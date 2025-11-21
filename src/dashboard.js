import batteryInfo from "./battery.js";
import cpuCoreMonitor from "./cpuCore.js";
import getSystemStats from "./cpu.js";
import showProcesses from "./processes.js";
import showDiskInfo from "./disk.js";
import showNetworkInfo from "./network.js";
import showMemoryInfo from "./memory.js";

import readline from "readline";
import figlet from "figlet";
import chalk from "chalk";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ----- Show Header -----
function showHeader() {
  console.clear();
  console.log(
    chalk.cyan(
      figlet.textSync("SYSTEM MENU", { horizontalLayout: "full" })
    )
  );
}

// ----- Show Menu -----
function showMenu() {
  showHeader();

  console.log(chalk.yellow("\n===== MAIN MENU ====="));
  console.log(chalk.green("1. Show Battery Info"));
  console.log(chalk.green("2. Show System Info"));
  console.log(chalk.green("3. Show CPU Core Info"));
  console.log(chalk.green("4. Show Memory Info"));
  console.log(chalk.green("5. Show Disk Info"));
  console.log(chalk.green("6. Show Network Info"));
  console.log(chalk.green("7. Show Processes Info"));
  console.log(chalk.red("8. Exit"));

  rl.question(chalk.cyan("\nEnter your choice: "), handleChoice);
}

// ----- Handle Options -----
async function handleChoice(choice) {
  const c = choice.trim();
  console.clear();
  console.log(chalk.gray(`[DEBUG] You chose: ${c}\n`));

  try {
    switch (c) {
      case "1":
        await batteryInfo();
        break;

      case "2":
        await getSystemStats();
        break;

      case "3":
        await cpuCoreMonitor();
        break;

      case "4":
        await showMemoryInfo();
        break;

      case "5":
        await showDiskInfo();
        break;

      case "6":
        await showNetworkInfo();
        break;

      case "7":
        await showProcesses();
        break;

      case "8":
        console.log(chalk.red("Exiting..."));
        rl.close();
        process.exit(0)
        return;

      default:
        console.log(chalk.red("❌ Invalid option! Try again."));
    }
  } catch (err) {
    console.error(chalk.red("\n⚠️ Error while running option:\n"), err);
  }

  rl.question(chalk.cyan("\nPress Enter to return to menu..."), () => {
    showMenu();
  });
}

rl.on("close", () => {
  console.log(chalk.gray("\nPress Ctrl + C to exit this mode"));
  process.exit(0);
});

export default showMenu