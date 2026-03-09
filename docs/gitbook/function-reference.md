# Function Reference

Complete reference for all public and external functions in `VaultSentinel.sol`.

---

## User Functions

### `depositETH()`
```solidity
function depositETH() external payable
```
Deposit native ETH into the vault.

- Requires: `vaultState != EMERGENCY`
- Requires: `msg.value > 0`
- Emits: `DepositedETH(user, amount)`

---

### `depositERC20(address token, uint256 amount)`
```solidity
function depositERC20(address token, uint256 amount) external
```
Deposit a whitelisted ERC20 token.

- Requires: `vaultState != EMERGENCY`
- Requires: `amount > 0`
- Requires: `token` is whitelisted via `addSupportedToken()`
- Requires: caller has approved vault for `amount` via `ERC20.approve()`
- Emits: `DepositedERC20(user, token, amount)`

> ⚠️ Always call `approve()` before `depositERC20()`. The frontend handles this automatically as a two-step flow.

---

### `getUserBalance(address user, address token)`
```solidity
function getUserBalance(address user, address token) external view returns (uint256)
```
Returns a user's vault balance for a specific token.

- Pass `address(0)` for ETH balance
- Pass token contract address for ERC20 balance

---

## Authorized Caller Functions

> Callable by `authorizedCaller` (CRE workflow wallet) or `owner`.

### `setRiskScore(uint256 score)`
```solidity
function setRiskScore(uint256 score) external onlyAuthorized
```
Write the latest risk score on-chain. Core function called by the CRE workflow every 60 seconds.

- Requires: `score <= 100`
- Emits: `RiskScoreUpdated(score, timestamp)`
- If `score >= riskThreshold`: automatically calls `_executeEmergency()`

---

### `triggerEmergency()`
```solidity
function triggerEmergency() external onlyAuthorized
```
Manually trigger emergency using the last known risk score.

- Emits: `EmergencyTriggered(riskScore, timestamp)`
- Calls `_returnAllFunds()` internally

---

## Owner-Only Functions

### `resetVault()`
```solidity
function resetVault() external onlyOwner
```
Reset vault from `EMERGENCY` back to `ACTIVE`.

---

### `addSupportedToken(address token)`
```solidity
function addSupportedToken(address token) external onlyOwner
```
Whitelist an ERC20 token for deposit.

- Requires: `token != address(0)`
- Requires: token not already whitelisted
- Emits: `TokenSupported(token)`

---

### `setAuthorizedCaller(address caller)`
```solidity
function setAuthorizedCaller(address caller) external onlyOwner
```
Update the CRE workflow wallet address.

---

### `setRiskThreshold(uint256 threshold)`
```solidity
function setRiskThreshold(uint256 threshold) external onlyOwner
```
Update the score threshold that triggers emergency.

- Requires: `threshold <= 100`
- Default: `70`

---

## Events

| Event | Parameters | When |
|---|---|---|
| `RiskScoreUpdated` | `score, timestamp` | Every `setRiskScore()` call |
| `EmergencyTriggered` | `riskScore, timestamp` | Score ≥ threshold |
| `TokenSupported` | `token` | `addSupportedToken()` |
| `DepositedETH` | `user, amount` | `depositETH()` |
| `DepositedERC20` | `user, token, amount` | `depositERC20()` |
| `FundsReturnedETH` | `user, amount` | During emergency sweep |
| `FundsReturnedERC20` | `user, token, amount` | During emergency sweep |

---

## Read-Only State Variables

| Variable | Type | Description |
|---|---|---|
| `vaultState` | `VaultState` | `ACTIVE` / `GUARDED` / `EMERGENCY` |
| `lastRiskScore` | `uint256` | Last score written by CRE workflow |
| `riskThreshold` | `uint256` | Emergency trigger threshold (default: 70) |
| `authorizedCaller` | `address` | CRE workflow wallet |
| `isSupportedToken(address)` | `bool` | Whether a token is whitelisted |
