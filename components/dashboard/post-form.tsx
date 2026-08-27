import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { tagOrder, tagLabels, type Post } from "@/lib/posts";

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

export function PostForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: Partial<Post>;
  submitLabel: string;
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      <Field label="Title">
        <input
          name="title"
          defaultValue={defaultValues?.title}
          required
          className={fieldClass}
        />
      </Field>

      <Field label="Summary">
        <textarea
          name="summary"
          defaultValue={defaultValues?.summary}
          required
          rows={2}
          className={fieldClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Date">
          <input
            type="date"
            name="date"
            defaultValue={defaultValues?.date ?? today}
            required
            className={fieldClass}
          />
        </Field>

        <Field label="Category">
          <select
            name="tag"
            defaultValue={defaultValues?.tag}
            required
            className={fieldClass}
          >
            {tagOrder.map((tag) => (
              <option key={tag} value={tag}>
                {tagLabels[tag]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Related project slug (optional)">
        <input
          name="relatedProject"
          defaultValue={defaultValues?.relatedProject}
          className={fieldClass}
        />
      </Field>

      <Field label="Content (Markdown/MDX)">
        <textarea
          name="content"
          defaultValue={defaultValues?.content}
          required
          rows={16}
          className={`${fieldClass} font-mono text-sm`}
        />
      </Field>

      <Button type="submit" nativeButton className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}
