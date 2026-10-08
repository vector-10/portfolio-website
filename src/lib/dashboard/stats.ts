import "server-only";

export type Range = "7d" | "30d" | "90d";

export type Stats =
  | { connected: false }
  | {
      connected: true;
      views: number;
      viewsChange: number;
      signups: number;
      subscribers: number;
      reactions: number;
      series: { date: string; views: number }[];
      byPath: Record<string, { views: number; reactions: number | null }>;
    };

export async function getStats(_range: Range): Promise<Stats> {
  return { connected: false };
}
