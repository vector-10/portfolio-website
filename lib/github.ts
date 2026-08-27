const GITHUB_API = "https://api.github.com";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

function repoConfig() {
  return {
    owner: requireEnv("GITHUB_OWNER"),
    repo: requireEnv("GITHUB_REPO"),
    token: requireEnv("GITHUB_TOKEN"),
  };
}

function contentPath(slug: string): string {
  return `content/posts/${slug}.mdx`;
}

async function githubRequest(
  path: string,
  init?: RequestInit
): Promise<unknown> {
  const { token } = repoConfig();
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${body}`);
  }

  return res.json();
}

export async function getFileSha(slug: string): Promise<string | undefined> {
  const { owner, repo } = repoConfig();
  try {
    const data = (await githubRequest(
      `/repos/${owner}/${repo}/contents/${contentPath(slug)}`
    )) as { sha: string };
    return data.sha;
  } catch {
    return undefined;
  }
}

export async function commitPost(params: {
  slug: string;
  content: string;
  message: string;
  sha?: string;
}): Promise<void> {
  const { owner, repo } = repoConfig();
  const encoded = Buffer.from(params.content, "utf8").toString("base64");

  await githubRequest(`/repos/${owner}/${repo}/contents/${contentPath(params.slug)}`, {
    method: "PUT",
    body: JSON.stringify({
      message: params.message,
      content: encoded,
      sha: params.sha,
    }),
  });
}

export async function deleteFile(params: {
  slug: string;
  message: string;
  sha: string;
}): Promise<void> {
  const { owner, repo } = repoConfig();

  await githubRequest(`/repos/${owner}/${repo}/contents/${contentPath(params.slug)}`, {
    method: "DELETE",
    body: JSON.stringify({
      message: params.message,
      sha: params.sha,
    }),
  });
}
