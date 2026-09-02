const MARK = /\p{Mark}/u;
const JOINERS = new Set(["\u200c", "\u200d"]);
const VIRAMA = "्";

/** A fallback that keeps matras, nukta, virama and joined consonants together. */
function fallbackSegments(text: string): string[] {
  const result: string[] = [];
  let current = "";
  let joinsNextBase = false;

  for (const character of Array.from(text.normalize("NFC"))) {
    if (!current) {
      current = character;
      continue;
    }
    if (MARK.test(character) || JOINERS.has(character)) {
      current += character;
      joinsNextBase ||= character === VIRAMA || JOINERS.has(character);
      continue;
    }
    if (joinsNextBase) {
      current += character;
      joinsNextBase = false;
      continue;
    }
    result.push(current);
    current = character;
  }
  if (current) result.push(current);
  return result;
}

/** Returns user-perceived characters, not UTF-16 code units. */
export function splitGraphemes(text: string): string[] {
  const Segmenter = Intl.Segmenter;
  if (typeof Segmenter === "function") {
    return Array.from(new Segmenter("hi", { granularity: "grapheme" }).segment(text), ({ segment }) => segment);
  }
  return fallbackSegments(text);
}

export interface AttemptEvaluation {
  expected: string[];
  actual: string[];
  correct: number;
  incorrect: number;
  missing: number;
  extra: number;
  accuracy: number;
  complete: boolean;
}

export function evaluateAttempt(expectedText: string, actualText: string): AttemptEvaluation {
  const expected = splitGraphemes(expectedText);
  const actual = splitGraphemes(actualText);
  const sharedLength = Math.min(expected.length, actual.length);
  let correct = 0;
  let incorrect = 0;

  for (let index = 0; index < sharedLength; index += 1) {
    if (expected[index] === actual[index]) correct += 1;
    else incorrect += 1;
  }

  const missing = Math.max(0, expected.length - actual.length);
  const extra = Math.max(0, actual.length - expected.length);
  const denominator = Math.max(expected.length, actual.length, 1);
  return {
    expected,
    actual,
    correct,
    incorrect,
    missing,
    extra,
    accuracy: Math.round((correct / denominator) * 100),
    complete: expected.length === actual.length && incorrect === 0,
  };
}

export function removeLastGrapheme(text: string): string {
  const units = splitGraphemes(text);
  units.pop();
  return units.join("");
}

export function wordsPerMinute(text: string, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const characters = splitGraphemes(text.replaceAll(/\s/g, "")).length;
  return Math.round((characters / 5 / elapsedSeconds) * 60);
}
