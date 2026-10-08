import { z } from "zod";

export const MetricSchema = z.object({
  value: z.string().min(1),
  unit: z.string().min(1),
  label: z.string().min(1),
  source: z.enum(["Production", "Benchmark"]),
  date: z.string().min(1),
  method: z.string().min(1),
});

const status = z.enum(["draft", "published"]);

const isoDate = z.union([z.string(), z.date()]).transform((d) => new Date(d).toISOString());

export const ProjectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  kind: z.string().min(1),
  type: z.enum(["Product", "Systems"]),
  outcome: z.string().min(1),
  role: z.string().min(1),
  timeframe: z.string().min(1),
  team: z.string().optional(),
  stack: z.array(z.string()).min(1),
  links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
  metrics: z.array(MetricSchema),
  headlineMetric: z.string().min(1),
  summary: z.object({
    problem: z.string().min(1),
    did: z.string().min(1),
    result: z.string().min(1),
  }),
  results: z
    .array(
      z.object({
        measure: z.string(),
        before: z.string(),
        after: z.string(),
        source: z.string(),
      }),
    )
    .optional(),
  cta: z.string().optional(),
  cover: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  status,
});

export const PostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  date: isoDate,
  updated: isoDate.optional(),
  external: z.url().optional(),
  source: z.string().optional(),
  readingTime: z.number().int().positive().optional(),
  status,
});

export type Metric = z.infer<typeof MetricSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Post = z.infer<typeof PostSchema>;
