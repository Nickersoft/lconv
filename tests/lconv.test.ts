import lconv from "../src";

describe("lconv", () => {
  it("converts from 1 to 2 properly", () => {
    expect(lconv("en", { from: 1, to: 2 })).toBe("eng");
  });

  it("converts from 1 to 3 properly", () => {
    expect(lconv("en", { from: 1, to: 3 })).toBe("eng");
  });

  it("converts from 2 to 3 properly", () => {
    expect(lconv("eng", { from: 2, to: 3 })).toBe("eng");
  });

  it("converts from 3 to 2 properly", () => {
    expect(lconv("eng", { from: 3, to: 2 })).toBe("eng");
  });

  it("converts from 3 to 1 properly", () => {
    expect(lconv("eng", { from: 3, to: 1 })).toBe("en");
  });

  it("converts from 2 to 1 properly", () => {
    expect(lconv("eng", { from: 2, to: 1 })).toBe("en");
  });

  it("returns null if cannot convert", () => {
    expect(lconv("cmn", { from: 3, to: 1 })).toBeNull();
  });

  it("converts to label properly", () => {
    expect(lconv("cmn", { from: 3, to: "label" })).toBe("Mandarin Chinese");
  });

  it("resolves languages properly", () => {
    expect(lconv("cmn", { from: 3, to: 1, resolve: true })).toBe("zh");
  });
});
