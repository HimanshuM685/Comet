import ora, { Ora } from "ora";
import chalk from "chalk";
import { EMOJIS } from "../../constants/emojis";

export function createSpinner(text: string): Ora {
  return ora({
    text: chalk.cyan(text),
    spinner: "dots",
    color: "cyan",
  });
}

export async function withSpinner<T>(
  text: string,
  fn: () => Promise<T>
): Promise<T> {
  const spinner = createSpinner(text);
  spinner.start();
  try {
    const result = await fn();
    spinner.succeed(chalk.green(`${EMOJIS.check} ${text}`));
    return result;
  } catch (error) {
    spinner.fail(chalk.red(`${EMOJIS.cross} ${text}`));
    throw error;
  }
}
