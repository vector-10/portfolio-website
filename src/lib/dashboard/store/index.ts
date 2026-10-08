import "server-only";
import { githubStore } from "./github";
import { localStore } from "./local";
import type { ContentStore } from "./types";

export * from "./types";

let store: ContentStore | undefined;

export function getStore(): ContentStore {
  if (store) return store;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (token && repo) store = githubStore(token, repo, process.env.GITHUB_BRANCH ?? "main");
  else if (process.env.NODE_ENV === "development") store = localStore();
  else throw new Error("GITHUB_TOKEN and GITHUB_REPO must be set for the dashboard");
  return store;
}
