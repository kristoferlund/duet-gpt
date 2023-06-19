# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4] - 2023-06-19

### Added

- Added a configuration screen before app starts that allows user to change config (e.g. API key) (7b12610)

## [0.1.2] - 2023-06-19

### Changed

- Notify AI also when function output is empty (1e3ff91)
- Add AI assistant responses to memory (4784b67)
- Throw error in function arguments are malformed (fbb0ed1)
- Make sure spinner stops after error (9b01d91)
- Make sure system.prompt is included in npm package (fd26535)
- Try to get gpt to be more verbose when making function calls (6699913)
- Update README.md (2e35934)
- Merge branch 'fix/minor-issues-230619' of https://github.com/kristoferlund/duet-gpt into fix/minor-issues-230619 (b917603)
- Remove unused (b0356db)

## [0.1.1] - 2022-06-18

### Changed

- Text update (5b2926a, 4fc7a59)
- Removed langchain, use plain OpenAI instead (4e1f913)
- Asked DuetGPT to move welcome messages to separate file (3329f84)

## [0.0.9] - 2022-05-25

### Added

- Initial release of the project.
- Experimental AI developer assistant CLI.
- Developers can give the AI tasks, and the AI responds with commands that the CLI performs.
