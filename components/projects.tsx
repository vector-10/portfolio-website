import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import { Badge } from "@/components/ui/badge";
import { ProjectBanner } from "@/components/project-banner";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/data/projects";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-24">
      <Reveal>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Projects
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Case studies from systems I&apos;ve designed and built — the
          problem, the decision, and the outcome.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={(index % 2) * 0.1}>
            <div className="h-full">
              <ProjectBanner index={index} className="h-40 rounded-md" />
              <div className="pt-4">
                <h3 className="text-lg font-medium">{project.title}</h3>
                <div className="mt-2 space-y-2">
                  {project.summary.map((sentence) => (
                    <p
                      key={sentence}
                      className="text-sm leading-relaxed text-muted-foreground"
                    >
                      {sentence}
                    </p>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {(project.githubUrl ||
                  project.liveUrl ||
                  project.articleSlug ||
                  project.articleUrl) && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {project.githubUrl && (
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent-warm"
                      >
                        <GithubIcon className="size-4" />
                        Code
                      </Link>
                    )}
                    {project.liveUrl && (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent-warm"
                      >
                        Live site
                        <ArrowUpRight className="size-4" />
                      </Link>
                    )}
                    {project.articleSlug && (
                      <Link
                        href={`/blog/${project.articleSlug}`}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent-warm"
                      >
                        Read the deep dive
                        <ArrowUpRight className="size-4" />
                      </Link>
                    )}
                    {project.articleUrl && (
                      <Link
                        href={project.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent-warm"
                      >
                        Read the deep dive
                        <ArrowUpRight className="size-4" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
