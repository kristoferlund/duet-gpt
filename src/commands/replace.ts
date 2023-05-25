import * as fs from "graceful-fs";

/**
 * Handle the REPLACE command. This command will write the command contents to the
 * file specified in the command.
 */
export async function replace(command: string) {
  // What file are we replacing?
  const fileName = command.substring(5, command.indexOf("\n")).split("=")[1];
  if (!fileName) {
    throw new Error("No file name provided");
  }

  // What are we replacing it with?
  const newFileContents = command.substring(command.indexOf("\n") + 1);

  // Write the new file contents to the file
  fs.writeFileSync(fileName, newFileContents);

  return "OK";
}
