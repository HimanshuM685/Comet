import { execFileSync } from "child_process";

export function createCommit(message: string): boolean {
  try {
    execFileSync("git", ["commit", "-m", message], {
      encoding: "utf-8",
      stdio: "pipe",
    });
    return true;
  } catch (error: any) {
    const stderr = error.stderr || error.message || "Unknown error";
    throw new Error(`Git commit failed: ${stderr}`);
  }
}

export function pushCommits(): boolean {
  try {
    execFileSync("git", ["push"], {
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
    execFileSync("git", ["add", filePath], { encoding: "utf-8" });
    return true;
  } catch {
    return false;
  }
}

export function stageAll(): boolean {
  try {
    execFileSync("git", ["add", "."], { encoding: "utf-8" });
    return true;
  } catch {
    return false;
  }
}
