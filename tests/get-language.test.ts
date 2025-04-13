import { describe, it, expect } from "vitest";
import { getLanguage } from "../src";
import { LanguageStatus } from "../shared/enums";

describe("getLanguage", () => {
  it("finds a language by ISO 639-1 code", () => {
    const language = getLanguage("en", 1);
    expect(language).not.toBeNull();
    expect(language?.name).toBe("English");
    expect(language?.codes["1"]).toBe("en");
    expect(language?.codes["3"]).toBe("eng");
  });

  it("finds a language by ISO 639-2T code", () => {
    const language = getLanguage("eng", 2);
    expect(language).not.toBeNull();
    expect(language?.name).toBe("English");
    expect(language?.codes["1"]).toBe("en");
    expect(language?.codes["3"]).toBe("eng");
  });

  it("finds a language by ISO 639-2B code", () => {
    const language = getLanguage("ger", "2B");
    expect(language).not.toBeNull();
    expect(language?.name).toBe("German");
    expect(language?.codes["1"]).toBe("de");
    expect(language?.codes["3"]).toBe("deu");
  });

  it("finds a language by ISO 639-3 code", () => {
    const language = getLanguage("eng", 3);
    expect(language).not.toBeNull();
    expect(language?.name).toBe("English");
    expect(language?.codes["1"]).toBe("en");
  });

  it("performs case-insensitive lookup", () => {
    const language = getLanguage("EN", 1);
    expect(language).not.toBeNull();
    expect(language?.name).toBe("English");
  });

  it("returns null for non-existent language codes", () => {
    const language = getLanguage("xx", 1);
    expect(language).toBeNull();
  });

  it("auto-detects format when no format is specified", () => {
    const language = getLanguage("zh");
    expect(language).not.toBeNull();
    expect(language?.name).toBe("Chinese");

    const language2 = getLanguage("eng");
    expect(language2).not.toBeNull();
    expect(language2?.name).toBe("English");
  });

  it("correctly identifies macro languages", () => {
    const language = getLanguage("zh", 1);
    expect(language?.scope).toBe("M"); // Macro language
  });

  it("correctly identifies individual languages with family relationships", () => {
    const language = getLanguage("cmn", 3); // Mandarin Chinese
    expect(language?.scope).toBe("I"); // Individual language
    expect(language?.family).not.toBeNull();
    expect(language?.family?.name).toBe("Chinese");
    expect(language?.family?.codes["1"]).toBe("zh");
  });

  it("handles languages without an ISO 639-1 code", () => {
    const language = getLanguage("haw", 3); // Hawaiian
    expect(language).not.toBeNull();
    expect(language?.codes["1"]).toBeNull(); // No ISO 639-1 code
    expect(language?.codes["3"]).toBe("haw");
  });

  // New tests for language status
  it("correctly identifies active languages", () => {
    const language = getLanguage("en", 1); // English should be active
    expect(language).not.toBeNull();
    expect(language?.status).toBe(LanguageStatus.Active);
  });

  it("preserves status field when resolving to family language", () => {
    // Test a language that has a family and check its status before and after resolution
    const mandarin = getLanguage("cmn", 3);
    expect(mandarin).not.toBeNull();
    const mandarinStatus = mandarin?.status;

    // Now get the family language
    const chinese = mandarin?.family;
    expect(chinese).not.toBeNull();

    // The statuses might be different, but both should be valid values from LanguageStatus
    expect([LanguageStatus.Active, LanguageStatus.Deprecated]).toContain(
      mandarinStatus,
    );
    expect([LanguageStatus.Active, LanguageStatus.Deprecated]).toContain(
      chinese?.status,
    );
  });
});
