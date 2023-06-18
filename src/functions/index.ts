import { ChatCompletionRequestMessageFunctionCall } from "openai";

export class AiFunction {
  definition: any;

  async execute(
    functionCall: ChatCompletionRequestMessageFunctionCall
  ): Promise<string> {
    throw new Error("Not implemented");
  }

  async notify(
    functionCall: ChatCompletionRequestMessageFunctionCall
  ): Promise<void> {
    throw new Error("Not implemented");
  }
}
