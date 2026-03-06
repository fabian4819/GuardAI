"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";

export function Hero() {
  const containerRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const { scrollY } = useScroll();

  // Parallax effects
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating blobs animation
      gsap.to(blob1Ref.current, {
        x: '+=50',
        y: '+=30',
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      gsap.to(blob2Ref.current, {
        x: '-=40',
        y: '-=60',
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Split text-like entrance
      gsap.from(".hero-title", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.2
      });
      
      gsap.from(".hero-p", {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.5,
        ease: "power3.out"
      });

      gsap.from(".hero-btn", {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        delay: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative pt-32 pb-24 overflow-hidden min-h-[80vh] flex flex-col justify-center">
      {/* Background Blobs with GSAP & Framer Parallax */}
      <motion.div 
        ref={blob1Ref}
        style={{ y: y1 }}
        className="absolute top-20 -left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20" 
      />
      <motion.div 
        ref={blob2Ref}
        style={{ y: y2 }}
        className="absolute bottom-0 -right-10 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20" 
      />
      
      <motion.div style={{ opacity }} className="relative max-w-5xl mx-auto px-4 text-center">
        <h2 className="hero-title text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
          Systemic DeFi Protection <br className="hidden md:block" /> Powered by Chainlink
        </h2>
        
        <p className="hero-p text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          The first self-custodial vault that monitors live protocol health across the ecosystem. 
          When systemic risk spikes, your assets are automatically returned to your wallet.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6">
          <motion.a 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="#dashboard" 
            className="hero-btn px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-2xl shadow-blue-600/30 transition-all"
          >
            Launch Sentinel
          </motion.a>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.98 }}
            className="hero-btn px-10 py-4 bg-transparent text-white rounded-2xl font-bold transition-all border border-gray-700 backdrop-blur-sm"
          >
            Explore Ecosystem
          </motion.button>
        </div>
      </motion.div>

      {/* Hero Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Scroll to Monitor</span>
        <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
