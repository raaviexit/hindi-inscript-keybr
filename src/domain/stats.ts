import { type Finger, keyForCharacter } from "./layout";
import { type AttemptEvaluation, splitGraphemes, wordsPerMinute } from "./typing";

export interface SessionStats {
  wpm: number;
  accuracy: number;
  keyErrors: Record<string, number>;
  fingerErrors: Partial<Record<Finger, number>>;
}

export function deriveSessionStats(
  expectedText: string,
  actualText: string,
  elapsedSeconds: number,
  evaluation: AttemptEvaluation,
): SessionStats {
  const expected = splitGraphemes(expectedText);
  const actual = splitGraphemes(actualText);
  const keyErrors: Record<string, number> = {};
  const fingerErrors: Partial<Record<Finger, number>> = {};

  expected.forEach((unit, index) => {
    // Omitted future characters are not errors; only a typed, mismatched unit heats a key.
    if (actual[index] === undefined || actual[index] === unit) return;
    const key = keyForCharacter(unit.at(-1) ?? unit);
    if (!key) return;
    keyErrors[key.code] = (keyErrors[key.code] ?? 0) + 1;
    fingerErrors[key.finger] = (fingerErrors[key.finger] ?? 0) + 1;
  });

  return {
    wpm: wordsPerMinute(actualText, elapsedSeconds),
    accuracy: evaluation.accuracy,
    keyErrors,
    fingerErrors,
  };
}

