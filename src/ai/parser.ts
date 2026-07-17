import { CommitSuggestion } from "../types/commit";

export function parseCommitSuggestions(
  rawResponse: string
): CommitSuggestion[] {
  try {
    const jsonMatch = rawResponse.match(/\[[\s\S]*?\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]) as unknown[];

    if (!Array.isArray(parsed)) {
      throw new Error("Parsed response is not an array");
    }

    return parsed
      .filter((item): item is CommitSuggestion => {
        return (
          typeof item === "object" &&
          item !== null &&
          "message" in item &&
          "type" in item
        );
      })
      .map((item) => ({
        message: String(item.message),
        type: String(item.type) as CommitSuggestion["type"],
        scope: item.scope ? String(item.scope) : undefined,
        description: item.description ? String(item.description) : "",
      }));
  } catch (error) {
    throw new Error(
      `Failed to parse AI response: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export function parseJsonObjectResponse(
  rawResponse: string
): Record<string, any> | null {
  try {
    const jsonMatch = rawResponse.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      throw new Error("No JSON object found in response");
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    throw new Error(
      `Failed to parse JSON object response: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Backwards-compatible aliases
export function parseReviewResponse(rawResponse: string): unknown {
  return parseJsonObjectResponse(rawResponse);
}

export function parseExplainResponse(rawResponse: string): unknown {
  return parseJsonObjectResponse(rawResponse);
}
