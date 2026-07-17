import inquirer from "inquirer";

export async function confirmAction(
  message: string
): Promise<boolean> {
  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message,
      default: true,
    },
  ]);
  return confirmed;
}
