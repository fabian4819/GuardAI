"use client";
import { useReadContract, useAccount } from "wagmi";
import { VAULT_ADDRESS, VAULT_ABI } from "@/lib/contract";
import { RiskGauge } from "./components/RiskGauge";
import { DepositForm } from "./components/DepositForm";
import { ActionPanel } from "./components/ActionPanel";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { SystemicRiskFeatures } from "./components/SystemicRiskFeatures";
import { HowItWorks } from "./components/HowItWorks";
import { Portfolio } from "./components/Portfolio";
import { PoolsGrid } from "./components/PoolsGrid";
import { PoolDetailModal } from "./components/PoolDetailModal";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPoolIndex, setSelectedPoolIndex] = useState<number | null>(null);
  const [preSelectedToken, setPreSelectedToken] = useState<number | undefined>(undefined);

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

  const handlePoolSelect = (poolIndex: number) => {
    setSelectedPoolIndex(poolIndex);
  };

  const handleDepositFromPool = (poolIndex: number) => {
    setPreSelectedToken(poolIndex);
    setActiveTab(2); // Switch to Deposit tab
  };

  useEffect(() => {
    document.title = "GuardAI | Autonomous Risk Protection";
  }, []);

  return (
    <div className="min-h-screen bg-[#020204] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_50%,rgba(168,85,247,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,rgba(236,72,153,0.05),transparent_50%)]" />
      </div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="relative pt-0 pb-0">
        <AnimatePresence mode="wait">
          {/* Tab 0: Home */}
          {activeTab === 0 && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Hero />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mt-0">
                  <RiskGauge score={score} />
                </div>
                <div className="mt-0">
                  <SystemicRiskFeatures />
                </div>
                <HowItWorks />
              </div>
            </motion.div>
          )}

          {/* Tab 1: Pools */}
          {activeTab === 1 && (
            <motion.div
              key="pools"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24"
            >
              <div className="text-center mb-20">
                <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.4em] mb-4 block">Available Assets</span>
                <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6">Protection Pools</h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                  Choose from our autonomously monitored pools, each protected by real-time systemic risk analysis.
                </p>
              </div>
              <PoolsGrid onSelectPool={handlePoolSelect} riskScore={score} />
            </motion.div>
          )}

          {/* Tab 2: Deposit */}
          {activeTab === 2 && (
            <motion.div
              key="deposit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24"
            >
              <div className="text-center mb-16">
                <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.4em] mb-4 block">Secure Entry</span>
                <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6">Secure Your Assets</h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Deposit funds into autonomously monitored protection pools.
                </p>
              </div>
              
              {isConnected && address ? (
                <DepositForm preSelectedToken={preSelectedToken} />
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-[#0a1518]/40 backdrop-blur-xl border border-white/5 rounded-3xl p-12 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Connect Wallet Required</h3>
                  <p className="text-gray-500 mb-8">
                    Please connect your wallet to deposit funds.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Tab 3: Portfolio */}
          {activeTab === 3 && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24"
            >
              <div className="text-center mb-16">
                <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.4em] mb-4 block">Asset Overview</span>
                <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6">Your Portfolio</h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Track your protected assets and vault status in real-time.
                </p>
              </div>

              {isConnected && address ? (
                <Portfolio address={address} vaultState={stateIndex} />
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="max-w-2xl mx-auto bg-[#0a1518]/40 backdrop-blur-xl border border-white/5 rounded-3xl p-12 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">👛</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">No Wallet Connected</h3>
                  <p className="text-gray-500">
                    Connect your wallet to view your portfolio.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Pool Detail Modal */}
      <PoolDetailModal
        poolIndex={selectedPoolIndex}
        isOpen={selectedPoolIndex !== null}
        onClose={() => setSelectedPoolIndex(null)}
        onDeposit={handleDepositFromPool}
        riskScore={score}
      />

      <footer className="relative py-12 overflow-hidden">
        {/* Top Border Gradient */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 bg-emerald-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          {/* Logo Section */}
          <div className="mb-12">
            <span className="text-2xl font-black text-white tracking-tighter uppercase">
              Guard<span className="text-emerald-500">AI</span>
            </span>
            <p className="text-gray-500 text-sm mt-4 max-w-xs mx-auto leading-relaxed">
              Engineering a trustless failsafe for the decentralized future.
            </p>
          </div>

          {/* Navigation */}
          <nav className="mb-16">
            <ul className="flex items-center justify-center gap-12">
              {['Pools', 'Deposit', 'Portfolio'].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-[10px] font-bold text-gray-400 hover:text-emerald-400 uppercase tracking-[0.3em] transition-all duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Bar */}
          <div className="flex flex-col items-center gap-6">
            <div className="w-12 h-px bg-white/5" />
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
              © 2026 GuardAI
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
