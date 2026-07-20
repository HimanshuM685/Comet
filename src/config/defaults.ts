import { Config } from "../types/config";

export const DEFAULT_CONFIG: Config = {
  provider: "gemini",
  model: "gemini-2.5-flash",
  emoji: false,
  autoCommit: false,
  theme: "dark",
  maxLength: 60,
  language: "en",
};
