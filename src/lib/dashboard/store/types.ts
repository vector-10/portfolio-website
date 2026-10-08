export type TreeEntry = { path: string; sha: string; size: number };

export type FileChange = { path: string; content: Buffer | null } | { path: string; blobSha: string };

export type CommitInput = {
  message: string;
  changes: FileChange[];
  expected: Record<string, string | null>;
};

export type CommitInfo = { sha: string; message: string; date: string };

export interface ContentStore {
  kind: "github" | "local";
  repo: string;
  branch: string;
  tree(): Promise<TreeEntry[]>;
  read(path: string): Promise<{ content: Buffer; sha: string } | null>;
  commit(input: CommitInput): Promise<{ sha: string }>;
  stageBlob(content: Buffer): Promise<string>;
  log(limit: number, path?: string): Promise<CommitInfo[]>;
}

export class ConflictError extends Error {
  constructor(public paths: string[]) {
    super(`Changed on GitHub since you opened it: ${paths.join(", ")}`);
  }
}

export const CONTENT_ROOTS = ["content/", "public/images/", "public/resume.pdf"];

export function inScope(path: string) {
  return CONTENT_ROOTS.some((root) => path === root || path.startsWith(root));
}
