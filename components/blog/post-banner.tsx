import type { PostTag } from "@/lib/posts";

const strokeStyle = { stroke: "var(--accent-warm)" };
const fillStyle = { fill: "var(--accent-warm)" };

export function NetworkPattern() {
  return (
    <svg viewBox="0 0 400 160" className="h-full w-full">
      <g style={strokeStyle} strokeWidth={1.5} opacity={0.5} fill="none">
        <line x1="60" y1="40" x2="160" y2="80" />
        <line x1="160" y1="80" x2="280" y2="50" />
        <line x1="160" y1="80" x2="220" y2="130" />
        <line x1="280" y1="50" x2="350" y2="100" />
        <line x1="60" y1="40" x2="40" y2="120" />
      </g>
      <g style={fillStyle}>
        <circle cx="60" cy="40" r="5" />
        <circle cx="160" cy="80" r="7" />
        <circle cx="280" cy="50" r="5" />
        <circle cx="220" cy="130" r="4" />
        <circle cx="350" cy="100" r="5" />
        <circle cx="40" cy="120" r="4" />
      </g>
    </svg>
  );
}

function BlueprintPattern() {
  return (
    <svg viewBox="0 0 400 160" className="h-full w-full">
      <rect
        x="40"
        y="30"
        width="200"
        height="100"
        rx="2"
        fill="none"
        style={strokeStyle}
        strokeWidth={1.5}
        strokeDasharray="6 5"
        opacity={0.6}
      />
      <line
        x1="40"
        y1="80"
        x2="240"
        y2="80"
        style={strokeStyle}
        strokeWidth={1}
        strokeDasharray="4 4"
        opacity={0.4}
      />
      <line
        x1="140"
        y1="30"
        x2="140"
        y2="130"
        style={strokeStyle}
        strokeWidth={1}
        strokeDasharray="4 4"
        opacity={0.4}
      />
      <path
        d="M300 40 h20 v20"
        fill="none"
        style={strokeStyle}
        strokeWidth={1.5}
        opacity={0.6}
      />
      <path
        d="M300 120 h20 v-20"
        fill="none"
        style={strokeStyle}
        strokeWidth={1.5}
        opacity={0.6}
      />
    </svg>
  );
}

function AscendingPattern() {
  return (
    <svg viewBox="0 0 400 160" className="h-full w-full">
      <polyline
        points="40,130 120,100 200,110 280,60 360,40"
        fill="none"
        style={strokeStyle}
        strokeWidth={2}
        opacity={0.6}
      />
      <g style={fillStyle}>
        <circle cx="40" cy="130" r="4" />
        <circle cx="120" cy="100" r="4" />
        <circle cx="200" cy="110" r="4" />
        <circle cx="280" cy="60" r="4" />
        <circle cx="360" cy="40" r="5" />
      </g>
    </svg>
  );
}

function BarsPattern() {
  return (
    <svg viewBox="0 0 400 160" className="h-full w-full">
      <g style={fillStyle} opacity={0.55}>
        <rect x="60" y="90" width="28" height="50" />
        <rect x="110" y="60" width="28" height="80" />
        <rect x="160" y="100" width="28" height="40" />
        <rect x="210" y="40" width="28" height="100" />
        <rect x="260" y="75" width="28" height="65" />
        <rect x="310" y="55" width="28" height="85" />
      </g>
      <line
        x1="40"
        y1="140"
        x2="360"
        y2="140"
        style={strokeStyle}
        strokeWidth={1.5}
        opacity={0.4}
      />
    </svg>
  );
}

const patterns: Record<PostTag, () => React.ReactElement> = {
  "system-design-review": NetworkPattern,
  "software-proposals": BlueprintPattern,
  "career-notes": AscendingPattern,
  "business-case-study": BarsPattern,
};

export function PostBanner({
  tag,
  className,
}: {
  tag: PostTag;
  className?: string;
}) {
  const Pattern = patterns[tag];

  return (
    <div className={`relative overflow-hidden bg-muted/60 ${className ?? ""}`}>
      <Pattern />
    </div>
  );
}
