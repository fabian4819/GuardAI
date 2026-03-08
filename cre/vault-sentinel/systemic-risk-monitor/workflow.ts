import {
	ConsensusAggregationByFields,
	type CronPayload,
	cre,
	getNetwork,
	identical,
	median,
	type Runtime,
} from '@chainlink/cre-sdk'
import { encodeFunctionData, type Hex } from 'viem'
import { z } from 'zod'

// ─── Config Schema ─────────────────────────────────────────────────────────────
export const configSchema = z.object({
	schedule: z.string(),
	vaultSentinelAddress: z.string(),
	chainName: z.string(),
	gasLimit: z.string(),
	riskThreshold: z.number(),
	ethPriceFeedAddress: z.string(),
	priceBaseline: z.number(),
	lidoTvlBaseline: z.number(),
	aaveTvlBaseline: z.number(),
	makerTvlBaseline: z.number(),
})

export type Config = z.infer<typeof configSchema>

// ─── DeFiLlama Response Type ───────────────────────────────────────────────────
interface DefiLlamaProtocol {
	currentChainTvls?: Record<string, number>
	tvl?: number
}

// ─── Risk Breakdown Type ───────────────────────────────────────────────────────
export interface RiskBreakdown {
	riskScore: number
	ethPrice: number
	priceScore: number
	lidoTvlB: string
	lidoScore: number
	aaveTvlB: string
	aaveScore: number
	makerTvlB: string
	makerScore: number
}

// ─── HTTP Fetch Helpers ────────────────────────────────────────────────────────

export const fetchEthPrice = (
	sendRequester: import('@chainlink/cre-sdk').HTTPSendRequester,
	_config: Config,
): { ethPrice: number } => {
	const resp = sendRequester
		.sendRequest({
			method: 'GET',
			url: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
		})
		.result()

	if (resp.statusCode !== 200) {
		throw new Error(`ETH price fetch failed: ${resp.statusCode}`)
	}

	const text = Buffer.from(resp.body).toString('utf-8')
	const parsed = JSON.parse(text)
	const price = parsed?.ethereum?.usd

	if (typeof price !== 'number') {
		throw new Error(`Invalid ETH price response: ${text}`)
	}

	return { ethPrice: price }
}

export const fetchLidoTvl = (
	sendRequester: import('@chainlink/cre-sdk').HTTPSendRequester,
	_config: Config,
): { lidoTvl: number } => {
	const resp = sendRequester
		.sendRequest({ method: 'GET', url: 'https://api.llama.fi/protocol/lido' })
		.result()

	if (resp.statusCode !== 200) {
		throw new Error(`Lido TVL fetch failed: ${resp.statusCode}`)
	}

	const body: DefiLlamaProtocol = JSON.parse(Buffer.from(resp.body).toString('utf-8'))
	return { lidoTvl: body.currentChainTvls?.Ethereum ?? body.tvl ?? 0 }
}

export const fetchAaveTvl = (
	sendRequester: import('@chainlink/cre-sdk').HTTPSendRequester,
	_config: Config,
): { aaveTvl: number } => {
	const resp = sendRequester
		.sendRequest({ method: 'GET', url: 'https://api.llama.fi/protocol/aave' })
		.result()

	if (resp.statusCode !== 200) {
		throw new Error(`Aave TVL fetch failed: ${resp.statusCode}`)
	}

	const body: DefiLlamaProtocol = JSON.parse(Buffer.from(resp.body).toString('utf-8'))
	return { aaveTvl: body.currentChainTvls?.Ethereum ?? body.tvl ?? 0 }
}

export const fetchMakerTvl = (
	sendRequester: import('@chainlink/cre-sdk').HTTPSendRequester,
	_config: Config,
): { makerTvl: number } => {
	const resp = sendRequester
		.sendRequest({ method: 'GET', url: 'https://api.llama.fi/protocol/makerdao' })
		.result()

	if (resp.statusCode !== 200) {
		throw new Error(`MakerDAO TVL fetch failed: ${resp.statusCode}`)
	}

	const body: DefiLlamaProtocol = JSON.parse(Buffer.from(resp.body).toString('utf-8'))
	return { makerTvl: body.currentChainTvls?.Ethereum ?? body.tvl ?? 0 }
}

