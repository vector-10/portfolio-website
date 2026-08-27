import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-5xl flex-col justify-center px-6 py-24">
      <p className="font-mono text-sm text-muted-foreground">
        Backend Engineer — Distributed Systems &amp; Fintech Infrastructure
      </p>

      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
        Chukwuduzie Blaise
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
        I build backend systems and distributed infrastructure that hold up
        under real load and real failure — with deep specialty in fintech and
        payments.
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
    </section>
  );
}
