# User Roles

GuardAI has two distinct roles with different permissions and interactions.

---

## 👤 Depositor (Regular User)

Any wallet that deposits assets into the vault.

### What they can do:
| Action | Condition |
|---|---|
| Deposit ETH | Vault must be `ACTIVE` |
| Deposit USDC / stETH | Vault must be `ACTIVE` + ERC20 approved |
| View risk score | Always — live on dashboard |
| View vault state | Always |
| View their portfolio | Always |

### What happens automatically:
- When risk score hits **≥ 70**, all their deposited funds are **returned instantly** to their wallet — no action needed.
- New deposits are **blocked** while vault is in `EMERGENCY`.

---

## 🔑 Owner (Deployer / Protocol Admin)

The wallet that deployed the `VaultSentinel` contract.

### Exclusive permissions:
| Function | Description |
|---|---|
| `resetVault()` | Reset vault from `EMERGENCY` → `ACTIVE` |
| `addSupportedToken(address)` | Whitelist a new ERC20 token |
| `setAuthorizedCaller(address)` | Update the CRE workflow wallet |
| `setRiskThreshold(uint256)` | Change the emergency trigger threshold |

### Typical owner workflow:
```
1. Deploy contracts          → scripts/deploy.ts
2. Fund wallet               → scripts/faucet-tenderly.ts
3. Monitor vault state       → frontend dashboard
4. Reset after emergency     → scripts/reset-vault.ts
5. Update CRE wallet         → setAuthorizedCaller()
```

---

## 🤖 Authorized Caller (CRE Workflow)

The wallet used by the Chainlink CRE workflow to write risk scores on-chain.

### Permissions:
| Function | Description |
|---|---|
| `setRiskScore(uint256)` | Write computed risk score — triggers emergency if ≥ threshold |
| `triggerEmergency()` | Manually force emergency using last known score |

> The authorized caller address is set at deploy time and can be updated by the owner via `setAuthorizedCaller()`.

In the demo environment, the **deployer wallet** acts as both owner and authorized caller, which is why `simulate-attack.ts` works directly.
