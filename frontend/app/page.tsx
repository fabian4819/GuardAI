"use client";
import { useReadContract, useAccount } from "wagmi";
import { VAULT_ADDRESS, VAULT_ABI, VAULT_STATES } from "@/lib/contract";
import { RiskGauge } from "./components/RiskGauge";
import { DepositForm } from "./components/DepositForm";
import { ActionPanel } from "./components/ActionPanel";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { SystemicRiskFeatures } from "./components/SystemicRiskFeatures";
import { Portfolio } from "./components/Portfolio";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { address, isConnected } = useAccount();

  const { data: vaultState } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "vaultState",
    query: { refetchInterval: 3000 },
  });

  const { data: riskScore } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "lastRiskScore",
    query: { refetchInterval: 5000 },
  });

  const stateIndex = Number(vaultState ?? 0);
  const score = Number(riskScore ?? 0);

  return (
    <div className="min-h-screen bg-[#020204] text-white selection:bg-blue-500/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <Hero />

        <div id="dashboard" className="scroll-mt-20 pt-10 pb-32">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Security Dashboard</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
              Autonomous monitoring engine tracking systemic DeFi fragility.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Risk & Status (8 Cols) */}
            <div className="lg:col-span-12 xl:col-span-8 space-y-8">
              
              {/* Main Risk Gauge Card */}
              <motion.div 
                layout
                className="bg-[#0a0a0f] shadow-2xl rounded-[3rem] border border-gray-800/60 p-10 relative overflow-hidden group backdrop-blur-xl"
              >
                {/* Decorative element */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-all duration-700" />
                
                <div className="relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">System Intelligence Live</p>
                      </div>
                      <h3 className="text-3xl font-black tracking-tight">Systemic Risk Index</h3>
                    </div>
                    
                    <motion.div 
                      layout
                      className={`px-6 py-2.5 rounded-full text-xs font-black border tracking-widest uppercase transition-all duration-500
                        ${stateIndex === 0 ? "bg-green-500/5 border-green-500/30 text-green-400" :
                          stateIndex === 1 ? "bg-yellow-500/5 border-yellow-500/30 text-yellow-400" :
                          "bg-red-500/10 border-red-500/40 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]"}`}
                    >
                      {VAULT_STATES[stateIndex]}
                    </motion.div>
                  </div>

                  <div className="max-w-2xl mx-auto py-4">
                    <RiskGauge score={score} />
                  </div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16 border-t border-gray-800/50 pt-10"
                  >
                    <div>
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Signal Integrity</p>
                      <ul className="space-y-3 text-sm text-gray-500 font-medium">
                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" /> Chainlink Data Orchestration</li>
                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" /> Multi-Protocol TVL Analytics</li>
                      </ul>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800/50">
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 text-right sm:text-left">Network Metadata</p>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                          <span className="text-[10px] text-gray-500 font-bold uppercase">Chain</span>
                          <span className="text-xs text-gray-300 font-mono">Tenderly 9991</span>
                        </div>
                        <div className="flex justify-between items-center bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                          <span className="text-[10px] text-gray-500 font-bold uppercase">Auth</span>
                          <span className="text-xs text-gray-300 font-mono">CRE Workflow</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <AnimatePresence>
                {stateIndex === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, height: 0 }}
                    animate={{ opacity: 1, scale: 1, height: 'auto' }}
                    exit={{ opacity: 0, scale: 0.9, height: 0 }}
                    className="bg-red-500/10 border border-red-500/30 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-[0_0_40px_rgba(239,68,68,0.1)] overflow-hidden"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center text-3xl shrink-0 animate-pulse">
                      🚨
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-red-500 mb-1 uppercase tracking-tight">Systemic Liquidation Triggered</h4>
                      <p className="text-sm text-red-400/80 leading-relaxed font-medium">
                        The composite risk score crossed the safety threshold. All positions were automatically closed and assets were routed to your secure address.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <SystemicRiskFeatures />
            </div>

            {/* Right Column: Portfolio & Deposit (4 Cols) */}
            <div className="lg:col-span-12 xl:col-span-4 space-y-8">
              {mounted && isConnected && address ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-8 sticky top-24"
                >
                  <Portfolio address={address} />
                  <DepositForm />
                  <ActionPanel vaultState={stateIndex} />
                </motion.div>
              ) : (
                <div className="bg-[#0a0a0f] border border-gray-800/60 rounded-[3rem] p-12 text-center space-y-6 backdrop-blur-xl">
                  <motion.div 
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-7xl"
                  >
                    ⚡
                  </motion.div>
                  <h4 className="text-2xl font-black tracking-tight">Unlock Access</h4>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Connect your wallet to join the first automated systemic risk protection network.
                  </p>
                  <div className="pt-4">
                    <div className="w-full h-12 bg-blue-600 rounded-2xl animate-pulse opacity-50" />
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800/40 py-20 mt-20 relative bg-black/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-3 mb-8">
            <span className="text-3xl grayscale brightness-150">🛡️</span>
            <span className="font-extrabold text-xl text-gray-400 tracking-tighter uppercase font-mono">Vault Sentinel</span>
          </div>
          <p className="text-sm text-gray-600 mb-10 max-w-md mx-auto leading-relaxed font-medium">
            Engineering a trustless failsafe for the DeFi ecosystem.<br />
            Prototype build — Chainlink Convergence 2026.
          </p>
          <div className="flex justify-center flex-wrap gap-8 text-[10px] text-gray-700 uppercase font-black tracking-[0.2em]">
            <span className="text-gray-800">© 2026 Sentinel Lab</span>
            <a href="#" className="hover:text-blue-500 transition-all border-b border-transparent hover:border-blue-500/50">Source Code</a>
            <a href="#" className="hover:text-blue-500 transition-all border-b border-transparent hover:border-blue-500/50">Documentation</a>
            <a href="#" className="hover:text-blue-500 transition-all border-b border-transparent hover:border-blue-500/50">Audit Report</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
