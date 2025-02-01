// #!/usr/bin/env node
// import "dotenv/config";
// import { AIOrchestrator } from "../src/orchestrators/ai.orchestrator";
// import { BrowserService } from "../src/services/browser.service";
// import { AIService } from "../src/services/ai.service";

// const args = process.argv.slice(2);

// async function main() {
//   const command = args[0];
//   const aiService = new AIService();
//   const browserService = new BrowserService();
//   const orchestrator = new AIOrchestrator(browserService, aiService);

//   try {
//     switch (command) {
//       case "execute":
//         await handleExecuteCommand();
//         break;
//       case "crawl":
//         await handleCrawlCommand();
//         break;
//       case "chat":
//         await handleChatMode();
//         break;
//       default:
//         showHelp();
//     }
//   } catch (error) {
//     console.error("Error:", error instanceof Error ? error.message : error);
//     process.exit(1);
//   }
// }

// async function handleExecuteCommand() {
//   const objective = getArgValue("--objective") || args[1];
//   const url = getArgValue("--url");
//   const outputFormat = getArgValue("--output") || "text";

//   const task = {
//     objective,
//     steps: [],
//     currentUrl: url,
//     metadata: {
//       outputFormat,
//       headless: args.includes("--headless"),
//     },
//   };

//   const result = await orchestrator.executeTask(JSON.stringify(task));
//   console.log(formatOutput(result, outputFormat));
// }

// function formatOutput(data: any, format: string) {
//   switch (format) {
//     case "json":
//       return JSON.stringify(data, null, 2);
//     case "csv":
//       return convertToCSV(data);
//     default:
//       return data.toString();
//   }
// }

// function getArgValue(flag: string) {
//   const index = args.indexOf(flag);
//   return index !== -1 ? args[index + 1] : null;
// }

// function showHelp() {
//   console.log(`
// Usage:
//   execute <objective> [--url <url>] [--output <format>]
//   crawl --url <url> --objective <text>
//   chat
//   `);
// }
