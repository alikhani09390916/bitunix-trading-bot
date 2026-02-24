const axios = require("axios");
const { config } = require("../config/config");
const { generateSignature } = require("../utils/signature");
const { getLogger } = require("../utils/logger");

const logger = getLogger("tradeService");

async function getAccountBalance() {
    try {
        const timestamp = Date.now().toString();
        const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const queryParams = `marginCoin=${config.DEFAULT_MARGIN_COIN}`;
        const sign = generateSignature(config.API_KEY, config.SECRET_KEY, nonce, timestamp, queryParams);

        const response = await axios.get(`${config.BASE_URL}/api/v1/futures/account?${queryParams}`, {
            headers: {
                "api-key": config.API_KEY,
                nonce: nonce,
                timestamp: timestamp,
                sign: sign,
                "Content-Type": "application/json",
            },
        });

        if (response.data && response.data.code === 0 && response.data.data.length > 0) {
            const accountData = response.data.data[0];
            logger.info(`Fetched account balance: Available ${accountData.available} ${accountData.marginCoin}`);
            return {
                freeBalance: parseFloat(accountData.available),
                lockedBalance: parseFloat(accountData.frozen),
                marginBalance: parseFloat(accountData.margin),
                unrealizedPNL: parseFloat(accountData.crossUnrealizedPNL) + parseFloat(accountData.isolationUnrealizedPNL),
                marginCoin: accountData.marginCoin
            };
        }
        logger.warn(`Could not fetch account balance: ${JSON.stringify(response.data)}`);
        return null;
    } catch (error) {
        logger.error(`Error fetching account balance: ${error.message}`);
        return null;
    }
}

async function placeFuturesOrder(symbol, side, quantity, price, options = {}) {
    try {
        const timestamp = Date.now().toString();
        const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const orderBody = {
            symbol: symbol,
            qty: quantity.toString(),
            side: side.toUpperCase(), // BUY or SELL
            tradeSide: options.tradeSide ? options.tradeSide.toUpperCase() : "OPEN", // OPEN or CLOSE
            orderType: options.orderType ? options.orderType.toUpperCase() : "LIMIT", // LIMIT or MARKET
            ...options
        };

        if (orderBody.orderType === "LIMIT" && !price) {
            throw new Error("Price is required for LIMIT orders.");
        }
        if (orderBody.orderType === "LIMIT") {
            orderBody.price = price.toString();
        }

        // Sort keys for body before stringifying and removing spaces
        const sortedOrderBody = Object.keys(orderBody).sort().reduce(
            (obj, key) => { 
                obj[key] = orderBody[key]; 
                return obj;
            }, 
            {}
        );
        const bodyString = JSON.stringify(sortedOrderBody).replace(/\s/g, "");

        const sign = generateSignature(config.API_KEY, config.SECRET_KEY, nonce, timestamp, "", bodyString);

        const response = await axios.post(`${config.BASE_URL}/api/v1/futures/trade/place_order`, orderBody, {
            headers: {
                "api-key": config.API_KEY,
                nonce: nonce,
                timestamp: timestamp,
                sign: sign,
                "Content-Type": "application/json",
            },
        });

        if (response.data && response.data.code === 0) {
            logger.info(`Placed order for ${symbol}: ${side} ${quantity} at ${price || 'Market'} - Order ID: ${response.data.data.orderId}`);
            return response.data.data;
        }
        logger.error(`Failed to place order for ${symbol}: ${JSON.stringify(response.data)}`);
        return null;
    } catch (error) {
        logger.error(`Error placing order for ${symbol}: ${error.message}`);
        return null;
    }
}

module.exports = { getAccountBalance, placeFuturesOrder };
