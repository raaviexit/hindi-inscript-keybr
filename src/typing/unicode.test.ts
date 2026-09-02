import { compareUnicode, isDevanagariText, normalizeTypingText, unicodeUnits } from "./unicode";

describe("Unicode typing helpers", () => {
  it("normalizes canonically equivalent text", () => {
    expect(normalizeTypingText("क\u093c़")).toBe("क़");
  });

  it("compares Devanagari code-point sequences", () => {
    expect(compareUnicode("कर्म", "कर्म").correct).toBe(true);
    expect(compareUnicode("कर्म", "करम").correct).toBe(false);
  });

  it("keeps ZWJ/ZWNJ as explicit Unicode units", () => {
    expect(unicodeUnits("क\u200dष")).toEqual(["क", "\u200d", "ष"]);
    expect(unicodeUnits("क्\u200dष")).toEqual(["क", "्", "\u200d", "ष"]);
  });

  it("recognizes Devanagari text", () => {
    expect(isDevanagariText("हिंदी भाषा।")).toBe(true);
    expect(isDevanagariText("hello")).toBe(false);
  });
});
