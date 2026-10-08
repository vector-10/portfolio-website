import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = join(process.cwd(), "node_modules/@fontsource/newsreader/files");

export async function ogImage(title: string, eyebrow?: string) {
  const [regular, medium] = await Promise.all([
    readFile(join(fontDir, "newsreader-latin-400-normal.woff")),
    readFile(join(fontDir, "newsreader-latin-500-normal.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f4f1ea",
          color: "#14120f",
          fontFamily: "Newsreader",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 32, fontWeight: 500 }}>
          <span>{site.name}</span>
          {eyebrow && <span style={{ fontWeight: 400, color: "#5b564d" }}>{eyebrow}</span>}
        </div>
        <div
          style={{
            display: "flex",
            borderTop: "2px solid #14120f",
            paddingTop: 36,
            fontSize: title.length > 60 ? 64 : 84,
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Newsreader", data: regular, style: "normal", weight: 400 },
        { name: "Newsreader", data: medium, style: "normal", weight: 500 },
      ],
    },
  );
}
