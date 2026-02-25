# BTC Price Tracker

A minimalistic Bitcoin price tracker built with Bun. This is my first project using Bun. And it's the first time I've not built a website! I actually built a backend!

## Features
- **Tracking of Btc Price:** Fetches the current price every 30 seconds.
- **Database:** Stores the price history in a SQLite database on your computer.
- **Type Safety:** Uses TypeScript for type safety.
- **Modular Architecture:** Clean seperation of modules.

## Installation for Developers
### Installation
**Open a new terminal and enter:**
```bash
git clone https://github.com/sudo-mystic-duck/btc-price-tracker.git
```

**Execution: Backend**
```bash
cd backend
bun install
bun dev
```

**Execution: Frontend**
```bash
cd frontend
bun install
bun dev
```

Then open the browser and enter "localhost:5173"

## Installation for Users
Currently there is no v2.0.0 executable release. If you want to download the v1.0.0(only terminal) Then follow these steps:

1. Download the latest release from [Releases](https://github.com/sudo-mystic-duck/btc-price-tracker/releases)
2. **Mac and Linux users:** Open your terminal, copy/paste the following command and drag and drop the file into your
terminal and press Enter to make it executable.

```bash
chmod +x 
```

Then, run the executable file by either double clicking it or dragging it into your terminal.

3. **Windows users:** Just double click the file.
4. Your terminal should now display the current Bitcoin price. The db.sqlite file should be created in your home directory(at least on MacOS).
