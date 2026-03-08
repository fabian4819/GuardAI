import { describe, expect } from 'bun:test'
import { newTestRuntime, test } from '@chainlink/cre-sdk/test'
import {
	computeRiskScore,
	encodeSetRiskScore,
	fetchAaveTvl,
	fetchEthPrice,
	fetchLidoTvl,
	fetchMakerTvl,
	initWorkflow,
	onCronTrigger,
	type Config,
} from './workflow'

// ─── Shared test config ────────────────────────────────────────────────────────
const TEST_CONFIG: Config = {
	schedule: '*/60 * * * * *',
	vaultSentinelAddress: '0xd5474D48fb3DB3CF012D4D3fAad8bf3aE409E450',
	chainName: 'ethereum-mainnet',
	gasLimit: '500000',
	riskThreshold: 70,
	ethPriceFeedAddress: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
	priceBaseline: 3500,
	lidoTvlBaseline: 10_000_000_000,
	aaveTvlBaseline: 8_000_000_000,
	makerTvlBaseline: 6_000_000_000,
}

// ─── Helper: create a mock Response ───────────────────────────────────────────
const mockResponse = (body: object, statusCode = 200) => ({
	statusCode,
	body: new TextEncoder().encode(JSON.stringify(body)),
	headers: {},
})

// ─── computeRiskScore ─────────────────────────────────────────────────────────
describe('computeRiskScore', () => {
	test('returns score 0 when markets are healthy (above baseline)', () => {
		const result = computeRiskScore(4000, 12e9, 10e9, 8e9, TEST_CONFIG)
		expect(result.riskScore).toBe(0)
		expect(result.priceScore).toBe(0)
		expect(result.lidoScore).toBe(0)
	})

	test('returns score 100 when ETH crashes to 0 and all TVL drained', () => {
		const result = computeRiskScore(0, 0, 0, 0, TEST_CONFIG)
		expect(result.riskScore).toBe(100)
	})

	test('computes correct weighted score for partial crash', () => {
		// ETH drops 40% from baseline → priceDrop=40 → priceScore=min(100, 100)=100 * 0.30 = 30
		// All TVLs at baseline → other scores = 0
		const result = computeRiskScore(2100, 10e9, 8e9, 6e9, TEST_CONFIG)
		expect(result.priceScore).toBe(100)
		expect(result.lidoScore).toBe(0)
		expect(result.riskScore).toBe(30) // 100*0.30 only
	})

	test('triggers emergency threshold at score >= 70', () => {
		// Full price crash + some TVL drain
		const result = computeRiskScore(0, 5e9, 4e9, 3e9, TEST_CONFIG)
		expect(result.riskScore).toBeGreaterThanOrEqual(70)
	})

	test('formats TVL values as billions string', () => {
		const result = computeRiskScore(3500, 10e9, 8e9, 6e9, TEST_CONFIG)
		expect(result.lidoTvlB).toBe('10.00')
		expect(result.aaveTvlB).toBe('8.00')
		expect(result.makerTvlB).toBe('6.00')
	})
})

// ─── encodeSetRiskScore ───────────────────────────────────────────────────────
describe('encodeSetRiskScore', () => {
	test('returns valid hex calldata for setRiskScore(42)', () => {
		const calldata = encodeSetRiskScore(42)
		expect(calldata).toMatch(/^0x/)
		// 4 bytes selector + 32 bytes uint256 = 36 bytes = 72 hex chars + 0x prefix
		expect(calldata.length).toBe(74)
	})

	test('encodes score 0 correctly', () => {
		const calldata = encodeSetRiskScore(0)
		expect(calldata).toMatch(/^0x/)
		expect(calldata.length).toBe(74)
	})
})

// ─── fetchEthPrice (with HTTP mock) ──────────────────────────────────────────
describe('fetchEthPrice', () => {
	test('parses CoinGecko response correctly', () => {
		const fakeRequester = {
			sendRequest: (_req: any) => ({
				result: () => mockResponse({ ethereum: { usd: 2800 } }),
			}),
		} as any
		const result = fetchEthPrice(fakeRequester, TEST_CONFIG)
		expect(result.ethPrice).toBe(2800)
	})

	test('throws on non-200 response', () => {
		const fakeRequester = {
			sendRequest: (_req: any) => ({
				result: () => ({ statusCode: 503, body: new Uint8Array(), headers: {} }),
			}),
		} as any
		expect(() => fetchEthPrice(fakeRequester, TEST_CONFIG)).toThrow('ETH price fetch failed: 503')
	})
})

// ─── fetchLidoTvl ─────────────────────────────────────────────────────────────
describe('fetchLidoTvl', () => {
	test('reads Ethereum TVL from currentChainTvls', () => {
		const fakeRequester = {
			sendRequest: (_req: any) => ({
				result: () => mockResponse({ currentChainTvls: { Ethereum: 9_500_000_000 } }),
			}),
		} as any
		const result = fetchLidoTvl(fakeRequester, TEST_CONFIG)
		expect(result.lidoTvl).toBe(9_500_000_000)
	})

	test('falls back to tvl field if currentChainTvls missing', () => {
		const fakeRequester = {
			sendRequest: (_req: any) => ({
				result: () => mockResponse({ tvl: 8_000_000_000 }),
			}),
		} as any
		const result = fetchLidoTvl(fakeRequester, TEST_CONFIG)
		expect(result.lidoTvl).toBe(8_000_000_000)
	})

	test('returns 0 if both fields missing', () => {
		const fakeRequester = {
			sendRequest: (_req: any) => ({
				result: () => mockResponse({}),
			}),
		} as any
		const result = fetchLidoTvl(fakeRequester, TEST_CONFIG)
		expect(result.lidoTvl).toBe(0)
	})
})

// ─── fetchAaveTvl / fetchMakerTvl ─────────────────────────────────────────────
describe('fetchAaveTvl', () => {
	test('reads Aave Ethereum TVL', () => {
		const fakeRequester = {
			sendRequest: (_req: any) => ({
				result: () => mockResponse({ currentChainTvls: { Ethereum: 7_200_000_000 } }),
			}),
		} as any
		const result = fetchAaveTvl(fakeRequester, TEST_CONFIG)
		expect(result.aaveTvl).toBe(7_200_000_000)
	})
})

describe('fetchMakerTvl', () => {
	test('reads MakerDAO Ethereum TVL', () => {
		const fakeRequester = {
			sendRequest: (_req: any) => ({
				result: () => mockResponse({ currentChainTvls: { Ethereum: 5_000_000_000 } }),
			}),
		} as any
		const result = fetchMakerTvl(fakeRequester, TEST_CONFIG)
		expect(result.makerTvl).toBe(5_000_000_000)
	})
})

// ─── onCronTrigger ────────────────────────────────────────────────────────────
describe('onCronTrigger', () => {
	test('throws when scheduledExecutionTime is missing', () => {
		const runtime = newTestRuntime() as any
		expect(() => onCronTrigger(runtime, {} as any)).toThrow('scheduledExecutionTime is required')
	})
})

// ─── initWorkflow ─────────────────────────────────────────────────────────────
describe('initWorkflow', () => {
	test('registers one handler for cron trigger with correct schedule', () => {
		const handlers = initWorkflow(TEST_CONFIG)
		expect(handlers).toHaveLength(1)
		expect(handlers[0].fn).toBe(onCronTrigger)
		const trigger = handlers[0].trigger as { config?: { schedule?: string } }
		expect(trigger.config?.schedule).toBe(TEST_CONFIG.schedule)
	})
})
