import si from "systeminformation";
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";
import gradient from "gradient-string";

 
function printHeader(text) {
  const ascii = figlet.textSync(text, { horizontalLayout: "full" });
  console.log(gradient.fruit(ascii));
}

async function showProcesses() {
  printHeader("Processes");

  const spinner = ora("Fetching top CPU processes...").start();

  try {
    const data = await si.processes();

    spinner.succeed("Process list loaded!");

    // Remove idle/system idle
    let list = data.list.filter(
      (p) =>
        p.name &&
        !p.name.toLowerCase().includes("idle") &&
        !p.name.toLowerCase().includes("system idle")
    );

    // Sort by CPU usage
    list.sort((a, b) => b.cpu - a.cpu);

    const top = list.slice(0, 10);

    const table = top.map((p) => ({
      PID: p.pid,
      Name: p.name.slice(0, 25),
      CPU: p.cpu.toFixed(1) + " %",
      Memory: p.mem.toFixed(2) + " %",
    }));

    console.log(chalk.cyan("\n======= Top Processes (By CPU) ======="));
    console.table(table);

  } catch (error) {
    spinner.fail("Failed to load process list.");
    console.log(chalk.red("Error:"), error.message);
  }
}

export default showProcesses;
