import { execSync } from "child_process";
import { GIT } from "../constants/git";
import { ChangedFile, FileStatus } from "../types/commit";
import { FILE_STATUS_MAP } from "../constants/git";

export function getStagedDiff(): string {
  try {
    return execSync(`git ${GIT.STAGED_DIFF_CMD}`, {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    }).trim();
  } catch {
    return "";
  }
}

export function getStagedDiffStat(): string {
  try {
    return execSync(`git ${GIT.DIFF_CMD}`, {
      encoding: "utf-8",
    }).trim();
  } catch {
    return "";
  }
}

export function getStagedFiles(): ChangedFile[] {
  try {
    const output = execSync(
      `git diff --cached --name-status`,
      { encoding: "utf-8" }
    ).trim();

    if (!output) return [];

    return output
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const [statusChar, ...pathParts] = line.split(/\s+/);
        const filePath = pathParts.join(" ");
        const status = (FILE_STATUS_MAP[statusChar] || "modified") as FileStatus;
        return { path: filePath, status };
      });
  } catch {
    return [];
  }
}
