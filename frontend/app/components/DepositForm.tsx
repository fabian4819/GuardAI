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
      className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl border border-gray-800/50 rounded-4xl p-8 space-y-6 relative overflow-hidden"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative">
        <div className="flex justify-between items-center px-2 mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-widest">
              Add Protection
            </h3>
            <p className="text-xs text-gray-500 mt-1">Secure your assets with automated risk monitoring</p>
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] text-gray-600 font-mono bg-gray-800/50 px-3 py-1 rounded-full"
          >
            {token.symbol} Position
          </motion.div>
        </div>

        {/* Token Selector Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex p-2 bg-black/40 rounded-3xl border border-gray-800/50 mb-6"
        >
          {SUPPORTED_TOKENS.map((t, i) => (
            <motion.button
              key={t.symbol}
              onClick={() => { setSelectedIndex(i); setAmount(t.isNative ? "1" : "100"); }}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all relative overflow-hidden ${
                i === selectedIndex
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {i === selectedIndex && (
                <motion.div
                  layoutId="activeToken"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{t.symbol}</span>
            </motion.button>
          ))}
        </motion.div>

        <div className="space-y-5">
          {/* Input Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-black/40 to-black/20 border border-gray-800/50 rounded-3xl p-6 transition-all focus-within:border-blue-600/50 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative">
              <div className="flex justify-between text-[10px] uppercase font-bold text-gray-600 mb-3">
                <span>Deposit Amount</span>
                <motion.span
                  key={walletDisplay}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-blue-400"
                >
                  Wallet: {walletDisplay}
                </motion.span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  step={token.isNative ? "0.1" : "10"}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent text-2xl font-mono text-white outline-none placeholder:text-gray-800"
                  placeholder="0.00"
                />
                <motion.span
                  key={token.symbol}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-gray-400 font-bold text-lg"
                >
                  {token.symbol}
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* Vault Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/10"
          >
            <span className="text-[10px] uppercase font-bold text-gray-500">Current Position</span>
            <motion.span
              key={vaultDisplay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-mono font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              {vaultDisplay} {token.symbol}
            </motion.span>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={handleDeposit}
            disabled={isBtnDisabled}
            className={`w-full py-5 rounded-3xl font-bold text-lg transition-all relative overflow-hidden group ${
              isBtnDisabled
                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-900/40 hover:shadow-2xl hover:shadow-blue-900/60"
            }`}
            whileHover={!isBtnDisabled ? { scale: 1.02 } : {}}
            whileTap={!isBtnDisabled ? { scale: 0.98 } : {}}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {buttonLabel}
              {!isBtnDisabled && (
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              )}
            </span>
            {!isBtnDisabled && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.button>

          {!token.isNative && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="px-4 text-center"
            >
              <p className="text-xs text-gray-500 leading-relaxed">
                Whitelisted ERC20 deposit requires approval for the{" "}
                <span className="text-blue-400 font-mono">{VAULT_ADDRESS.slice(0, 8)}...</span>{" "}
                contract.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
