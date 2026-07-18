import { execFileSync } from "child_process";

export function createCommit(message: string): boolean {
  try {
    execFileSync("git", ["commit", "-m", message], {
      encoding: "utf-8",
      stdio: "pipe",
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });
    return true;
  } catch (error: any) {
    const stderr = error.stderr || "";
    const stdout = error.stdout || "";
    const output = stderr || stdout || error.message || "Unknown error";

    if (output.includes("nothing to commit")) {
      throw new Error("No changes to commit. All files are already committed.");
    }
    if (output.includes("could not find Username")) {
      throw new Error("Git credentials not configured.");
    }
    if (output.includes("Please tell me who you are")) {
      throw new Error(
        "Git user not configured. Run:\ngit config --global user.name \"Your Name\"\ngit config --global user.email \"you@example.com\""
      );
    }

    throw new Error(`Git commit failed: ${output}`);
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
