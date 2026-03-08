"use client";
import { motion } from "framer-motion";

const features = [
  {
    name: "ETH/USD Feed",
    desc: "Uses Chainlink Data Feeds to monitor price volatility and flash crashes in real-time.",
    weight: "30%"
  },
  {
    name: "Lido Health",
    desc: "Tracks TVL drains in the largest ETH staking protocol to detect exit-liquidity panics.",
    weight: "25%"
  },
  {
    name: "Aave Markets",
    desc: "Monitors borrowing rates and liquidity spikes that precede large-scale liquidations.",
    weight: "25%"
  },
  {
    name: "MakerDAO Stability",
    desc: "Detects systemic backing risks by monitoring TVL changes in the DAI engine.",
    weight: "20%"
  }
];

export function SystemicRiskFeatures() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.3em] mb-4 block">Engine Architecture</span>
          <h3 className="text-4xl font-bold text-white mb-4 tracking-tight">Multi-Protocol Risk Monitoring</h3>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Verifiable health signals aggregated via Chainlink CRE workflows.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div 
              key={f.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0a1518]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <h4 className="text-xl font-bold text-white tracking-tight">{f.name}</h4>
                <span className="text-[10px] font-mono font-bold text-emerald-500/50 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                  WEIGHT: {f.weight}
                </span>
              </div>
              <p className="text-gray-500 leading-relaxed text-sm">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
