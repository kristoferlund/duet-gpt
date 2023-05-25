# DuetGPT

![DuetGPT Logo](media/duetgpt.png)

DuetGPT is a CLI tool that allows developers to more you to interact with AI in completing development tasks. The tool sends requests to the OpenAI to help you complete various development tasks based on bash commands and patch operations.

## Setup

1. Clone the repository.
2. Install dependencies:

```bash
yarn
```

3. Set up a `.env` file with your OpenAI API key:

```
OPEN_AI_KEY=your_openai_key
```

4. Run DuetGPT using yarn:

```bash
yarn start
```

## Usage

As you interact with DuetGPT, it will suggest appropriate bash or patch commands based on your requests. To proceed, you'll be asked whether to run the command or not. Respond to AI questions and follow its instructions to complete your tasks.

## Features
                                                                                                                            
• 🤖 Interactive AI assistance: Get quick help and suggestions for development tasks.                                  
• 🎯 Accurate commands: Receive precise bash and patch commands tailored to your needs.                                
• 💬 Two-way communication: Engage in an easy-to-understand and effective conversation with the AI.                    
• 📁 File management: Get help creating, modifying, and organizing project files.                                      
• 🌐 OpenAI powered: Harness the power of OpenAI's advanced language model for superior assistance.                    
                                                                                                                      
## `boot.prompt`

The [`boot.prompt`](boot.prompt) file contains the instructions that govern the interaction between the AI and the developer. It sets the ground rules for how the conversation is conducted and what each party is expected to do.

The developer presents tasks to the AI, who then provides ResponseMessages that include either a BashCommand, a PatchCommand or a follow-up Question for clarification. The developer follows the commands given by the AI to perform the requested tasks.

## Known issues

