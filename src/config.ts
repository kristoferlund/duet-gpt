import * as fs from "fs";
import * as p from "@clack/prompts";

import os from "os";
import path from "path";

type ConfigPartial = {
  OPEN_AI_KEY?: string;
  OPEN_AI_MODEL?: Model;
};

export type Config = {
  OPEN_AI_KEY: string;
  OPEN_AI_MODEL: Model;
};

export type Model = {
  id: string;
  maxTokens: number;
};

function isCompleteConfig(config: ConfigPartial): config is Config {
  return config.OPEN_AI_KEY !== undefined && config.OPEN_AI_MODEL !== undefined;
}

// Define file and directory names
const configPath = path.join(os.homedir(), ".duet-gpt");

/**
 * Load config from config file
 */
export async function loadConfig(): Promise<ConfigPartial> {
  let config: ConfigPartial = {};
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    } catch (e) {
      throw new Error(`Error parsing config file: ${e}`);
    }
  }
  return config;
}

/**
 * Prompt user for config values
 */
export async function configPrompts(): Promise<Config> {
  let config = await loadConfig();

  // Prompt user for API key
  const apiKey = await p.text({
    message: "Please enter your OpenAI API key: ",
    placeholder: "sk-XXX…",
    initialValue: config.OPEN_AI_KEY,
  });

  if (p.isCancel(apiKey) || !apiKey) {
    p.cancel("OpenAI API key is required to run DuetGPT");
    process.exit(0);
  }

  const model = await p.select<{ value: Model; label: string }[], Model>({
    message: "Select the model to use:",
    initialValue: config.OPEN_AI_MODEL,
    options: [
      {
        value: { id: "gpt-3.5-turbo-0613", maxTokens: 4000 },
        label: "gpt-3.5-turbo-0613",
      },
      { value: { id: "gpt-4-0613", maxTokens: 8000 }, label: "gpt-4-0613" },
    ],
  });

  if (p.isCancel(model) || !model) {
    p.cancel("OpenAI model is required to run DuetGPT");
    process.exit(0);
  }

  // Save API key to config file
  fs.writeFileSync(
    configPath,
    JSON.stringify({ OPEN_AI_KEY: apiKey, OPEN_AI_MODEL: model })
  );

  return { OPEN_AI_KEY: apiKey, OPEN_AI_MODEL: model };
}

/**
 * Prompt user for config or start DuetGPT
 */
export async function configOrStart(): Promise<Config> {
  let config = await loadConfig();

  if (!isCompleteConfig(config)) {
    // If config is not complete, prompt user for to complete it
    config = await configPrompts();
  } else {
    // If config is complete, prompt user to start or change config
    const bootChoice = await p.select({
      message: "Select an action:",
      options: [
        { value: "start", label: "Start" },
        { value: "config", label: "Config" },
      ],
    });

    if (p.isCancel(bootChoice) || !bootChoice) {
      p.cancel("Quitting.. see you next time!");
      process.exit(0);
    }

    // If user chooses to change config, prompt them for new values
    if (bootChoice === "config") {
      config = await configPrompts();
    }
  }

  return config as Config;
}
