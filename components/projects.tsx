import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/data/projects";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Projects
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Case studies from systems I&apos;ve designed and built — the
          problem, the decision, and the outcome.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={(index % 2) * 0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  {project.summary}
                </CardDescription>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              {(project.githubUrl || project.articleSlug) && (
                <CardFooter className="flex gap-4">
                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <GithubIcon className="size-4" />
                      Code
                    </Link>
                  )}
                  {project.articleSlug && (
                    <Link
                      href={`/blog/${project.articleSlug}`}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Read the deep dive
                      <ArrowUpRight className="size-4" />
                    </Link>
                  )}
                </CardFooter>
              )}
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
