"use client";
import { useEffect, useRef, useState } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { motion } from "framer-motion";
import gsap from "gsap";
import { TabNavigation } from "./TabNavigation";

interface NavbarProps {
  activeTab?: number;
  setActiveTab?: (tab: number) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [mounted, setMounted] = useState(false);
  const navRef = useRef(null);

  useEffect(() => { 
    setMounted(true); 
  }, []);

  useEffect(() => {
    if (mounted) {
      gsap.fromTo(navRef.current, 
        { y: -100, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
      );
    }
  }, [mounted]);

  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
      <div className="w-full max-w-7xl flex justify-between items-center bg-gray-950/40 backdrop-blur-2xl border border-white/5 px-8 py-4 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] pointer-events-auto transition-all hover:border-white/10">
        <div className="flex items-center gap-12">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            </div>
            <span className="font-black text-xl tracking-tighter bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent uppercase">
              Vault Sentinel
            </span>
          </motion.div>

          {/* Inline Tab Navigation for a cleaner look */}
          {activeTab !== undefined && setActiveTab && (
            <div className="hidden md:block">
              <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} isCompact />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          {mounted && isConnected ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 pl-4 border-l border-white/10"
            >
              <div className="hidden sm:block text-right">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none mb-1 opacity-50">Secure</p>
                <p className="text-sm font-mono font-bold text-gray-300">{address?.slice(0, 4)}...{address?.slice(-4)}</p>
              </div>
              <button 
                onClick={() => disconnect()} 
                className="w-10 h-10 flex items-center justify-center rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20"
                title="Disconnect"
              >
                <span className="text-lg">○</span>
              </button>
            </motion.div>
          ) : mounted ? (
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,1)", color: "black" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => connect({ connector: injected() })}
              className="bg-white text-black px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl transition-all"
            >
              Connect
            </motion.button>
          ) : (
            <div className="w-32 h-10 bg-white/5 rounded-2xl animate-pulse" />
          )}
        </div>
      </div>
    </nav>
  );
}
