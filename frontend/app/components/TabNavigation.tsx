"use client";
import { motion } from "framer-motion";

interface TabNavigationProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

const TABS = [
  { id: 0, label: "Home", icon: "🏠" },
  { id: 1, label: "Pools", icon: "💧" },
  { id: 2, label: "Deposit", icon: "💰" },
  { id: 3, label: "Portfolio", icon: "📊" },
];

export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-gray-900/60 backdrop-blur-xl p-2 rounded-3xl border border-gray-800/50 shadow-2xl relative overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <div className="relative flex gap-2">
          {TABS.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-900/50"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <motion.span
                  animate={
                    activeTab === tab.id
                      ? {
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.2, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.2,
                  }}
                >
                  {tab.icon}
                </motion.span>
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
