import fetch from "node-fetch";
import { getApiKeyForProvider } from "../utils/env";
import { AIResponse } from "./provider";

export async function generateWithOpenAI(
  prompt: string
): Promise<AIResponse> {
  const apiKey = getApiKeyForProvider("openai");
  const model = process.env.OPENAI_MODEL || "gpt-4o";

  const url = "https://api.openai.com/v1/chat/completions";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are an expert git commit message generator. Always respond with valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("No content received from OpenAI API");
  }

  return { content: text };
}