// ─── Risk Score Computation ────────────────────────────────────────────────────

export const computeRiskScore = (
	ethPrice: number,
	lidoTvl: number,
	aaveTvl: number,
	makerTvl: number,
	config: Config,
): RiskBreakdown => {
	const priceDrop = Math.max(0, (config.priceBaseline - ethPrice) / config.priceBaseline * 100)
	const priceScore = Math.min(100, priceDrop * 2.5)

	const lidoDrop = Math.max(0, (config.lidoTvlBaseline - lidoTvl) / config.lidoTvlBaseline * 100)
	const lidoScore = Math.min(100, lidoDrop * 2)

	const aaveDrop = Math.max(0, (config.aaveTvlBaseline - aaveTvl) / config.aaveTvlBaseline * 100)
	const aaveScore = Math.min(100, aaveDrop * 2)

	const makerDrop = Math.max(0, (config.makerTvlBaseline - makerTvl) / config.makerTvlBaseline * 100)
	const makerScore = Math.min(100, makerDrop * 2)

	const riskScore = Math.round(
		priceScore * 0.30 +
		lidoScore  * 0.25 +
		aaveScore  * 0.25 +
		makerScore * 0.20,
	)

	return {
		riskScore,
		ethPrice,
		priceScore:  Math.round(priceScore),
		lidoTvlB:    (lidoTvl  / 1e9).toFixed(2),
		lidoScore:   Math.round(lidoScore),
		aaveTvlB:    (aaveTvl  / 1e9).toFixed(2),
		aaveScore:   Math.round(aaveScore),
		makerTvlB:   (makerTvl / 1e9).toFixed(2),
		makerScore:  Math.round(makerScore),
	}
}

// ─── On-chain Write via HTTP JSON-RPC (Tenderly VNet) ─────────────────────────
// CRE SDK EVMClient only supports writeReport (Chainlink Data Feeds Cache).
// For setRiskScore we call Tenderly VNet directly via eth_sendTransaction.

const VAULT_SENTINEL_ABI = [
	{
		name: 'setRiskScore',
		type: 'function' as const,
		stateMutability: 'nonpayable',
		inputs: [{ name: 'score', type: 'uint256' }],
		outputs: [],
	},
]

export const encodeSetRiskScore = (score: number): Hex =>
	encodeFunctionData({
		abi: VAULT_SENTINEL_ABI,
		functionName: 'setRiskScore',
		args: [BigInt(score)],
	})

export const writeRiskScoreViaRpc = (
	sendRequester: import('@chainlink/cre-sdk').HTTPSendRequester,
	config: Config,
	score: number,
): { txHash: string } => {
	const calldata = encodeSetRiskScore(score)
	const rpcUrl = 'https://virtual.mainnet.eu.rpc.tenderly.co/b495c5e3-b6bf-4275-a9a7-8b45fe92ac40'

	const reqBody = JSON.stringify({
		jsonrpc: '2.0',
		id: 1,
		method: 'eth_sendTransaction',
		params: [{
			from: '0xdfcDBf41Eb7150592F6495F921891bc5e11A94d2',
			to: config.vaultSentinelAddress,
			data: calldata,
			gas: '0x' + parseInt(config.gasLimit, 10).toString(16),
		}],
	})

	const resp = sendRequester
		.sendRequest({
			method: 'POST',
			url: rpcUrl,
			headers: { 'Content-Type': 'application/json' },
			body: Buffer.from(reqBody).toString('base64'),
		})
		.result()

	const text = Buffer.from(resp.body).toString('utf-8')

	if (resp.statusCode !== 200) {
		throw new Error(`RPC request failed (${resp.statusCode}): ${text}`)
	}

	const json = JSON.parse(text)

	if (json.error) {
		throw new Error(`eth_sendTransaction error: ${JSON.stringify(json.error)}`)
	}

	return { txHash: json.result ?? '0x0' }
}

