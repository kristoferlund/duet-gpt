import * as p from "@clack/prompts";
import { runCommand } from "./commands";
import { boot } from "./boot";
import { notifyCommandAskRunOrNot } from "./notifications/notify-command-ask-run-or-not";
import { notify } from "./notifications/notify";

/**
 * Main function.
 * - Handle commands and display AI responses
 * - Ask the user for input
 * - Send the input to the AI
 * - Repeat
 */
(async () => {
  // BOOT!
  const { bootResponse, chain } = await boot();
  let aiResponse = bootResponse;
  let aiRequest = "";

  // Main loop
  while (true) {
    // Split the AI response to get the ResponseMessage parts
    const [questionOrExplanation, moreOrDone, command] = aiResponse.response
      .split("-----")
      .map((s: string) => s.trim())
      .filter(Boolean);

    if (command) {
      // If the AI response has a command, ask the user if they want to run it
      const choice = await notifyCommandAskRunOrNot(
        questionOrExplanation,
        command
      );

      // Choosing to run the command will execute it
      if (choice === "run") {
        try {
          // Handle all commands, currently only BASH and REPLACE are supported
          let commandOutput = await runCommand(command);

          // Notify the user of the command output
          notify(commandOutput, { markdown: false, title: "💻" });

          // If more interactions are expected, set the AI request to the command output
          if (moreOrDone.trim().startsWith("MORE")) {
            aiRequest = commandOutput;
          }
        } catch (e) {
          // Notify the user of the error
          notify(e.message, { markdown: false, title: "🛑" });
          aiRequest = e.message;
        }
      }

      // Choosing not to run the command will let the user input a new prompt
      if (choice === "dont-run") {
        aiRequest = "";
      }
    } else {
      // If the AI response doesn't have a command, then the AI is asking a question.
      // Notify the user of the question and let them input a response.
      notify(questionOrExplanation, { markdown: true, title: "🤖" });
    }

    if (!aiRequest) {
      const task = await p.text({
        message: "What would you like to do?",
        placeholder: "Not sure",
      });
      if (p.isCancel(task)) {
        p.cancel("Quitting.. See you soon!");
        process.exit(0);
      }
      aiRequest = task;
    }

    if (aiRequest) {
      const s = p.spinner();
      s.start("Calling AI");

      aiResponse = await chain.call({
        input: aiRequest,
      });

      aiRequest = "";

      s.stop("AI response received");
    }
  }
})();
