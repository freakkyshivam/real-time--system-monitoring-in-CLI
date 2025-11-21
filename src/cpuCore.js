import os from "node:os";
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";
import gradient from "gradient-string";

function printHeader(text) {
  const ascii = figlet.textSync(text, { horizontalLayout: "full" });
  console.log(gradient.fruit(ascii));
}

function calculateCPU(oldCpu, newCpu) {
  const oldTotal = Object.values(oldCpu.times).reduce((a, b) => a + b, 0);
  const newTotal = Object.values(newCpu.times).reduce((a, b) => a + b, 0);

  const idleDiff = newCpu.times.idle - oldCpu.times.idle;
  const totalDiff = newTotal - oldTotal;

  const used = totalDiff - idleDiff;

  if (totalDiff === 0) return 0;

  return ((100 * used) / totalDiff).toFixed(1);
}

async function cpuCoreMonitor() {
  printHeader("CPU Cores");

  const spinner = ora("Measuring per-core CPU usage...").start();

  const oldCpus = os.cpus();

  setTimeout(() => {
    const newCpus = os.cpus();

    const core = newCpus.map((cpu, i) => ({
      core: `Core ${i}`,
      usage: calculateCPU(oldCpus[i], newCpus[i]) + " %",
    }));

    spinner.succeed("CPU core usage calculated!");

    console.log(chalk.yellow("\n======= CPU Usage Per Core ======="));
    console.table(core, ["core", "usage"]);
  }, 1000);
}

export default cpuCoreMonitor;
