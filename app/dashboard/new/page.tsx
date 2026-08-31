import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/dashboard/post-form";
import { createPost } from "@/app/dashboard/actions";

export default function NewArticlePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-accent-warm"
      >
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      <h1 className="mt-8 text-2xl font-semibold tracking-tight">New Article</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Publishing commits a new file to GitHub and triggers a redeploy — it
        can take about a minute to go live.
      </p>
      <PostForm action={createPost} submitLabel="Publish" />
    </div>
  );
}
