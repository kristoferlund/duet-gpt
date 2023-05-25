import * as fs from "fs";
import { $ } from "execa";

/**
 * Handle the BASH command. This command will write the bash command to a file,
 * then execute the bash command, clean up and return the output of the bash command.
 */
export async function bash(command: string) {
  // Write bash commands to a file
  fs.writeFileSync("_cmd.sh", `#${command}`);

  // Execute bash commands
  const { stdout } = await $`bash _cmd.sh`;

  // Delete bash commands file
  fs.unlinkSync("_cmd.sh");

  return stdout;
}
