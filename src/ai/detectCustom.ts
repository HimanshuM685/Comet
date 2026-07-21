import { ModelChoice } from "../constants/models";
import { CustomApiFlavor } from "../types/config";

const TIMEOUT_MS = 8000;
const NON_CHAT = /embed|whisper|tts|dall-e|audio|image|moderation|realtime/i;

export interface DetectedEndpoint {
  /** Normalized base URL — includes /v1 when that's where the API lives */
  baseUrl: string;
  api: CustomApiFlavor;
  models: ModelChoice[];
}

async function tryFetchJson(
  url: string,
  headers: Record<string, string>
): Promise<any | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { headers, signal: controller.signal });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// Probes {base}/models and {base}/v1/models with both auth styles.
// Flavor is classified by the response shape: Anthropic model objects
// carry display_name; OpenAI-style ones don't.
export async function detectCustomEndpoint(
  baseUrl: string,
  apiKey: string
): Promise<DetectedEndpoint | null> {
  const root = baseUrl.replace(/\/+$/, "");
  const bases = root.endsWith("/v1") ? [root] : [root, `${root}/v1`];

  const headerSets: Record<string, string>[] = [
    apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    { "x-api-key": apiKey || "", "anthropic-version": "2023-06-01" },
  ];

  for (const b of bases) {
    for (const headers of headerSets) {
      const data = await tryFetchJson(`${b}/models`, headers);
      const list = data?.data;
      if (!Array.isArray(list) || list.length === 0) continue;

      const isAnthropic = list.some((m: any) => m?.display_name);
      if (isAnthropic) {
        return {
          baseUrl: b,
          api: "anthropic",
          models: list.map((m: any) => ({
            name: m.display_name || m.id,
            value: m.id,
          })),
        };
      }
      return {
        baseUrl: b,
        api: "openai",
        models: list
          .map((m: any) => m?.id)
          .filter((id: any) => typeof id === "string" && !NON_CHAT.test(id))
          .sort()
          .map((id: string) => ({ name: id, value: id })),
      };
    }
  }
  return null;
}
