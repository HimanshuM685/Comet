import { AIContext } from "../types/commit";
import { PROMPTS } from "../constants/prompts";

export function buildCommitPrompt(context: AIContext, count: number): string {
  return PROMPTS.commit
    .replace("{repository}", context.repository)
    .replace("{branch}", context.branch)
    .replace(
      "{recentCommits}",
      context.recentCommits.map((c) => `  - ${c}`).join("\n") || "  (none)"
    )
    .replace(
      "{changedFiles}",
      context.changedFiles
        .map((f) => `  - [${f.status}] ${f.path}`)
        .join("\n")
    )
    .replace("{diff}", context.diff)
    .replace("{count}", count.toString());
}

export function buildReviewPrompt(context: AIContext): string {
  return PROMPTS.review
    .replace(
      "{changedFiles}",
      context.changedFiles
        .map((f) => `  - [${f.status}] ${f.path}`)
        .join("\n")
    )
    .replace("{diff}", context.diff);
}

export function buildExplainPrompt(context: AIContext): string {
  return PROMPTS.explain
    .replace(
      "{changedFiles}",
      context.changedFiles
        .map((f) => `  - [${f.status}] ${f.path}`)
        .join("\n")
    )
    .replace("{diff}", context.diff);
}

export function buildRefactorPrompt(diff: string): string {
  return PROMPTS.refactor.replace("{diff}", diff);
}
