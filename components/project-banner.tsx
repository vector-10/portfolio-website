import {
  NetworkPattern,
  BlueprintPattern,
  AscendingPattern,
  BarsPattern,
} from "@/components/blog/post-banner";

const patterns = [NetworkPattern, BlueprintPattern, AscendingPattern, BarsPattern];

export function ProjectBanner({
  index,
  className,
}: {
  index: number;
  className?: string;
}) {
  const Pattern = patterns[index % patterns.length];

  return (
    <div className={`relative overflow-hidden bg-muted/60 ${className ?? ""}`}>
      <Pattern />
    </div>
  );
}
