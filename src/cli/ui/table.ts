import Table from "cli-table3";
import chalk from "chalk";

export function createTable(head: string[]): Table.Table {
  return new Table({
    head: head.map((h) => chalk.cyan(h)),
    style: {
      head: [],
      border: ["gray"],
    },
    chars: {
      top: "─",
      "top-mid": "┬",
      "top-left": "┌",
      "top-right": "┐",
      bottom: "─",
      "bottom-mid": "┴",
      "bottom-left": "└",
      "bottom-right": "┘",
      left: "│",
      "left-mid": "├",
      mid: "─",
      "mid-mid": "┼",
      right: "│",
      "right-mid": "┤",
    },
  });
}

export function printTable(
  head: string[],
  rows: string[][]
): void {
  const table = createTable(head);
  rows.forEach((row) => table.push(row));
  console.log(table.toString());
}
