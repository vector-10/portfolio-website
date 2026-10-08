"use client";

import { useId, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm({
  label,
  className = "",
  inputClassName = "bg-transparent",
}: {
  label?: string;
  className?: string;
  inputClassName?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const id = useId();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const email = new FormData(e.currentTarget).get("email");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className={`flex w-full flex-col gap-3 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm text-muted">
          {label}
        </label>
      )}
      {status === "success" ? (
        <p role="status" className="flex min-h-12 items-center text-base">
          Thanks. Check your inbox to confirm.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <input
            id={id}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            aria-label={label ? undefined : "Email address"}
            className={`min-h-12 min-w-0 flex-[1_1_220px] rounded-full border border-ink px-4 text-base text-ink placeholder:text-muted ${inputClassName}`}
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="min-h-12 cursor-pointer rounded-full bg-ink px-5.5 font-medium text-bg disabled:cursor-wait disabled:opacity-70"
          >
            Subscribe
          </button>
        </div>
      )}
      {status === "error" && (
        <p role="alert" className="text-sm text-muted">
          Something went wrong. Try again or email me.
        </p>
      )}
    </form>
  );
}
