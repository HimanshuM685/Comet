export type AIProvider = "gemini" | "openai";

export interface Config {
  provider: AIProvider;
  model: string;
  emoji: boolean;
  autoCommit: boolean;
  theme: "dark" | "light";
  maxLength: number;
  language: string;
}

export interface ConfigOptions {
  provider?: AIProvider;
  model?: string;
  emoji?: boolean;
  autoCommit?: boolean;
  theme?: "dark" | "light";
  maxLength?: number;
  language?: string;
}
