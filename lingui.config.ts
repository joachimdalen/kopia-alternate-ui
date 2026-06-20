import { defineConfig } from "@lingui/cli";
export default defineConfig({
  locales: ["nb", "en"],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"]
    }
  ]
});
