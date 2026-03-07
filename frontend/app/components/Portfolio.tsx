"use client";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { VAULT_ADDRESS, VAULT_ABI, SUPPORTED_TOKENS } from "@/lib/contract";
import { VaultStateBanner } from "./VaultStateBanner";
import { motion } from "framer-motion";

function PortfolioRow({ address, token }: { address: `0x${string}`; token: typeof SUPPORTED_TOKENS[number] }) {
  const { data: balance } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "getUserBalance",
    args: [address, token.address],
    query: { refetchInterval: 5000 },
  });
  const formatted = balance ? formatUnits(balance as bigint, token.decimals) : "0";
  const hasBalance = balance && Number(balance) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex justify-between items-center px-6 py-4 rounded-2xl border transition-all ${
        hasBalance
          ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-800/30 shadow-lg shadow-blue-900/10"
          : "bg-gray-900/30 border-gray-800/50 opacity-60"
      }`}
      whileHover={hasBalance ? { scale: 1.02, x: 5 } : {}}
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-xl font-bold"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          {token.symbol[0]}
        </motion.div>
        <div>
          <p className="text-base font-bold text-white">{token.symbol}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{token.label}</p>
        </div>
      </div>
      <div className="text-right">
        <motion.p
          key={formatted}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-lg font-mono font-bold ${hasBalance ? "bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" : "text-gray-600"}`}
        >
          {formatted}
        </motion.p>
        <p className="text-[10px] text-gray-600 uppercase tracking-wider">Balance</p>
      </div>
    </motion.div>
  );
}

export function Portfolio({ address, vaultState }: { address: `0x${string}`; vaultState?: number }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {vaultState !== undefined && <VaultStateBanner vaultState={vaultState} />}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 space-y-4 relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-widest">
                Your Portfolio
              </h3>
              <p className="text-xs text-gray-500 mt-1">Real-time balance updates</p>
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-[10px] text-blue-500 font-bold uppercase">Live</p>
            </motion.div>
          </div>
          
          <div className="space-y-3">
            {SUPPORTED_TOKENS.map((token, index) => (
              <motion.div
                key={token.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <PortfolioRow key={token.symbol} address={address} token={token} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
