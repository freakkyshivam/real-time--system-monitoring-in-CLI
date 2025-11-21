import si from "systeminformation";
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";
import gradient from "gradient-string";

// Gradient ASCII Header
function printHeader(text) {
  const ascii = figlet.textSync(text, { horizontalLayout: "full" });
  console.log(gradient.vice(ascii));
}

async function showDiskInfo() {
  printHeader("Disk Info");

  const spinner = ora("Fetching disk information...").start();

  try {
    const disks = await si.diskLayout();
    const fsInfo = await si.fsSize();

    spinner.succeed("Disk info loaded!");

    console.log(chalk.cyan("\n======= Disk Layout (Hardware) ======="));

    const layoutTable = disks.map((d) => ({
      Name: d.name,
      Type: d.type,
      Size_GB: (d.size / 1024 ** 3).toFixed(1),
      Interface: d.interfaceType,
    }));

    console.table(layoutTable);

    console.log(chalk.cyan("\n======= Disk Usage (Partitions) ======="));

    const usageTable = fsInfo.map((fs) => ({
      Mount: fs.mount,
      Type: fs.type,
      Total_GB: (fs.size / 1024 ** 3).toFixed(1),
      Used_GB: (fs.used / 1024 ** 3).toFixed(1),
      Usage_Percent: fs.use.toFixed(1) + " %",
    }));

    console.table(usageTable);

  } catch (err) {
    spinner.fail("Failed to load disk information.");
    console.log(chalk.red("Error:", err.message));
  }
}

export default showDiskInfo;
