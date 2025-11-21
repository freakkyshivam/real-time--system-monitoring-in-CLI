import si from "systeminformation";
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";
import gradient from "gradient-string";

function printHeader(text) {
  const ascii = figlet.textSync(text, { horizontalLayout: "full" });
  console.log(gradient.pastel(ascii));
}

async function getSystemStats() {
  printHeader("System Stats");

  const spinner = ora("Collecting system information...").start();

  try {
    // CPU Info
    const cpu = await si.cpu();
    const cpuSpeed = await si.cpuCurrentSpeed();
    const cpuTemp = await si.cpuTemperature();
    const cpuLoad = await si.currentLoad();

    // Memory
    const mem = await si.mem();

    // Uptime
    const osInfo = await si.time();

    spinner.succeed("System information loaded!");

    console.log(chalk.yellow.bold("\n🧠 CPU INFORMATION"));
    console.table({
      Manufacturer: cpu.manufacturer,
      Brand: cpu.brand,
      Cores: cpu.cores,
      "Physical Cores": cpu.physicalCores,
      "Base Speed (GHz)": cpu.speed,
      "Max Speed (GHz)": cpu.speedMax,
    });

    console.log(chalk.yellow.bold("\n⚡ CURRENT CPU STATS"));
    console.table({
      "Min (GHz)": cpuSpeed.min,
      "Current (GHz)": cpuSpeed.avg,
      "Max (GHz)": cpuSpeed.max,
      "Temp (°C)": cpuTemp.main,
      "Load (%)": cpuLoad.currentLoad.toFixed(2),
    });

    console.log(chalk.yellow.bold("\n💾 MEMORY SUMMARY"));
    console.table({
      "Total (GB)": (mem.total / 1024 ** 3).toFixed(2),
      "Used (GB)": (mem.used / 1024 ** 3).toFixed(2),
      "Free (GB)": (mem.free / 1024 ** 3).toFixed(2),
      "Usage (%)": ((mem.used / mem.total) * 100).toFixed(1) + " %",
    });

    console.log(chalk.yellow.bold("\n⏱ SYSTEM UPTIME"));
    console.table({
      "Uptime (Hours)": (osInfo.uptime / 3600).toFixed(2),
    });

  } catch (err) {
    spinner.fail("Failed to load system stats.");
    console.log(chalk.red("Error:", err.message));
  }
}

export default getSystemStats;
