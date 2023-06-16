import p from "@clack/prompts";
import packageJson from "../../package.json";
import pc from "picocolors";

export function welcomeMessages() {
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
