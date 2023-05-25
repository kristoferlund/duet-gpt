import * as fs from "graceful-fs";
import * as diff from "diff";
import { NotifyOptions } from "./types/notify-options.type";
import { notify } from "./notify";

/**
 * Notify the user of something, plus, add a code block to the message.
 */
export function notifyWithCodeBlock(
  message: string,
  command: string,
  options?: NotifyOptions
) {
  message = message.trim();
  command = command.trim();
  if (command.startsWith("BASH")) {
    command = command.slice(4).trim();
    notify(message + "\n\n## BASH\n```bash\n" + command + "\n```", options);
  }
  if (command.startsWith("REPLACE")) {
    const fileName = command.substring(5, command.indexOf("\n")).split("=")[1];
    if (!fileName) {
      throw new Error("No file name provided");
    }

    // Read the old file contents from disk and the new file contents from the command
    const oldFileContents = fs.existsSync(fileName)
      ? fs.readFileSync(fileName).toString()
      : "";
    const newFileContents = command.slice(command.indexOf("\n") + 1).trim();

    // Generate a diff of the old file contents and the new file contents to
    // show the user what changed
    const fileDiff = diff.createTwoFilesPatch(
      fileName,
      fileName,
      oldFileContents,
      newFileContents
    );

    notify(message + "\n\n## PATCH\n```diff\n" + fileDiff + "\n```", options);
  }
}
