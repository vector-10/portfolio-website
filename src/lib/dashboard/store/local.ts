import "server-only";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { ConflictError, CONTENT_ROOTS, type ContentStore, type TreeEntry } from "./types";

const run = promisify(execFile);
const root = process.cwd();

const blobSha = (content: Buffer) =>
  createHash("sha1").update(`blob ${content.length}\0`).update(content).digest("hex");

async function walk(rel: string): Promise<string[]> {
  const full = path.join(root, rel);
  const stat = await fs.stat(full).catch(() => null);
  if (!stat) return [];
  if (stat.isFile()) return [rel];
  const names = await fs.readdir(full);
  return (await Promise.all(names.map((n) => walk(path.posix.join(rel, n))))).flat();
}

export function localStore(): ContentStore {
  async function tree(): Promise<TreeEntry[]> {
    const files = (await Promise.all(CONTENT_ROOTS.map((r) => walk(r.replace(/\/$/, ""))))).flat();
    return Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(path.join(root, file));
        return { path: file, sha: blobSha(content), size: content.length };
      }),
    );
  }

  return {
    kind: "local",
    repo: "local working tree",
    branch: "main",
    tree,

    async read(file) {
      const content = await fs.readFile(path.join(root, file)).catch(() => null);
      return content ? { content, sha: blobSha(content) } : null;
    },

    async commit({ changes, expected }) {
      const current = new Map((await tree()).map((e) => [e.path, e.sha]));
      const conflicts = Object.entries(expected)
        .filter(([file, sha]) => (current.get(file) ?? null) !== sha)
        .map(([file]) => file);
      if (conflicts.length) throw new ConflictError(conflicts);

      for (const { path: file, content } of changes) {
        const full = path.join(root, file);
        if (content === null) await fs.rm(full, { force: true });
        else {
          await fs.mkdir(path.dirname(full), { recursive: true });
          await fs.writeFile(full, content);
        }
      }
      return { sha: `local-${Date.now().toString(16)}` };
    },

    async log(limit, file) {
      const args = ["log", `-n${limit}`, "--format=%H%x1f%s%x1f%cI"];
      if (file) args.push("--", file);
      const { stdout } = await run("git", args, { cwd: root }).catch(() => ({ stdout: "" }));
      return stdout
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const [sha, message, date] = line.split("\x1f");
          return { sha, message, date };
        });
    },
  };
}
