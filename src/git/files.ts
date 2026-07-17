import { execSync } from "child_process";
import { ChangedFile, FileStatus } from "../types/commit";

export function getChangedFiles(): ChangedFile[] {
  try {
    const output = execSync("git diff --name-status HEAD~1", {
      encoding: "utf-8",
    }).trim();

    if (!output) return [];

    return output.split("\n").map((line) => {
      const [status, ...pathParts] = line.split(/\s+/);
      const filePath = pathParts.join(" ");
      return {
        path: filePath,
        status: mapStatus(status),
      };
    });
  } catch {
    return [];
  }
}

export function getFileContent(filePath: string): string | null {
  try {
    return execSync(`git show HEAD:${filePath}`, {
      encoding: "utf-8",
    });
  } catch {
    return null;
  }
}

export function getDiffForFile(filePath: string): string {
  try {
    return execSync(`git diff --cached -- "${filePath}"`, {
      encoding: "utf-8",
    }).trim();
  } catch {
    return "";
  }
}

function mapStatus(status: string): FileStatus {
  switch (status) {
    case "A":
      return "added";
    case "D":
      return "deleted";
    case "R":
      return "renamed";
    default:
      return "modified";
  }
}
