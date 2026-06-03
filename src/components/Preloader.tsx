import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
  key?: string;
}

const CONSTANT_PHRASES = [
  'DECONSTRUCTING MODERN HABITS',
  'LOADING ACOUSTIC VINYL SOUNDSCAPES',
  'SYNCHRONIZING SHIBUYA JOURNAL FILES',
  'CURATING SLOW ANALOG CONTEMPLATION'
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [step, setStep] = useState<'drawing' | 'holding' | 'splitting' | 'done'>('drawing');
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    // Phase 1 (0ms - 1500ms -> accelerated to 0ms - 100ms): Draw Logo Line layout
    const tHolding = setTimeout(() => {
      setStep('holding');
    }, 100);

    // Phase 2 (100ms - 180ms): Hold logo fully drawn
    const tSplitting = setTimeout(() => {
      setStep('splitting');
    }, 180);

    // Phase 3 (180ms - 400ms): Split curtains and fade out logo
    const tComplete = setTimeout(() => {
      setStep('done');
      onComplete();
    }, 400);

    // Rapid phrase cycler for brutalist high-frequency telemetry
    const wordInterval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % CONSTANT_PHRASES.length);
    }, 120);

    return () => {
      clearTimeout(tHolding);
      clearTimeout(tSplitting);
      clearTimeout(tComplete);
      clearInterval(wordInterval);
    };
  }, [onComplete]);

  // Click anywhere to immediately skip the loader sequence and land home safely
  const handleImmediateSkip = () => {
    setStep('done');
    onComplete();
  };

  if (step === 'done') return null;

  return (
    <div
      onClick={handleImmediateSkip}
      className="fixed inset-0 z-[9999] overflow-hidden select-none cursor-pointer"
    >
      {/* 🎬 SPLIT CURTAINS */}
      
      {/* Left Curtain */}
      <motion.div
        initial={{ x: '0%' }}
        animate={step === 'splitting' ? { x: '-100%' } : { x: '0%' }}
        transition={{
          duration: 0.6,
          ease: [0.76, 0, 0.24, 1] // Master vertical split curve specified in guide
        }}
        className="absolute top-0 left-0 w-1/2 h-full bg-[#0d0d0d] border-r border-[#e84b1f]/15"
      />

      {/* Right Curtain */}
      <motion.div
        initial={{ x: '0%' }}
        animate={step === 'splitting' ? { x: '100%' } : { x: '0%' }}
        transition={{
          duration: 0.6,
          ease: [0.76, 0, 0.24, 1]
        }}
        className="absolute top-0 right-0 w-1/2 h-full bg-[#0d0d0d] border-l border-[#e84b1f]/15"
      />

      {/* 🤖 CENTERED LOGO AND TELEMETRY GRID */}
      <div className="absolute inset-0 flex flex-col justify-between items-center p-8 sm:p-12 z-20 pointer-events-none">
        
        {/* Top telemetry bar */}
        <div className="w-full flex justify-between items-start text-left">
          <div className="font-mono text-[9px] text-[#f5f0e8]/30 tracking-[0.2em] leading-relaxed">
            <span>COHORT TRANSITION // VIVID SYSTEM INGESTION</span>
            <br />
            <span className="text-[#e84b1f] font-bold">● ACTIVE LINK ESTABLISHED</span>
          </div>
          <div className="font-mono text-[9px] text-[#f5c842]/45 tracking-[0.18em] text-right">
            <span>PRESS ANYWHERE TO SKIP INTRO</span>
            <br />
            <span>LAT. 6.42° N // LONG. 3.42° E</span>
          </div>
        </div>

        {/* Center Animated Logo Unit */}
        <AnimatePresence>
          {step !== 'splitting' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 1 }}
              exit={{ 
                scale: 1.5, 
                opacity: 0,
                transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
              }}
              className="flex flex-col items-center justify-center space-y-8 max-w-lg w-full text-center"
            >
              {/* Grand SVG Stroke Drawing Logo */}
              <div className="relative w-full max-w-sm px-6 filter drop-shadow-[0_0_15px_rgba(232,75,31,0.1)]">
                <svg 
                  viewBox="0 0 400 100" 
                  className="w-full text-[#f5f0e8] stroke-current fill-none font-bebas"
                >
                  {/* Letter V */}
                  <motion.path
                    d="M 20,20 L 60,80 L 100,20"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  />
                  {/* Letter I */}
                  <motion.path
                    d="M 130,20 L 130,80"
                    strokeWidth="7"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1], delay: 0.02 }}
                  />
                  {/* Letter V */}
                  <motion.path
                    d="M 160,20 L 200,80 L 240,20"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
                  />
                  {/* Letter I */}
                  <motion.path
                    d="M 270,20 L 270,80"
                    strokeWidth="7"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
                  />
                  {/* Letter D */}
                  <motion.path
                    d="M 300,20 L 300,80 C 355,80 355,20 300,20"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                  />
                  {/* Animated Vermillion dot */}
                  <motion.circle
                    cx="375"
                    cy="80"
                    r="6.5"
                    fill="#e84b1f"
                    stroke="#e84b1f"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 120, delay: 0.15 }}
                  />
                </svg>
              </div>

              {/* Shifting Brutalist telemetry lines */}
              <div className="space-y-2">
                <div className="h-4 overflow-hidden relative">
                  <motion.p
                    key={phraseIndex}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="font-mono text-[9px] text-[#f5c842] tracking-[0.2em] uppercase font-bold"
                  >
                    // {CONSTANT_PHRASES[phraseIndex]}
                  </motion.p>
                </div>

                <div className="flex justify-center items-center space-x-1 font-mono text-[8px] text-[#f5f0e8]/30 tracking-widest uppercase">
                  <span>SECURE CONNECTING</span>
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer branding details */}
        <div className="w-full flex justify-between items-center text-[8px] font-mono text-[#f5f0e8]/20 uppercase tracking-[0.3em] pt-4 border-t border-white/5">
          <span>EST. 2026 // VIVID CULTURAL DIVISION</span>
          <span>LAGOS &middot; ABUJA &middot; PORT HARCOURT</span>
        </div>
      </div>
    </div>
  );
}
