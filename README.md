# DuetGPT

**🎉 News:** DuetGPT no longer uses langchain but instead [OpenAI functions](https://openai.com/blog/function-calling-and-other-api-updates). This means a significant improvement in reliability and performance.

DuetGPT is an experimental AI powered CLI tool and semi-autonomous agent that helps developers with coding tasks and file system tasks. The developer describes tasks to the AI who then issues commands or follow-up questions for clarification. After approval by the developer, **DuetGPT automatically executes the commands issued by the AI.**

DuetGPT also does really well as a general bash helper.

Example tasks:

- "Refactor index.js: add inline comments, improve variable naming."
- "Write a bash script that lists all cars in the database."
- "Find all files in current directory and subdirectories that contain the word "DuetGPT"

DuetGPT builds on OpenAI's GPT-4 language model and uses its conversational capabilities to engage in a two-way conversation with the developer. It uses the newly released feature of the OpenAI API that allows the AI to make [function calls](https://openai.com/blog/function-calling-and-other-api-updates).

### ⚠️ DuetGPT has no guardrails! Make sure you understand the commands given by the AI before executing them. ⚠️

<p align="center">
   <img alt="Intro video" src="https://github.com/kristoferlund/duet-gpt/blob/main/media/intro-video.gif?raw=true" >
<p>

**👆 Example: Creating a node.js app that draws a sine wave using DuetGPT**

## Setup

Install the DuetGPT CLI tool globally using npm:

```bash
npm install -g duet-gpt
```

## Usage

To start DuetGPT, run the following command:

```bash
duet-gpt
```

You will be prompted to enter your OpenAI API key. You can find your API key on the [OpenAI dashboard](https://platform.openai.com/account/api-keys).

```bash
     _            _              _
    | |          | |            | |
  __| |_   _  ___| |_ __ _ _ __ | |_
 / _` | | | |/ _ \ __/ _` | '_ \| __|
| (_| | |_| |  __/ || (_| | |_) | |_
 \__,_|\__,_|\___|\__\__, | .__/ \__|
                      __/ | |
                     |___/|_|

┌  DuetGPT
│
◆  Please enter your OpenAI API key:
│  sk-XXX…
└
```

## Setup for development

1. Clone the repository.

2. Install dependencies:

```bash
npm install
```

3. Run DuetGPT using yarn:

```bash
npm start
```

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

┌  DuetGPT
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

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Author

- [kristofer@fmckl.se](mailto:kristofer@fmckl.se)
- Twitter: [@kristoferlund](https://twitter.com/kristoferlund)
- Discord: kristofer#1475

## License

[MIT](LICENSE)
