# Billions Agent — Web3Central Content Engine

An AI-powered agent that autonomously generates a research-grade, 7-day social media content schedule for Web3Central using live on-chain data.

## Skills

| Skill | Description |
|---|---|
| `web3central-content-engine` | Generates a 7-day content schedule using Groq (Llama 3.3) + MongoDB |
| `verified-agent-identity` | Manages the agent's DID passport on the Billions Network |

---

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Expat-Q/Billions-Agent
cd Billions-Agent
```

### 2. Setup Dependencies
```bash
# From the root directory
npm run setup
```

### 3. Configure Environment Variables

#### For Local Development:
Copy the `.env.example` file (or create one) at the root and fill in your values:
```bash
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=your_mongodb_connection_string
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

#### For GitHub Codespaces:
1. Go to your repo on GitHub -> **Settings** -> **Secrets and variables** -> **Codespaces**.
2. Add the keys above as **Secrets**.
3. When you launch the Codespace, they will be automatically loaded.

### 4. Run the Content Generator
```bash
# Run via the root shortcut
npm run generate

# Or run manually
node skills/web3central-content-engine/scripts/generateBatch.js
```


---

## Content Calendar Logic

The agent follows a research-driven, weekly rhythm:

| Day | Focus | Feature |
|---|---|---|
| **Monday** | The Narrative Shift | TVL / Volume Data Storytelling |
| **Tuesday** | Developer Alpha | Developer Console & Onboarding |
| **Wednesday** | Category Kings | Sector-specific Category Deep Dives |
| **Thursday** | Community Consensus | Review Ratings & Community Sentiment |
| **Friday** | On-Chain Trending | High-signal dApps by Click Count |
| **Saturday** | Platform Mastery | Tutorials & Feature Spotlights |
| **Sunday** | Weekly Recap | Synthesized Weekly Summary |

---

## Agent Training Rules (2026 Alpha Pillars)

1. **Hook with the "Why"** — Every metric must have an implication.
2. **Utility-First** — No hype. Only actionable insights.
3. **Platform Integration** — Naturally reference Review Ratings, Developer Console, and Categories.
4. **Atomic Metrics** — Every post must feature at least 2 verifiable data points.
5. **No AI-isms** — Zero use of "Leverage," "Unlock," "Game-changer," etc.
6. **Neutrality Filter** (DefiLlama Style) — Objective, data-first reporting.
7. **Alpha Divergence** — Identify discrepancies in the data for real "Alpha".

---

## Output

Generated schedules are saved to `skills/web3central-content-engine/batches/` and optionally delivered to your Telegram DM.
