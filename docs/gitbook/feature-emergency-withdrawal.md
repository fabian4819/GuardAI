# Emergency Auto-Withdrawal

> When risk is detected, GuardAI returns every user's funds instantly — automatically, on-chain, with no human trigger.

---

## The Circuit Breaker

`VaultSentinel` implements a **one-way circuit breaker** pattern:

```
ACTIVE ──── score ≥ 70 ────► EMERGENCY
              (automatic)
                │
                ▼
        _returnAllFunds()
        ├── Return ETH to every depositor
        └── Return all ERC20s to every depositor

EMERGENCY ──── resetVault() ────► ACTIVE
                (owner only)
```

Once triggered, the vault stays in `EMERGENCY` until the owner explicitly resets it. This prevents re-entrancy and ensures funds aren't re-deposited into a still-dangerous vault.

---

## What Happens During Emergency

When `setRiskScore(score)` receives a score ≥ 70:

1. `_executeEmergency()` is called internally
2. `vaultState` flips to `EMERGENCY` — **new deposits immediately blocked**
3. `EmergencyTriggered` event emitted on-chain
4. `_returnAllFunds()` iterates every depositor:
   - Returns **ETH** via low-level `call{value}`
   - Returns **each whitelisted ERC20** via `IERC20.transfer()`
5. Individual transfer failures are handled gracefully — one failed transfer does not block others

---

## Safety Design

| Concern | How GuardAI handles it |
|---|---|
| Re-entrancy | `EMERGENCY` state set before transfers begin |
| Failed ETH transfer | Balance reverted for that user only, others unaffected |
| Failed ERC20 transfer | `try/catch` — balance reverted for that user only |
| Idempotency | `_executeEmergency()` is a no-op if already in EMERGENCY |
| Deposit during emergency | `notEmergency` modifier reverts with `"Vault is in emergency"` |

---

## On-Chain Proof

Every emergency withdrawal emits verifiable events:

```solidity
event EmergencyTriggered(uint256 riskScore, uint256 timestamp);
event FundsReturnedETH(address indexed user, uint256 amount);
event FundsReturnedERC20(address indexed user, address indexed token, uint256 amount);
```

All events are queryable on Tenderly explorer — full transparency, no trust required.

---

## Demo

```bash
# 1. Deposit 2 ETH via frontend
# 2. Trigger emergency
SCORE=82 npx hardhat run scripts/simulate-attack.ts --network tenderly
# → Vault enters EMERGENCY, 2 ETH returned to wallet instantly

# 3. Reset vault
npx hardhat run scripts/reset-vault.ts --network tenderly
```
