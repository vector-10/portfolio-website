import "server-only";

export type DeployState = "pending" | "building" | "ready" | "error" | "unknown";

export type Deploy = { state: DeployState; url: string | null; inspectorUrl: string | null };

const STATE: Record<string, DeployState> = {
  QUEUED: "building",
  INITIALIZING: "building",
  BUILDING: "building",
  READY: "ready",
  ERROR: "error",
  CANCELED: "error",
  BLOCKED: "error",
};

export const vercelConfigured = () => !!(process.env.VERCEL_TOKEN && process.env.VERCEL_PROJECT_ID);

export async function deploymentsFor(shas: string[]): Promise<Record<string, Deploy>> {
  if (!vercelConfigured() || !shas.length) return {};
  const params = new URLSearchParams({ projectId: process.env.VERCEL_PROJECT_ID!, limit: "20" });
  if (process.env.VERCEL_TEAM_ID) params.set("teamId", process.env.VERCEL_TEAM_ID);
  const res = await fetch(`https://api.vercel.com/v7/deployments?${params}`, {
    headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) return {};
  const { deployments } = (await res.json()) as {
    deployments: { state?: string; readyState?: string; url: string | null; inspectorUrl: string | null; meta?: Record<string, string> }[];
  };
  const out: Record<string, Deploy> = {};
  for (const d of deployments) {
    const sha = d.meta?.githubCommitSha;
    if (!sha || !shas.includes(sha) || out[sha]) continue;
    out[sha] = {
      state: STATE[d.state ?? d.readyState ?? ""] ?? "unknown",
      url: d.url ? `https://${d.url}` : null,
      inspectorUrl: d.inspectorUrl,
    };
  }
  return out;
}
