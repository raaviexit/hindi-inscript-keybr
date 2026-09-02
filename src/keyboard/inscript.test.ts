import { INSCRIPT_KEYS, codePoints, resolveInscriptKey } from "./inscript";

describe("Hindi InScript", () => {
  it("contains the home row", () => {
    expect(INSCRIPT_KEYS.filter((key) => key.home).map((key) => key.base)).toEqual([
      "ो", "े", "्", "ि", "ु", "प", "र", "क", "त", "च",
    ]);
  });

  it("resolves base and shift mappings", () => {
    expect(resolveInscriptKey("KeyK", "base")).toBe("क");
    expect(resolveInscriptKey("KeyK", "shift")).toBe("ख");
    expect(resolveInscriptKey("KeyD", "base")).toBe("्");
  });

  it("uses code-point iteration for Unicode output", () => {
    expect(codePoints("क्\u200dष")).toEqual([0x915, 0x94d, 0x200d, 0x937]);
  });
});
