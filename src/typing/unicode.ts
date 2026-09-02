export const ZERO_WIDTH_NON_JOINER = "\u200C";
export const ZERO_WIDTH_JOINER = "\u200D";

/** NFC keeps canonically equivalent Devanagari sequences comparable while preserving ZWJ/ZWNJ. */
export function normalizeTypingText(value: string): string {
  return value.normalize("NFC");
}

export function unicodeUnits(value: string): string[] {
  return Array.from(value);
}

export function codePointLength(value: string): number {
  return Array.from(value).length;
}

export type UnicodeComparison = {
  expected: string;
  actual: string;
  correct: boolean;
  firstMismatch: number;
};

export function compareUnicode(expected: string, actual: string): UnicodeComparison {
  const left = unicodeUnits(normalizeTypingText(expected));
  const right = unicodeUnits(normalizeTypingText(actual));
  const length = Math.min(left.length, right.length);
  let firstMismatch = length;

  for (let i = 0; i < length; i += 1) {
    if (left[i] !== right[i]) {
      firstMismatch = i;
      break;
    }
  }

  const correct = firstMismatch === left.length && left.length === right.length;
  return {
    expected: normalizeTypingText(expected),
    actual: normalizeTypingText(actual),
    correct,
    firstMismatch,
  };
}

export function isDevanagariCodePoint(codePoint: number): boolean {
  return (codePoint >= 0x0900 && codePoint <= 0x097f) || codePoint === 0x200c || codePoint === 0x200d;
}

export function isDevanagariText(value: string): boolean {
  return Array.from(value).every((char) => isDevanagariCodePoint(char.codePointAt(0) ?? -1) || /\s|[.,!?।॥]/u.test(char));
}
