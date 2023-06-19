import * as fs from "fs";

import { $ } from "execa";
import { AiFunction } from ".";
import { ChatCompletionRequestMessageFunctionCall } from "openai";
import { notify } from "../notifications/notify";

type BashArgs = {
  cmd: string;
};

export class BashAiFunction extends AiFunction {
  definition = {
    name: "BASH",
    description: "Execute a bash command",
    parameters: {
      type: "object",
      properties: {
        cmd: {
          type: "string",
          description: "The bash command to execute",
        },
      },
    },
  };

  async execute(functionCall: ChatCompletionRequestMessageFunctionCall) {
    let args: BashArgs;
    try {
      args = JSON.parse(functionCall.arguments || "");
    } catch (e) {
      throw new Error("Couldn't parse function arguments");
    }

    // Write bash commands to a file
    fs.writeFileSync("_cmd.sh", `${args.cmd}`);

    // Execute bash commands
    const { stdout } = await $`bash _cmd.sh`;

    // Delete bash commands file
    fs.unlinkSync("_cmd.sh");

    return stdout;
  }

  async notify(functionCall: ChatCompletionRequestMessageFunctionCall) {
    const args: BashArgs = JSON.parse(functionCall.arguments || "");

    if (functionCall.name === "BASH") {
      notify("\n\n## BASH\n```bash\n" + args?.cmd + "\n```", {
        title: "🤖",
        markdown: true,
      });
    }
  }
}
