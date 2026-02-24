require("dotenv").config();

const config = {
    API_KEY: process.env.BITUNIX_API_KEY,
    SECRET_KEY: process.env.BITUNIX_SECRET_KEY,
    BASE_URL: "https://fapi.bitunix.com",
    WS_URL: "wss://ws.bitunix.com/v1/realtime", // Placeholder, needs verification
    PRICE_MONITOR_INTERVAL: 10000, // 10 seconds
    DEFAULT_SYMBOL: "BTCUSDT",
    DEFAULT_MARGIN_COIN: "USDT",
    RECV_WINDOW: 5000, // Default recvWindow, needs verification
};

function validateConfig() {
    if (!config.API_KEY || !config.SECRET_KEY) {
        throw new Error("API_KEY and SECRET_KEY must be set in environment variables.");
    }
    // Add more validation as needed
}

function setupConfig() {
    validateConfig();
    console.log("Configuration loaded and validated.");
}

module.exports = { config, setupConfig };
