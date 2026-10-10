import "server-only";

export type DeployState = "pending" | "building" | "ready" | "error" | "unknown";

export type Deploy = { id: string | null; state: DeployState; url: string | null; inspectorUrl: string | null };

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

function api(path: string, params: Record<string, string> = {}, init: RequestInit = {}) {
  const query = new URLSearchParams(params);
  if (process.env.VERCEL_TEAM_ID) query.set("teamId", process.env.VERCEL_TEAM_ID);
  return fetch(`https://api.vercel.com${path}?${query}`, {
    ...init,
    headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
}

export async function deploymentsFor(shas: string[]): Promise<Record<string, Deploy>> {
  if (!vercelConfigured() || !shas.length) return {};
  const res = await api("/v7/deployments", { projectId: process.env.VERCEL_PROJECT_ID!, limit: "20" });
  if (!res.ok) return {};
  const { deployments } = (await res.json()) as {
    deployments: {
      uid: string;
      state?: string;
      readyState?: string;
      url: string | null;
      inspectorUrl: string | null;
      meta?: Record<string, string>;
    }[];
  };
  const out: Record<string, Deploy> = {};
  for (const d of deployments) {
    const sha = d.meta?.githubCommitSha;
    if (!sha || !shas.includes(sha) || out[sha]) continue;
    out[sha] = {
      id: d.uid,
      state: STATE[d.state ?? d.readyState ?? ""] ?? "unknown",
      url: d.url ? `https://${d.url}` : null,
      inspectorUrl: d.inspectorUrl,
    };
  }
  return out;
}

type DeploymentDetail = {
  id: string;
  name: string;
  target?: string | null;
  readyState: string;
  url?: string | null;
  inspectorUrl?: string | null;
};

async function deploymentDetail(id: string): Promise<DeploymentDetail | null> {
  if (!vercelConfigured()) return null;
  const res = await api(`/v13/deployments/${encodeURIComponent(id)}`);
  return res.ok ? ((await res.json()) as DeploymentDetail) : null;
}

export async function deploymentById(id: string): Promise<Deploy | null> {
  const d = await deploymentDetail(id);
  if (!d) return null;
  return {
    id: d.id,
    state: STATE[d.readyState] ?? "unknown",
    url: d.url ? `https://${d.url}` : null,
    inspectorUrl: d.inspectorUrl ?? null,
  };
}

export async function redeploy(id: string): Promise<string | null> {
  const original = await deploymentDetail(id);
  if (!original) return null;
  const res = await api(
    "/v13/deployments",
    { forceNew: "1" },
    {
      method: "POST",
      body: JSON.stringify({
        name: original.name,
        deploymentId: original.id,
        ...(original.target ? { target: original.target } : {}),
      }),
    },
  );
  if (!res.ok) return null;
  return ((await res.json()) as { id: string }).id;
}
