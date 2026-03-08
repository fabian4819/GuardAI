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
      className="bg-[#061012] p-10 hover:bg-[#0a1518] transition-colors group relative overflow-hidden"
    >
      <div className="relative z-10 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl font-bold text-white/20 group-hover:text-emerald-500/50 group-hover:border-emerald-500/30 transition-all duration-500">
            {token.symbol[0]}
          </div>
          <div>
            <h4 className="text-2xl font-bold text-white tracking-tight mb-1 group-hover:translate-x-1 transition-transform duration-500">{token.symbol}</h4>
            <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-bold">{token.label}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-3 mb-1">
            <span className={`text-3xl font-black tracking-tighter ${hasBalance ? "text-white" : "text-gray-800"}`}>
              {formatted}
            </span>
            <span className="text-gray-700 font-bold text-sm uppercase tracking-widest">{token.symbol}</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${hasBalance ? "bg-emerald-500 animate-pulse" : "bg-gray-800"}`} />
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Protected Assets</span>
          </div>
        </div>
      </div>

      {/* Subtle Hover Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_70%) opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}

export function Portfolio({ address }: { address: `0x${string}`; vaultState?: number }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 gap-px bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden">
        {SUPPORTED_TOKENS.map((token, i) => (
          <PortfolioRow key={token.symbol} address={address} token={token} />
        ))}
      </div>
    </div>
  );
}
