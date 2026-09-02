export type Modifier = "base" | "shift" | "altgr";

export type KeyDefinition = {
  code: string;
  label: string;
  base?: string;
  shift?: string;
  altGr?: string;
  finger: "L1" | "L2" | "L3" | "L4" | "L5" | "R1" | "R2" | "R3" | "R4" | "R5";
  home?: boolean;
};

const k = (
  code: string,
  label: string,
  base: string | undefined,
  shift: string | undefined,
  altGr: string | undefined,
  finger: KeyDefinition["finger"],
  home = false,
): KeyDefinition => ({ code, label, base, shift, altGr, finger, home });

/** BIS/Windows Devanagari InScript primary mappings. */
export const INSCRIPT_KEYS: readonly KeyDefinition[] = [
  k("Backquote", "`", "`", "~", "", "L5"),
  k("Digit1", "1", "1", "!", "", "L5"),
  k("Digit2", "2", "2", "@", "", "L4"),
  k("Digit3", "3", "3", "#", "", "L3"),
  k("Digit4", "4", "4", "$", "", "L2"),
  k("Digit5", "5", "5", "%", "", "L1"),
  k("Digit6", "6", "6", "^", "", "R1"),
  k("Digit7", "7", "7", "&", "", "R2"),
  k("Digit8", "8", "8", "*", "", "R3"),
  k("Digit9", "9", "9", "(", "", "R4"),
  k("Digit0", "0", "0", ")", "", "R5"),
  k("Minus", "-", "-", "_", "", "R5"),
  k("Equal", "=", "=", "+", "", "R5"),

  k("KeyQ", "Q", "ौ", "औ", "", "L4"),
  k("KeyW", "W", "ै", "ऐ", "", "L3"),
  k("KeyE", "E", "ा", "आ", "", "L2"),
  k("KeyR", "R", "ी", "ई", "", "L1"),
  k("KeyT", "T", "ू", "ऊ", "", "L1"),
  k("KeyY", "Y", "ब", "भ", "", "R1"),
  k("KeyU", "U", "ह", "ङ", "", "R2"),
  k("KeyI", "I", "ग", "घ", "", "R3"),
  k("KeyO", "O", "द", "ध", "", "R4"),
  k("KeyP", "P", "ज", "झ", "", "R5"),
  k("BracketLeft", "[", "ड", "ढ", "", "R5"),
  k("BracketRight", "]", "़", "ञ", "", "R5"),

  k("KeyA", "A", "ो", "ओ", "", "L4", true),
  k("KeyS", "S", "े", "ए", "", "L3", true),
  k("KeyD", "D", "्", "अ", "", "L2", true),
  k("KeyF", "F", "ि", "इ", "", "L1", true),
  k("KeyG", "G", "ु", "उ", "", "L1", true),
  k("KeyH", "H", "प", "फ", "", "R1", true),
  k("KeyJ", "J", "र", "ऱ", "", "R2", true),
  k("KeyK", "K", "क", "ख", "", "R3", true),
  k("KeyL", "L", "त", "थ", "", "R4", true),
  k("Semicolon", ";", "च", "छ", "", "R5", true),

  k("KeyZ", "Z", "ॆ", "ऎ", "", "L5"),
  k("KeyX", "X", "ं", "ँ", "", "L4"),
  k("KeyC", "C", "म", "ण", "", "L3"),
  k("KeyV", "V", "न", "ऩ", "", "L2"),
  k("KeyB", "B", "व", "ड", "", "L1"),
  k("KeyN", "N", "ल", "ळ", "", "R1"),
  k("KeyM", "M", "स", "श", "", "R2"),
  k("Comma", ",", ",", "श", "", "R3"),
  k("Period", ".", ".", "ष", "", "R4"),
  k("Slash", "/", "/", "र", "", "R5"),
];

export const INSCRIPT_BY_CODE = new Map(INSCRIPT_KEYS.map((key) => [key.code, key]));

export function resolveInscriptKey(code: string, modifier: Modifier): string | undefined {
  const key = INSCRIPT_BY_CODE.get(code);
  if (!key) return undefined;
  if (modifier === "shift") return key.shift || key.base;
  if (modifier === "altgr") return key.altGr || key.base;
  return key.base;
}

export function codePoints(text: string): number[] {
  return Array.from(text, (char) => char.codePointAt(0) as number);
}
