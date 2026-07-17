import chalk from "chalk";
import { getStagedDiff, getStagedFiles } from "../../git/diff";
import { hasStagedChanges, stageAllFiles } from "../../git/status";
import { generateAIResponse } from "../../ai/provider";
import { buildExplainPrompt } from "../../ai/prompts";
import { parseExplainResponse } from "../../ai/parser";
import { withSpinner } from "../ui/spinner";
import { showBanner } from "../ui/banner";
import { logger } from "../../utils/logger";
import { confirmAction } from "../prompts/confirm";
import { AIContext } from "../../types/commit";
import { getCurrentBranch, getRepoName } from "../../git/branch";
import { EMOJIS } from "../../constants/emojis";

export async function explainCommand(): Promise<void> {
  showBanner();

  try {
    if (!hasStagedChanges()) {
      const shouldStage = await confirmAction(
        "No staged changes found. Stage all changes?"
      );
      if (!shouldStage) {
        logger.warn("No changes to explain.");
        return;
      }
      await withSpinner("Staging all changes", async () => {
        stageAllFiles();
      });
    }

    const context: AIContext = await withSpinner("Reading staged changes", async () => {
      const diff = getStagedDiff();
      const files = getStagedFiles();
      const branch = getCurrentBranch();
      const repo = getRepoName();

      return {
        repository: repo,
        branch,
        recentCommits: [],
        changedFiles: files,
        diff,
      };
    });

    const prompt = buildExplainPrompt(context);

    const response = await withSpinner("AI is analyzing changes", async () => {
      return generateAIResponse(prompt);
    });

    const explanation = parseExplainResponse(response.content) as {
      summary?: string;
      explanation?: string;
      impact?: string;
      category?: string;
    };

    logger.blank();
    logger.bold("Plain English Explanation");
    logger.blank();

    if (explanation.summary) {
      logger.info(`${EMOJIS.bulb} Summary: ${explanation.summary}`);
      logger.blank();
    }

    if (explanation.category) {
      const categoryColors: Record<string, typeof chalk.green> = {
        "bug-fix": chalk.red,
        "new-feature": chalk.green,
        improvement: chalk.blue,
        cleanup: chalk.gray,
        security: chalk.yellow,
      };
      const color = categoryColors[explanation.category] || chalk.white;
      logger.info(`Category: ${color(explanation.category)}`);
      logger.blank();
    }

    if (explanation.explanation) {
      logger.bold("Explanation:");
      logger.info(explanation.explanation);
      logger.blank();
    }

    if (explanation.impact) {
      logger.bold("Impact:");
      logger.info(explanation.impact);
    }
  } catch (error) {
    logger.error(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    process.exit(1);
  }
}
