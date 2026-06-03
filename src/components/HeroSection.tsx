import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  onReadLatest: (category?: string) => void;
  onMeetMe: () => void;
}

const HERO_SLIDES = [
  {
    category: "MINDSET",
    headline: "STOP OPTIMISING YOUR LIFE. START LIVING IT.",
    subtext: "The self-improvement industry is worth $13 billion and most of it is making you worse because it shifts focus from being present to fixing a hypothetical future self. Time to drop the state trackers and live.",
    tag: "Long Read · 12 min · Most Shared This Month",
    image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1200",
    color: "#e84b1f"
  },
  {
    category: "TRAVEL",
    headline: "44 HOURS IN ACCRA. ZERO REGRETS.",
    subtext: "A spontaneous long weekend in Ghana's capital — the food of Jamestown, the incredible contemporary art galleries, the music on the beach, and the beautiful friction of a city that never stops moving.",
    tag: "Travel Diary · 9 min · Reader Favourite",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1200",
    color: "#f5c842"
  },
  {
    category: "STYLE",
    headline: "I WORE ONLY NIGERIAN DESIGNERS FOR 60 DAYS.",
    subtext: "What started as an experiment became a full lifestyle shift. Here's what I learned about craft, sustainability, identity, and why the future of fashion is being sewn on our own local soil right now.",
    tag: "Style Feature · 7 min · Editor's Pick",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200",
    color: "#e84b1f"
  }
];

