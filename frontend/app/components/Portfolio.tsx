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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-[#0a1518]/40 backdrop-blur-xl p-6 hover:bg-[#0a1518]/60 transition-all duration-500 group border-b border-white/5 last:border-0"
    >
      <div className="relative z-10 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-sm font-bold text-white/30 group-hover:text-emerald-500/50 group-hover:border-emerald-500/20 transition-all duration-500">
            {token.symbol[0]}
          </div>
          <div>
            <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors duration-500">{token.symbol}</h4>
            <p className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">{token.label}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-0.5">
            <span className={`text-xl font-bold tracking-tight ${hasBalance ? "text-white" : "text-gray-700"}`}>
              {formatted}
            </span>
            <span className="text-gray-600 font-bold text-[10px] uppercase tracking-widest">{token.symbol}</span>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <div className={`w-1 h-1 rounded-full ${hasBalance ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-gray-800"}`} />
            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Protected</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Portfolio({ address }: { address: `0x${string}`; vaultState?: number }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#0a1518]/20 rounded-3xl border border-white/5 overflow-hidden">
        <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Asset Allocation</span>
          <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.2em]">Live Updates</span>
        </div>
        <div>
          {SUPPORTED_TOKENS.map((token) => (
            <PortfolioRow key={token.symbol} address={address} token={token} />
          ))}
        </div>
      </div>
    </div>
  );
}
