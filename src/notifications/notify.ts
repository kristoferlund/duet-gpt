import markdownToCli from "cli-markdown";
import boxen from "boxen";
import pc from "picocolors";
import { NotifyOptions } from "./types/notify-options.type";

/**
 * Notify the user of something. This will print a message to the console.
 */
export function notify(
  message: string,
  options: NotifyOptions = {
    markdown: false,
  }
) {
  message = message.trim();
  if (options.markdown) {
    message = markdownToCli(message);
  }
  if (message.endsWith("\n")) {
    message = message.slice(0, -1);
  }
  message = boxen(message, {
    padding: 1,
    title: options.title,
    borderColor: "gray",
  });
  console.log(pc.gray("│"));
  console.log(message);
}

function createCodeBox(code: string, title?: string) {
  return boxen(code, {
    padding: 1,
    borderColor: "gray",
    title,
  });
}
