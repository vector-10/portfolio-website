import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { caseStudyComponents } from "@/components/mdx/case-study";
import { CaseStudyView } from "@/components/views/case-study-view";
import { getProject, getProjects } from "@/lib/content";
import { renderMDX } from "@/lib/mdx";
import { pageMeta } from "@/lib/meta";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.meta.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return pageMeta(project.meta.title, project.meta.outcome, `/work/${slug}`);
}

async function CaseStudyBody({ slug }: { slug: string }) {
  "use cache";
  cacheLife("max");
  const project = await getProject(slug);
  if (!project) return null;
  return renderMDX(project.body, caseStudyComponents(project.meta));
}

async function CaseStudy({ params }: Pick<PageProps<"/work/[slug]">, "params">) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  return <CaseStudyView meta={project.meta} next={project.next} body={<CaseStudyBody slug={slug} />} />;
}

export default function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <CaseStudy params={params} />
    </Suspense>
  );
}
