import { characterForKey, keyForCharacter, keyForCode } from "./layout";

describe("Hindi InScript layout", () => {
  it("maps core vowels, matras, consonants and their shifted partners", () => {
    expect(characterForKey("KeyD")).toBe("्");
    expect(characterForKey("KeyD", true)).toBe("अ");
    expect(characterForKey("KeyE")).toBe("ा");
    expect(characterForKey("KeyE", true)).toBe("आ");
    expect(characterForKey("KeyK")).toBe("क");
    expect(characterForKey("KeyK", true)).toBe("ख");
  });

  it("keeps the physical home row and finger metadata", () => {
    expect(keyForCode("KeyK")).toMatchObject({ home: true, finger: "right-middle" });
    expect(keyForCode("KeyD")).toMatchObject({ home: true, finger: "left-middle" });
  });

  it("finds keys for Devanagari characters", () => {
    expect(keyForCharacter("्")?.code).toBe("KeyD");
    expect(keyForCharacter("औ")?.code).toBe("KeyQ");
    expect(keyForCharacter("।")?.code).toBe("Period");
  });
});
