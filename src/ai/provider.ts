import { AIProvider } from "../types/config";
import { AIContext } from "../types/commit";
import { generateWithGemini } from "./gemini";
import { generateWithOpenAI } from "./openai";
import { getEffectiveProvider } from "../config/config";

export interface AIResponse {
  content: string;
}

export async function generateAIResponse(
  prompt: string,
  provider?: AIProvider
): Promise<AIResponse> {
  const effectiveProvider = provider || getEffectiveProvider();

  switch (effectiveProvider) {
    case "gemini":
      return generateWithGemini(prompt);
    case "openai":
      return generateWithOpenAI(prompt);
    default:
      throw new Error(`Unknown provider: ${effectiveProvider}`);
  }
}

export async function generateCommitSuggestions(
  context: AIContext,
  count: number = 3,
  provider?: AIProvider
): Promise<string> {
  const { PROMPTS } = require("../constants/prompts");
  const prompt = PROMPTS.commit
    .replace("{repository}", context.repository)
    .replace("{branch}", context.branch)
    .replace(
      "{recentCommits}",
      context.recentCommits.map((c) => `  - ${c}`).join("\n")
    )
    .replace(
      "{changedFiles}",
      context.changedFiles
        .map((f) => `  - [${f.status}] ${f.path}`)
        .join("\n")
    )
    .replace("{diff}", context.diff)
    .replace("{count}", count.toString());

  const response = await generateAIResponse(prompt, provider);
  return response.content;
}
