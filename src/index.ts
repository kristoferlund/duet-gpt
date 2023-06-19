import * as p from "@clack/prompts";

import { boot } from "./boot";
import { getErrorMessage } from "./utils/error";
import { notify } from "./notifications/notify";
import { notifyFunctionAskRunOrNot } from "./notifications/notify-function-ask-run-or-not";

/**
 * Main function to initialize the bot, interact with the user, and execute user commands.
 * The flow is as follows:
 * - Boot the bot
 * - Enter a loop to continuously ask the user for input
 * - Send the user input to the AI and get the response
 * - Repeat the previous two steps until the user decides to exit
 */
(async () => {
  // Initialize bot and get the initial response / welcome message from the AI
  const { bootResponse, duetGpt } = await boot();
  let chatResponse = bootResponse;
  let chatRequest = "";

  // Main bot interaction loop
  while (true) {
    // Get the first recommendation returned by the AI
    const choice = chatResponse.choices[0];

    // Notify user if the AI generates a message
    if (choice.message?.content) {
      notify(choice.message.content, { markdown: true, title: "🤖" });
    }

    // If the AI suggests a function call, execute it
    const functionCall = choice.message?.function_call;
    if (functionCall && functionCall.name) {
      const func = duetGpt.getFunction(functionCall.name);
      const choice = await notifyFunctionAskRunOrNot(func, functionCall);
      // If user confirms to run the function, execute it and handle the result or error
      if (choice === "run") {
        const s = p.spinner();
        try {
          s.start("Executing user command");

          let commandOutput = await duetGpt.executeFunction(functionCall);

          s.stop("User command executed");

          // If the function produces output, notify the user and send the output as next input to the AI
          if (commandOutput) {
            notify(commandOutput, { markdown: false, title: "💻" });
            chatRequest = commandOutput;
          }
        } catch (e) {
          s.stop("Execution failed");

          // If there is an error, notify user and send error message as next input to the AI
          const errorMessage = getErrorMessage(e);
          notify(errorMessage, { markdown: false, title: "🛑" });
          chatRequest = errorMessage;
        }
      }
    }

    // If no pending chatRequest, ask user for new input
    if (!chatRequest) {
      const task = await p.text({
        message: "What would you like to do?",
        placeholder: "Not sure",
      });
      if (p.isCancel(task)) {
        p.cancel("Quitting.. see you next time!");
        process.exit(0);
      }
      chatRequest = task;
    }

    // Make AI request and get the response
    if (chatRequest) {
      const s = p.spinner();
      s.start("Making AI request");

      chatResponse = await duetGpt.userRequest(chatRequest);

      // Clear the chat request for the next iteration
      chatRequest = "";

      s.stop("AI response received");
    }
  }
})();
