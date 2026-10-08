import { z } from "zod";
import { REACTIONS } from "@/lib/reactions";

const Body = z.object({
  post: z.string().min(1),
  reaction: z.enum(REACTIONS.map((r) => r.id) as [string, ...string[]]),
  on: z.boolean(),
});

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid reaction" }, { status: 400 });
  }
  return Response.json({ error: "Reaction storage is not configured yet" }, { status: 503 });
}
