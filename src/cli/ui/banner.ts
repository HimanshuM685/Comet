import chalk from "chalk";
import figlet from "figlet";
import { EMOJIS } from "../../constants/emojis";

export function showBanner(): void {
  const banner = figlet.textSync("Comet", {
    font: "ANSI Shadow",
    horizontalLayout: "fitted",
  });

  console.log(chalk.cyan.bold(banner));
  console.log(
    chalk.gray(`  ${EMOJIS.rocket} AI-Powered Commit Generator`)
  );
  console.log("");
}
