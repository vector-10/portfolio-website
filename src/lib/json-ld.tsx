import { site } from "@/config/site";

export const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: site.name,
      url: site.url,
      image: `${site.url}${site.portrait.src}`,
      jobTitle: "Software engineer",
      description: site.description,
      address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
      knowsAbout: [
        "Backend engineering",
        "Payment orchestration",
        "Distributed systems",
        "Data pipelines",
        "Multi-tenant SaaS",
        "Full-stack product development",
      ],
      sameAs: [site.social.github, site.social.linkedin, site.social.x],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: site.url,
      name: site.name,
      publisher: { "@id": personId },
    },
  ],
};

export function articleLd(post: {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
}) {
  const url = `${site.url}/writing/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    keywords: post.tags,
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    author: { "@id": personId },
    publisher: { "@id": personId },
    isPartOf: { "@id": websiteId },
  };
}
