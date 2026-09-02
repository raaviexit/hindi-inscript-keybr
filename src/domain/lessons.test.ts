import { createAdaptiveLesson, LESSONS } from "./lessons";

describe("lesson progression", () => {
  it("covers home row through sentences", () => {
    expect(LESSONS.map((lesson) => lesson.id)).toEqual([
      "home-row",
      "vowels",
      "consonants",
      "matras",
      "conjuncts",
      "words",
      "sentences",
    ]);
  });

  it("builds a drill around missed InScript characters", () => {
    const lesson = createAdaptiveLesson(["क", "ा", "क"]);
    expect(lesson.focus).toEqual(["क", "ा"]);
    expect(lesson.target.length).toBeGreaterThan(0);
  });
});
