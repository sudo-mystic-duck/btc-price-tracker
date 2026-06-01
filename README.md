# BTC Price Tracker

A minimalistic Bitcoin price tracker built with Bun. This is my first project using Bun. And it's the first time I've not built a website! I actually built a backend!

## Features
- **Tracking of Bitcoin Price:** Fetches the current price every 30 seconds.
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

Then open the browser and enter `http://localhost:5173`

### Environment variables

Copy `backend/.env.example` and `frontend/.env.example` to `.env` and adjust as needed.

**Backend** (`backend/.env`):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP server port |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed browser origin |
| `POLL_INTERVAL_MS` | `30000` | Coinbase fetch interval |
| `DB_PATH` | `db.sqlite` | SQLite file path |

**Frontend** (`frontend/.env`):

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api` | API base URL (Vite proxies `/api` to the backend in dev) |

The frontend uses [Tailwind CSS 4](https://tailwindcss.com/) and [daisyUI](https://daisyui.com/) for layout and theming. Use the header control to switch light, dark, or system theme (preference is saved in `localStorage`).

### API

| Route | Description |
|-------|-------------|
| `GET /` | Latest stored price |
| `GET /prices` | Full price history (newest first) |
| `GET /health` | Server and database health check |

### Tests

```bash
cd backend && bun test
cd frontend && bun test
```

### Rules for AI agents

See [RULES.md](RULES.md) at the repository root.

## Installation for Users
Currently there is no v2.0.0 executable release. If you want to download the v1.0.0(only terminal) Then follow these steps:

1. Download the latest release from [Releases](https://github.com/sudo-mystic-duck/btc-price-tracker/releases)
2. **Mac and Linux users:** Open your terminal, copy/paste the following command and drag and drop the file into your
terminal and press Enter to make it executable.

```bash
chmod +x 
```

Then, run the executable file by either double clicking it or dragging it into your terminal and hitting Enter.

3. **Windows users:** Just double click the file.
4. Your terminal should now display the current Bitcoin price. The db.sqlite file should be created in your home directory(at least on MacOS).
