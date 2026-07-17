import { execSync } from "child_process";

export function getCurrentBranch(): string {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf-8",
    }).trim();
  } catch {
    return "unknown";
  }
}

export function getRecentCommits(count: number = 10): string[] {
  try {
    const output = execSync(`git log --oneline -${count}`, {
      encoding: "utf-8",
    }).trim();

    if (!output) return [];
    return output.split("\n").filter((line) => line.trim());
  } catch {
    return [];
  }
}

export function getRepoName(): string {
  try {
    const remoteUrl = execSync("git remote get-url origin", {
      encoding: "utf-8",
    }).trim();
    const match = remoteUrl.match(/[:/]([^/]+\/[^/]+?)(?:\.git)?$/);
    return match ? match[1] : "unknown";
  } catch {
    return "unknown";
  }
}

export function isGitRepo(): boolean {
  try {
    execSync("git rev-parse --is-inside-work-tree", {
      encoding: "utf-8",
    });
    return true;
  } catch {
    return false;
  }
}
