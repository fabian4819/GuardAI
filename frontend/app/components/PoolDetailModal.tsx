"use client";
import { motion, AnimatePresence } from "framer-motion";
import { POOL_DATA } from "@/lib/contract";

interface PoolDetailModalProps {
  poolIndex: number | null;
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (poolIndex: number) => void;
  riskScore: number;
}

export function PoolDetailModal({
  poolIndex,
  isOpen,
  onClose,
  onDeposit,
  riskScore,
}: PoolDetailModalProps) {
  if (poolIndex === null) return null;

  const pool = POOL_DATA[poolIndex];
  const calculatedRisk = Math.min(100, Math.round(riskScore * pool.riskMultiplier));
  const riskColor =
    calculatedRisk < 30 ? "text-green-400" : calculatedRisk < 70 ? "text-yellow-400" : "text-red-400";
  const riskBg =
    calculatedRisk < 30 ? "bg-green-900/20" : calculatedRisk < 70 ? "bg-yellow-900/20" : "bg-red-900/20";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors flex items-center justify-center text-gray-400 hover:text-white"
              >
                ✕
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">{pool.icon}</div>
                <div>
                  <h2 className="text-3xl font-black text-white mb-1">
                    {pool.token.symbol} Pool
                  </h2>
                  <p className="text-gray-500 text-sm uppercase tracking-wider">
                    {pool.token.label}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-base leading-relaxed mb-6">
                {pool.description}
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                    Total Value Locked
                  </p>
                  <p className="text-2xl font-bold text-white">{pool.tvl}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                    Annual Yield
                  </p>
                  <p className="text-2xl font-bold text-green-400">{pool.apy}</p>
                </div>
                <div className={`${riskBg} rounded-xl p-4 text-center`}>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
                    Risk Score
                  </p>
                  <p className={`text-2xl font-bold ${riskColor}`}>
                    {calculatedRisk}/100
                  </p>
                </div>
              </div>

              {/* Risk Breakdown */}
              <div className="bg-gray-800/30 rounded-2xl p-5 mb-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Risk Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Base Systemic Risk</span>
                    <span className="text-sm font-mono text-white">{riskScore}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Pool Risk Multiplier</span>
                    <span className="text-sm font-mono text-white">{pool.riskMultiplier}x</span>
                  </div>
                  <div className="h-px bg-gray-700 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-300">
                      Adjusted Pool Risk
                    </span>
                    <span className={`text-sm font-mono font-bold ${riskColor}`}>
                      {calculatedRisk}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Historical Performance */}
              <div className="bg-gray-800/30 rounded-2xl p-5 mb-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Historical APY (Last 3 Months)
                </h3>
                <div className="flex gap-2">
                  {pool.historicalApy.map((apy, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gray-700/50 rounded-xl p-3 text-center"
                    >
                      <p className="text-xs text-gray-500 mb-1">Month {index + 1}</p>
                      <p className="text-base font-bold text-green-400">{apy}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  onDeposit(poolIndex);
                  onClose();
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-900/50 hover:shadow-blue-900/70"
              >
                Go to Deposit →
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
