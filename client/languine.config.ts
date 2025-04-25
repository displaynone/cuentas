import { defineConfig } from "languine";

export default defineConfig({
  version: "1.0.2",
  locale: {
    source: "en",
    targets: ["es", "fr", "it", "jp", "zn", "ko", "ge", "ar", "pt", "pl"],
  },
  files: {
    json: {
      include: ["src/services/i18n/locales/[locale]/common.json"],
    },
  },
  llm: {
    provider: "ollama",
    model: "winkefinger/alma-13b:latest",
  },
});
