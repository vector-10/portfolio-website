import { site } from "@/config/site";
import { getPosts } from "@/lib/content";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const posts = await getPosts();
  const items = posts
    .map(({ meta }) => {
      const url = meta.external ?? `${site.url}/writing/${meta.slug}`;
      return `    <item>
      <title>${escape(meta.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escape(meta.description)}</description>
      <pubDate>${new Date(meta.date).toUTCString()}</pubDate>
${meta.tags.map((t) => `      <category>${escape(t)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)}</title>
    <link>${site.url}/writing</link>
    <description>${escape(site.description)}</description>
    <language>en</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
