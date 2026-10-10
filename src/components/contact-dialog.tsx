"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { sendContact, type ContactState } from "@/app/(site)/actions";
import { buttonClass } from "./button";
import { CONTACT_EVENT } from "./contact-anchor";

const initial: ContactState = { status: "idle", message: "" };

const label = "flex flex-col gap-2 text-sm text-muted";
const field = "w-full border border-rule bg-transparent px-5 text-base text-ink focus:border-ink focus:outline-none";

export function ContactDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState({ count: 0, subject: "" });

  useEffect(() => {
    const show = (e: Event) => {
      setOpen((o) => ({ count: o.count + 1, subject: (e as CustomEvent<string>).detail }));
      ref.current?.showModal();
    };
    window.addEventListener(CONTACT_EVENT, show);
    return () => window.removeEventListener(CONTACT_EVENT, show);
  }, []);

  return (
    <dialog
      id="contact-dialog"
      ref={ref}
      aria-labelledby="contact-title"
      onClick={(e) => e.target === ref.current && ref.current.close()}
      className="m-auto max-h-[calc(100dvh-32px)] w-[min(560px,calc(100%-32px))] border border-ink bg-bg p-0 text-ink backdrop:bg-[rgba(20,18,15,0.45)]"
    >
      <ContactForm key={open.count} subject={open.subject} onClose={() => ref.current?.close()} />
    </dialog>
  );
}

function ContactForm({ subject, onClose }: { subject: string; onClose: () => void }) {
  const [state, action, pending] = useActionState(sendContact, initial);

  const head = (
    <div className="flex items-start justify-between gap-4">
      <h2 id="contact-title" className="text-[clamp(28px,3vw,36px)] leading-[1.1] tracking-[-0.02em]">
        {state.status === "sent" ? "Thanks, it's sent." : "Email me"}
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="size-11 shrink-0 cursor-pointer rounded-full border border-rule bg-transparent text-lg text-ink"
      >
        ×
      </button>
    </div>
  );

  if (state.status === "sent") {
    return (
      <div className="flex flex-col gap-5 p-[clamp(20px,4vw,32px)]">
        {head}
        <p className="text-muted">I reply within one working day.</p>
        <button type="button" onClick={onClose} className={`${buttonClass()} cursor-pointer self-start`}>
          Close
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5 p-[clamp(20px,4vw,32px)]">
      {head}
      <label className={label}>
        Your email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.values?.email}
          className={`${field} min-h-12 rounded-full`}
        />
      </label>
      <label className={label}>
        Subject
        <input
          name="subject"
          required
          maxLength={150}
          defaultValue={state.values?.subject ?? subject}
          className={`${field} min-h-12 rounded-full`}
        />
      </label>
      <label className={label}>
        Message
        <textarea
          name="message"
          required
          rows={6}
          maxLength={5000}
          defaultValue={state.values?.message}
          className={`${field} resize-y py-3`}
        />
      </label>
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.status === "error" && (
        <p role="alert" className="text-[15px] text-muted">
          {state.message}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-muted">I reply within one working day.</span>
        <button type="submit" disabled={pending} className={`${buttonClass()} cursor-pointer disabled:opacity-60`}>
          {pending ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
