import {
  ChatCompletionRequestMessageFunctionCall,
  Configuration,
  CreateChatCompletionResponse,
  OpenAIApi,
} from "openai";

import { AiFunction } from "./functions";
import { get_encoding } from "@dqbd/tiktoken";

// Change this constant for the desired model
const MODEL = "gpt-4-0613";
const MAX_REQUEST_TOKENS = 8000;

// Role types for the Messages
type Message = {
  role: "user" | "system" | "assistant";
  content: string;
};

/**
 * DuetGpt class handles all interactions with OpenAI's Chat models
 */
export class DuetGpt {
  private config: Configuration;
  private openai: OpenAIApi;
  private messages: Message[] = [];
  private functions: AiFunction[] = [];

  /**
   * Constructor for the DuetGpt class
   */
  constructor(openAIApiKey: string, systemMessage: string) {
    // Set up OpenAI configuration
    this.config = new Configuration({
      apiKey: openAIApiKey,
    });
    // Initialize OpenAI client
    this.openai = new OpenAIApi(this.config);
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
   * This function ensures that the total token length of all messages does not exceed the maximum limit set by OpenAI.
   * If the total token length exceeds the limit, it removes the second oldest messages until the total is within the
   * limit. The oldest message is always kept since it is the system message.
   */
  private capMessageList() {
    const encoding = get_encoding("cl100k_base");

    let totalTokenLength = this.messages.reduce((acc, m) => {
      const tokenLength = encoding.encode(m.content).length;
      return acc + tokenLength;
    }, 0);

    //
    while (totalTokenLength > MAX_REQUEST_TOKENS) {
      const tokenLength = encoding.encode(this.messages[1].content).length;
      totalTokenLength -= tokenLength;
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

    const chatCompletion = await this.openai.createChatCompletion({
      model: MODEL,
      messages: this.messages,
      functions: this.functions.map((f) => f.definition),
      temperature: 0,
    });
    return chatCompletion.data;
  }
}
