import { Command } from "commander";
import { commitCommand } from "./commands/commit";
import { reviewCommand } from "./commands/review";
import { explainCommand } from "./commands/explain";
import { configCommand } from "./commands/config";
import { historyCommand, HistoryCommandOptions } from "./commands/history";

const program = new Command();

program
  .name("aicommit")
  .description("AI-powered commit message generator")
  .version("1.0.0");

program
  .command("commit")
  .alias("")
  .description("Generate and create an AI-powered commit")
  .option("-p, --push", "Push after commit")
  .option("-d, --dry-run", "Show suggestions without committing")
  .option("--provider <provider>", "AI provider (gemini/openai)")
  .option("--model <model>", "AI model to use")
  .option("-n, --count <count>", "Number of suggestions", "3")
  .option("-m, --message <message>", "Skip selection, use this message")
  .action(commitCommand);

program
  .command("review")
  .description("AI-powered code review of staged changes")
  .action(reviewCommand);

program
  .command("explain")
  .description("Explain staged changes in plain English")
  .action(explainCommand);

program
  .command("config")
  .description("Configure AI Commit Generator settings")
  .action(configCommand);

program
  .command("history")
  .description("View AI-generated commit history")
  .option("-s, --search <query>", "Search history")
  .option("--clear", "Clear commit history")
  .action((options: HistoryCommandOptions) => historyCommand(options));

export { program };
