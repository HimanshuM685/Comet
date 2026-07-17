import { Command } from "commander";
import chalk from "chalk";
import { getStagedDiff, getStagedFiles } from "../../git/diff";
import { getCurrentBranch, getRecentCommits, getRepoName } from "../../git/branch";
import { hasStagedChanges, stageAllFiles } from "../../git/status";
import { createCommit, pushCommits } from "../../git/commit";
import { generateCommitSuggestions } from "../../ai/provider";
import { parseCommitSuggestions } from "../../ai/parser";
import { buildCommitContext } from "../../ai/prompts";
import { selectCommit } from "../prompts/selectCommit";
import { confirmAction } from "../prompts/confirm";
import { withSpinner } from "../ui/spinner";
import { showBanner } from "../ui/banner";
import { logger } from "../../utils/logger";
import { addToHistory } from "../../storage/history";
import { formatDate } from "../../utils/helpers";
import { loadConfig } from "../../config/config";
import { CommitSuggestion, AIContext } from "../../types/commit";

export interface CommitCommandOptions {
  push?: boolean;
  dryRun?: boolean;
  provider?: string;
  model?: string;
  count?: string;
  message?: string;
}

export async function commitCommand(options: CommitCommandOptions): Promise<void> {
  showBanner();

  const config = loadConfig();
  const count = parseInt(options.count || "3", 10);

  try {
    if (!hasStagedChanges()) {
      const shouldStage = await confirmAction(
        "No staged changes found. Stage all changes?"
      );
      if (!shouldStage) {
        logger.warn("No changes to commit.");
        return;
      }
      await withSpinner("Staging all changes", async () => {
        stageAllFiles();
      });
    }

    const context: AIContext = await withSpinner("Reading git context", async () => {
      const diff = getStagedDiff();
      const files = getStagedFiles();
      const branch = getCurrentBranch();
      const repo = getRepoName();
      const recent = getRecentCommits(5);

      return {
        repository: repo,
        branch,
        recentCommits: recent,
        changedFiles: files,
        diff,
      };
    });

    const rawResponse = await withSpinner("Contacting AI", async () => {
      return generateCommitSuggestions(context, count);
    });

    const suggestions = parseCommitSuggestions(rawResponse);

    if (suggestions.length === 0) {
      logger.error("No commit suggestions generated.");
      return;
    }

    let selected: CommitSuggestion;

    if (options.message) {
      selected = {
        message: options.message,
        type: "chore",
        description: "User-provided message",
      };
    } else {
      logger.blank();
      logger.bold("Suggested Commits:");
      logger.blank();
      selected = await selectCommit(suggestions);
    }

    if (options.dryRun) {
      logger.blank();
      logger.info("Dry run - commit message:");
      logger.bold(selected.message);
      return;
    }

    const shouldCommit = await confirmAction(
      `Commit with message: "${selected.message}"?`
    );

    if (!shouldCommit) {
      logger.warn("Commit cancelled.");
      return;
    }

    const committed = await withSpinner("Creating commit", async () => {
      return createCommit(selected.message);
    });

    if (!committed) {
      logger.error("Failed to create commit.");
      return;
    }

    addToHistory({
      date: formatDate(new Date()),
      message: selected.message,
      branch: context.branch,
      hash: "HEAD",
    });

    logger.blank();
    logger.success(`Committed: ${chalk.white(selected.message)}`);

    if (options.push) {
      const pushed = await withSpinner("Pushing to remote", async () => {
        return pushCommits();
      });

      if (pushed) {
        logger.success("Pushed successfully!");
      } else {
        logger.error("Failed to push. Try pushing manually.");
      }
    }
  } catch (error) {
    logger.error(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    process.exit(1);
  }
}
