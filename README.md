# BTC Price Tracker

A minimalistic Bitcoin price tracker built with Bun.
This is my first project using Bun. And it's the first time I've not 
built a website! I actually built a backend!

## Features
- **Tracking of Btc Price:** Fetches the current price every 30 seconds.
- **Database:** Stores the price history in a SQLite database on your computer.
- **Type Safety:** Uses TypeScript for type safety.
- **Modular Architecture:** Clean seperation of modules.

## Installation
```bash
git clone https://github.com/sudo-mystic-duck/btc-price-tracker.git
cd btc-price-tracker
bun install
bun run src/index.ts
