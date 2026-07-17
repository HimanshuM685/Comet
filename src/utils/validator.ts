import { CommitSuggestion, CommitType } from "../types/commit";

const VALID_TYPES: CommitType[] = [
  "feat",
  "fix",
  "docs",
  "style",
  "refactor",
  "perf",
  "test",
  "build",
  "ci",
  "chore",
  "revert",
];

const CONVENTIONAL_COMMIT_REGEX =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .{1,72}$/;

export function isValidCommitType(type: string): type is CommitType {
  return VALID_TYPES.includes(type as CommitType);
}

export function isValidCommitMessage(message: string, maxLength: number = 72): boolean {
  const pattern = new RegExp(`^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\\(.+\\))?!?:\\s.{1,${maxLength}}$`);
  return pattern.test(message);
}

export function validateCommitSuggestion(
  suggestion: { type?: string; message?: string },
  maxLength: number = 72
): boolean {
  if (!suggestion.type || !suggestion.message) return false;
  if (!isValidCommitType(suggestion.type)) return false;
  if (suggestion.message.length > maxLength) return false;
  return true;
}

export function sanitizeCommitMessage(message: string): string {
  return message
    .replace(/[\x00-\x1F\x7F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateMessage(message: string, maxLength: number = 72): string {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength - 3) + '...';
}
