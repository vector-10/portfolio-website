import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center md:py-28">
      <Reveal className="relative aspect-[16/9] w-full max-w-2xl overflow-hidden rounded-2xl ring-1 ring-border">
        <Image
          src="/duzie.jpg"
          alt="Chukwuduzie Blaise"
          fill
          priority
          sizes="(min-width: 768px) 42rem, 100vw"
          className="object-cover"
        />
      </Reveal>

      <Reveal delay={0.15} className="mt-10 flex flex-col items-center">
        <p className="font-mono text-sm text-muted-foreground">
          Backend Engineer — Distributed Systems &amp; Fintech Infrastructure
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Chukwuduzie Blaise
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          I build backend systems and distributed infrastructure that hold up
          under real load and real failure — with deep specialty in fintech
          and payments.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
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
    </section>
  );
}
