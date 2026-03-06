"use client";
import { motion } from "framer-motion";

const features = [
  {
    icon: "📈",
    name: "ETH/USD Feed",
    desc: "Uses Chainlink Data Feeds to monitor price volatility and flash crashes in real-time.",
    weight: "30%"
  },
  {
    icon: "💧",
    name: "Lido Health",
    desc: "Tracks TVL drains in the largest ETH staking protocol to detect exit-liquidity panics.",
    weight: "25%"
  },
  {
    icon: "🏦",
    name: "Aave Markets",
    desc: "Monitors borrowing rates and liquidity spikes that precede large-scale liquidations.",
    weight: "25%"
  },
  {
    icon: "🛡️",
    name: "MakerDAO Stability",
    desc: "Detects systemic backing risks by monitoring TVL changes in the DAI engine.",
    weight: "20%"
  }
];

export function SystemicRiskFeatures() {
  return (
    <section className="py-16 bg-gray-950/20 rounded-[3rem] border border-gray-800/50 my-10 relative overflow-hidden backdrop-blur-sm">
      {/* Decorative SVG Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold text-white mb-3">Multi-Protocol Risk Engine</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The Chainlink CRE workflow continuously aggregates multiple on-chain health signals 
            to produce a verifiable safety verdict.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={f.name}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, borderColor: "rgba(59, 130, 246, 0.5)" }}
              className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 transition-all group relative"
            >
              <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">{f.icon}</div>
              <h4 className="text-xl font-bold text-white mb-3">{f.name}</h4>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed min-h-[60px]">{f.desc}</p>
              
              <div className="mt-auto pt-6 border-t border-gray-800/50 flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Signal Weight</span>
                <span className="text-sm font-mono font-bold text-blue-400 bg-blue-900/20 px-3 py-1 rounded-full">
                  {f.weight}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
