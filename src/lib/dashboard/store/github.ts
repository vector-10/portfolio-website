import "server-only";
import { Octokit } from "@octokit/rest";
import { ConflictError, inScope, type CommitInput, type ContentStore, type TreeEntry } from "./types";

export function githubStore(token: string, repoSlug: string, branch = "main"): ContentStore {
  const [owner, repo] = repoSlug.split("/");
  const octokit = new Octokit({ auth: token });

  async function head() {
    const { data } = await octokit.git.getRef({ owner, repo, ref: `heads/${branch}` });
    return data.object.sha;
  }

  async function treeAt(commitSha: string): Promise<TreeEntry[]> {
    const { data: commit } = await octokit.git.getCommit({ owner, repo, commit_sha: commitSha });
    const { data } = await octokit.git.getTree({ owner, repo, tree_sha: commit.tree.sha, recursive: "true" });
    return data.tree
      .filter((e) => e.type === "blob" && e.path && e.sha && inScope(e.path))
      .map((e) => ({ path: e.path!, sha: e.sha!, size: e.size ?? 0 }));
  }

  async function createBlob(content: Buffer) {
    const { data } = await octokit.git.createBlob({ owner, repo, content: content.toString("base64"), encoding: "base64" });
    return data.sha;
  }

  return {
    kind: "github",
    stageBlob: createBlob,
    repo: repoSlug,
    branch,

    async tree() {
      return treeAt(await head());
    },

    async read(path) {
      try {
        const { data } = await octokit.repos.getContent({ owner, repo, path, ref: branch });
        if (Array.isArray(data) || data.type !== "file") return null;
        if (data.content) return { content: Buffer.from(data.content, "base64"), sha: data.sha };
        const { data: blob } = await octokit.git.getBlob({ owner, repo, file_sha: data.sha });
        return { content: Buffer.from(blob.content, "base64"), sha: data.sha };
      } catch (error) {
        if ((error as { status?: number }).status === 404) return null;
        throw error;
      }
    },

    async commit({ message, changes, expected }: CommitInput) {
      const parent = await head();
      const current = new Map((await treeAt(parent)).map((e) => [e.path, e.sha]));
      const conflicts = Object.entries(expected)
        .filter(([path, sha]) => (current.get(path) ?? null) !== sha)
        .map(([path]) => path);
      if (conflicts.length) throw new ConflictError(conflicts);

      const { data: parentCommit } = await octokit.git.getCommit({ owner, repo, commit_sha: parent });
      const entries = await Promise.all(
        changes.map(async (change) => {
          const base = { path: change.path, mode: "100644" as const, type: "blob" as const };
          if ("blobSha" in change) return { ...base, sha: change.blobSha };
          if (change.content === null) return { ...base, sha: null };
          return { ...base, sha: await createBlob(change.content) };
        }),
      );
      const { data: tree } = await octokit.git.createTree({
        owner,
        repo,
        base_tree: parentCommit.tree.sha,
        tree: entries,
      });
      const { data: commit } = await octokit.git.createCommit({
        owner,
        repo,
        message,
        tree: tree.sha,
        parents: [parent],
      });
      try {
        await octokit.git.updateRef({ owner, repo, ref: `heads/${branch}`, sha: commit.sha, force: false });
      } catch (error) {
        if ((error as { status?: number }).status === 422) throw new ConflictError(changes.map((c) => c.path));
        throw error;
      }
      return { sha: commit.sha };
    },

    async log(limit, path) {
      const { data } = await octokit.repos.listCommits({ owner, repo, sha: branch, path, per_page: limit });
      return data.map((c) => ({
        sha: c.sha,
        message: c.commit.message,
        date: c.commit.committer?.date ?? c.commit.author?.date ?? "",
      }));
    },
  };
}
