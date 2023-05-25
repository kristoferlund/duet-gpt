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
                                                                                                                            
- 🤖 Interactive AI assistance: Get quick help and suggestions for development tasks.                                  
- 🎯 Accurate commands: Receive precise bash and patch commands tailored to your needs.                                
- 💬 Two-way communication: Engage in an easy-to-understand and effective conversation with the AI.                    
- 📁 File management: Get help creating, modifying, and organizing project files.                                      
- 🌐 OpenAI powered: Harness the power of OpenAI's advanced language model for superior assistance.                    
                                                                                                                      
## `boot.prompt`

The [`boot.prompt`](boot.prompt) file contains the instructions that govern the interaction between the AI and the developer. It sets the ground rules for how the conversation is conducted and what each party is expected to do.

The developer presents tasks to the AI, who then provides ResponseMessages that include either a BashCommand, a PatchCommand or a follow-up Question for clarification. The developer follows the commands given by the AI to perform the requested tasks.

## Sample interaction

For the purposes of illustrating how interactions work, I chose a super simple task. Let's say you want to add `.yarn/cache` to `.gitignore`. Here is how to ask DuetGPT to help you with that:

```

     _            _              _   
    | |          | |            | |  
  __| |_   _  ___| |_ __ _ _ __ | |_ 
 / _` | | | |/ _ \ __/ _` | '_ \| __|
| (_| | |_| |  __/ || (_| | |_) | |_ 
 \__,_|\__,_|\___|\__\__, | .__/ \__|
                      __/ | |        
                     |___/|_|        
  
┌  DuetGPT v0.0.2
│
◇  LLM and memory started
│
┌ 🤖 ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                                            │
│                                                                                                                            │
│    My mission is to collaborate with you as a developer by providing specific bash or file modification commands to help   │
│    you complete your development-related tasks, while effectively engaging in two-way interactions.                        │
│                                                                                                                            │
│                                                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
│
◇  What would you like to do?
│  Add .yarn/cache to .gitignore
│
◇  AI response received
│
┌ 🤖 ────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                                                                            │
│    First, I need to check if .gitignore exists in the current directory.   │
│                                                                            │
│     § BASH                                                                 │
│                                                                            │
│     1 ls .gitignore                                                        │
│                                                                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
│
◇  What would you like to do?
│  Run command
│
┌ 💻 ────────────┐
│                │
│   .gitignore   │
│                │
└────────────────┘
│
◇  AI response received
│
┌ 🤖 ────────────────────────────────────────────────────────────────────┐
│                                                                        │
│                                                                        │
│    I will now append '.yarn/cache' to your existing .gitignore file.   │
│                                                                        │
│     § BASH                                                             │
│                                                                        │
│     1 echo ".yarn/cache" >> .gitignore                                 │
│                                                                        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
│
◇  What would you like to do?
│  Run command
│
┌ 💻 ────┐
│        │
│   OK   │
│        │
└────────┘
│
◆  What would you like to do?
│  Not sure
└

```
## Known issues

- When proposing changes to large files, the AI may return incomplete results. The gpt-4 context window is limited, DuetGPT works best with small files - one function per file is ideal.
