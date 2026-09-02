"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/lib/auth";
import { checkPassword } from "@/lib/password";
import { commitPost, deleteFile, getFileSha } from "@/lib/github";
import type { PostTag } from "@/lib/posts";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function escapeYamlString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function buildMdxContent(data: {
  title: string;
  summary: string;
  date: string;
  tag?: PostTag;
  relatedProject?: string;
  externalUrl?: string;
  platform?: string;
  coverImage?: string;
  body: string;
}): string {
  const lines = [
    "---",
    `title: "${escapeYamlString(data.title)}"`,
    `summary: "${escapeYamlString(data.summary)}"`,
    `date: "${data.date}"`,
  ];
  if (data.tag) {
    lines.push(`tag: "${data.tag}"`);
  }
  if (data.relatedProject) {
    lines.push(`relatedProject: "${escapeYamlString(data.relatedProject)}"`);
  }
  if (data.externalUrl) {
    lines.push(`externalUrl: "${escapeYamlString(data.externalUrl)}"`);
  }
  if (data.platform) {
    lines.push(`platform: "${escapeYamlString(data.platform)}"`);
  }
  if (data.coverImage) {
    lines.push(`coverImage: "${escapeYamlString(data.coverImage)}"`);
  }
  lines.push("---", "", data.body);
  return lines.join("\n");
}

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const valid = await checkPassword(password);

  if (!valid) {
    redirect("/dashboard/login?error=1");
  }

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/dashboard/login");
}

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const summary = String(formData.get("summary") ?? "");
  const date = String(formData.get("date") ?? "");
  const tag = (String(formData.get("tag") ?? "") || undefined) as PostTag | undefined;
  const relatedProject = String(formData.get("relatedProject") ?? "") || undefined;
  const externalUrl = String(formData.get("externalUrl") ?? "") || undefined;
  const platform = String(formData.get("platform") ?? "") || undefined;
  const coverImage = String(formData.get("coverImage") ?? "") || undefined;
  const body = String(formData.get("content") ?? "");

  const slug = slugify(title);
  const mdx = buildMdxContent({
    title,
    summary,
    date,
    tag,
    relatedProject,
    externalUrl,
    platform,
    coverImage,
    body,
  });

  await commitPost({ slug, content: mdx, message: `Add post: ${title}` });

  revalidatePath("/blog");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updatePost(slug: string, formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const summary = String(formData.get("summary") ?? "");
  const date = String(formData.get("date") ?? "");
  const tag = (String(formData.get("tag") ?? "") || undefined) as PostTag | undefined;
  const relatedProject = String(formData.get("relatedProject") ?? "") || undefined;
  const externalUrl = String(formData.get("externalUrl") ?? "") || undefined;
  const platform = String(formData.get("platform") ?? "") || undefined;
  const coverImage = String(formData.get("coverImage") ?? "") || undefined;
  const body = String(formData.get("content") ?? "");

  const sha = await getFileSha(slug);
  const mdx = buildMdxContent({
    title,
    summary,
    date,
    tag,
    relatedProject,
    externalUrl,
    platform,
    coverImage,
    body,
  });

  await commitPost({
    slug,
    content: mdx,
    message: `Update post: ${title}`,
    sha,
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deletePostAction(slug: string) {
  const sha = await getFileSha(slug);
  if (!sha) {
    throw new Error(`Post "${slug}" not found`);
  }

  await deleteFile({ slug, message: `Delete post: ${slug}`, sha });

  revalidatePath("/blog");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
