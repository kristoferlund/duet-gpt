import {
  ChatCompletionRequestMessageFunctionCall,
  ChatCompletionResponseMessage,
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi,
} from "openai";

import { AiFunction } from "./functions";
import { Config } from "./config";
import { get_encoding } from "@dqbd/tiktoken";

/**
 * DuetGpt class handles all interactions with OpenAI's Chat models
 */
export class DuetGpt {
  private config: Config;
  private openAi: OpenAIApi;
  private messages: ChatCompletionResponseMessage[] = [];
  private functions: AiFunction[] = [];

  /**
   * Constructor for the DuetGpt class
   */
  constructor(config: Config, systemMessage: string) {
    // Save config
    this.config = config;

    // Set up OpenAI configuration
    const openAiConfiguration = new Configuration({
      apiKey: config.OPEN_AI_KEY,
    });

    // Initialize OpenAI client
    this.openAi = new OpenAIApi(openAiConfiguration);
    this.messages.push({ role: "system", content: systemMessage });
  }

  /**
   * Add a new AI Function to the list of functions
   */
  addFunction(func: AiFunction) {
    this.functions.push(func);
  }

  /**
   * Retrieves a function by its name
   */
  getFunction(name: string): AiFunction {
    const func = this.functions.find((f) => f.definition.name === name);
    if (!func) {
      throw new Error(`Function ${name} not found`);
    }
    return func;
  }

  /**
   * executes the AI Function
   */
  executeFunction(functionCall: ChatCompletionRequestMessageFunctionCall) {
    if (!functionCall.name) {
      throw new Error("Function name not provided");
    }

    const func = this.getFunction(functionCall.name);
    return func.execute(functionCall);
  }

  /**
   *  Calculates the token length of a message. Messages can contain both content and function_call properties.
   */
  private calculateTokenLength(message: ChatCompletionResponseMessage) {
    const encoding = get_encoding("cl100k_base");
    let tokenLength = 0;

    if (message.content) {
      tokenLength += encoding.encode(message.content).length;
    }

    if (message.function_call) {
      tokenLength += encoding.encode(
        JSON.stringify(message.function_call)
      ).length;
    }

    return tokenLength;
  }

  /**
   * This function ensures that the total token length of all messages does not exceed the maximum limit set by OpenAI.
   * If the total token length exceeds the limit, it removes the second oldest messages until the total is within the
   * limit. The oldest message is always kept since it is the system message.
   */
  private capMessageList() {
    let totalTokenLength = this.messages.reduce((acc, m) => {
      return acc + this.calculateTokenLength(m);
    }, 0);

    // Remove the second oldest message until the total token length is within the limit
    while (totalTokenLength > this.config.OPEN_AI_MODEL.maxTokens) {
      totalTokenLength -= this.calculateTokenLength(this.messages[1]);
      this.messages.splice(1, 1);
    }
  }

  /**
   * Handles User's request using OpenAI's Chat models
   */
  async userRequest(message: string): Promise<CreateChatCompletionResponse> {
    // Add the user's message to the list of messages
    this.messages.push({ role: "user", content: message });

    // Ensure that the token length of the messages is less than the maximum
    // allowed by OpenAI
    this.capMessageList();

    const chatCompletion = await this.openAi.createChatCompletion({
      model: this.config.OPEN_AI_MODEL.id,
      messages: this.messages,
      functions: this.functions.map((f) => f.definition),
      temperature: 0,
    });

    // Add the response from OpenAI to the list of messages
    if (chatCompletion.data.choices[0].message) {
      this.messages.push(chatCompletion.data.choices[0].message);
    }

    return chatCompletion.data;
  }
}
