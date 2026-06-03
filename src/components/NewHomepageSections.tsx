import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Sparkles, BookOpen, Clock, Heart, 
  Layers, Database, Compass, CheckCircle, Award, 
  Coffee, Shield, Check, Mail, Bookmark
} from 'lucide-react';
import { BlogPost } from '../types';

interface HomepageSectionsProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onSelectCategory: (category: any) => void;
  savedIds: string[];
  likedIds: string[];
  onToggleBookmark: (post: BlogPost, e: React.MouseEvent) => void;
  onLike: (post: BlogPost, e: React.MouseEvent) => void;
}

// Custom curated reading lists grouping
const READING_LISTS_DATA = [
  {
    title: "THE MONEY COLLECTION",
    desc: "8 finance ledgers for absolute capital sovereignty.",
    tag: "FINANCE",
    count: 8,
    icon: "📊"
  },
  {
    title: "THE TRAVEL STARTER PACK",
    desc: "6 transcripts for first-time solo overland travellers.",
    tag: "TRAVEL",
    count: 6,
    icon: "🧭"
  },
  {
    title: "THE WELLNESS RESET",
    desc: "7 guidelines for when you need to drop high frequency grind.",
    tag: "WELLNESS",
    count: 7,
    icon: "🌱"
  },
  {
    title: "THE STYLE EDIT",
    desc: "6 files for building apparel silhouettes with dense local fibers.",
    tag: "STYLE",
    count: 6,
    icon: "🕶️"
  },
  {
    title: "THE MINDSET LIBRARY",
    desc: "9 documents on deconstructing optimization pressure.",
    tag: "MINDSET",
    count: 9,
    icon: "🧠"
  },
  {
    title: "THE LAGOS GUIDE",
    desc: "All critical logs about eating, driving, and surviving in Lagos.",
    tag: "CULTURE",
    count: 14,
    icon: "⚡"
  }
];

