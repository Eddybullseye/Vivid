import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, Mail } from 'lucide-react';

export default function NewsletterWidget() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  // Submit state triggers for loading spinner -> checkmark tick
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessAnimated, setIsSuccessAnimated] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!email) {
      setErrorText('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorText('Please enter a valid email address.');
      return;
    }

    // Trigger loading spinner
    setIsSubmitting(true);
    
    setTimeout(() => {
      // Transition to checkmark tick after 1.2s
      setIsSubmitting(false);
      setIsSuccessAnimated(true);
      
      setTimeout(() => {
        // Finally complete enrollment and reset
        setIsSubscribed(true);
        setIsSuccessAnimated(false);
        setEmail('');
      }, 800);
    }, 1200);
  };

  const headlineWords = "JOIN THE VIVID CIRCLE".split(" ");

  return (
    <section id="newsletter-section" className="bg-[#181818] border-t border-b border-[#e84b1f]/20 py-16 relative overflow-hidden">
      {/* Slow moving noise texture overlay for immersive film grain depth */}
      <div className="noise-overlay" />

      {/* Background abstract layout elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft radial orange/yellow vibe */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#e84b1f]/5 to-[#f5c842]/3 rounded-full filter blur-[80px] opacity-70" />
        
        {/* Abstract fine-line decorative layout */}
        <svg className="absolute -left-12 -top-12 w-48 h-48 text-[#f5f0e8]/5" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" />
          <line x1="10" y1="10" x2="90" y2="90" stroke="currentColor" strokeWidth="0.25" />
        </svg>
        
        <svg className="absolute -right-16 -bottom-16 w-64 h-64 text-[#e84b1f]/5" viewBox="0 0 100 100" fill="none">
          <rect x="10" y="10" width="80" height="80" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <AnimatePresence mode="wait">
          {!isSubscribed ? (
            <motion.div
              key="signup-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="mx-auto w-12 h-12 rounded-xl bg-[#e84b1f]/10 border border-[#e84b1f]/35 flex items-center justify-center text-[#e84b1f]">
                <Mail size={20} />
              </div>

              <div className="space-y-2">
                <span className="font-mono text-xs text-[#e84b1f] tracking-[0.3em] uppercase font-bold block">
                  Stay in the Loop
                </span>
                {/* Headline splits word by word and enters with a staggered bounce */}
                <h3 className="font-bebas text-4xl sm:text-5xl text-[#f5f0e8] tracking-widest uppercase font-bold flex flex-wrap justify-center gap-x-3 gap-y-1">
                  {headlineWords.map((word, wIdx) => (
                    <motion.span
                      key={wIdx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{
                        type: "spring",
                        stiffness: 240,
                        damping: 18,
                        delay: wIdx * 0.03,
                      }}
                      className={`inline-block transition-all duration-300 ${word === 'VIVID' ? 'text-[#e84b1f] glow-text-red' : 'hover-glow-cream'}`}
                    >
                      {word}
                    </motion.span>
                  ))}
                </h3>
                <p className="font-sans text-sm sm:text-base text-[#f5f0e8]/70 max-w-lg mx-auto">
                  Sign up to receive our raw unfiltered lifestyle critiques, high-fidelity sound reviews, design chronicles, and global travel directives straight to your visual scanner.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="max-w-md mx-auto pt-4 relative">
                {/* Input container styled with pulse-focus class for single red ring focus pulse */}
                <div className="flex flex-row items-stretch border border-[#f5f0e8]/25 hover:border-[#e84b1f]/50 transition-all bg-black pulse-focus rounded-2xl overflow-hidden p-1 shadow-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorText('');
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onMouseEnter={() => setIsFocused(true)}
                    onMouseLeave={() => setIsFocused(false)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-black text-[#f5f0e8] placeholder-[#f5f0e8]/30 text-xs py-4 px-4 focus:outline-none font-mono uppercase border-none rounded-xl w-full"
                  />
                  {/* Button shows rotating loading spinner or checkmark tick or standard text */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || isSuccessAnimated}
                    animate={isFocused ? {
                      scale: [1, 1.05, 1],
                    } : { scale: 1 }}
                    transition={isFocused ? {
                      repeat: Infinity,
                      duration: 1.2,
                      ease: "easeInOut"
                    } : { duration: 0.2 }}
                    className="bg-[#e84b1f] hover:bg-[#f5c842] text-white hover:text-[#0d0d0d] font-bebas text-xs tracking-widest px-6 transition-all duration-300 uppercase shrink-0 flex items-center justify-center select-none font-bold rounded-xl relative overflow-hidden min-w-[124px]"
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div
                          key="loading animate"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        </motion.div>
                      ) : isSuccessAnimated ? (
                        <motion.div
                          key="success-tick animate"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1.1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 220, damping: 12 }}
                          className="text-[#f5c842] flex items-center space-x-1 animate-pulse"
                        >
                          <span>✔</span>
                          <span className="font-bebas text-[10px]">TICK</span>
                        </motion.div>
                      ) : (
                        <motion.span
                          key="text content animate"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          SUBSCRIBE
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
                {errorText && (
                  <span className="absolute -bottom-5 left-0 font-mono text-[10px] text-[#e84b1f]">
                    {errorText}
                  </span>
                )}
              </form>

              <div className="overflow-hidden pt-2">
                <motion.p
                  initial={{ y: '100%', opacity: 0 }}
                  whileInView={{ y: '0%', opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                  className="font-mono text-[10px] text-[#f5f0e8]/40 tracking-wider uppercase"
                >
                  Join 48,000+ readers. No telemetry or unsolicited noise.
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 py-6"
            >
              <div className="mx-auto w-12 h-12 bg-[#f5c842]/10 border border-[#f5c842]/35 flex items-center justify-center text-[#f5c842] rounded-xl shadow">
                <CheckCircle2 size={24} className="animate-bounce" />
              </div>
              <h4 className="font-bebas text-3xl text-[#f5f0e8] tracking-widest uppercase">
                WELCOME TO VIVID COHORT
              </h4>
              <p className="font-serif-display text-base text-[#f5c842] italic max-w-md mx-auto leading-relaxed">
                "Our editorial issue Nº 05 is entering final print drafts. It will reach your visual scanner momentarily."
              </p>
              <button
                onClick={() => setIsSubscribed(false)}
                className="font-mono text-[10px] text-[#f5f0e8]/30 uppercase hover:text-[#e84b1f] tracking-wider transition-colors pt-4 block mx-auto underline"
              >
                Enroll another email address
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
