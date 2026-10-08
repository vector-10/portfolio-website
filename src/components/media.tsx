import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

const stripes = "bg-[repeating-linear-gradient(135deg,var(--soft)_0_6px,transparent_6px_12px)]";

function exists(src?: string) {
  return !!src && src.startsWith("/") && fs.existsSync(path.join(process.cwd(), "public", src));
}

export function Media({
  src,
  alt,
  ratio,
  sizes,
  preload,
  className = "",
}: {
  src?: string;
  alt: string;
  ratio: "4/5" | "16/10" | "16/9";
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  const aspect = { "4/5": "aspect-[4/5]", "16/10": "aspect-[16/10]", "16/9": "aspect-video" }[ratio];
  return (
    <div className={`relative w-full min-w-0 ${aspect} ${className}`}>
      {exists(src) ? (
        <Image src={src!} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
      ) : (
        <div role="img" aria-label={alt} className={`absolute inset-0 border border-dashed border-rule ${stripes}`} />
      )}
    </div>
  );
}

export function Logo({ name, src }: { name: string; src?: string }) {
  if (exists(src)) {
    return <Image src={src!} alt={name} width={120} height={32} className="h-8 w-[120px] object-contain" />;
  }
  return (
    <div className={`flex h-8 w-[120px] items-center justify-center border border-dashed border-rule font-mono text-[11px] text-muted ${stripes}`}>
      {name}
    </div>
  );
}

export function Avatar({ src, alt }: { src?: string; alt: string }) {
  if (exists(src)) {
    return <Image src={src!} alt={alt} width={44} height={44} className="size-11 shrink-0 rounded-full object-cover" />;
  }
  return (
    <div className="size-11 shrink-0 rounded-full bg-[repeating-linear-gradient(135deg,var(--soft)_0_4px,var(--rule)_4px_8px)]" />
  );
}
