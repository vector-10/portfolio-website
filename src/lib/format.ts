export function monthYear(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function fullDate(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${monthYear(iso)}`;
}
