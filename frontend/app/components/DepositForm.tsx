"use client";
import { useState } from "react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { parseEther } from "viem";
import { VAULT_ADDRESS, VAULT_ABI, TOKEN_ADDRESS, TOKEN_ABI } from "@/lib/contract";

export function DepositForm() {
  const [amount, setAmount] = useState("100");
  const { address } = useAccount();
  const { writeContract: approve, isPending: isApproving } = useWriteContract();
  const { writeContract: deposit, isPending: isDepositing } = useWriteContract();

  const { data: balance } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "getUserBalance",
    args: [address as `0x${string}`],
    query: { enabled: !!address, refetchInterval: 5000 },
  });

  async function handleDeposit() {
    const amt = parseEther(amount);
    // First approve token spend
    approve({
      address: TOKEN_ADDRESS,
      abi: TOKEN_ABI,
      functionName: "approve",
      args: [VAULT_ADDRESS, amt],
    });
    // For a real app, you would wait for the approval tx to be mined.
    // In this POC, we use a simple timeout for the user to confirm the second tx.
    setTimeout(() => {
      deposit({
        address: VAULT_ADDRESS,
        abi: VAULT_ABI,
        functionName: "deposit",
        args: [amt],
      });
    }, 5000);
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 space-y-3">
      <h3 className="text-white font-semibold">Deposit Funds</h3>
      <p className="text-gray-400 text-sm">
        Your vault balance: {balance ? (Number(balance) / 1e18).toFixed(2) : "0"} mUSD
      </p>
      <div className="flex gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm"
          placeholder="Amount (mUSD)"
        />
        <button
          onClick={handleDeposit}
          disabled={isApproving || isDepositing}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          {isApproving ? "Approving..." : isDepositing ? "Depositing..." : "Deposit"}
        </button>
      </div>
    </div>
  );
}
