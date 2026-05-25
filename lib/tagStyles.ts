import { normalizeTag } from "./normalizeTag";

const PRESETS: Record<string, { color: string }> = {
  essential: { color: "var(--accent, #7cffb2)" },
  entertainment: { color: "var(--accent-cyan, #5ee8ff)" },
  community: { color: "var(--accent-amber, #ffb84d)" },
  "non-essential": { color: "var(--accent-hot, #ff3d68)" },
  paypal: { color: "var(--fg-1, #b8b8c8)" },
};

const FALLBACK_PALETTE = [
  "var(--accent, #7cffb2)",
  "var(--accent-hot, #ff3d68)",
  "var(--accent-amber, #ffb84d)",
  "var(--accent-cyan, #5ee8ff)",
];

const hash = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

// Preset keys are hyphenated (e.g. "non-essential"). Storage normalization keeps
// internal whitespace, so hyphenate before looking up a preset.
const presetKey = (n: string): string => n.replace(/\s+/g, "-");

export function getTagStyle(label: string): { color: string } {
  const n = normalizeTag(label);
  if (!n) return { color: FALLBACK_PALETTE[0] };
  const key = presetKey(n);
  if (PRESETS[key]) return { ...PRESETS[key] };
  for (const [k, val] of Object.entries(PRESETS)) {
    if (key.includes(k) || k.includes(key)) return { ...val };
  }
  return { color: FALLBACK_PALETTE[hash(n) % FALLBACK_PALETTE.length] };
}