// ─── Main Workflow Logic ───────────────────────────────────────────────────────

const doRiskMonitor = (runtime: Runtime<Config>): string => {
	const http = new cre.capabilities.HTTPClient()

	// 1. Fetch ETH price (CoinGecko — free API, no key needed)
	const { ethPrice } = http
		.sendRequest(
			runtime,
			fetchEthPrice,
			ConsensusAggregationByFields<{ ethPrice: number }>({ ethPrice: median }),
		)(runtime.config)
		.result()

	// 2. Fetch Lido TVL
	const { lidoTvl } = http
		.sendRequest(
			runtime,
			fetchLidoTvl,
			ConsensusAggregationByFields<{ lidoTvl: number }>({ lidoTvl: median }),
		)(runtime.config)
		.result()

	// 3. Fetch Aave TVL
	const { aaveTvl } = http
		.sendRequest(
			runtime,
			fetchAaveTvl,
			ConsensusAggregationByFields<{ aaveTvl: number }>({ aaveTvl: median }),
		)(runtime.config)
		.result()

	// 4. Fetch MakerDAO TVL
	const { makerTvl } = http
		.sendRequest(
			runtime,
			fetchMakerTvl,
			ConsensusAggregationByFields<{ makerTvl: number }>({ makerTvl: median }),
		)(runtime.config)
		.result()

	// 5. Compute Systemic Risk Index
	const breakdown = computeRiskScore(ethPrice, lidoTvl, aaveTvl, makerTvl, runtime.config)
	const { riskScore } = breakdown

	// 6. Log breakdown
	runtime.log(`[VaultSentinel] ═══ SYSTEMIC RISK INDEX ═══`)
	runtime.log(`  SCORE       : ${riskScore}/100 ${riskScore >= runtime.config.riskThreshold ? '⚠️  EMERGENCY!' : '✅ SAFE'}`)
	runtime.log(`  ETH Price   : $${breakdown.ethPrice.toFixed(2)} → priceScore: ${breakdown.priceScore}`)
	runtime.log(`  Lido TVL    : $${breakdown.lidoTvlB}B → lidoScore:  ${breakdown.lidoScore}`)
	runtime.log(`  Aave TVL    : $${breakdown.aaveTvlB}B → aaveScore:  ${breakdown.aaveScore}`)
	runtime.log(`  MakerDAO    : $${breakdown.makerTvlB}B → makerScore: ${breakdown.makerScore}`)

	if (riskScore >= runtime.config.riskThreshold) {
		runtime.log(`  🚨 THRESHOLD BREACHED — setRiskScore(${riskScore}) will trigger emergency!`)
	}

	// 7. Write score on-chain
	const { txHash } = http
		.sendRequest(
			runtime,
			writeRiskScoreViaRpc,
			ConsensusAggregationByFields<{ txHash: string }>({ txHash: identical }),
		)(runtime.config, riskScore)
		.result()

	runtime.log(`✅ setRiskScore(${riskScore}) → txHash: ${txHash}`)

	return JSON.stringify(breakdown)
}

export const onCronTrigger = (runtime: Runtime<Config>, payload: CronPayload): string => {
	if (!payload.scheduledExecutionTime) {
		throw new Error('scheduledExecutionTime is required')
	}
	runtime.log(`[VaultSentinel] CronTrigger fired`)
	return doRiskMonitor(runtime)
}

export function initWorkflow(config: Config) {
	const cronTrigger = new cre.capabilities.CronCapability()
	return [
		cre.handler(
			cronTrigger.trigger({ schedule: config.schedule }),
			onCronTrigger,
		),
	]
}
