export const REACTIONS = [
  { id: "useful", label: "Useful" },
  { id: "learned", label: "Learned something" },
  { id: "more", label: "Want a follow-up" },
] as const;

export type ReactionId = (typeof REACTIONS)[number]["id"];

export async function getReactionCounts(): Promise<Record<ReactionId, number>> {
  return { useful: 0, learned: 0, more: 0 };
}
