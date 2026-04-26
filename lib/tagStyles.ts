const norm = (s: string) =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-");

const PRESETS: Record<string, { color: string }> = {
  essential: { color: "var(--accent, #7cffb2)" },
  entertainment: { color: "var(--accent-cyan, #5ee8ff)" },
  community: { color: "var(--accent-amber, #ffb84d)" },
  "non-essential": { color: "var(--accent-hot, #ff3d68)" },
  paypal: { color: "var(--fg-1, #b8b8c8)" },
};

export function getTagStyle(label: string): { color: string } {
  const n = norm(label);
  if (PRESETS[n]) return { ...PRESETS[n] };
  for (const [key, val] of Object.entries(PRESETS)) {
    if (n.includes(key) || key.includes(n)) return { ...val };
  }
  return { color: "var(--fg-2, #6e6e85)" };
}
