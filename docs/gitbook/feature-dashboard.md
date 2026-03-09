# Live Risk Dashboard

> A real-time interface that reads directly from the smart contract — no backend, no intermediary.

---

## Overview

The GuardAI frontend gives users full visibility into vault health at a glance. Every metric is pulled live from `VaultSentinel.sol` via `useReadContract` (wagmi v2), polling every 3–5 seconds.

---

## Risk Gauge

The centerpiece of the Home tab. Displays the current `lastRiskScore` as an animated arc gauge.

| Score | Color | Label |
|---|---|---|
| 0 – 39 | 🟢 Emerald | Low Risk |
| 40 – 69 | 🟡 Amber | Elevated |
| 70 – 100 | 🔴 Red | Critical — Emergency |

The gauge updates in real time. When a simulate-attack script runs, the needle moves within seconds.

---

## Vault State Banner

When `vaultState == EMERGENCY`, a full-width banner appears across the app:

```
🚨  VAULT IS IN EMERGENCY — All funds have been returned to users
```

Deposits are blocked and the UI reflects this immediately.

---

## Pools Tab

Three protected asset pools, each showing:

| Field | Description |
|---|---|
| Asset | ETH / USDC / stETH |
| APY | Estimated yield |
| Risk Level | Low / Medium / High |
| TVL | Total value locked |
| Status | Active / Emergency |

Clicking a pool opens the **Pool Detail Modal** with Deposit and Withdraw tabs.

---

## Portfolio Tab

Shows the connected user's live balances inside the vault:

- ETH balance
- USDC balance
- stETH balance
- Total estimated USD value

Reads from `getUserBalance(userAddress, tokenAddress)` for each asset.

---

## No Backend Required

All data flows directly from the contract:

```typescript
// Risk score — polls every 5s
const { data: riskScore } = useReadContract({
  address: VAULT_ADDRESS,
  abi: VAULT_ABI,
  functionName: "lastRiskScore",
  query: { refetchInterval: 5000 },
});

// Vault state — polls every 3s
const { data: vaultState } = useReadContract({
  address: VAULT_ADDRESS,
  abi: VAULT_ABI,
  functionName: "vaultState",
  query: { refetchInterval: 3000 },
});
```

Fully decentralized frontend — the UI is just a window into the contract state.
