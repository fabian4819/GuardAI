# Glossary

Key terms used throughout the GuardAI documentation.

---

## A

**Authorized Caller**
The wallet address permitted to call `setRiskScore()` and `triggerEmergency()` on the VaultSentinel contract. In production, this is the Chainlink CRE workflow wallet. Set at deploy time, updatable by owner.

---

## C

**Chainlink CRE (Compute Runtime Environment)**
A decentralized automation platform by Chainlink that allows developers to define multi-step workflows (data fetch → compute → on-chain write) triggered by cron schedules or events. The core automation layer of GuardAI.

**Chainlink Data Feed**
On-chain price oracles maintained by a decentralized network of node operators. GuardAI uses the ETH/USD feed (`0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419`) for manipulation-resistant price data.

**Circuit Breaker**
A smart contract pattern where a one-way state transition (`ACTIVE → EMERGENCY`) halts operations and protects users. Inspired by traditional financial circuit breakers. Requires explicit owner action to reset.

---

## D

**DeFiLlama**
An open-source DeFi analytics platform providing TVL (Total Value Locked) data for protocols like Lido, Aave, and MakerDAO via a free public API. Used by the CRE workflow for TVL signal inputs.

**Depositor**
Any wallet that has called `depositETH()` or `depositERC20()` on the VaultSentinel contract. All depositors are tracked in `_depositors[]` for the emergency sweep.

---

## E

**Emergency Withdrawal**
The automatic process triggered when `lastRiskScore >= riskThreshold`. The contract sweeps all user balances (ETH + ERC20) back to their respective wallets in a single transaction.

**ERC20**
The standard interface for fungible tokens on Ethereum. GuardAI supports whitelisted ERC20 tokens (USDC, stETH) alongside native ETH.

---

## R

**Risk Score**
An integer from 0 to 100 representing the current systemic risk level of the DeFi ecosystem. Computed by the CRE workflow every 60 seconds as a weighted composite of ETH price and protocol TVL signals.

**Risk Threshold**
The score value at which the vault automatically triggers emergency. Default: `70`. Configurable by owner via `setRiskThreshold()`.

---

## S

**Systemic Risk**
Risk that affects the entire DeFi ecosystem rather than a single protocol — e.g., ETH price crash, major protocol exploit, or cascading liquidations across Lido/Aave/MakerDAO.

**Systemic Risk Index**
GuardAI's proprietary composite score (0–100) combining ETH price drop (30%), Lido TVL drain (25%), Aave TVL drain (25%), and MakerDAO TVL drain (20%).

---

## T

**Tenderly Virtual Testnet**
A cloud-hosted Ethereum mainnet fork used for realistic smart contract testing. Supports custom RPC, `tenderly_setBalance` for funding wallets, and a full transaction explorer. GuardAI uses Chain ID `9991`.

**TVL (Total Value Locked)**
The total USD value of assets deposited in a DeFi protocol. A sudden TVL drain signals capital flight and potential systemic risk.

---

## V

**VaultSentinel**
The core smart contract of GuardAI. Holds user deposits, receives risk scores from the CRE workflow, and autonomously executes emergency withdrawals when the threshold is breached.

**VaultState**
The enum representing the vault's current operational mode:
- `ACTIVE` — normal operation, deposits allowed
- `GUARDED` — reserved for future use
- `EMERGENCY` — all funds returned, deposits blocked
