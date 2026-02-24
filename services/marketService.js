const axios = require("axios");
const { config } = require("../config/config");
const { generateSignature } = require("../utils/signature");
const { getLogger } = require("../utils/logger");

const logger = getLogger("marketService");

async function getMarketPrice(symbol) {
    try {
        const timestamp = Date.now().toString();
        const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const queryParams = `symbols=${symbol}`;
        const sign = generateSignature(config.API_KEY, config.SECRET_KEY, nonce, timestamp, queryParams);

        const response = await axios.get(`${config.BASE_URL}/api/v1/futures/market/tickers?${queryParams}`, {
            headers: {
                "api-key": config.API_KEY,
                nonce: nonce,
                timestamp: timestamp,
                sign: sign,
                "Content-Type": "application/json",
            },
        });

        if (response.data && response.data.code === 0 && response.data.data.length > 0) {
            const ticker = response.data.data.find(t => t.symbol === symbol);
            if (ticker) {
                logger.info(`Fetched market price for ${symbol}: ${ticker.lastPrice}`);
                return parseFloat(ticker.lastPrice);
            }
        }
        logger.warn(`Could not fetch market price for ${symbol}: ${JSON.stringify(response.data)}`);
        return null;
    } catch (error) {
        logger.error(`Error fetching market price for ${symbol}: ${error.message}`);
        return null;
    }
}

module.exports = { getMarketPrice };
