import { slug } from "github-slugger";

export function headings(source: string) {
  const withoutCode = source.replace(/```[\s\S]*?```/g, "");
  return [...withoutCode.matchAll(/^## (.+)$/gm)].map((m) => {
    const text = m[1].trim();
    return { text, id: slug(text) };
  });
}
