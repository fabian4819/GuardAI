# VaultSentinel Frontend Tabs Redesign

**Date:** March 7, 2026  
**Status:** Ready for Implementation  
**Context:** Hackathon demo improvement — transform single-page layout into tabbed navigation

---

## Understanding Summary

- **What:** Redesign VaultSentinel frontend into a 4-tab SPA
- **Why:** Improve navigation clarity for hackathon judges/demo viewers
- **Who:** Connected wallet users viewing the demo
- **Key Constraint:** Contract has a single vault with 3 supported tokens (ETH, USDC, stETH)
- **Stack:** Next.js 16, wagmi, viem, framer-motion, GSAP, Tailwind

---

## Tab Structure

### Tab 1 — Home
- Hero section with animations
- System introduction
- Live risk gauge
- SystemicRiskFeatures component

### Tab 2 — Pools
- Grid of 3 pool cards (one per token: ETH, USDC, stETH)
- Each card shows:
  - Token logo and name
  - TVL (mocked: $1.2M, $850K, $2.1M)
  - APY (mocked: 4.2%, 8.1%, 12.4%)
  - Risk level (derived from contract `lastRiskScore`)
  - "View Details" button
- Clicking a pool opens a modal with:
  - Detailed pool information
  - Risk breakdown
  - Historical performance (mocked)
  - "Go to Deposit" button → switches to Tab 3 with token pre-selected

### Tab 3 — Deposit
- Full-page focused deposit experience
- Existing DepositForm component (enhanced styling)
- Shows selected token from Pools tab if navigated from there
- Connect wallet gate if not connected

### Tab 4 — Portfolio
- User's deposited balances per token
- Vault state banner (🟢 ACTIVE / 🟡 GUARDED / 🔴 EMERGENCY)
- Protection status message based on vault state
- Real-time balance updates

---

## Assumptions

1. **TVL Data:** Mocked with realistic values (no on-chain aggregation)
2. **APY Data:** Static mocked values for demo purposes
3. **Risk per Pool:** Derived from global `lastRiskScore` with token-specific multipliers:
   - ETH: 0.8x (lower risk)
   - USDC: 1.0x (baseline)
   - stETH: 1.3x (higher risk)
4. **Routing:** Client-side state (`useState`) — no URL routing needed
5. **Responsive:** Optimized for desktop demo, but mobile-responsive
6. **Wallet Required:** Deposit tab shows connect wallet prompt if not connected

---

## Decision Log

| Decision | Choice | Alternatives Considered | Reason |
|---|---|---|---|
| **Navigation Type** | State-based tabs (`useState`) | Next.js routing, URL hash routing | Simplest for hackathon; avoids routing complexity |
| **Pool Structure** | Token-as-Pool | Separate pool contracts | Logical mapping for multi-asset vault |
| **Tab Transitions** | Framer Motion `AnimatePresence` | CSS transitions, no animation | High-polish feel for judges |
| **Pool Details Display** | Inline modal/drawer | Navigate to separate page | Keeps context before deposit flow |
| **Portfolio State Alert** | Banner with vault state | Silent display | Emphasizes security feature for demo |

---

## Components to Create

### 1. `TabNavigation.tsx`
- Segmented control with 4 tabs
- Active tab indicator with smooth animation
- Glassmorphism styling
- Props: `activeTab`, `setActiveTab`

### 2. `PoolsGrid.tsx`
- Grid layout (3 columns on desktop)
- Pool cards with hover effects
- Props: `onSelectPool` callback
- Displays TVL, APY, risk metrics

### 3. `PoolDetailModal.tsx`
- Modal overlay with backdrop
- Detailed pool information
- Risk breakdown visualization
- "Go to Deposit" CTA
- Props: `pool`, `isOpen`, `onClose`, `onDeposit`

### 4. `VaultStateBanner.tsx`
- Colored banner based on vault state
- Protection status message
- Icon + text + state indicator
- Props: `vaultState` (0/1/2)

---

## Components to Modify

### 1. `Navbar.tsx`
- Add `TabNavigation` component below logo/wallet
- Pass `activeTab` and `setActiveTab` props

### 2. `page.tsx`
- Add `activeTab` state (default: 0)
- Add `selectedToken` state for pool → deposit flow
- Wrap tab content in `AnimatePresence`
- Conditionally render components based on `activeTab`

### 3. `DepositForm.tsx`
- Accept `preSelectedToken` prop
- Initialize token selection if prop is provided
- Enhanced full-page styling for Tab 3

### 4. `Portfolio.tsx`
- Add `VaultStateBanner` at the top
- Enhanced layout for full-tab view

---

## Mock Data Structure

```typescript
export const POOL_DATA = [
  {
    token: SUPPORTED_TOKENS[0], // ETH
    tvl: "$1,200,000",
    apy: "4.2%",
    riskMultiplier: 0.8,
    description: "Native Ethereum with lowest risk profile",
    historicalApy: ["3.8%", "4.1%", "4.2%"],
  },
  {
    token: SUPPORTED_TOKENS[1], // USDC
    tvl: "$850,000",
    apy: "8.1%",
    riskMultiplier: 1.0,
    description: "Stablecoin pool with moderate returns",
    historicalApy: ["7.9%", "8.0%", "8.1%"],
  },
  {
    token: SUPPORTED_TOKENS[2], // stETH
    tvl: "$2,100,000",
    apy: "12.4%",
    riskMultiplier: 1.3,
    description: "Liquid staking with highest yields",
    historicalApy: ["11.8%", "12.1%", "12.4%"],
  },
];
```

---

## Implementation Order

1. Create `TabNavigation.tsx` component
2. Create `POOL_DATA` in `lib/contract.ts`
3. Create `PoolsGrid.tsx` component
4. Create `PoolDetailModal.tsx` component
5. Create `VaultStateBanner.tsx` component
6. Modify `Navbar.tsx` to include tabs
7. Modify `page.tsx` for tab switching logic
8. Modify `DepositForm.tsx` to accept pre-selected token
9. Modify `Portfolio.tsx` to include state banner
10. Test tab navigation flow
11. Polish animations and transitions

---

## Testing Checklist

- [ ] All 4 tabs render correctly
- [ ] Tab transitions are smooth
- [ ] Pool modal opens/closes properly
- [ ] Clicking pool → modal → deposit flow works
- [ ] Deposit form pre-fills token from pool selection
- [ ] Portfolio shows vault state banner correctly
- [ ] Wallet connection gate works on Deposit tab
- [ ] Mobile responsive (basic)
- [ ] All animations perform smoothly

---

## Non-Goals

- ❌ Real TVL/APY data from contract
- ❌ URL-based routing
- ❌ Pool filtering/sorting
- ❌ Historical charts (beyond mocked data)
- ❌ Admin controls in tabs (keep in separate section)

---

## Exit Criteria

✅ Design validated  
✅ Assumptions documented  
✅ Decision log complete  
✅ Implementation plan created  
✅ Component breakdown finalized

**Status:** Ready for implementation handoff.
