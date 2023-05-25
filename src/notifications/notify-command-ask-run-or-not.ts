import * as p from "@clack/prompts";
import { notifyWithCodeBlock } from "./notify-with-code-block";

/**
 * Ask the user if they want to run a command or not.
 */
export async function notifyCommandAskRunOrNot(
  questionOrExplanation: string,
  command: string
) {
  notifyWithCodeBlock(questionOrExplanation, command, {
    title: "🤖",
    markdown: true,
  });

  const choice = await p.select({
    message: "What would you like to do?",
    options: [
      { value: "run", label: "Run command" },
      { value: "dont-run", label: "Don't run command" },
    ],
  });

  // If the user cancels, exit the program
  if (p.isCancel(choice)) {
    p.cancel("Quitting.. See you soon!");
    process.exit(0);
  }

  return choice;
}
