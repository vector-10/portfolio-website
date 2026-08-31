import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllPosts, tagLabels } from "@/lib/posts";
import { logout, deletePostAction } from "@/app/dashboard/actions";

export default function DashboardHome() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <form action={logout}>
          <Button variant="ghost" size="sm" type="submit" nativeButton>
            Log out
          </Button>
        </form>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button render={<Link href="/dashboard/new" />} nativeButton={false}>
          New Article
        </Button>
        <Button
          render={
            <Link href="https://vercel.com" target="_blank" rel="noopener noreferrer" />
          }
          nativeButton={false}
          variant="outline"
        >
          View Analytics
        </Button>
        <Button render={<Link href="/blog" />} nativeButton={false} variant="outline">
          Back to Blog
        </Button>
      </div>

      <div className="mt-10 flex flex-col divide-y divide-border">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="flex flex-wrap items-center justify-between gap-4 py-4"
          >
            <div>
              <Badge variant="outline">{tagLabels[post.tag] ?? post.tag}</Badge>
              <p className="mt-1 font-medium">{post.title}</p>
            </div>
            <div className="flex gap-2">
              <Button
                render={<Link href={`/dashboard/${post.slug}/edit`} />}
                nativeButton={false}
                variant="outline"
                size="sm"
              >
                Edit
              </Button>
              <form action={deletePostAction.bind(null, post.slug)}>
                <Button variant="destructive" size="sm" type="submit" nativeButton>
                  Delete
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
