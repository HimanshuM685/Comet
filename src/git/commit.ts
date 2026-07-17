import { execSync } from "child_process";

export function createCommit(message: string): boolean {
  try {
    const escapedMessage = message.replace(/"/g, '\\"');
    execSync(`git commit -m "${escapedMessage}"`, {
      encoding: "utf-8",
    });
    return true;
  } catch {
    return false;
  }
}

export function pushCommits(): boolean {
  try {
    execSync("git push", {
      encoding: "utf-8",
      stdio: "pipe",
    });
    return true;
  } catch {
    return false;
  }
}

export function stageFile(filePath: string): boolean {
  try {
    execSync(`git add "${filePath}"`, { encoding: "utf-8" });
    return true;
  } catch {
    return false;
  }
}

export function stageAll(): boolean {
  try {
    execSync("git add .", { encoding: "utf-8" });
    return true;
  } catch {
    return false;
  }
}