export default function HeroSection({ onReadLatest, onMeetMe }: HeroSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-advance loop every 6 seconds as requested in prompt
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const current = HERO_SLIDES[activeSlide];

  // Continuous scrolling ticker content
  const tickerItems = [
    "✦ NEW: The Lagos Apartment Makeover",
    "✦ TRENDING: Setting Boundaries Without Guilt",
    "✦ JUST PUBLISHED: 10 African Restaurants to Book Before Year End",
    "✦ POPULAR: The Honest Guide to Japa",
    "✦ EDITORIAL: Is Quiet Luxury Really Over?",
    "✦ SPOTLIGHT: Tokyo & Berlin Record Stores Explored"
  ];
  const tickerText = Array(4).fill(tickerItems).flat().join("   |   ");

  return (
    <section className="relative bg-[#0d0d0d] border-b border-[#e84b1f]/20 overflow-hidden flex flex-col justify-between">
      {/* Background Grunge Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none bg-[radial-gradient(#e84b1f_1px,transparent_1px)] [background-size:16px_16px] z-0" />
      
      {/* Tall Editorial Slide Wrapper */}
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 min-h-[75vh]">
        
        {/* Left Column: Slides changing inside AnimatePresence */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8 min-h-[440px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Category Indicator Tag */}
              <div className="overflow-hidden">
                <motion.div
                  initial={{ x: '-101%', opacity: 0 }}
                  animate={{ x: '0%', opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
                  className="flex items-center space-x-2"
                >
                  <span className="w-2.5 h-2.5 bg-[#e84b1f] rounded-full animate-pulse" />
                  <span className="font-mono text-xs sm:text-sm tracking-[0.3em] text-[#e84b1f] uppercase font-bold text-shadow-red">
                    FEATURED STORY &middot; {current.category}
                  </span>
                </motion.div>
              </div>

              {/* Jumbo Title */}
              <h1 className="font-bebas text-4xl sm:text-6xl lg:text-7xl leading-none tracking-tight text-[#f5f0e8] uppercase">
                {current.headline.split('. ').map((part, index) => (
                  <div key={index} className="overflow-hidden py-1">
                    <motion.span
                      initial={{ y: '1.5em' }}
                      animate={{ y: '0px' }}
                      transition={{ 
                        duration: 0.75, 
                        ease: [0.16, 1, 0.3, 1], 
                        delay: 0.2 + index * 0.08 
                      }}
                      className="block last:text-[#e84b1f]"
                    >
                      {part}
                    </motion.span>
                  </div>
                ))}
              </h1>

              {/* Subtext Paragraph */}
              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.36 }}
                  className="font-sans text-base sm:text-lg text-[#f5f0e8]/75 leading-relaxed max-w-xl text-justify"
                >
                  {current.subtext}
                </motion.p>
              </div>

              {/* Metadata details tag */}
              <div className="overflow-hidden">
                <motion.div
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                  className="font-mono text-[10px] sm:text-xs text-[#f5c842] tracking-widest uppercase"
                >
                  🏷️ {current.tag}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action buttons and Slide selectors */}
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <button
              onClick={() => onReadLatest(current.category)}
              className="bg-[#e84b1f] hover:bg-[#f5c842] text-white hover:text-[#0d0d0d] font-mono text-xs tracking-[0.2em] font-bold px-8 py-4 transition-all duration-300 uppercase flex items-center space-x-2 group shrink-0 shadow-lg cursor-pointer cta-shimmer rounded-xl border border-white/5"
            >
              <span>EXPLORE NOW</span>
              <ArrowRight size={13} className="transform group-hover:translate-x-1.5 transition-transform" />
            </button>

            {/* Manual Slide Toggles */}
            <div className="flex items-center space-x-2 bg-zinc-950/80 p-1.5 border border-white/5 rounded-2xl">
              <button 
                onClick={handlePrev}
                className="bg-zinc-950 hover:bg-zinc-900 border border-white/10 text-[#f5f0e8] p-2 hover:border-[#e84b1f] rounded-xl transition-all cursor-pointer"
                aria-label="Previous story"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-mono text-xs text-[#f5f0e8]/50 px-2 select-none">
                0{activeSlide + 1} / 0{HERO_SLIDES.length}
              </span>
              <button 
                onClick={handleNext}
                className="bg-zinc-950 hover:bg-zinc-900 border border-white/10 text-[#f5f0e8] p-2 hover:border-[#e84b1f] rounded-xl transition-all cursor-pointer"
                aria-label="Next story"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic background height/scaling of image for responsive depth */}
        <motion.div
          initial={{ scale: 1.15, filter: 'blur(15px)', opacity: 0 }}
          animate={{
            scale: 1,
            filter: 'blur(0px)',
            opacity: 1,
            y: [-4, 4, -4],
          }}
          transition={{
            scale: { duration: 1.25, ease: [0.16, 1, 0.3, 1] },
            filter: { duration: 1.25, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
            y: {
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut"
            }
          }}
          className="lg:col-span-5 h-[320px] sm:h-[400px] lg:h-[550px] relative overflow-hidden group border border-[#f5f0e8]/15 shadow-2xl rounded-3xl"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeSlide}
              initial={{ scale: 1.1, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0.8 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              src={current.image}
              alt={current.headline}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 brightness-[0.35] group-hover:scale-105 transition-transform duration-700 object-center"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d]/40" />

          {/* Corner highlights */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#e84b1f]/40 pointer-events-none" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#f5c842]/40 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#f5c842]/40 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#e84b1f]/40 pointer-events-none" />

          {/* Slide metadata floating card info */}
          <div className="absolute inset-6 flex flex-col justify-between items-start pointer-events-none">
            <span className="font-mono text-[9px] text-[#f5f0e8]/50 tracking-[0.4em] uppercase">
              // CHRONICLE ISS. O{activeSlide + 1}
            </span>
            <span className="bg-[#f5c842] text-black font-mono text-[9px] tracking-[0.2em] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm border border-black/5">
              THE BOLD LIFE.
            </span>
          </div>
        </motion.div>
      </div>

      {/* 3. Infinite horizontal scrolling live ticker strip below the carousel */}
      <div className="w-full bg-[#070707] py-3.5 border-t border-b border-[#e84b1f]/20 z-10 overflow-hidden relative select-none">
        <div className="flex w-max">
          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 35,
            }}
            className="flex whitespace-nowrap gap-8 text-[10px] font-mono tracking-widest text-[#f5f0e8]/75 uppercase"
          >
            <span>{tickerText}</span>
            <span>{tickerText}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
