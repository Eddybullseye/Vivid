import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { MapPin, Calendar, Compass, Coffee, Heart, CheckCircle2, X } from 'lucide-react';

interface AboutSectionProps {
  onSubscribe: () => void;
}

export default function AboutSection({ onSubscribe }: AboutSectionProps) {
  const [showStory, setShowStory] = useState(false);
  
  // Parallax Scroll logic for Image Box
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Slow parallax offset (moves at 0.5x scroll speed)
  const yParallaxImage = useTransform(scrollYProgress, [0, 1], [-45, 45]);

  return (
    <section ref={sectionRef} className="bg-[#000] border-b border-[#e84b1f]/20 py-20 px-6 relative overflow-hidden">
      {/* Abstract and geometric shapes to add depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large faint translucent rotating geometric layout */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-20 -top-20 w-[450px] h-[450px] border border-[#f5f0e8]/5 rounded-full flex items-center justify-center"
        >
          <div className="w-[350px] h-[350px] border border-dashed border-[#e84b1f]/5 rounded-full flex items-center justify-center">
            <div className="w-[250px] h-[250px] border border-dotted border-[#f5f0e8]/5 rounded-full" />
          </div>
        </motion.div>

        {/* Subtle, soft visual warmth */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#e84b1f]/5 to-transparent filter blur-[140px] opacity-40" />
        
        {/* Elegant architectural vertical/horizontal hairline grid lines */}
        <div className="absolute left-[8%] top-0 bottom-0 w-px bg-[#f5f0e8]/5" />
        <div className="absolute right-[8%] top-0 bottom-0 w-px bg-[#f5f0e8]/5" />
        <div className="absolute top-12 left-0 right-0 h-px bg-[#e84b1f]/10" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Tall dark blue-gradient image box with caption bar */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-md lg:max-w-full h-[480px] sm:h-[580px] border border-[#f5f0e8]/15 bg-gradient-to-br from-[#0a192f]/40 to-[#0c0d12] overflow-hidden rounded-3xl shadow-2xl group">
            
            {/* Dark contrast illustration background with 0.5x Parallax Scroll speed effect */}
            <motion.img
              style={{ y: yParallaxImage }}
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200"
              alt="Zara Adeyemi VIVID founder"
              referrerPolicy="no-referrer"
              className="absolute -inset-y-12 inset-x-0 w-full h-[calc(100%+96px)] object-cover filter grayscale contrast-125 brightness-[0.35] group-hover:scale-105 transition-transform duration-1000 object-center"
            />
            
            {/* Deep elegant dark blue gradient overlay to give that custom dark blue-gradient hue */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 via-[#0d1b2a]/65 to-[#000814]/40" />

            {/* Faint "ME" watermark overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <span className="font-bebas text-[28vw] lg:text-[14vw] tracking-wider text-white/5 uppercase select-none font-black">
                ME
              </span>
            </div>

            {/* Highlight Corners */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#e84b1f]/50" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#e84b1f]/50" />

            {/* Bottom Caption bar slides in from left (translateX(-100%) to translateY(0)) when in view */}
            <motion.div 
              initial={{ x: '-100%' }}
              whileInView={{ x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 inset-x-0 bg-[#e84b1f] py-4.5 px-6 flex items-center justify-between shadow-xl z-10 rounded-b-3xl"
            >
              <div className="space-y-0.5">
                <span className="font-mono text-[9px] text-[#0d0d0d] tracking-widest font-black uppercase block">
                  FOUNDER & CURATOR
                </span>
                <span className="font-bebas text-lg tracking-wider text-[#f5f0e8] uppercase">
                  Hi, I'm Zara Adeyemi
                </span>
              </div>
              <span className="font-mono text-sm text-[#0d0d0d] font-bold"> Lagos ✈</span>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Bio Copy, Bio stats table, & read block */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
          
          <div className="space-y-3">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="font-mono text-xs text-[#e84b1f] tracking-[0.3em] uppercase font-bold block"
            >
              // Editorial Curator
            </motion.span>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="font-bebas text-5xl sm:text-6xl tracking-wider text-[#f5f0e8] leading-none uppercase"
            >
              WHO AM I?<span className="text-[#f5c842]">_</span>
            </motion.h3>
          </div>

          <div className="space-y-5 font-sans text-sm sm:text-base text-[#f5f0e8]/80 leading-relaxed text-justify max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.35, delay: 0.15 }}
            >
              I am Zara Adeyemi, a design researcher and visual documentarian traversing the boundary between raw material reality and fast modern communication. I founded VIVID in 2024 to serve as a high-fidelity counterweight to algorithmic lifestyle optimization.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              Before launching this chronicle, I documented architectural brutalism across Lagos, tracked authentic wood-fired hearth smoke in Nordic fishing cells, and cataloged vinyl audio archives in Tokyo. I believe in concrete, analogue static, heavy cast iron, and living with pristine, uncompromising focus.
            </motion.p>
          </div>

          {/* 2x2 highlight grid: flipping up from rotateX(90deg) to rotateX(0) */}
          <div 
            style={{ perspective: 1000 }}
            className="grid grid-cols-2 gap-4 max-w-xl"
          >
            {/* Box 1 */}
            <motion.div 
              initial={{ opacity: 0, rotateX: 90 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              style={{ transformOrigin: 'bottom' }}
              className="border border-[#f5f0e8]/10 p-5 bg-[#080808] flex items-center space-x-4 group/item cursor-pointer hover:border-[#e84b1f]/20 transition-colors rounded-2xl"
            >
              <div className="w-10 h-10 bg-[#e84b1f]/5 flex items-center justify-center border border-[#e84b1f]/10 shrink-0 rounded-xl">
                <MapPin size={16} className="text-[#e84b1f]" />
              </div>
              <div>
                <span className="font-mono text-[9px] text-[#f5f0e8]/40 tracking-wider block">BASED IN</span>
                <span className="font-bebas text-base text-[#f5f0e8] group-hover/item:text-[#e84b1f] group-hover/item:scale-110 transition-all duration-300 block origin-left tracking-widest">
                  LAGOS, NIGERIA
                </span>
              </div>
            </motion.div>

            {/* Box 2 */}
            <motion.div 
              initial={{ opacity: 0, rotateX: 90 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              style={{ transformOrigin: 'bottom' }}
              className="border border-[#f5f0e8]/10 p-5 bg-[#080808] flex items-center space-x-4 group/item cursor-pointer hover:border-[#e84b1f]/20 transition-colors rounded-2xl"
            >
              <div className="w-10 h-10 bg-[#e84b1f]/5 flex items-center justify-center border border-[#e84b1f]/10 shrink-0 rounded-xl">
                <Calendar size={16} className="text-[#e84b1f]" />
              </div>
              <div>
                <span className="font-mono text-[9px] text-[#f5f0e8]/40 tracking-wider block">WRITING SINCE</span>
                <span className="font-bebas text-base text-[#f5f0e8] group-hover/item:text-[#e84b1f] group-hover/item:scale-110 transition-all duration-300 block origin-left tracking-widest">
                  2016-ACTIVE
                </span>
              </div>
            </motion.div>

            {/* Box 3 */}
            <motion.div 
              initial={{ opacity: 0, rotateX: 90 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              style={{ transformOrigin: 'bottom' }}
              className="border border-[#f5f0e8]/10 p-5 bg-[#080808] flex items-center space-x-4 group/item cursor-pointer hover:border-[#e84b1f]/20 transition-colors rounded-2xl"
            >
              <div className="w-10 h-10 bg-[#e84b1f]/5 flex items-center justify-center border border-[#e84b1f]/10 shrink-0 rounded-xl">
                <Compass size={16} className="text-[#e84b1f]" />
              </div>
              <div>
                <span className="font-mono text-[9px] text-[#f5f0e8]/40 tracking-wider block">COUNTRIES VISITED</span>
                <span className="font-bebas text-base text-[#f5f0e8] group-hover/item:text-[#e84b1f] group-hover/item:scale-110 transition-all duration-300 block origin-left tracking-widest">
                  34 CRITIQUED
                </span>
              </div>
            </motion.div>

            {/* Box 4 */}
            <motion.div 
              initial={{ opacity: 0, rotateX: 90 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              style={{ transformOrigin: 'bottom' }}
              className="border border-[#f5f0e8]/10 p-5 bg-[#080808] flex items-center space-x-4 group/item cursor-pointer hover:border-[#e84b1f]/20 transition-colors rounded-2xl"
            >
              <div className="w-10 h-10 bg-[#e84b1f]/5 flex items-center justify-center border border-[#e84b1f]/10 shrink-0 rounded-xl">
                <Coffee size={16} className="text-[#e84b1f]" />
              </div>
              <div>
                <span className="font-mono text-[9px] text-[#f5f0e8]/40 tracking-wider block">TEA PER DAY</span>
                <span className="font-bebas text-base text-[#f5f0e8] group-hover/item:text-[#e84b1f] group-hover/item:scale-110 transition-all duration-300 block origin-left tracking-widest">
                  4 CUPS SLOWLY
                </span>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => setShowStory(true)}
              className="bg-[#e84b1f] hover:bg-[#f5c842] text-white hover:text-[#0d0d0d] font-mono text-xs tracking-[0.2em] font-bold px-8 py-4 uppercase transition-all duration-300 shadow-lg cursor-pointer flex items-center space-x-2 rounded-xl border border-white/5"
            >
              <span>READ MY STORY →</span>
            </button>
            
            <button
              onClick={onSubscribe}
              className="border border-[#f5f0e8]/15 hover:border-[#e84b1f]/40 text-[#f5f0e8]/75 hover:text-[#e84b1f] font-mono text-xs tracking-[0.2em] px-6 py-4 uppercase transition-colors rounded-xl"
            >
              SUBSCRIBE TO LETTERS
            </button>
          </div>

        </div>

      </div>

      {/* Embedded Story Reveal Modal */}
      <AnimatePresence>
        {showStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStory(false)}
            className="fixed inset-0 z-50 bg-[#0d0d0d]/95 flex items-center justify-center p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full p-8 md:p-10 border border-[#e84b1f]/35 bg-[#000000] space-y-6 relative overflow-hidden rounded-3xl shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-8 text-7xl font-bebas text-[#e84b1f]/5 pointer-events-none select-none">
                ZARA
              </div>

              <div className="flex items-center justify-between border-b border-[#f5f0e8]/10 pb-4">
                <div className="flex items-center space-x-2">
                  <Heart size={20} className="text-[#e84b1f]" />
                  <h3 className="font-bebas text-2xl tracking-[0.1em] text-[#f5f0e8] uppercase">
                    ZARA'S DEVIATION
                  </h3>
                </div>
                <button
                  onClick={() => setShowStory(false)}
                  className="text-[#f5f0e8]/50 hover:text-[#e84b1f] font-mono text-xs uppercase cursor-pointer"
                >
                  DISMISS [×]
                </button>
              </div>

              <div className="space-y-4 font-sans text-sm sm:text-base text-[#f5f0e8]/85 leading-relaxed text-justify max-w-xl">
                <p>
                  "It started as a physical notebook. Each coordinate was logged by hand. I noticed that online descriptions completely missed the physical soul of real objects - they translated high fidelity concrete or rich raw timber simply into digital sales tags."
                </p>
                <p>
                  So I began making field recordings onto tape. I noticed that when sound is uncompressed, you feel the rumble in your sternum. When you build with monoliths of concrete, you feel the weight of history. That is the essence of VIVID: providing the architectural blueprint to living with uncompromised focus.
                </p>
                <div className="bg-[#1a1a1a]/80 p-4 border-l-4 border-[#e84b1f] text-xs font-mono text-[#f5f0e8]/60 space-y-1 rounded-r-xl">
                  <div>• LAGOS (MINDSET, DESIGN ARCHIVE)</div>
                  <div>• TOKYO (VINYL NOISE, TAKUMI CRAFTS)</div>
                  <div>• COPENHAGEN (CONCRETE PREFAB STAGES)</div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setShowStory(false)}
                  className="bg-[#e84b1f] hover:bg-white text-white hover:text-black font-bebas text-xs tracking-widest px-6 py-3 uppercase transition-all rounded-xl border border-white/5 shadow-md"
                >
                  RETURN TO CHRONICLES
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
