# Autonomous Risk Monitoring

> The brain of GuardAI — a Chainlink CRE workflow that runs every 60 seconds, aggregating multi-protocol signals into a single Systemic Risk Index.

---

## How It Works

Every minute, the CRE workflow:

1. Fetches **ETH/USD price** from Chainlink Data Feed
2. Fetches **Lido, Aave, MakerDAO TVL** from DeFiLlama
3. Computes a **weighted Systemic Risk Index** (0–100)
4. Writes the score on-chain via `setRiskScore()`

If the score hits **70 or above**, the vault automatically enters EMERGENCY.

---

## Risk Signals

| Signal | Source | Weight |
|---|---|---|
| ETH/USD Price Drop | Chainlink Data Feed (`0x5f4eC3...`) | **30%** |
| Lido TVL Drain | DeFiLlama API | **25%** |
| Aave TVL Drain | DeFiLlama API | **25%** |
| MakerDAO TVL Drain | DeFiLlama API | **20%** |

---

## Score Formula

$$\text{RiskScore} = (\text{priceScore} \times 0.30) + (\text{lidoScore} \times 0.25) + (\text{aaveScore} \times 0.25) + (\text{makerScore} \times 0.20)$$

Each factor score is computed as:

| Factor | Baseline | Formula |
|---|---|---|
| ETH Price | $3,500 | `min(100, priceDrop% × 2.5)` |
| Lido TVL | $10B | `min(100, drain% × 2)` |
| Aave TVL | $8B | `min(100, drain% × 2)` |
| MakerDAO TVL | $6B | `min(100, drain% × 2)` |

Score is always an integer **0–100**.

---

## Live Dashboard

The Risk Gauge on the Home tab reads `lastRiskScore` directly from the contract every 5 seconds via `useReadContract`. No backend. No intermediary.

| Score Range | Color | Vault State |
|---|---|---|
| 0 – 39 | 🟢 Green | ACTIVE — Safe |
| 40 – 69 | 🟡 Yellow | ACTIVE — Elevated |
| 70 – 100 | 🔴 Red | EMERGENCY triggered |

---

## Chainlink Integration

```yaml
- id: fetch_eth_price
  type: chainlink-data-feed
  params:
    feedAddress: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"  # ETH/USD Mainnet
  output: eth_price
```

The `chainlink-data-feed` step type is native to Chainlink CRE — it fetches verifiable price data directly from the on-chain aggregator, no third-party API needed.

**Workflow file:** [`cre/vault-sentinel-workflow.yaml`](https://github.com/fabian4819/VaultSentinel/blob/main/cre/vault-sentinel-workflow.yaml)
