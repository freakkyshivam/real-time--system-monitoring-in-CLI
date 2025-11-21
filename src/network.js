import si from "systeminformation";
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";
import gradient from "gradient-string";

// Gradient ASCII banner
function printHeader(text) {
  const ascii = figlet.textSync(text, { horizontalLayout: "full" });
  console.log(gradient.instagram(ascii));
}

async function showNetworkInfo() {
  printHeader("Network Info");

  const spinner = ora("Fetching network data...").start();

  try {
    const interfaces = await si.networkInterfaces();
    const stats = await si.networkStats();

    spinner.succeed("Network info loaded!");

    console.log(chalk.cyan("\n======= Network Interfaces ======="));

    const ifaceTable = interfaces.map((n) => ({
      Name: n.iface,
      Type: n.type,
      IP4: n.ip4 || "-",
      MAC: n.mac || "-",
      Speed_Mbps: n.speed || "Unknown",
      Status: n.operstate,
    }));

    console.table(ifaceTable);

    console.log(chalk.cyan("\n======= Network Stats (Speed / Usage) ======="));

    const statsTable = stats.map((s) => ({
      Interface: s.iface,
      RX_MB: (s.rx_bytes / 1024 ** 2).toFixed(2),
      TX_MB: (s.tx_bytes / 1024 ** 2).toFixed(2),
      RX_Speed: s.rx_sec ? s.rx_sec + " bytes/s" : "-",
      TX_Speed: s.tx_sec ? s.tx_sec + " bytes/s" : "-",
    }));

    console.table(statsTable);

  } catch (err) {
    spinner.fail("Failed to load network info.");
    console.log(chalk.red("Error:", err.message));
  }
}

export default showNetworkInfo;
