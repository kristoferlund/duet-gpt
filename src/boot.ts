import * as fs from "fs";
import * as p from "@clack/prompts";

import path, { dirname } from "path";

import { BashAiFunction } from "./functions/bash";
import { CreateChatCompletionResponse } from "openai";
import { DuetGpt } from "./duetgpt";
import { ReplaceAiFunction } from "./functions/replace";
import { fileURLToPath } from "url";
import { getApiKey } from "./utils/api";
import { getErrorMessage } from "./utils/error";
import packageJson from "../package.json";
import pc from "picocolors";

// Define file and directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const systemPromptPath = path.join(__dirname, "../system.prompt");

function welcomeMessages() {
  // Print warning message
  console.log(
    pc.bold(
      pc.yellow(
        "⚠️ DuetGPT has no guardrails! Make sure you understand the commands given by the AI before executing them. ⚠️"
      )
    )
  );

  // Print intro message
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

  p.intro(`DuetGPT v${packageJson.version}`);
}

type BootResponse = {
  bootResponse: CreateChatCompletionResponse;
  duetGpt: DuetGpt;
};

// Main boot function
export async function boot() {
  // Print welcome messages
  welcomeMessages();

  // Get the OpenAI API key from config or prompt the user for it
  const openAIApiKey = await getApiKey();

  // Show a spinner while booting
  const s = p.spinner();
  s.start("Starting DuetGPT");

  // Read the boot sequence from the boot.prompt file and send it to the AI
  try {
    const systemPromptText = fs.readFileSync(systemPromptPath, "utf8");

    // Create a new DuetGPT instance
    const duetGpt = new DuetGpt(openAIApiKey, systemPromptText);
    duetGpt.addFunction(new BashAiFunction());
    duetGpt.addFunction(new ReplaceAiFunction());

    const bootResponse = await duetGpt.userRequest(
      "Confirm by responding with a one sentence summary of the mission you have been assigned."
    );

    // Boot sequence is done, so stop the spinner
    s.stop("DuetGPT started");

    return { bootResponse, duetGpt };
  } catch (e) {
    // Handle any errors during boot sequence
    p.cancel(getErrorMessage(e));
    process.exit(0);
  }
}
