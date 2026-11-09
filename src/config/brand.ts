const configuredName = process.env.NEXT_PUBLIC_BRAND_NAME || "{{BRAND_NAME}}";
const configuredInstructor =
  process.env.NEXT_PUBLIC_INSTRUCTOR_NAME || "{{YOUR NAME}}";
/** Public, non-secret owner settings. Replace placeholders before launch. */
export const brand = {
  name: configuredName,
  displayName: configuredName.startsWith("{{") ? "AI & Coding" : configuredName,
  instructorDisplayName: configuredInstructor.startsWith("{{")
    ? "Muallif"
    : configuredInstructor,
  botUsername: process.env.NEXT_PUBLIC_BOT_USERNAME || "{{BOT_USERNAME}}",
  productionDomain:
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "{{https://app.example.com}}",
  instructorName: configuredInstructor,
  repositoryUrl: "https://github.com/rakhimov-web/project",
  defaultLanguage: "uz",
  supportedLanguages: ["uz", "ru", "en"],
} as const;
