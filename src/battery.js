import system from "systeminformation";
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";
import gradient from "gradient-string";

 
function printHeader(text) {
  const ascii = figlet.textSync(text, { horizontalLayout: "full" });
  console.log(gradient.fruit(ascii));
}

async function batteryInfo() {
  printHeader("Battery Info");

  const spinner = ora("Fetching battery details...").start();

  try {
    const battery = await system.battery();

    spinner.succeed("Battery info loaded!");

    const batteryInformation = {
      "Battery Model": battery.model,
      "Charging Connected": battery.acConnected ? "Yes" : "No",
      "Charging (%)": battery.percent + " %",
      "Time Remaining (min)": battery.timeRemaining,
      "Max Capacity": battery.maxCapacity + " " + battery.capacityUnit,
      "Current Capacity": battery.currentCapacity + " " + battery.capacityUnit,
    };

    console.log(chalk.cyan("\n======= Battery Info ======="));
    console.table(batteryInformation);

  } catch (error) {
    spinner.fail("Failed to load battery info.");
    console.error(chalk.red("Error:"), error.message);
  }
}

export default batteryInfo;
