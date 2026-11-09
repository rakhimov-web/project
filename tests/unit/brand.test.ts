import { describe, expect, it } from "vitest";
import { brand } from "../../src/config/brand";
describe("public owner config", () => {
  it("defaults to Uzbek with Russian and English fallbacks", () => {
    expect(brand.defaultLanguage).toBe("uz");
    expect(brand.supportedLanguages).toEqual(["uz", "ru", "en"]);
  });
  it("keeps branding usable before owner configuration", () => {
    expect(brand.name.trim().length).toBeGreaterThan(0);
    expect(brand.repositoryUrl).toBe("https://github.com/rakhimov-web/project");
    expect(Object.keys(brand).join(" ")).not.toMatch(/token|secret|admin/i);
  });
});
