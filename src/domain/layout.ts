export type Finger =
  | "left-pinky"
  | "left-ring"
  | "left-middle"
  | "left-index"
  | "right-index"
  | "right-middle"
  | "right-ring"
  | "right-pinky"
  | "thumb";

export interface InscriptKey {
  code: string;
  normal: string;
  shift?: string;
  altGr?: string;
  label?: string;
  finger: Finger;
  home?: boolean;
  width?: "wide" | "extra-wide";
}

/**
 * Hindi (Devanagari) layout defined by the BIS InScript standard.
 * The physical codes keep the layout usable on both ANSI and ISO keyboards.
 */
export const INSCRIPT_ROWS: readonly (readonly InscriptKey[])[] = [
  [
    { code: "Backquote", normal: "ॊ", shift: "ॅ", finger: "left-pinky" },
    { code: "Digit1", normal: "१", shift: "१", finger: "left-pinky" },
    { code: "Digit2", normal: "२", shift: "२", finger: "left-pinky" },
    { code: "Digit3", normal: "३", shift: "्र", finger: "left-ring" },
    { code: "Digit4", normal: "४", shift: "र्", finger: "left-middle" },
    { code: "Digit5", normal: "५", shift: "ज्ञ", finger: "left-index" },
    { code: "Digit6", normal: "६", shift: "त्र", finger: "right-index" },
    { code: "Digit7", normal: "७", shift: "क्ष", finger: "right-index" },
    { code: "Digit8", normal: "८", shift: "श्र", finger: "right-middle" },
    { code: "Digit9", normal: "९", shift: "(", finger: "right-ring" },
    { code: "Digit0", normal: "०", shift: ")", finger: "right-ring" },
    { code: "Minus", normal: "-", shift: "ः", finger: "right-pinky" },
    { code: "Equal", normal: "ृ", shift: "ऋ", finger: "right-pinky" },
    { code: "Backspace", normal: "⌫", label: "Backspace", finger: "right-pinky", width: "wide" },
  ],
  [
    { code: "Tab", normal: "⇥", label: "Tab", finger: "left-pinky", width: "wide" },
    { code: "KeyQ", normal: "ौ", shift: "औ", finger: "left-pinky" },
    { code: "KeyW", normal: "ै", shift: "ऐ", finger: "left-ring" },
    { code: "KeyE", normal: "ा", shift: "आ", finger: "left-middle" },
    { code: "KeyR", normal: "ी", shift: "ई", finger: "left-index" },
    { code: "KeyT", normal: "ू", shift: "ऊ", finger: "left-index" },
    { code: "KeyY", normal: "ब", shift: "भ", finger: "right-index" },
    { code: "KeyU", normal: "ह", shift: "ङ", finger: "right-index" },
    { code: "KeyI", normal: "ग", shift: "घ", finger: "right-middle" },
    { code: "KeyO", normal: "द", shift: "ध", finger: "right-ring" },
    { code: "KeyP", normal: "ज", shift: "झ", finger: "right-pinky" },
    { code: "BracketLeft", normal: "ड", shift: "ढ", finger: "right-pinky" },
    { code: "BracketRight", normal: "़", shift: "ञ", finger: "right-pinky" },
    { code: "Backslash", normal: "ॉ", shift: "ऑ", finger: "right-pinky" },
  ],
  [
    { code: "CapsLock", normal: "⇪", label: "Caps", finger: "left-pinky", width: "extra-wide" },
    { code: "KeyA", normal: "ो", shift: "ओ", finger: "left-pinky", home: true },
    { code: "KeyS", normal: "े", shift: "ए", finger: "left-ring", home: true },
    { code: "KeyD", normal: "्", shift: "अ", finger: "left-middle", home: true },
    { code: "KeyF", normal: "ि", shift: "इ", finger: "left-index", home: true },
    { code: "KeyG", normal: "ु", shift: "उ", finger: "left-index", home: true },
    { code: "KeyH", normal: "प", shift: "फ", finger: "right-index", home: true },
    { code: "KeyJ", normal: "र", shift: "ऱ", finger: "right-index", home: true },
    { code: "KeyK", normal: "क", shift: "ख", finger: "right-middle", home: true },
    { code: "KeyL", normal: "त", shift: "थ", finger: "right-ring", home: true },
    { code: "Semicolon", normal: "च", shift: "छ", finger: "right-pinky", home: true },
    { code: "Quote", normal: "ट", shift: "ठ", finger: "right-pinky" },
    { code: "Enter", normal: "↵", label: "Enter", finger: "right-pinky", width: "extra-wide" },
  ],
  [
    { code: "ShiftLeft", normal: "⇧", label: "Shift", finger: "left-pinky", width: "extra-wide" },
    // Present only on ISO 105-key hardware; punctuation remains available in the web trainer.
    { code: "IntlBackslash", normal: "\\", shift: "|", finger: "left-pinky" },
    { code: "KeyZ", normal: "ं", shift: "ँ", finger: "left-pinky" },
    { code: "KeyX", normal: "म", shift: "ण", finger: "left-ring" },
    { code: "KeyC", normal: "न", shift: "ऩ", finger: "left-middle" },
    { code: "KeyV", normal: "व", shift: "ळ", finger: "left-index" },
    { code: "KeyB", normal: "ल", shift: "ळ", finger: "left-index" },
    { code: "KeyN", normal: "स", shift: "श", finger: "right-index" },
    { code: "KeyM", normal: "य", shift: "ष", finger: "right-index" },
    { code: "Comma", normal: ",", shift: "ष", finger: "right-middle" },
    { code: "Period", normal: "।", shift: "॥", finger: "right-ring" },
    { code: "Slash", normal: "य", shift: "?", finger: "right-pinky" },
    { code: "ShiftRight", normal: "⇧", label: "Shift", finger: "right-pinky", width: "extra-wide" },
  ],
  [
    { code: "ControlLeft", normal: "Ctrl", label: "Ctrl", finger: "left-pinky", width: "wide" },
    { code: "AltLeft", normal: "Alt", label: "Alt", finger: "thumb", width: "wide" },
    { code: "Space", normal: " ", label: "Space", finger: "thumb", width: "extra-wide" },
    { code: "AltRight", normal: "AltGr", label: "AltGr", finger: "thumb", width: "wide" },
    { code: "ControlRight", normal: "Ctrl", label: "Ctrl", finger: "right-pinky", width: "wide" },
  ],
];

export const INSCRIPT_KEYS = INSCRIPT_ROWS.flat();

export const keyForCode = (code: string): InscriptKey | undefined =>
  INSCRIPT_KEYS.find((key) => key.code === code);

export function characterForKey(code: string, shifted = false, altGr = false): string | undefined {
  const key = keyForCode(code);
  if (!key || (key.label && code !== "Space") || key.normal === "⌫") return undefined;
  if (altGr && key.altGr) return key.altGr;
  return shifted ? key.shift ?? key.normal : key.normal;
}

export function keyForCharacter(character: string): InscriptKey | undefined {
  return INSCRIPT_KEYS.find(
    (key) => key.normal === character || key.shift === character || key.altGr === character,
  );
}

export const FINGER_LABELS: Record<Finger, string> = {
  "left-pinky": "बायीं छोटी उंगली",
  "left-ring": "बायीं अनामिका",
  "left-middle": "बायीं मध्यमा",
  "left-index": "बायीं तर्जनी",
  "right-index": "दायीं तर्जनी",
  "right-middle": "दायीं मध्यमा",
  "right-ring": "दायीं अनामिका",
  "right-pinky": "दायीं छोटी उंगली",
  thumb: "अंगूठा",
};
