import * as diff from "diff";
import * as fs from "fs";

import { AiFunction } from ".";
import { ChatCompletionRequestMessageFunctionCall } from "openai";
import { notify } from "../notifications/notify";

type ReplaceArgs = {
  filePath: string;
  contents: string;
};

export class ReplaceAiFunction extends AiFunction {
  definition = {
    name: "REPLACE",
    description: "Replace the contents of a file",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The path to the file to replace",
        },
        contents: {
          type: "string",
          description: "The contents to replace the file with",
        },
      },
    },
  };

  async execute(functionCall: ChatCompletionRequestMessageFunctionCall) {
    const args: ReplaceArgs = JSON.parse(functionCall.arguments || "");

    // Write the new file contents to the file
    fs.writeFileSync(args.filePath, args.contents);

    return "";
  }

  async notify(functionCall: ChatCompletionRequestMessageFunctionCall) {
    const args: ReplaceArgs = JSON.parse(functionCall.arguments || "");

    const fileName = args?.filePath;
    if (!fileName) {
      throw new Error("No file name provided");
    }

    // Read the old file contents from disk and the new file contents from the command
    const oldFileContents = fs.existsSync(fileName)
      ? fs.readFileSync(fileName).toString()
      : "";

    const newFileContents = args?.contents;

    // Generate a diff of the old file contents and the new file contents to
    // show the user what changed
    const fileDiff = diff.createTwoFilesPatch(
      fileName,
      fileName,
      oldFileContents,
      newFileContents
    );

    notify("\n\n## PATCH\n```diff\n" + fileDiff + "\n```", {
      title: "🤖",
      markdown: true,
    });
  }
}
