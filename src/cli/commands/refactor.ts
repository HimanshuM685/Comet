import chalk from "chalk";
import { getStagedDiff, getStagedFiles } from "../../git/diff";
import { hasStagedChanges, stageAllFiles } from "../../git/status";
import { generateAIResponse } from "../../ai/provider";
import { buildRefactorPrompt } from "../../ai/prompts";
import { parseReviewResponse } from "../../ai/parser";
import { withSpinner } from "../ui/spinner";
import { showBanner } from "../ui/banner";
import { logger } from "../../utils/logger";
import { confirmAction } from "../prompts/confirm";
import { printTable } from "../ui/table";
import { EMOJIS } from "../../constants/emojis";

interface RefactorSuggestion {
  file?: string;
  line?: number;
  issue?: string;
  suggestion?: string;
  priority?: string;
}

interface RefactorResult {
  summary?: string;
  suggestions?: RefactorSuggestion[];
}

export async function refactorCommand(): Promise<void> {
  try {
    if (!hasStagedChanges()) {
      const shouldStage = await confirmAction(
        "No staged changes found. Stage all changes?"
      );
      if (!shouldStage) {
        logger.warn("No changes to analyze for refactoring.");
        return;
      }
      await withSpinner("Staging all changes", async () => {
        stageAllFiles();
      });
    }

    const diff = getStagedDiff();

    const prompt = buildRefactorPrompt(diff);

    const response = await withSpinner("Analyzing code for refactoring suggestions...", async () => {
      return generateAIResponse(prompt);
    });

    const parsed = parseReviewResponse(response.content) as RefactorResult;

    if (!parsed) {
      logger.error("Failed to parse refactoring suggestions.");
      return;
    }

    logger.blank();
    logger.bold(`${EMOJIS.refactor} Refactoring Suggestions`);
    logger.blank();

    if (parsed.summary) {
      logger.info(`Summary: ${parsed.summary}`);
      logger.blank();
    }

    if (parsed.suggestions && parsed.suggestions.length > 0) {
      logger.bold(`Found ${parsed.suggestions.length} suggestion(s):`);
      logger.blank();

      const rows = parsed.suggestions.map((s) => [
        s.priority || "medium",
        s.file || "-",
        s.issue || "-",
        s.suggestion || "-",
      ]);

      printTable(["Priority", "File", "Issue", "Suggestion"], rows);
    } else {
      logger.success("No refactoring suggestions — code looks clean!");
    }
  } catch (error) {
    logger.error(
      `Refactor failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
