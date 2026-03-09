# Our Solution

## GuardAI — Autonomous DeFi Risk Protection

GuardAI is a smart vault system powered by **Chainlink CRE** that monitors systemic DeFi risk in real time and automatically returns user funds the moment risk crosses a safe threshold.

**No alerts. No manual action. No delay.**

---

## How We Solve It

### 🔗 Chainlink CRE as the Autonomous Brain

A Chainlink CRE workflow runs every **60 seconds**, aggregating risk signals from:
- **Chainlink Data Feed** — ETH/USD price (on-chain, tamper-proof)
- **DeFiLlama API** — Lido, Aave, and MakerDAO TVL in real time

It computes a **Systemic Risk Index** (0–100) and writes it directly on-chain.

### 🛡️ VaultSentinel as the Protective Layer

The `VaultSentinel` smart contract holds user deposits and reacts instantly:
- Score **below 70** → vault stays `ACTIVE`, deposits and withdrawals work normally
- Score **70 or above** → vault flips to `EMERGENCY`, all user funds are returned automatically

### 📊 GuardAI Dashboard as the User Interface

A real-time dashboard lets users:
- See the live risk score and vault state
- Deposit and withdraw ETH, USDC, and stETH
- Monitor their portfolio balances

---

## Key Differentiators

| Capability | Traditional DeFi | GuardAI |
|---|---|---|
| Risk monitoring | Manual | Automated every 60s |
| Emergency response | User-initiated | Fully autonomous |
| Data source | Centralized alerts | Chainlink Data Feed + DeFiLlama |
| Fund protection | Reactive | Proactive |
| Deposit blocking | None | Blocked during EMERGENCY |

---

## The Result

Users deposit assets into GuardAI knowing that if the market turns systemic — their funds come back automatically, instantly, and without any action on their part.

> GuardAI is not an alert system. It is an **autonomous protection system**.
