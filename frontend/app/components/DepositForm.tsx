"use client";
import { useState } from "react";
import { useWriteContract, useReadContract, useAccount, useBalance } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { VAULT_ADDRESS, VAULT_ABI, ERC20_ABI, SUPPORTED_TOKENS } from "@/lib/contract";
import { motion } from "framer-motion";

interface DepositFormProps {
  preSelectedToken?: number;
}

export function DepositForm({ preSelectedToken }: DepositFormProps) {
  const { address } = useAccount();
  const [selectedIndex, setSelectedIndex] = useState(preSelectedToken ?? 0);
  const [amount, setAmount] = useState("1");
  const [approving, setApproving] = useState(false);

  const token = SUPPORTED_TOKENS[selectedIndex];

  const { writeContract, isPending } = useWriteContract();

  // Read vault balance for selected token
  const { data: vaultBalance } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "getUserBalance",
    args: [address as `0x${string}`, token.address],
    query: { enabled: !!address, refetchInterval: 5000 },
  });

  // Read native ETH wallet balance
  const { data: ethBalance } = useBalance({ address });

  // Read ERC20 wallet balance
  const { data: erc20Balance } = useReadContract({
    address: token.address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: { enabled: !!address && !token.isNative, refetchInterval: 5000 },
  });

  const walletDisplay = token.isNative
    ? `${ethBalance ? (Number(ethBalance.value) / 1e18).toFixed(4) : "0"} ETH`
    : `${erc20Balance ? formatUnits(erc20Balance as bigint, token.decimals) : "0"} ${token.symbol}`;

  const vaultDisplay = vaultBalance
    ? formatUnits(vaultBalance as bigint, token.decimals)
    : "0";

  async function handleDeposit() {
    if (!amount || isNaN(Number(amount))) return;
    const amt = parseUnits(amount, token.decimals);

    if (token.isNative) {
      writeContract({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "depositETH",
        value: amt,
      });
    } else {
      setApproving(true);
      writeContract({
        address: token.address,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [VAULT_ADDRESS, amt],
      });
      
      // For POC simplicity, assuming user confirms.
      // In production we would watch for the transaction receipt.
      setTimeout(() => {
        setApproving(false);
        writeContract({
          address: VAULT_ADDRESS,
          abi: VAULT_ABI,
          functionName: "depositERC20",
          args: [token.address, amt],
        });
      }, 5000);
    }
  }

  const isBtnDisabled = approving || isPending || !amount || Number(amount) <= 0;

  const buttonLabel = approving
    ? "Confirming Approval..."
    : isPending
    ? "Executing Deposit..."
    : `Deposit ${token.symbol}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#0a1518]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 space-y-10 relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Select Asset</span>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 rounded-full border border-emerald-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-500/50 font-bold uppercase tracking-widest">Live Network</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-12">
          {SUPPORTED_TOKENS.map((t, i) => (
            <button
              key={t.symbol}
              onClick={() => { setSelectedIndex(i); setAmount(t.isNative ? "1" : "100"); }}
              className={`py-4 rounded-2xl border transition-all duration-500 flex flex-col items-center gap-2 ${
                selectedIndex === i
                  ? "bg-emerald-500/10 border-emerald-500/30 text-white"
                  : "bg-white/5 border-white/5 text-gray-500 hover:bg-white/10"
              }`}
            >
              <span className="text-lg font-bold">{t.symbol}</span>
              <span className="text-[8px] uppercase tracking-widest font-bold opacity-50">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-8">
          <div className="relative">
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">
              <span>Amount</span>
              <span>Wallet: {walletDisplay}</span>
            </div>
            <div className="relative group">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/5 focus:border-emerald-500/30 rounded-2xl py-6 px-8 text-3xl font-bold text-white outline-none transition-all"
                placeholder="0.00"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2">
                <button 
                  onClick={() => setAmount("100")}
                  className="text-[10px] font-bold text-emerald-500/50 hover:text-emerald-500 uppercase tracking-widest transition-colors"
                >
                  Max
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <span className="text-gray-500">Vault Balance</span>
              <span className="text-white">{vaultDisplay} {token.symbol}</span>
            </div>
            <div className="w-full h-px bg-white/5" />
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <span className="text-gray-500">Protection Status</span>
              <span className="text-emerald-400">Active</span>
            </div>
          </div>

          <button
            onClick={handleDeposit}
            disabled={isBtnDisabled}
            className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all duration-500 ${
              isBtnDisabled
                ? "bg-white/5 text-gray-700 cursor-not-allowed"
                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
            }`}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
