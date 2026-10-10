"use server";

import matter from "gray-matter";
import { z } from "zod";
import { requireOwner } from "@/lib/dashboard/data";
import { folderOf, publishIssues, toFrontmatter, type FormDoc } from "@/lib/dashboard/doc";
import { ConflictError, getStore } from "@/lib/dashboard/store";
import { deploymentById, deploymentsFor, redeploy, vercelConfigured } from "@/lib/dashboard/vercel";

const text = z.string().max(200_000);

const FormDocSchema = z.object({
  type: z.enum(["Project", "Post"]),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers and hyphens"),
  originalSlug: z.string().nullable(),
  sha: z.string().nullable(),
  status: z.enum(["Published", "Draft"]),
  title: text,
  outcome: text,
  kind: text,
  category: z.enum(["Product", "Systems"]),
  role: text,
  timeframe: text,
  team: text,
  stack: text,
  featured: z.boolean(),
  problem: text,
  did: text,
  result: text,
  metrics: z.array(z.object({ value: text, unit: text, label: text, source: text, date: text, method: text })),
  links: z.array(z.object({ label: text, href: text })),
  cover: text,
  tags: text,
  date: text,
  body: text,
  extra: z.record(z.string(), z.unknown()),
});

const ImagePath = z.string().regex(/^public\/images\/(work|writing|site)\/[a-z0-9][a-z0-9._-]*\.(png|jpe?g|webp|avif|gif)$/);

const SaveInput = z.object({
  doc: FormDocSchema,
  publish: z.boolean(),
  message: z.string().min(1).max(200),
  images: z.array(z.object({ path: ImagePath, blobSha: z.string().min(1) })).max(20),
});

export type SaveResult =
  | { ok: true; commit: string; path: string; sha: string; files: { op: "A" | "M" | "D"; path: string }[] }
  | { ok: false; error: string; conflict?: boolean };

export async function stageImage(base64: string): Promise<{ ok: true; blobSha: string } | { ok: false; error: string }> {
  await requireOwner();
  const content = Buffer.from(z.string().max(4_000_000).parse(base64), "base64");
  if (!content.length) return { ok: false, error: "Empty image" };
  return { ok: true, blobSha: await getStore().stageBlob(content) };
}

export async function saveDoc(input: z.input<typeof SaveInput>, overwrite = false): Promise<SaveResult> {
  await requireOwner();
  const parsed = SaveInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((i) => i.message).join("; ") };
  const { doc, publish, message, images } = parsed.data as { doc: FormDoc } & typeof parsed.data;

  if (publish) {
    const issues = publishIssues(doc);
    if (issues.length) return { ok: false, error: `Can't publish yet: ${issues.join("; ")}` };
  }

  const store = getStore();
  const folder = folderOf(doc.type);
  const path = `${folder}/${doc.slug}.mdx`;
  const oldPath = doc.originalSlug ? `${folder}/${doc.originalSlug}.mdx` : null;
  const renamed = !!oldPath && oldPath !== path;

  const expected: Record<string, string | null> = {};
  if (!overwrite) {
    if (oldPath) expected[oldPath] = doc.sha;
    if (!oldPath || renamed) expected[path] = null;
  }

  const content = Buffer.from(matter.stringify(`\n${doc.body.trim()}\n`, toFrontmatter(doc, publish)));
  const changes = [
    { path, content },
    ...(renamed ? [{ path: oldPath!, content: null }] : []),
    ...images.map((i) => ({ path: i.path, blobSha: i.blobSha })),
  ];

  try {
    const { sha: commit } = await store.commit({ message, changes, expected });
    const written = await store.read(path);
    return {
      ok: true,
      commit,
      path,
      sha: written?.sha ?? "",
      files: [
        { op: oldPath && !renamed ? "M" : "A", path },
        ...(renamed ? [{ op: "D" as const, path: oldPath! }] : []),
        ...images.map((i) => ({ op: "A" as const, path: i.path })),
      ],
    };
  } catch (error) {
    if (error instanceof ConflictError) {
      return { ok: false, conflict: true, error: "This file changed on GitHub since you opened it." };
    }
    return { ok: false, error: error instanceof Error ? error.message : "Couldn't reach GitHub." };
  }
}

export async function deployStatus(commit: string) {
  await requireOwner();
  if (!vercelConfigured() || getStore().kind === "local") return null;
  return (await deploymentsFor([commit]))[commit] ?? { id: null, state: "pending" as const, url: null, inspectorUrl: null };
}

export async function deploymentStatus(id: string) {
  await requireOwner();
  return deploymentById(z.string().min(1).parse(id));
}

export async function retryDeploy(id: string): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  await requireOwner();
  const next = await redeploy(z.string().min(1).parse(id));
  return next ? { ok: true, id: next } : { ok: false, error: "Vercel didn't accept the retry. Open the logs to see why." };
}

const MediaInput = z.object({
  add: z.array(z.object({ path: ImagePath, blobSha: z.string().min(1) })).max(20),
  remove: z.array(z.object({ path: ImagePath, sha: z.string().min(1) })).max(20),
});

export async function commitMedia(input: z.input<typeof MediaInput>): Promise<{ ok: true; commit: string } | { ok: false; error: string }> {
  await requireOwner();
  const parsed = MediaInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid image paths" };
  const { add, remove } = parsed.data;
  if (!add.length && !remove.length) return { ok: false, error: "Nothing to commit" };
  const parts = [add.length ? `add ${add.length}` : "", remove.length ? `remove ${remove.length}` : ""].filter(Boolean);
  try {
    const { sha } = await getStore().commit({
      message: `Media: ${parts.join(", ")} image${add.length + remove.length === 1 ? "" : "s"}`,
      changes: [...add.map((a) => ({ path: a.path, blobSha: a.blobSha })), ...remove.map((r) => ({ path: r.path, content: null }))],
      expected: Object.fromEntries([...add.map((a) => [a.path, null]), ...remove.map((r) => [r.path, r.sha])]),
    });
    return { ok: true, commit: sha };
  } catch (error) {
    if (error instanceof ConflictError) return { ok: false, error: "An image with that name already exists, or changed on GitHub. Reload and try again." };
    return { ok: false, error: error instanceof Error ? error.message : "Couldn't reach GitHub." };
  }
}

const SettingsInput = z.object({
  settings: z.object({
    available: z.boolean(),
    note: z.string().max(200),
    email: z.email(),
    resume: z.string().regex(/^\/[a-z0-9/_.-]+\.pdf$/),
  }),
  sha: z.string().nullable(),
  resumeBlob: z.string().nullable(),
});

export async function saveSettings(
  input: z.input<typeof SettingsInput>,
): Promise<{ ok: true; commit: string; sha: string } | { ok: false; error: string }> {
  await requireOwner();
  const parsed = SettingsInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues.map((i) => i.message).join("; ") };
  const { settings, sha, resumeBlob } = parsed.data;
  const store = getStore();
  try {
    const { sha: commit } = await store.commit({
      message: "Site: settings",
      changes: [
        { path: "content/site.json", content: Buffer.from(`${JSON.stringify(settings, null, 2)}\n`) },
        ...(resumeBlob ? [{ path: `public${settings.resume}`, blobSha: resumeBlob }] : []),
      ],
      expected: { "content/site.json": sha },
    });
    return { ok: true, commit, sha: (await store.read("content/site.json"))?.sha ?? "" };
  } catch (error) {
    if (error instanceof ConflictError) return { ok: false, error: "Settings changed on GitHub since you opened this page. Reload first." };
    return { ok: false, error: error instanceof Error ? error.message : "Couldn't reach GitHub." };
  }
}
