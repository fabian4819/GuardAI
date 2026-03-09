# Tech Stack

A breakdown of every technology used in GuardAI and why it was chosen.

---

## Chainlink (Core)

| Component | Usage |
|---|---|
| **Chainlink CRE** | Autonomous workflow engine — runs every 60s, computes risk, writes on-chain |
| **Chainlink Data Feeds** | ETH/USD price feed (`0x5f4eC3...`) — verifiable, manipulation-resistant |

CRE is the backbone of GuardAI's autonomy. Without it, the risk monitoring would require a centralized server. With CRE, the entire pipeline is trustless and automated.

---

## Smart Contract Layer

| Technology | Version | Role |
|---|---|---|
| **Solidity** | `^0.8.24` | VaultSentinel contract language |
| **Hardhat** | Latest | Compile, test, deploy |
| **OpenZeppelin** | v5 | `Ownable`, `IERC20` — battle-tested primitives |
| **TypeChain** | Auto-generated | Type-safe contract bindings for TypeScript |

---

## Frontend

| Technology | Version | Role |
|---|---|---|
| **Next.js** | 14 (App Router) | React framework, SSR, routing |
| **wagmi** | v2 | React hooks for wallet + contract interaction |
| **viem** | v2 | Low-level Ethereum client (used by wagmi) |
| **Tailwind CSS** | v3 | Utility-first styling |
| **Framer Motion** | Latest | Animations — tab transitions, modals, gauge |
| **GSAP** | Latest | Hero section animations |

---

## Infrastructure

| Technology | Role |
|---|---|
| **Tenderly Virtual Testnet** | Mainnet fork (Chain ID 9991) — realistic simulation without real funds |
| **DeFiLlama API** | TVL data for Lido, Aave, MakerDAO — free, no API key required |

---

## Developer Tooling

| Tool | Role |
|---|---|
| **TypeScript** | End-to-end type safety (contracts, scripts, frontend) |
| **ethers.js** | Used in Hardhat scripts |
| **dotenv** | Environment variable management |
| **ESLint** | Frontend linting |

---

## Why Chainlink CRE?

Traditional DeFi protection tools rely on:
- ❌ Centralized bots (single point of failure)
- ❌ Manual monitoring (human reaction time)
- ❌ Off-chain oracles with trust assumptions

Chainlink CRE provides:
- ✅ Decentralized compute — no central server
- ✅ Native Data Feed integration — verifiable price data
- ✅ On-chain execution — `eth-transaction` step writes directly to the contract
- ✅ Scheduled automation — cron trigger every 60 seconds
- ✅ Composable steps — HTTP + JavaScript + on-chain in one workflow
