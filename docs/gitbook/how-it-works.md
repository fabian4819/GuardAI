# How It Works

## End-to-End Flow

```
Every 60 seconds
      │
      ├─ Chainlink Data Feed ──► ETH/USD price
      ├─ DeFiLlama API ────────► Lido TVL
      ├─ DeFiLlama API ────────► Aave TVL
      └─ DeFiLlama API ────────► MakerDAO TVL
                │
                ▼
      Compute Systemic Risk Index
      (weighted score 0–100)
                │
                ▼
      VaultSentinel.setRiskScore(score)
                │
         ┌──────┴──────┐
    score < 70     score ≥ 70
         │                │
         ▼                ▼
    Vault ACTIVE    EMERGENCY triggered
    (no action)     → return ALL funds
                    → block new deposits
```

---

## Step-by-Step

### Step 1 — Data Collection
The CRE workflow fetches four data points simultaneously:
- **ETH/USD price** from the official Chainlink aggregator on Ethereum mainnet
- **Lido TVL**, **Aave TVL**, **MakerDAO TVL** from DeFiLlama's protocol API

### Step 2 — Risk Computation
A JavaScript compute step calculates the Systemic Risk Index using a weighted formula:

| Signal | Weight |
|---|---|
| ETH price drop from $3,500 baseline | 30% |
| Lido TVL drain from $10B baseline | 25% |
| Aave TVL drain from $8B baseline | 25% |
| MakerDAO TVL drain from $6B baseline | 20% |

Score is always an integer **0–100**.

### Step 3 — On-Chain Write
The CRE workflow calls `VaultSentinel.setRiskScore(score)` via an `eth-transaction` step, signed by the authorized CRE wallet.

### Step 4 — Smart Contract Response
The contract evaluates the score:
- **Below threshold (70):** Updates `lastRiskScore`, emits event, no further action
- **At or above threshold:** Calls `_executeEmergency()` → sweeps all ETH and ERC20 balances back to every depositor

### Step 5 — Frontend Update
The GuardAI dashboard reads `vaultState` and `lastRiskScore` on-chain via wagmi. The Risk Gauge updates, and an EMERGENCY banner appears if triggered.

---

## User Journey

```
User connects wallet
        │
        ▼
Browse Pools → Select asset → Deposit
        │
        ▼
Funds held in VaultSentinel
        │
   ┌────┴─────────────────┐
   │                      │
Score stays < 70    Score reaches ≥ 70
   │                      │
Earn yield (APY)    Funds auto-returned
Continue normally   Wallet balance restored
```
