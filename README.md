# Bitunix Futures Trading Bot (Termux)

A production-grade, modular Node.js trading bot for Bitunix Futures, designed to run 24/7 in Termux.

## Features
- **Real Trading:** Execute real trades on Bitunix using official API.
- **Advanced Terminal UI:** Professional trader-grade UI using chalk, ora, cli-table3, boxen, figlet, and gradient-string.
- **Modular Architecture:** Clean separation of concerns (config, services, utils, ui).
- **Security:** HMAC-SHA256 signature algorithm, environment variables for credentials.
- **Stability:** Exponential backoff retry, timestamp drift correction, health monitoring, and structured logging.
- **Risk Control:** Built-in risk control framework.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bitunix-trading-bot
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add your Bitunix API credentials:
   ```
   BITUNIX_API_KEY=your_api_key
   BITUNIX_SECRET_KEY=your_secret_key
   ```

## Usage
Run the bot:
```bash
node main.js
```

## Documentation
A detailed Persian educational brochure is available in the `bitunix-trading-bot-brochure.pdf` file.

## Disclaimer
Trading involves significant risk. Use this bot at your own risk. The authors are not responsible for any financial losses.
