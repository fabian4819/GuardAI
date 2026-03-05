"use client";
import { useWriteContract } from "wagmi";
import { VAULT_ADDRESS, VAULT_ABI } from "@/lib/contract";

export function ActionPanel({ vaultState }: { vaultState: number }) {
  const { writeContract, isPending } = useWriteContract();

  function handleManualEmergency() {
    writeContract({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "triggerEmergency",
    });
  }

  function handleResetVault() {
    writeContract({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "resetVault",
    });
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 space-y-3">
      <h3 className="text-white font-semibold">Manual Actions</h3>
      <div className="flex gap-2">
        <button
          onClick={handleManualEmergency}
          disabled={isPending || vaultState === 2}
          className="flex-1 bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          🚨 Trigger Emergency
        </button>
        <button
          onClick={handleResetVault}
          disabled={isPending || vaultState !== 2}
          className="flex-1 bg-green-700 hover:bg-green-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          ♻️ Reset Vault
        </button>
      </div>
      <p className="text-gray-500 text-xs">
        Emergency returns all user funds automatically. Reset re-opens the vault.
      </p>
    </div>
  );
}
