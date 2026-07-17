export const GIT = {
  STAGED_DIFF_CMD: "diff --cached",
  STATUS_CMD: "status --porcelain",
  BRANCH_CMD: "rev-parse --abbrev-ref HEAD",
  RECENT_COMMITS_CMD: "log --oneline -10",
  COMMIT_CMD: "commit -m",
  PUSH_CMD: "push",
  ADD_CMD: "add",
  REPO_NAME_CMD: "remote get-url origin",
  DIFF_CMD: "diff --cached --stat",
  ADD_ALL: ".",
} as const;

export const FILE_STATUS_MAP: Record<string, string> = {
  M: "modified",
  A: "added",
  D: "deleted",
  R: "renamed",
  C: "copied",
  "?": "untracked",
} as const;
