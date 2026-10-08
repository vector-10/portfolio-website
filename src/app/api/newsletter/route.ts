import { z } from "zod";

const Body = z.object({ email: z.email() });

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }
  return Response.json({ error: "Newsletter storage is not configured yet" }, { status: 503 });
}
