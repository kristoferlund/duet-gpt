import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import * as dotenv from "dotenv";
import * as p from "@clack/prompts";
import * as fs from "graceful-fs";
import pc from "picocolors";

/**
 * Boot the LLM and memory. This will read the .env file, create a new LLM instance,
 * create a new memory instance, create a new conversation chain instance, read the
 * boot sequence from the boot.prompt file and send it to the AI.
 */
export async function boot() {
  console.log(
    pc.cyan(`
     _            _              _   
    | |          | |            | |  
  __| |_   _  ___| |_ __ _ _ __ | |_ 
 / _\` | | | |/ _ \\ __/ _\` | '_ \\| __|
| (_| | |_| |  __/ || (_| | |_) | |_ 
 \\__,_|\\__,_|\\___|\\__\\__, | .__/ \\__|
                      __/ | |        
                     |___/|_|        
  `)
  );

  const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const version = packageData.version;

  p.intro(`DuetGPT v${version}`);

  // Show a spinner while booting
  const s = p.spinner();
  s.start("Starting LLM and memory");

  // Read ENV variables from .env file
  dotenv.config();

  // Create a new OpenAI LLM instance
  const model = new OpenAI({
    openAIApiKey: process.env.OPEN_AI_KEY,
    modelName: "gpt-4",
  });

  // Create a new memory instance
  const memory = new BufferMemory();

  // Create a new conversation chain instance
  const chain = new ConversationChain({ llm: model, memory: memory });

  // Read the boot sequence from the boot.prompt file and send it to the AI
  const bootResponse = await chain.call({
    input: fs.readFileSync("./boot.prompt", "utf8"),
  });

  // Boot sequence is done, so stop the spinner
  s.stop("LLM and memory started");

  return { bootResponse, chain };
}