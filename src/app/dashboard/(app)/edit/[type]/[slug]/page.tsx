import { notFound } from "next/navigation";
import { EditorLoader } from "@/components/dashboard/editor-loader";
import { listMedia, readDoc, storeInfo } from "@/lib/dashboard/data";
import { fromFrontmatter, newDoc, type DocType } from "@/lib/dashboard/doc";

export const instant = false;

const TYPES: Record<string, DocType> = { project: "Project", post: "Post" };

export default async function EditPage({ params }: PageProps<"/dashboard/edit/[type]/[slug]">) {
  const { type: rawType, slug } = await params;
  const type = TYPES[rawType];
  if (!type) notFound();

  const [media, store] = await Promise.all([listMedia(), storeInfo()]);
  let initial;
  if (slug === "new") {
    initial = newDoc(type, new Date().toISOString().slice(0, 10));
  } else {
    const doc = await readDoc(type, slug);
    if (!doc) notFound();
    initial = fromFrontmatter(type, slug, doc.sha, doc.data, doc.body);
  }

  return (
    <EditorLoader
      key={`${type}:${slug}`}
      initial={initial}
      media={media.map((m) => ({ src: m.src, name: m.name }))}
      store={store}
    />
  );
}
