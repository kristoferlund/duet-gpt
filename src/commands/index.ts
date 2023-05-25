import { bash } from "./bash";
import { replace } from "./replace";

/**
 * Run a command. Currently only BASH and REPLACE are supported.
 */
export async function runCommand(command: string) {
  let commandOutput = "";

  // Handle commands based on their type. Currently only BASH and REPLACE are supported
  // but more can be added in the future.
  if (command.startsWith("BASH")) {
    commandOutput = await bash(command);
  }
  if (command.startsWith("REPLACE")) {
    commandOutput = await replace(command);
  }

  // If the command output is empty, set it to "OK" to notify the user
  commandOutput = commandOutput || "OK";

  // Trim the command output from any whitespace or newlines to avoid any issues
  // with patch files and similar relying on the output to be exactly the same
  // as the contents of the file being patched
  commandOutput = commandOutput.trim();

  return commandOutput;
}
