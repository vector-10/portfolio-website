import Link from "next/link";
import { ClosingBand } from "@/components/closing-band";
import { Header } from "@/components/header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <section className="gutter flex min-h-[50vh] flex-col justify-center gap-6 py-(--section-y)">
          <h1 className="text-[clamp(56px,8vw,120px)] leading-[0.95] tracking-[-0.04em]">Not found</h1>
          <p className="max-w-[560px] text-[clamp(17px,1.5vw,20px)] text-muted">
            This page doesn&apos;t exist, or it moved.
          </p>
          <Link href="/" className="text-[15px] font-medium">
            ← Back to the home page
          </Link>
        </section>
        <ClosingBand />
      </main>
    </>
  );
}
