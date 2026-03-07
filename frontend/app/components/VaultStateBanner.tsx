"use client";
import { motion, AnimatePresence } from "framer-motion";
import { VAULT_STATES } from "@/lib/contract";

interface VaultStateBannerProps {
  vaultState: number;
}

export function VaultStateBanner({ vaultState }: VaultStateBannerProps) {
  const stateIndex = Number(vaultState ?? 0);
  const stateLabel = VAULT_STATES[stateIndex];

  const colors = {
    0: {
      bg: "from-green-900/20 to-emerald-900/10",
      border: "border-green-700/50",
      text: "text-green-400",
      icon: "🛡️",
      glow: "shadow-green-900/20"
    },
    1: {
      bg: "from-yellow-900/20 to-orange-900/10",
      border: "border-yellow-700/50",
      text: "text-yellow-400",
      icon: "⚠️",
      glow: "shadow-yellow-900/20"
    },
    2: {
      bg: "from-red-900/20 to-pink-900/10",
      border: "border-red-700/50",
      text: "text-red-400",
      icon: "🚨",
      glow: "shadow-red-900/20"
    },
  };

  const messages = {
    0: "Your funds are actively monitored and protected by autonomous risk detection.",
    1: "⚠️ Elevated risk detected. Your funds are being closely monitored.",
    2: "🚨 Emergency mode activated. Withdrawal protocols engaged for fund protection.",
  };

  const color = colors[stateIndex as keyof typeof colors] || colors[0];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stateIndex}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className={`bg-gradient-to-r ${color.bg} ${color.border} border rounded-3xl p-6 shadow-xl ${color.glow} relative overflow-hidden`}
      >
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ['0px 0px', '40px 40px'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </motion.div>

        <div className="relative flex items-start gap-5">
          <motion.div
            className={`text-4xl ${color.text}`}
            animate={
              stateIndex === 2
                ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }
                : {}
            }
            transition={{
              duration: 1,
              repeat: stateIndex === 2 ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {color.icon}
          </motion.div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <motion.h3
                className={`text-xl font-bold ${color.text}`}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Vault Status: {stateLabel}
              </motion.h3>
              <div className="flex gap-1.5">
                <motion.div
                  className={`w-2 h-2 rounded-full ${color.text.replace('text-', 'bg-')} animate-pulse`}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </div>
            <motion.p
              key={messages[stateIndex as keyof typeof messages]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-gray-300 leading-relaxed"
            >
              {messages[stateIndex as keyof typeof messages]}
            </motion.p>
          </div>

          {/* Status indicator ring */}
          <motion.div
            className={`w-16 h-16 rounded-full border-4 ${color.border} flex items-center justify-center`}
            animate={
              stateIndex === 2
                ? {
                    borderColor: [
                      'rgba(239, 68, 68, 0.3)',
                      'rgba(239, 68, 68, 0.8)',
                      'rgba(239, 68, 68, 0.3)',
                    ],
                  }
                : {}
            }
            transition={{ duration: 1, repeat: Infinity }}
          >
            <motion.div
              className={`w-8 h-8 rounded-full ${color.text.replace('text-', 'bg-')}`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
