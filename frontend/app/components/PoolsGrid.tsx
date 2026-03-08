"use client";
import { motion } from "framer-motion";
import { POOL_DATA } from "@/lib/contract";

interface PoolsGridProps {
  onSelectPool: (poolIndex: number) => void;
  riskScore: number;
}

export function PoolsGrid({ onSelectPool, riskScore }: PoolsGridProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POOL_DATA.map((pool, index) => {
          const calculatedRisk = Math.min(100, Math.round(riskScore * pool.riskMultiplier));
          
          return (
            <motion.div
              key={pool.token.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-[#0a1518]/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 overflow-hidden hover:border-emerald-500/20 transition-all duration-500">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight mb-1">
                        {pool.token.symbol}
                      </h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        {pool.token.label}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${calculatedRisk < 30 ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5" : calculatedRisk < 70 ? "border-yellow-500/20 text-yellow-400 bg-yellow-500/5" : "border-red-500/20 text-red-400 bg-red-500/5"}`}>
                      Risk: {calculatedRisk}%
                    </div>
                  </div>

                  <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Target APY</span>
                      <span className="text-xl font-bold text-white">{pool.apy}%</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">TVL</span>
                      <span className="text-xl font-bold text-white">{pool.tvl}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onSelectPool(index)}
                    className="w-full py-4 bg-white/5 hover:bg-emerald-500/10 text-white hover:text-emerald-400 border border-white/5 hover:border-emerald-500/20 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-500"
                  >
                    Select Pool
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
