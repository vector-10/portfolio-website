import { notFound } from "next/navigation";
import { PostForm } from "@/components/dashboard/post-form";
import { updatePost } from "@/app/dashboard/actions";
import { getPostBySlug } from "@/lib/posts";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const updateWithSlug = updatePost.bind(null, slug);

  return (
    <div className="mx-auto max-w-2xl w-full lg:max-w-4xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Article</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Updating commits a change to GitHub and triggers a redeploy.
      </p>
      <PostForm
        action={updateWithSlug}
        defaultValues={post}
        submitLabel="Save Changes"
      />
    </div>
  );
}
