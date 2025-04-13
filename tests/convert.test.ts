import { describe, it, expect } from "vitest";
import { convert, getLanguage } from "../src";
import { LanguageStatus } from "../shared/enums";

describe("convert", () => {
  it("converts from 1 to 2 properly", () => {
    expect(convert("en", { from: 1, to: 2 })).toBe("eng");
  });

  it("converts from 1 to 3 properly", () => {
    expect(convert("en", { from: 1, to: 3 })).toBe("eng");
  });

  it("converts from 2 to 3 properly", () => {
    expect(convert("eng", { from: 2, to: 3 })).toBe("eng");
  });

  it("converts from 3 to 2 properly", () => {
    expect(convert("eng", { from: 3, to: 2 })).toBe("eng");
  });

  it("converts from 3 to 1 properly", () => {
    expect(convert("eng", { from: 3, to: 1 })).toBe("en");
  });

  it("converts from 2 to 1 properly", () => {
    expect(convert("eng", { from: 2, to: 1 })).toBe("en");
  });

  it("returns null if cannot convert", () => {
    expect(convert("cmn", { from: 3, to: 1 })).toBeNull();
  });

  it("converts to label properly", () => {
    expect(convert("cmn", { from: 3, to: "label" })).toBe("Mandarin Chinese");
  });

  it("resolves languages properly", () => {
    expect(convert("cmn", { from: 3, to: 1, resolve: true })).toBe("zh");
  });

  // New tests for convert function
  it("converts from 'label' to code properly", () => {
    expect(convert("English", { from: "label", to: 3 })).toBe("eng");
  });

  it("converts from 'label' to code with default to=1", () => {
    expect(convert("English", { from: "label" })).toBe("en");
  });

  it("uses default options correctly", () => {
    // When no options provided, should convert to label
    expect(convert("zh")).toBe("Chinese");
    expect(convert("eng")).toBe("English");
  });

  it("handles default 'to' option based on 'from'", () => {
    expect(convert("en", { from: 1 })).toBe("English");
    expect(convert("English", { from: "label" })).toBe("en");
  });

  it("resolves specific Chinese languages to Mandarin with resolve=true", () => {
    // Cantonese should resolve to Chinese with resolve=true
    expect(convert("yue", { from: 3, to: "label", resolve: true })).toBe(
      "Chinese",
    );
  });

  it("doesn't resolve languages when resolve=false", () => {
    expect(
      convert("yue", {
        from: 3,
        to: "label",
        resolve: false,
      }),
    ).toBe("Yue Chinese");
  });

  it("handles empty string input", () => {
    expect(convert("", { from: 1, to: 2 })).toBeNull();
  });

  it("handles case-insensitive input", () => {
    expect(convert("EN", { from: 1, to: 3 })).toBe("eng");
    expect(convert("eNg", { from: 3, to: 1 })).toBe("en");
  });

  it("handles whitespace in input", () => {
    expect(convert("  en  ", { from: 1, to: 3 })).toBe("eng");
  });

  it("converts from '2B' to other formats properly", () => {
    expect(convert("ger", { from: "2B", to: 1 })).toBe("de");
  });

  it("converts to '2B' format properly", () => {
    expect(convert("de", { from: 1, to: "2B" })).toBe("ger");
  });

  // Tests for status field when using convert function
  describe("status field", () => {
    it("preserves status when converting between codes", () => {
      // Get a language with known status
      const enLang = getLanguage("en", 1);
      expect(enLang).not.toBeNull();
      expect(enLang?.status).toBe(LanguageStatus.Active);

      // Converting between codes preserves language identity and status
      const en3Code = convert("en", { from: 1, to: 3 });
      const enFromConvert = getLanguage(en3Code!, 3);
      expect(enFromConvert?.status).toBe(LanguageStatus.Active);
    });

    it("handles status when resolving to family language", () => {
      // First get a language with a family relationship (like Mandarin Chinese)
      const cmn = getLanguage("cmn", 3);
      expect(cmn).not.toBeNull();

      // Convert with resolve=true to get the family language code
      const zhCode = convert("cmn", { from: 3, to: 1, resolve: true });
      expect(zhCode).toBe("zh");

      // Get the resolved language and check it has a valid status
      const zh = getLanguage(zhCode!, 1);
      expect(zh).not.toBeNull();
      expect([LanguageStatus.Active, LanguageStatus.Deprecated]).toContain(
        zh?.status,
      );
    });
  });
});
