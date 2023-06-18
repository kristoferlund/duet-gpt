import * as p from "@clack/prompts";

import { AiFunction } from "../functions";
import { ChatCompletionRequestMessageFunctionCall } from "openai";

/**
 * Ask the user if they want to run a command or not.
 */
export async function notifyFunctionAskRunOrNot(
  func: AiFunction,
  functionCall: ChatCompletionRequestMessageFunctionCall
) {
  await func.notify(functionCall);

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
