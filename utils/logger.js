const winston = require("winston");

const loggers = {};

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
                new winston.transports.File({ filename: `logs/${name}.log` }),
            ],
        });
    }
    return loggers[name];
}

module.exports = { getLogger };
