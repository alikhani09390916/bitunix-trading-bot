const chalk = require("chalk");
const ora = require("ora");
const Table = require("cli-table3");
const boxen = require("boxen");
const figlet = require("figlet");
const gradient = require("gradient-string");

let spinner;
let uiData = {
    currentSymbol: "N/A",
    currentPrice: "N/A",
    lastPriceChange: "N/A",
    apiStatus: "N/A",
    internetStatus: "N/A",
    lastOrderStatus: "N/A",
    botHealthStatus: "N/A",
    accountBalance: {
        freeBalance: "N/A",
        lockedBalance: "N/A",
        marginBalance: "N/A",
        unrealizedPNL: "N/A",
        marginCoin: "USDT"
    }
};

function initUI() {
    console.clear();
    console.log(gradient.rainbow(figlet.textSync("BITUNIX BOT", { horizontalLayout: "full" })));
    console.log(boxen(chalk.bold.green("BITUNIX FUTURES TRADING BOT"), { padding: 1, margin: 1, borderStyle: "double" }));
    spinner = ora("Initializing bot...").start();
    renderUI();
}

function renderUI() {
    console.clear();
    console.log(gradient.rainbow(figlet.textSync("BITUNIX BOT", { horizontalLayout: "full" })));
    console.log(boxen(chalk.bold.green("BITUNIX FUTURES TRADING BOT"), { padding: 1, margin: 1, borderStyle: "double" }));

    const balanceTable = new Table({
        style: { 'padding-left': 0, 'padding-right': 0, border: [], header: [] }, // Remove padding and borders
        chars: { 'top': '─' , 'top-mid': '┬' , 'top-left': '┌' , 'top-right': '┐'
         , 'bottom': '─' , 'bottom-mid': '┴' , 'bottom-left': '└' , 'bottom-right': '┘'
         , 'left': '│' , 'left-mid': '├' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '│' , 'right-mid': '┤' , 'middle': '│' },
        colWidths: [20, 20]
    });

    balanceTable.push(
        [{ colSpan: 2, content: chalk.bold("ACCOUNT BALANCE"), hAlign: "center" }],
        [{ colSpan: 2, content: "", hAlign: "center" }], // Separator
        [chalk.white("Free Balance:"), chalk.yellow(`${uiData.accountBalance.freeBalance} ${uiData.accountBalance.marginCoin}`)],
        [chalk.white("Locked Balance:"), chalk.yellow(`${uiData.accountBalance.lockedBalance} ${uiData.accountBalance.marginCoin}`)],
        [chalk.white("Margin Balance:"), chalk.yellow(`${uiData.accountBalance.marginBalance} ${uiData.accountBalance.marginCoin}`)],
        [chalk.white("Unrealized PNL:"), chalk.yellow(`${uiData.accountBalance.unrealizedPNL} ${uiData.accountBalance.marginCoin}`)]
    );

    console.log(boxen(balanceTable.toString(), { padding: 0, margin: 1, borderStyle: "round", title: "BALANCE", titleAlignment: "center" }));

    const statusTable = new Table({
        style: { 'padding-left': 0, 'padding-right': 0, border: [], header: [] },
        chars: { 'top': '─' , 'top-mid': '┬' , 'top-left': '┌' , 'top-right': '┐'
         , 'bottom': '─' , 'bottom-mid': '┴' , 'bottom-left': '└' , 'bottom-right': '┘'
         , 'left': '│' , 'left-mid': '├' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '│' , 'right-mid': '┤' , 'middle': '│' },
        colWidths: [20, 20]
    });

    statusTable.push(
        [chalk.white("Current Symbol:"), chalk.cyan(uiData.currentSymbol)],
        [chalk.white("Current Price:"), chalk.hex("#FFA500")(uiData.currentPrice)], // Orange color
        [chalk.white("Last Price Change:"), chalk.magenta(uiData.lastPriceChange)],
        [chalk.white("API Status:"), uiData.apiStatus === "OK" ? chalk.green(uiData.apiStatus) : chalk.red(uiData.apiStatus)],
        [chalk.white("Internet Status:"), uiData.internetStatus === "OK" ? chalk.green(uiData.internetStatus) : chalk.red(uiData.internetStatus)],
        [chalk.white("Last Order Status:"), chalk.blue(uiData.lastOrderStatus)],
        [chalk.white("Bot Health Status:"), uiData.botHealthStatus === "Running" ? chalk.green(uiData.botHealthStatus) : chalk.red(uiData.botHealthStatus)]
    );

    console.log(boxen(statusTable.toString(), { padding: 0, margin: 1, borderStyle: "round", title: "STATUS", titleAlignment: "center" }));

    spinner.text = `Bot running. Current Price: ${uiData.currentPrice} | API: ${uiData.apiStatus} | Health: ${uiData.botHealthStatus}`;
}

function updateUI(newData) {
    const oldPrice = parseFloat(uiData.currentPrice);
    uiData = { ...uiData, ...newData };

    if (newData.currentPrice && oldPrice !== "N/A") {
        const newPrice = parseFloat(newData.currentPrice);
        if (newPrice > oldPrice) {
            uiData.lastPriceChange = chalk.green(`▲ ${((newPrice - oldPrice) / oldPrice * 100).toFixed(2)}%`);
        } else if (newPrice < oldPrice) {
            uiData.lastPriceChange = chalk.red(`▼ ${((oldPrice - newPrice) / oldPrice * 100).toFixed(2)}%`);
        } else {
            uiData.lastPriceChange = "0.00%";
        }
    }
    renderUI();
}

module.exports = { initUI, updateUI };
