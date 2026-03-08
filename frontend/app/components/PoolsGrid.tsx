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
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm text-blue-400 font-semibold">Live Pools</span>
        </motion.div>
        <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Investment Pools
          </span>
        </h2>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto font-light">
          Choose from our autonomously monitored pools, each protected by real-time systemic risk analysis.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {POOL_DATA.map((pool, index) => {
          const calculatedRisk = Math.min(100, Math.round(riskScore * pool.riskMultiplier));
          const riskColor =
            calculatedRisk < 30
              ? "from-green-400 to-emerald-400"
              : calculatedRisk < 70
              ? "from-yellow-400 to-orange-400"
              : "from-red-400 to-pink-400";
          
          const riskBg =
            calculatedRisk < 30
              ? "bg-green-500/10"
              : calculatedRisk < 70
              ? "bg-yellow-500/10"
              : "bg-red-500/10";

          return (
            <motion.div
              key={pool.token.symbol}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -12 }}
              className="group relative"
            >
              {/* Glow Effect */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Card */}
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-[1.8rem] p-8 overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
                </div>

                <div className="relative">
                  {/* Title */}
                  <motion.div
                    className="mb-6"
                    whileHover={{ x: 5 }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {pool.token.symbol}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      {pool.token.label}
                    </p>
                  </motion.div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <motion.div
                      className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-4 border border-white/5"
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className="text-[10px] text-gray-500 uppercase font-semibold mb-2">
                        TVL
                      </p>
                      <p className="text-xl font-bold text-white">{pool.tvl}</p>
                    </motion.div>
                    <motion.div
                      className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-2xl p-4 border border-green-500/10"
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className="text-[10px] text-gray-500 uppercase font-semibold mb-2">
                        APY
                      </p>
                      <p className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        {pool.apy}
                      </p>
                    </motion.div>
                  </div>

                  {/* Risk Score */}
                  <div className={`${riskBg} rounded-2xl p-4 mb-6 border border-white/5`}>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[10px] text-gray-500 uppercase font-semibold">
                        Risk Level
                      </p>
                      <p className={`text-sm font-bold bg-gradient-to-r ${riskColor} bg-clip-text text-transparent`}>
                        {calculatedRisk}/100
                      </p>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${calculatedRisk}%` }}
                        transition={{ delay: index * 0.15 + 0.5, duration: 1, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${riskColor} relative overflow-hidden`}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.button
                    onClick={() => onSelectPool(index)}
                    className="w-full group/btn relative overflow-hidden rounded-2xl font-bold text-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover/btn:from-blue-500 group-hover/btn:to-purple-500" />
                    <div className="relative z-10 flex items-center justify-center gap-2 py-4 text-white">
                      <span>View Details</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
