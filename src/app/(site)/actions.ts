"use server";

import { Resend } from "resend";
import { z } from "zod";
import { site } from "@/config/site";

type Fields = { email: string; subject: string; message: string };

export type ContactState = { status: "idle" | "sent" | "error"; message: string; values?: Fields };

const ContactSchema = z.object({
  email: z.email("Enter a valid email so I can reply."),
  subject: z.string().trim().min(1, "Add a subject.").max(150),
  message: z.string().trim().min(1, "Write a message.").max(5000),
});

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  if (formData.get("website")) return { status: "sent", message: "" };

  const values: Fields = {
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
  const parsed = ContactSchema.safeParse(values);
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0].message, values };

  const { RESEND_API_KEY, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_FROM) {
    return { status: "error", message: `Email isn't set up yet. Write to ${site.email} instead.`, values };
  }

  const { email, subject, message } = parsed.data;
  const { error } = await new Resend(RESEND_API_KEY).emails.send({
    from: CONTACT_FROM,
    to: site.email,
    replyTo: email,
    subject: `[Site] ${subject}`,
    text: `From: ${email}\n\n${message}`,
  });

  if (error) return { status: "error", message: `Something went wrong. Try again or write to ${site.email}.`, values };
  return { status: "sent", message: "" };
}
