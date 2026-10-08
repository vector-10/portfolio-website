import Link from "next/link";
import { ContentList } from "@/components/dashboard/content-list";
import { Page, PageTitle, primaryButton, secondaryButton } from "@/components/dashboard/ui";
import { listContent } from "@/lib/dashboard/data";

export const instant = false;

export default async function ContentPage() {
  const items = await listContent();
  return (
    <Page>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle>Content</PageTitle>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/edit/post/new" className={secondaryButton}>
            New post
          </Link>
          <Link href="/dashboard/edit/project/new" className={primaryButton}>
            New project
          </Link>
        </div>
      </div>
      <ContentList items={items} />
    </Page>
  );
}
