import { evaluateAttempt, removeLastGrapheme, splitGraphemes, wordsPerMinute } from "./typing";

describe("Unicode-safe Hindi typing", () => {
  it("keeps matras and nukta with their base consonant", () => {
    expect(splitGraphemes("किताब")).toEqual(["कि", "ता", "ब"]);
    expect(splitGraphemes("क़")).toEqual(["क़"]);
  });

  it("keeps halant conjuncts and optional ZWJ sequences intact", () => {
    expect(splitGraphemes("क्ष")).toEqual(["क्ष"]);
    expect(splitGraphemes("क्‍ष")).toEqual(["क्‍ष"]);
    expect(removeLastGrapheme("अक्ष")).toBe("अ");
  });

  it("scores complete Hindi text by grapheme, not UTF-16 code unit", () => {
    const result = evaluateAttempt("हिंदी भाषा", "हिंदी भाषा");
    expect(result.complete).toBe(true);
    expect(result.accuracy).toBe(100);
    expect(result.expected).toContain("हिं");
  });

  it("identifies a matra error without corrupting adjacent units", () => {
    const result = evaluateAttempt("किताब", "कुताब");
    expect(result.correct).toBe(2);
    expect(result.incorrect).toBe(1);
    expect(result.accuracy).toBe(67);
  });

  it("calculates a non-zero WPM from Hindi graphemes", () => {
    expect(wordsPerMinute("हिंदी", 12)).toBeGreaterThan(0);
  });
});
