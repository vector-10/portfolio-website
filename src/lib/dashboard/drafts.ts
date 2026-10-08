export const draftKey = (type: string, slug: string) => `cb-dash:${type.toLowerCase()}:${slug}`;

export function readDraft<T>(type: string, slug: string): T | null {
  try {
    const raw = localStorage.getItem(draftKey(type, slug));
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeDraft(type: string, slug: string, value: unknown) {
  try {
    localStorage.setItem(draftKey(type, slug), JSON.stringify(value));
  } catch {}
}

export function clearDraft(type: string, slug: string) {
  try {
    localStorage.removeItem(draftKey(type, slug));
  } catch {}
}

export function draftSlugs(): Set<string> {
  const out = new Set<string>();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("cb-dash:")) out.add(key.slice("cb-dash:".length));
    }
  } catch {}
  return out;
}
