import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col justify-center gap-10 px-6 py-20 md:min-h-[calc(100svh-4rem)] md:flex-row md:items-center md:justify-between md:py-24">
      <Reveal className="flex flex-col">
        <p className="font-mono text-sm text-muted-foreground">
          Backend Engineer — Distributed Systems &amp; Fintech Infrastructure
        </p>

        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Chukwuduzie Blaise
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          I build backend systems and distributed infrastructure that hold up
          under real load and real failure — with deep specialty in fintech
          and payments.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button render={<Link href="/#projects" />} nativeButton={false} size="lg">
            View Projects
          </Button>
          <Button
            render={<Link href="/#contact" />}
            nativeButton={false}
            variant="outline"
            size="lg"
          >
            Get in touch
          </Button>
        </div>
      </Reveal>

      <Reveal
        delay={0.15}
        className="relative size-40 shrink-0 overflow-hidden rounded-2xl ring-1 ring-border sm:size-48 md:size-56"
      >
        <Image
          src="/profile.jpg"
          alt="Chukwuduzie Blaise"
          fill
          priority
          sizes="(min-width: 768px) 14rem, 12rem"
          className="object-cover"
        />
      </Reveal>
    </section>
  );
}
