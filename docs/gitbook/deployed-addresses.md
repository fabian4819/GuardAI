# Deployed Addresses

All contracts are deployed on **Tenderly Virtual Testnet** — a mainnet fork for realistic simulation.

---

## Network Details

| Field | Value |
|---|---|
| Network | Tenderly Virtual Testnet (Ethereum Mainnet Fork) |
| Chain ID | `9991` |
| RPC URL | `https://virtual.mainnet.eu.rpc.tenderly.co/a0f307c2-5f8b-4bdd-94ec-9736d1bceeb6` |
| Explorer | [Tenderly Dashboard](https://dashboard.tenderly.co) |

---

## Contract Addresses

| Contract | Address |
|---|---|
| **VaultSentinel** | `0x0fD8E63a78b53B7b470763832521ddc20DA80e6f` |
| **Mock USDC** | `0x87BaB170C4292c965bfeCAD0014D073a404c369E` |
| **Mock stETH** | `0x009a5d466d1cefC40484a4f9c7334f605E5B26e7` |

---

## Deployment Config

```json
{
  "vaultSentinel": "0x0fD8E63a78b53B7b470763832521ddc20DA80e6f",
  "mockUSDC": "0x87BaB170C4292c965bfeCAD0014D073a404c369E",
  "mockStETH": "0x009a5d466d1cefC40484a4f9c7334f605E5B26e7",
  "network": "tenderly-mainnet-fork",
  "chainId": 9991,
  "deployer": "0xdfcDBf41Eb7150592F6495F921891bc5e11A94d2"
}
```

Saved to `deployment.json` at project root. The frontend reads this file dynamically — no hardcoded addresses.

---

## Add to MetaMask

| Field | Value |
|---|---|
| Network Name | Tenderly Mainnet Fork |
| RPC URL | `https://virtual.mainnet.eu.rpc.tenderly.co/a0f307c2-5f8b-4bdd-94ec-9736d1bceeb6` |
| Chain ID | `9991` |
| Currency Symbol | `ETH` |

---

## Chainlink Data Feed Used

| Feed | Address | Network |
|---|---|---|
| ETH / USD | `0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419` | Ethereum Mainnet |

> The CRE workflow reads this feed on mainnet and writes the computed score to the Tenderly fork via `eth-transaction` step.
