export const normalizeTag = (raw: string): string =>
  String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

export const normalizeTags = (list: readonly string[]): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    const n = normalizeTag(item);
    if (!n || seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
};
