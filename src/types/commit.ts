export interface CommitSuggestion {
  message: string;
  type: CommitType;
  scope?: string;
  description: string;
}

export type CommitType =
  | "feat"
  | "fix"
  | "docs"
  | "style"
  | "refactor"
  | "perf"
  | "test"
  | "build"
  | "ci"
  | "chore"
  | "revert";

export interface GitDiff {
  staged: string;
  files: ChangedFile[];
}

export interface ChangedFile {
  path: string;
  status: FileStatus;
}

export type FileStatus = "modified" | "added" | "deleted" | "renamed";

export interface GitStatus {
  branch: string;
  staged: ChangedFile[];
  modified: ChangedFile[];
  untracked: string[];
}

export interface CommitHistoryEntry {
  date: string;
  message: string;
  branch: string;
  hash: string;
}

export interface AIContext {
  repository: string;
  branch: string;
  recentCommits: string[];
  changedFiles: ChangedFile[];
  diff: string;
}

export interface CommitOptions {
  push?: boolean;
  dryRun?: boolean;
  provider?: string;
  model?: string;
  count?: number;
}
