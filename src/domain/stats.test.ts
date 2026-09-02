import { deriveSessionStats } from "./stats";
import { evaluateAttempt } from "./typing";

describe("typing statistics", () => {
  it("does not treat text that has not been typed yet as a key error", () => {
    const evaluation = evaluateAttempt("क र", "");
    const stats = deriveSessionStats("क र", "", 0, evaluation);
    expect(stats.keyErrors).toEqual({});
    expect(stats.fingerErrors).toEqual({});
  });

  it("maps a typed mismatch onto its expected InScript key", () => {
    const evaluation = evaluateAttempt("क", "ख");
    const stats = deriveSessionStats("क", "ख", 2, evaluation);
    expect(stats.keyErrors).toEqual({ KeyK: 1 });
    expect(stats.fingerErrors).toEqual({ "right-middle": 1 });
  });
});

