import * as fs from "fs";
import * as p from "@clack/prompts";

import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import path, { dirname } from "path";

import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import { fileURLToPath } from "url";
import { getApiKey } from "./utils/apiKey";
import { getErrorMessage } from "./utils/error";
import { welcomeMessages } from "./utils/boot";

// Define file and directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const promptPath = path.join(__dirname, "../boot.prompt");

// Main boot function
export async function boot() {
  // Print welcome messages
  welcomeMessages();

  // Get the OpenAI API key from config or prompt the user for it
  const openAIApiKey = await getApiKey();

  // Show a spinner while booting
  const s = p.spinner();
  s.start("Starting LLM and memory");

  // Create a new OpenAI LLM instance
  const model = new ChatOpenAI({
    openAIApiKey: openAIApiKey,
    modelName: "gpt-4-0613",
    temperature: 0,
  });

  // Read the boot sequence from the boot.prompt file and send it to the AI
  try {
    const systemPromptText = fs.readFileSync(promptPath, "utf8");
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(systemPromptText),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);

    // Create a new conversation chain instance
    const chain = new ConversationChain({
      memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
      prompt: chatPrompt,
      llm: model,
    });

    const bootResponse = await chain.call({
      input:
        "Confirm by responding with a one sentence summary of the mission you have been assigned.",
    });

    // Boot sequence is done, so stop the spinner
    s.stop("LLM and memory started");

    return { bootResponse, chain };
  } catch (e) {
    // Handle any errors during boot sequence
    p.cancel(getErrorMessage(e));
    process.exit(0);
  }
}