export default function NewHomepageSections({
  posts,
  onSelectPost,
  onSelectCategory,
  savedIds,
  likedIds,
  onToggleBookmark,
  onLike
}: HomepageSectionsProps) {

  // Email State for Start Here Onboarding Subscribe Form
  const [emailValue, setEmailValue] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailValue.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmailValue("");
      }, 3500);
    }
  };

  // 1. "Start Here" Curated Onboarding List (Matches 5 recommended files)
  const onboardingPostIds = ['morning-routine', 'quiet-luxury', 'morocco-solo', 'debt-payoff', 'quit-hustle'];
  const onboardingPosts = posts.filter(p => onboardingPostIds.includes(p.id));

  // 2. "This Week on VIVID" - Fresh Strip (4 most recently published based on date)
  const freshPosts = [...posts].slice(0, 4);

  // 3. "Long Reads" - articles with reading time over 8 min or long text content
  const longReads = posts.filter(p => p.readTime && parseInt(p.readTime) >= 8).slice(0, 4);

  // 4. "Quick Reads" - under 5 min
  const quickReads = posts.filter(p => p.readTime && parseInt(p.readTime) < 8).slice(0, 4);

  // 5. "From the Archives" - evergreen deep cuts from 2-5 years ago
  const archivedPosts = [...posts].reverse().slice(0, 6);

  return (
    <div className="space-y-24 max-w-7xl mx-auto px-6 py-4">

      {/* ========================================================= */}
      {/* 1. SECTION: START HERE — ONBOARDING BAR */}
      {/* ========================================================= */}
      <section className="bg-[#111111] border border-[#e84b1f]/20 rounded-3xl p-8 md:p-10 relative overflow-hidden">
        {/* Glow watermark */}
        <div className="absolute top-0 right-0 p-8 text-8xl font-bebas text-[#e84b1f]/5 pointer-events-none select-none font-black">
          START
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#e84b1f] animate-ping" />
              <span className="font-mono text-[9px] text-[#e84b1f] tracking-widest font-bold uppercase block">// ONBOARDING ARCHIVE</span>
            </div>
            <h2 className="font-bebas text-4xl sm:text-5xl leading-none text-white tracking-wider">
              NEW HERE? <span className="text-[#e84b1f]">START WITH THESE 5 ESSAYS.</span>
            </h2>
            <p className="font-serif italic text-xs sm:text-sm text-[#f5f0e8]/50 max-w-xl">
              "We have curated five cornerstone files analyzing modern optimization traps, Aso-oke styling experiments, otherworld solo travel friction, and debt exorcisms. Enter the sphere slowly."
            </p>

            {/* Email input strip */}
            <form onSubmit={handleSubscribe} className="max-w-md relative pt-2">
              <AnimatePresence mode="wait">
                {isSubscribed ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#e84b1f] text-white p-3.5 text-xs font-mono uppercase tracking-wider rounded-xl flex items-center space-x-2"
                  >
                    <Check size={14} className="stroke-white" />
                    <span>SUBSCRIBED. WELCOME TO 48,000 READERS COHORT.</span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={emailValue}
                      onChange={(e) => setEmailValue(e.target.value)}
                      placeholder="ENTER SECURE EMAIL..."
                      required
                      className="bg-black text-[#f5f0e8] placeholder-[#f5f0e8]/30 font-mono text-xs px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:border-[#e84b1f] flex-grow"
                    />
                    <button
                      type="submit"
                      className="bg-[#e84b1f] hover:bg-[#f5c842] hover:text-black text-white font-mono text-xs font-bold px-6 py-3 uppercase transition-all rounded-xl cursor-pointer"
                    >
                      JOIN COHORT
                    </button>
                  </div>
                )}
              </AnimatePresence>
              <span className="font-mono text-[9px] text-zinc-500 mt-2 block select-none">
                Join 48,000 readers who found this place and never left.
              </span>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-3 shrink-0">
            <span className="font-mono text-[9px] text-[#f5c842] tracking-widest uppercase block">// HIGH-FIDELITY COLLECTIBLES</span>
            <div className="space-y-2.5">
              {onboardingPosts.map((post, idx) => (
                <div 
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="bg-black/60 hover:bg-[#1a1a1a] border border-white/5 hover:border-[#e84b1f]/30 p-3.5 flex items-center justify-between text-left cursor-pointer transition-all rounded-xl group"
                >
                  <div className="space-y-1 truncate pr-3">
                    <span className="font-mono text-[8px] text-[#e84b1f]/80 select-none uppercase">Cornerstone 0{idx+1} &middot; {post.category}</span>
                    <h3 className="font-serif-display text-xs sm:text-sm text-white group-hover:text-[#e84b1f] transition-all truncate">
                      "{post.title}"
                    </h3>
                  </div>
                  <span className="font-mono text-[9px] text-[#f5c842] group-hover:translate-x-1.5 transition-transform">→</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. SECTION: THIS WEEK ON VIVID — FRESH CONTENT STRIP */}
      {/* ========================================================= */}
      <section className="space-y-6">
        <div className="border-b border-[#e84b1f]/20 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 text-left">
          <div>
            <span className="font-mono text-[9px] text-[#e84b1f] tracking-widest uppercase block font-bold">// DAILY TRANSCRIPTS</span>
            <div className="flex items-center space-x-2">
              <h2 className="font-bebas text-3xl sm:text-4xl tracking-widest text-[#f5f0e8] uppercase">THIS WEEK ON VIVID</h2>
              <span className="bg-[#f5c842] text-black font-mono text-[8px] font-bold px-2 py-0.5 rounded uppercase select-none">LIVE FEED</span>
            </div>
          </div>
          <span className="font-serif italic text-xs text-[#f5f0e8]/40 mb-1">Displaying freshly captured transcripts</span>
        </div>

        {/* Horizontal scroll grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {freshPosts.map((post, idx) => (
            <div 
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="bg-[#141414] border border-white/5 hover:border-transparent trace-card hover:-translate-y-2 transition-all duration-300 relative rounded-2xl overflow-hidden p-5 flex flex-col justify-between min-h-[220px] cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] text-[#e84b1f] uppercase bg-[#e84b1f]/10 px-2 py-0.5 border border-[#e84b1f]/20 rounded-md">
                    {post.category}
                  </span>
                  <span className="font-mono text-[8px] text-zinc-500">
                    PUBLISHED 0{idx+2} DAYS AGO
                  </span>
                </div>
                <h3 className="font-serif-display text-sm sm:text-base text-white group-hover:text-[#e84b1f] transition-all leading-tight line-clamp-2">
                  "{post.title}"
                </h3>
                <p className="font-sans text-[11px] text-[#f5f0e8]/60 line-clamp-3">
                  {post.subtitle}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-3 text-[9px] font-mono text-stone-500">
                <span>⏱️ {post.readTime}</span>
                <span className="text-[#f5c842] font-black group-hover:text-white uppercase transition-colors">READ NOW →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. SECTION: READING LISTS — CURATED COLLECTIONS */}
      {/* ========================================================= */}
      <section className="space-y-6">
        <div className="border-b border-white/10 pb-4 text-left">
          <span className="font-mono text-[9px] text-[#f5c842] tracking-widest uppercase block font-bold">// INTEGRATED CHRONICLE INDEX</span>
          <h2 className="font-bebas text-3xl tracking-widest text-[#f5f0e8] uppercase">CURATED READING LISTS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {READING_LISTS_DATA.map((list, idx) => (
            <div 
              key={idx}
              onClick={() => onSelectCategory(list.tag)}
              className="bg-[#0b0b0b]/80 border border-white/5 hover:border-[#e84b1f]/30 p-6 rounded-2xl cursor-pointer hover:bg-black transition-all flex justify-between items-start group"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl filter saturate-50 select-none">{list.icon}</span>
                  <span className="font-mono text-[10px] text-[#e84b1f] tracking-widest uppercase font-bold">DIRECTORY SHELF</span>
                </div>
                <h3 className="font-bebas text-lg tracking-widest text-white group-hover:text-[#f5c842] transition-colors uppercase">
                  {list.title}
                </h3>
                <p className="font-sans text-xs text-[#f5f0e8]/50">
                  {list.desc}
                </p>
              </div>
              <span className="font-mono text-[10px] text-zinc-500 group-hover:text-[#e84b1f] text-right ml-3 bg-neutral-950 px-2 py-1 rounded border border-neutral-800">
                {list.count} VOL
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. SECTION: LONG READS — DEEP DIVE FEATURE */}
      {/* ========================================================= */}
      <section className="space-y-6">
        <div className="border-b border-[#e84b1f]/25 pb-4 flex justify-between items-end text-left">
          <div>
            <span className="font-mono text-[9px] text-[#e84b1f] tracking-widest uppercase block font-bold">// SLOW LIFE DICTION</span>
            <h2 className="font-bebas text-3xl tracking-widest text-[#f5f0e8] uppercase">PREMIUM LONG READS</h2>
          </div>
          <span className="font-mono text-[9px] text-[#f5c842] uppercase tracking-wide">
            🍵 Brew a cup of tea for this one
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {longReads.map((post) => (
            <div 
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="group cursor-pointer bg-neutral-950 border border-white/5 hover:border-[#e84b1f]/20 rounded-3xl overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-stretch"
            >
              <div className="sm:col-span-5 h-48 sm:h-full overflow-hidden bg-zinc-900 relative">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter grayscale contrast-115 group-hover:grayscale-0 brightness-75 transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80" />
                <span className="absolute bottom-4 left-4 font-mono text-[9px] text-white/50 bg-black/65 border border-white/10 px-2 py-1 rounded">
                  {post.readTime}
                </span>
              </div>
              <div className="sm:col-span-7 p-6 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="font-mono text-[8px] text-[#e84b1f]/80 uppercase font-black block">{post.category} &middot; DEPTH CHRONICLE</span>
                  <h3 className="font-serif-display text-base sm:text-lg text-white group-hover:text-[#e84b1f] transition-colors leading-snug">
                    "{post.title}"
                  </h3>
                  <p className="font-sans text-xs text-[#f5f0e8]/65 leading-relaxed line-clamp-3">
                    {post.subtitle}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>BY {post.author.name.toUpperCase()}</span>
                  <span className="text-[#f5c842] font-black uppercase tracking-wider">READ ARTICLE →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. SECTION: QUICK READS — UNDER 5 MINUTES */}
      {/* ========================================================= */}
      <section className="space-y-6">
        <div className="border-b border-white/10 pb-4 text-left">
          <span className="font-mono text-[9px] text-[#f5c842] tracking-widest uppercase block font-bold">// RAPID SPECTER DIALS</span>
          <h2 className="font-bebas text-3xl tracking-widest text-[#f5f0e8] uppercase">QUICK READS [UNDER 5 MINUTES]</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
          {quickReads.map((post) => (
            <div 
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="bg-[#0b0b0b] hover:bg-[#111] p-5 rounded-2xl border border-white/5 hover:border-yellow-500/10 cursor-pointer transition-all flex flex-col justify-between min-h-[160px] group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] text-zinc-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    {post.category}
                  </span>
                  <span className="text-[9px] font-mono text-[#f5c842] font-bold uppercase">⚡ QUICK</span>
                </div>
                <h3 className="font-serif-display text-xs sm:text-sm text-white group-hover:text-[#f5c842] transition-colors leading-tight font-extrabold line-clamp-2">
                  "{post.title}"
                </h3>
                <p className="font-sans text-[10px] text-[#f5f0e8]/50 line-clamp-2">
                  {post.subtitle}
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-900 flex justify-between items-center text-[8px] font-mono text-stone-500">
                <span>⚡ {post.readTime}</span>
                <span className="text-zinc-400 group-hover:text-white uppercase">FAST TRACK →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. SECTION: THE VIVID INDEX — RUNNING DATA PAGE */}
      {/* ========================================================= */}
      <section className="bg-black border border-white/5 rounded-3xl p-8 relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 p-8 text-9xl font-bebas text-white/5 pointer-events-none select-none font-black">
          MAP
        </div>
        <div className="max-w-4xl space-y-6 relative z-10">
          <div>
            <span className="font-mono text-[8px] text-[#f5c842] tracking-[0.25em] block uppercase font-black mb-1">// COGNITIVE REGISTRY INDEX</span>
            <h2 className="font-bebas text-3xl sm:text-4xl tracking-widest text-[#f5f0e8] uppercase">THE VIVID METRICS LEDGER</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-left pt-2">
            <div className="space-y-1">
              <span className="font-bebas text-3xl sm:text-4xl text-[#e84b1f] font-bold block">126</span>
              <span className="font-mono text-[8.5px] text-[#f5f0e8]/40 tracking-wider uppercase block">Total Articles Published</span>
            </div>
            <div className="space-y-1">
              <span className="font-bebas text-3xl sm:text-4xl text-[#f5c842] font-bold block">14HQ</span>
              <span className="font-mono text-[8.5px] text-[#f5f0e8]/40 tracking-wider uppercase block">Countries Written From</span>
            </div>
            <div className="space-y-1">
              <span className="font-bebas text-3xl sm:text-4xl text-white font-bold block">247k+</span>
              <span className="font-mono text-[8.5px] text-[#f5f0e8]/40 tracking-wider uppercase block">Total Microtheoretic Words</span>
            </div>
            <div className="space-y-1">
              <span className="font-bebas text-3xl sm:text-4xl text-[#e84b1f] font-bold block">48 Days</span>
              <span className="font-mono text-[8.5px] text-[#f5f0e8]/40 tracking-wider uppercase block">Reader Streak Record</span>
            </div>
          </div>
          
          <p className="font-sans text-xs text-[#f5f0e8]/50 pt-2 border-t border-white/5 italic">
            "We audit our telemetry regularly to prevent high frequency noise bleed. Total cups of tea consumed during writing: too many to count."
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. SECTION: FROM THE ARCHIVE — EVERGREEN DEEP CUTS */}
      {/* ========================================================= */}
      <section className="space-y-6">
        <div className="border-b border-[#f5c842]/20 pb-4 flex justify-between items-end text-left">
          <div>
            <span className="font-mono text-[9px] text-[#f5c842] tracking-widest uppercase block font-bold">// DEEP ARCHIVE BURNS</span>
            <h2 className="font-bebas text-3xl tracking-widest text-[#f5f0e8] uppercase">FROM THE ARCHIVE [EVERGREEN]</h2>
          </div>
          <span className="bg-[#f5c842]/10 text-[#f5c842] font-mono text-[9px] px-2.5 py-0.5 border border-[#f5c842]/20 rounded-full font-bold">
            6 RE-SURFACING MONTHLY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {archivedPosts.map((post) => (
            <div 
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="bg-zinc-950/40 border border-[#f5c842]/20 hover:border-[#f5c842] p-5 flex flex-col justify-between min-h-[190px] rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden"
            >
              {/* Highlight red top line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#f5c842] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-[8px]">
                  <span className="text-[#f5c842] uppercase bg-[#f5c842]/5 px-2.5 py-0.5 rounded border border-[#f5c842]/20">
                    STILL RELEVANT
                  </span>
                  <span className="text-[#f5f0e8]/30">
                    ISSUED 2 YEARS AGO
                  </span>
                </div>
                <h3 className="font-serif-display text-sm sm:text-base text-white group-hover:text-[#f5c842] transition-colors leading-tight font-extrabold line-clamp-2">
                  "{post.title}"
                </h3>
                <p className="font-sans text-[11px] text-[#f5f0e8]/50 line-clamp-2">
                  {post.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-900 mt-3 flex justify-between items-center text-[9px] font-mono text-stone-500">
                <span>⏱️ {post.readTime}</span>
                <span className="text-[#e84b1f] uppercase font-bold group-hover:translate-x-1 transition-transform inline-block">BURNS BRIGHT →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
