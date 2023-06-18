import * as fs from "fs";
import * as p from "@clack/prompts";

import os from "os";
import path from "path";

// Define file and directory names
const configPath = path.join(os.homedir(), ".duet-gpt");

// Function to get API key
export async function getApiKey() {
  // Check if API key is in environment variables
  if (process.env.OPEN_AI_KEY) {
    return process.env.OPEN_AI_KEY;
  }

  // Check if API key is in config file
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return config.OPEN_AI_KEY;
  } else {
    // Prompt user for API key
    const apiKey = await p.text({
      message: "Please enter your OpenAI API key: ",
      placeholder: "sk-XXX…",
    });
    if (p.isCancel(apiKey) || !apiKey) {
      p.cancel("OpenAI API key is required to run DuetGPT");
      process.exit(0);
    }
    // Save API key to config file
    fs.writeFileSync(configPath, JSON.stringify({ OPEN_AI_KEY: apiKey }));
    return apiKey;
  }
}
