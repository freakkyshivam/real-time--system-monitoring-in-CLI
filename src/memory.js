import si from "systeminformation";
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";
import gradient from "gradient-string";

function printHeader(text) {
  const ascii = figlet.textSync(text, { horizontalLayout: "full" });
  console.log(gradient.fruit(ascii));
}

async function showMemoryInfo() {
  printHeader("Memory Info");

  const spinner = ora("Fetching memory details...").start();

  try {
    const mem = await si.mem();
    const memLayout = await si.memLayout();

    spinner.succeed("Memory info loaded!");

    console.log(chalk.cyan("\n======= Memory Summary ======="));

    const summary = {
      "Total RAM (GB)": (mem.total / 1024 ** 3).toFixed(2),
      "Used RAM (GB)": (mem.used / 1024 ** 3).toFixed(2),
      "Free RAM (GB)": (mem.free / 1024 ** 3).toFixed(2),
      "Active (GB)": (mem.active / 1024 ** 3).toFixed(2),
      "Available (GB)": (mem.available / 1024 ** 3).toFixed(2),
      "Memory Usage (%)": ((mem.used / mem.total) * 100).toFixed(1) + " %",
      "Swap Total (GB)": (mem.swaptotal / 1024 ** 3).toFixed(2),
      "Swap Used (GB)": (mem.swapused / 1024 ** 3).toFixed(2),
    };

    console.table(summary);

    console.log(chalk.cyan("\n======= RAM Sticks (Physical Modules) ======="));

    const sticks = memLayout.map((m) => ({
      Bank: m.bank,
      Type: m.type,
      Size_GB: (m.size / 1024 ** 3).toFixed(1),
      Clock_MHz: m.clockSpeed,
      ECC: m.ecc ? "Yes" : "No",
      FormFactor: m.formFactor,
      Manufacturer: m.manufacturer,
      Part_Number: m.partNum,
      Serial_Number: m.serialNum,
      Voltage: `${m.voltageConfigured}V`,
    }));

    console.table(sticks);

  } catch (err) {
    spinner.fail("Failed to load memory info.");
    console.log(chalk.red("Error:", err.message));
  }
}
 

export default showMemoryInfo;
