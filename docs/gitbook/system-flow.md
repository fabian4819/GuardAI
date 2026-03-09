# System Flow

End-to-end flow of GuardAI from user deposit to emergency withdrawal.

---

## Normal Operation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  USER                                                           │
│                                                                 │
│  1. Connect MetaMask to Tenderly (Chain ID 9991)                │
│  2. Navigate to Pools tab                                       │
│  3. Select asset (ETH / USDC / stETH)                          │
│  4. Enter amount → Confirm in MetaMask                          │
│     ├── ETH: single tx → depositETH()                          │
│     └── ERC20: approve() → wait → depositERC20()               │
│  5. Vault records balance: _balances[user][token] += amount     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │  Every 60 seconds
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  CHAINLINK CRE WORKFLOW                                         │
│                                                                 │
│  Step 1: fetch_eth_price  → Chainlink Data Feed (ETH/USD)      │
│  Step 2: fetch_lido_tvl   → DeFiLlama API                      │
│  Step 3: fetch_aave_tvl   → DeFiLlama API                      │
│  Step 4: fetch_maker_tvl  → DeFiLlama API                      │
│  Step 5: compute_risk     → Weighted score (0–100)             │
│  Step 6: write_risk_score → VaultSentinel.setRiskScore(score)  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
               score < 70          score ≥ 70
                    │                    │
                    ▼                    ▼
            ┌─────────────┐    ┌──────────────────────┐
            │   ACTIVE    │    │  _executeEmergency()  │
            │             │    │                       │
            │  Vault OK   │    │  vaultState=EMERGENCY │
            │  Gauge green│    │  _returnAllFunds()    │
            └─────────────┘    │  ├── ETH → all users  │
                               │  └── ERC20 → all users│
                               └──────────────────────┘
```

---

## Emergency Flow (Detailed)

```
setRiskScore(82) called by CRE workflow
        │
        ├── lastRiskScore = 82
        ├── emit RiskScoreUpdated(82, timestamp)
        │
        └── 82 >= 70 → _executeEmergency(82)
                │
                ├── vaultState = EMERGENCY
                ├── emit EmergencyTriggered(82, timestamp)
                │
                └── _returnAllFunds()
                        │
                        ├── user[0]: ETH 2.0 → call{value: 2 ETH}("") ✅
                        ├── user[0]: USDC 0  → skip
                        ├── user[1]: ETH 0   → skip
                        ├── user[1]: USDC 500 → IERC20.transfer(user1, 500) ✅
                        └── ... (all depositors)
```

---

## Frontend Polling Flow

```
Browser (every 3–5s)
        │
        ├── useReadContract(vaultState)    → ACTIVE / EMERGENCY
        ├── useReadContract(lastRiskScore) → 0–100
        └── useReadContract(getUserBalance) → user balances
                │
                ▼
        UI updates in real time:
        ├── Risk Gauge needle moves
        ├── Vault State Banner appears/disappears
        └── Portfolio balances update
```

---

## ERC20 Deposit — Two-Step Flow

```
User clicks "Deposit 100 USDC"
        │
        ▼
writeContract(USDC.approve, [vaultAddress, 100])
        │
        ▼
setApproveTxHash(hash)
        │
useWaitForTransactionReceipt(approveTxHash)
        │  approveConfirmed = true
        ▼
writeContract(vault.depositERC20, [usdcAddress, 100])
        │
        ▼
setDepositTxHash(hash)
        │
useWaitForTransactionReceipt(depositTxHash)
        │  depositSuccess = true
        ▼
"✅ Deposit Confirmed!"
```

> The two-step flow is critical. Sending `depositERC20` before `approve` is confirmed causes nonce conflicts and dropped transactions.
