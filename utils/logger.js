const winston = require("winston");
const fs = require("fs");
const path = require("path");

const loggers = {};
const logDir = path.join(__dirname, "..", "logs");

function setupLogging() {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    // You can add a default logger here if needed, or rely on getLogger to create them on demand.
    console.log("Logging setup complete.");
}

function getLogger(name) {
    if (!loggers[name]) {
        loggers[name] = winston.createLogger({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] [${level.toUpperCase()}] [${name}] ${message}`;
                })
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: path.join(logDir, `${name}.log`) }),
            ],
        });
    }
    return loggers[name];
}

module.exports = { getLogger, setupLogging };
