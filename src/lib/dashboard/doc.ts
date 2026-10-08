import { PostSchema, ProjectSchema, type Metric, type Post, type Project } from "@/lib/content/schema";

export type DocType = "Project" | "Post";

export type MetricRow = { value: string; unit: string; label: string; source: string; date: string; method: string };

export type FormDoc = {
  type: DocType;
  slug: string;
  originalSlug: string | null;
  sha: string | null;
  status: "Published" | "Draft";
  title: string;
  outcome: string;
  kind: string;
  category: "Product" | "Systems";
  role: string;
  timeframe: string;
  team: string;
  stack: string;
  featured: boolean;
  problem: string;
  did: string;
  result: string;
  metrics: MetricRow[];
  links: { label: string; href: string }[];
  cover: string;
  tags: string;
  date: string;
  body: string;
  extra: Record<string, unknown>;
};

export const METRIC_FIELDS = ["value", "unit", "label", "source", "date", "method"] as const;

export const emptyMetric = (): MetricRow => ({ value: "", unit: "", label: "", source: "", date: "", method: "" });

const str = (v: unknown) => (v == null ? "" : String(v));
const isoDay = (v: unknown) => (v ? new Date(String(v)).toISOString().slice(0, 10) : "");

const OWN = new Set([
  "title", "outcome", "description", "kind", "type", "role", "timeframe", "team", "stack", "featured",
  "summary", "metrics", "links", "cover", "tags", "date", "status", "slug", "headlineMetric",
]);

export function fromFrontmatter(
  type: DocType,
  slug: string,
  sha: string | null,
  data: Record<string, unknown>,
  body: string,
): FormDoc {
  const summary = (data.summary ?? {}) as Record<string, unknown>;
  const extra = Object.fromEntries(Object.entries(data).filter(([k]) => !OWN.has(k)));
  if (data.headlineMetric) extra.headlineMetric = data.headlineMetric;
  return {
    type,
    slug,
    originalSlug: sha ? slug : null,
    sha,
    status: data.status === "published" ? "Published" : "Draft",
    title: str(data.title),
    outcome: str(type === "Project" ? data.outcome : data.description),
    kind: str(data.kind),
    category: data.type === "Product" ? "Product" : "Systems",
    role: str(data.role),
    timeframe: str(data.timeframe),
    team: str(data.team),
    stack: Array.isArray(data.stack) ? data.stack.join(", ") : str(data.stack),
    featured: !!data.featured,
    problem: str(summary.problem),
    did: str(summary.did),
    result: str(summary.result),
    metrics: Array.isArray(data.metrics)
      ? (data.metrics as Record<string, unknown>[]).map((m) => ({
          value: str(m.value),
          unit: str(m.unit),
          label: str(m.label),
          source: str(m.source),
          date: str(m.date),
          method: str(m.method),
        }))
      : [],
    links: Array.isArray(data.links)
      ? (data.links as Record<string, unknown>[]).map((l) => ({ label: str(l.label), href: str(l.href) }))
      : [],
    cover: str(data.cover),
    tags: Array.isArray(data.tags) ? data.tags.join(", ") : str(data.tags),
    date: isoDay(data.date),
    body,
    extra,
  };
}

export function newDoc(type: DocType, today: string): FormDoc {
  return {
    ...fromFrontmatter(type, type === "Project" ? "untitled-project" : "untitled-post", null, {}, ""),
    title: type === "Project" ? "Untitled project" : "Untitled post",
    category: "Product",
    metrics: type === "Project" ? [emptyMetric()] : [],
    date: type === "Post" ? today : "",
    body: type === "Project" ? '<Section label="01 · Context and constraints">\n\n</Section>\n' : "",
  };
}

const list = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

export function toFrontmatter(doc: FormDoc, publish: boolean): Record<string, unknown> {
  const status = publish ? "published" : "draft";
  if (doc.type === "Post") {
    return clean({
      ...doc.extra,
      title: doc.title,
      description: doc.outcome,
      tags: list(doc.tags),
      date: doc.date,
      cover: doc.cover || undefined,
      status,
    });
  }
  const first = doc.metrics[0];
  return clean({
    title: doc.title,
    kind: doc.kind,
    type: doc.category,
    status,
    featured: doc.featured || undefined,
    outcome: doc.outcome,
    role: doc.role,
    timeframe: doc.timeframe,
    team: doc.team || undefined,
    stack: list(doc.stack),
    links: doc.links.filter((l) => l.label && l.href),
    headlineMetric:
      doc.extra.headlineMetric ?? (first?.value ? `${first.value}${first.unit} ${first.label}`.trim() : undefined),
    summary: { problem: doc.problem, did: doc.did, result: doc.result },
    metrics: doc.metrics.map((m) => ({ ...m })),
    cover: doc.cover || undefined,
    ...Object.fromEntries(Object.entries(doc.extra).filter(([k]) => k !== "headlineMetric")),
  });
}

function clean(obj: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== ""));
}

export function missingMetricFields(doc: FormDoc) {
  if (doc.type !== "Project") return [];
  return doc.metrics.flatMap((m, i) => METRIC_FIELDS.filter((k) => !m[k].trim()).map((k) => ({ i, k })));
}

export function publishIssues(doc: FormDoc): string[] {
  const data = { slug: doc.slug, ...toFrontmatter(doc, true) };
  const parsed = (doc.type === "Project" ? ProjectSchema : PostSchema).safeParse(data);
  const issues = parsed.success ? [] : parsed.error.issues.map((i) => `${i.path.join(".") || "document"}: ${i.message}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(doc.slug)) issues.unshift("slug: use lowercase letters, numbers and hyphens");
  return issues;
}

export function previewMeta(doc: FormDoc): Project | Post {
  if (doc.type === "Post") {
    const words = doc.body.split(/\s+/).filter(Boolean).length;
    return {
      slug: doc.slug,
      title: doc.title || "Untitled",
      description: doc.outcome,
      tags: list(doc.tags),
      date: doc.date ? new Date(doc.date).toISOString() : new Date(0).toISOString(),
      status: "published",
      readingTime: Math.max(1, Math.round(words / 220)),
    };
  }
  return {
    slug: doc.slug,
    title: doc.title || "Untitled",
    kind: doc.kind || "Kind",
    type: doc.category,
    outcome: doc.outcome,
    role: doc.role,
    timeframe: doc.timeframe,
    team: doc.team || undefined,
    stack: list(doc.stack),
    links: doc.links.filter((l) => l.label && l.href),
    metrics: doc.metrics.map((m) => ({ ...m, source: m.source === "Benchmark" ? "Benchmark" : "Production" }) as Metric),
    headlineMetric: "",
    summary: { problem: doc.problem, did: doc.did, result: doc.result },
    cta: typeof doc.extra.cta === "string" ? doc.extra.cta : undefined,
    status: "published",
  };
}

export const folderOf = (type: DocType) => (type === "Project" ? "content/projects" : "content/posts");
export const publicPathOf = (doc: Pick<FormDoc, "type" | "slug">) =>
  `/${doc.type === "Project" ? "work" : "writing"}/${doc.slug}`;
