"use client";
import { motion, AnimatePresence } from "framer-motion";

export function RiskGauge({ score }: { score: number }) {
  const percentage = Math.min(100, Math.max(0, score));

  // Determine color based on risk score
  const getBarColor = () => {
    if (percentage >= 70) return "bg-red-500 shadow-[0_0_25px_rgba(239,68,68,0.6)]";
    if (percentage >= 40) return "bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]";
    return "bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]";
  };

  const getTextColor = () => {
    if (percentage >= 70) return "text-red-500";
    if (percentage >= 40) return "text-yellow-500";
    return "text-blue-500";
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-end">
        <div className="flex items-baseline gap-1">
          <motion.span 
            key={score}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-7xl font-black font-mono tracking-tighter ${getTextColor()}`}
          >
            {percentage}
          </motion.span>
          <span className="text-gray-600 font-black text-2xl">/100</span>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] leading-none mb-2">Live Risk Rating</p>
          <AnimatePresence mode="wait">
            <motion.span 
              key={percentage >= 70 ? "red" : percentage >= 40 ? "yellow" : "blue"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className={`text-sm font-black uppercase tracking-widest px-3 py-1 rounded border ${getTextColor()} ${percentage >= 70 ? "border-red-500/50" : percentage >= 40 ? "border-yellow-500/50" : "border-blue-500/50"}`}
            >
              {percentage >= 70 ? "Critical Danger" : percentage >= 40 ? "Elevated Alert" : "Stable Health"}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative h-6 w-full bg-gray-950 rounded-full overflow-hidden border border-gray-800 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute top-0 left-0 h-full rounded-full transition-colors duration-500 ${getBarColor()}`}
        >
          {/* Animated Sheen */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
          />
        </motion.div>
        
        {/* Threshold Mark */}
        <div className="absolute top-0 left-[70%] h-full w-[2px] bg-red-500/50 z-10 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
        <div className="absolute top-0 right-0 h-full w-[30%] bg-red-500/5 z-0" />
      </div>

      <div className="flex justify-between px-1">
        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Safe Ops</span>
        <div className="flex items-center gap-2">
           <motion.div 
             animate={{ opacity: [0.3, 1, 0.3] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="w-2 h-2 rounded-full bg-blue-500" 
           />
           <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Auto-Sweep Threshold: 70</span>
        </div>
        <span className="text-[10px] font-black text-red-900 uppercase tracking-widest">System Failure</span>
      </div>
    </div>
  );
}
