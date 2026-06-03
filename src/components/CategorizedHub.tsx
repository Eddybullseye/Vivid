import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Bookmark, Eye, CornerDownRight, Compass } from 'lucide-react';
import { BlogPost, Category } from '../types';

interface CategorizedHubProps {
  posts: BlogPost[];
  onRead: (post: BlogPost) => void;
  onSelectCategory: (category: Category) => void;
  savedIds: string[];
  likedIds: string[];
  onToggleBookmark: (post: BlogPost, e: React.MouseEvent) => void;
  onLike: (post: BlogPost, e: React.MouseEvent) => void;
}

const CATEGORY_META: Record<Category, { title: string; desc: string; emoji: string; bg: string; border: string; accent: string }> = {
  MINDSET: { title: "MINDSET & PSYCHOLOGY", desc: "Deconstructing modern productivity cults, slow cognitive recovery, and intentional buffers.", emoji: "🧠", bg: "bg-red-950/10", border: "border-red-500/10", accent: "#e84b1f" },
  STYLE: { title: "STYLE & APPAREL", desc: "Sovereign design, heavy handwoven looms, and clothing as a structural armor of identity.", emoji: "🕶️", bg: "bg-amber-950/10", border: "border-amber-500/10", accent: "#f5c842" },
  TRAVEL: { title: "GEOGRAPHIC TRAVEL", desc: "Raw overland chronicles, medina navigations, and solo survival coordinate guides.", emoji: "🧭", bg: "bg-sky-950/10", border: "border-sky-500/10", accent: "#38bdf8" },
  FINANCE: { title: "SOVEREIGN CAPITAL", desc: "Tactile money ledger systems, defensive asset shields, and intentional spending friction.", emoji: "💸", bg: "bg-emerald-950/10", border: "border-emerald-500/10", accent: "#4ade80" },
  WELLNESS: { title: "SOMATIC WELLNESS", desc: "Refusing high-frequency optimization feeds, sensory isolation, and nervous system reboots.", emoji: "🌱", bg: "bg-teal-950/10", border: "border-teal-500/10", accent: "#2dd4bf" },
  FOOD: { title: "FIRE & CLAY TASTE", emoji: "🔥", desc: "pepper soup, volcanic basalt grinding slabs, and wood-smoke culinary geometry.", bg: "bg-orange-950/10", border: "border-orange-500/10", accent: "#fb923c" },
  HOME: { title: "ARCHITECTURE & HOME", desc: "Brutalist residential concrete, hand-cast patinas, and living environments that welcome age.", emoji: "📐", bg: "bg-purple-950/10", border: "border-purple-500/10", accent: "#a78bfa" },
  CULTURE: { title: "SONIC & CINEA CULTURE", desc: "Synthesizer feedback, grainy cinema loops, and independent underground sub-currents.", emoji: "🏺", bg: "bg-pink-950/10", border: "border-pink-500/10", accent: "#ec4899" },
  CARS: { title: "MOTORING STEERING", desc: "Pure steering communion, lightweight physical platforms, and open asphalt sanctuary.", emoji: "🏎️", bg: "bg-rose-950/10", border: "border-rose-500/10", accent: "#f43f5e" },
  EDUCATION: { title: "SOVEREIGN CRAFT", desc: "Trade apprenticeships, unstandardized research logs, and organic physical stamina.", emoji: "📚", bg: "bg-lime-950/10", border: "border-lime-500/10", accent: "#a3e635" }
};

export default function CategorizedHub({
  posts,
  onRead,
  onSelectCategory,
  savedIds,
  likedIds,
  onToggleBookmark,
  onLike
}: CategorizedHubProps) {
  const categories: Category[] = [
    'MINDSET', 'STYLE', 'TRAVEL', 'FINANCE', 'WELLNESS', 
    'FOOD', 'HOME', 'CULTURE', 'CARS', 'EDUCATION'
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-24">
      {/* Visual Section Intro Header */}
      <div className="border-b border-stone-800 pb-8 text-left space-y-3">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-[#e84b1f] rounded-full animate-ping" />
          <span className="font-mono text-[9px] tracking-[0.3em] text-[#e84b1f] uppercase font-bold">// THE CATEGORIZED BLUEPRINT</span>
        </div>
        <h2 className="font-bebas text-4xl sm:text-7xl tracking-wider text-[#f5f0e8] uppercase">
          CATEGORICAL <span className="text-[#f5c842]">CHRONICLES</span>
        </h2>
        <p className="font-serif italic text-xs sm:text-sm text-stone-400 max-w-xl">
          Each blog post structured directly under its respective life sphere. Choose a vertical below to enter the full archive.
        </p>
      </div>

      <div className="space-y-20">
        {categories.map((category) => {
          const categoryPosts = posts.filter(p => p.category === category);
          const meta = CATEGORY_META[category];
          const displayPosts = categoryPosts.slice(0, 3); // Top 3 posts for preview

          if (categoryPosts.length === 0) return null;

          return (
            <div 
              key={category} 
              id={`hub-section-${category}`}
              className="space-y-6 scroll-mt-24 text-left"
            >
              {/* Category Subheader Banner */}
              <div className={`p-6 rounded-2xl border ${meta.border} ${meta.bg} flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 hover:border-[#f5c842]/20`}>
                <div className="space-y-1.5 flex-grow">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{meta.emoji}</span>
                    <span 
                      style={{ color: meta.accent }}
                      className="font-mono text-[10px] tracking-[0.25em] uppercase font-black"
                    >
                      CHRONICLE LEVEL: #{category}
                    </span>
                  </div>
                  <h3 className="font-bebas text-2xl sm:text-3xl tracking-widest text-stone-100 uppercase">
                    {meta.title}
                  </h3>
                  <p className="font-sans text-xs text-stone-400 max-w-2xl leading-relaxed">
                    {meta.desc}
                  </p>
                </div>

                <button
                  onClick={() => onSelectCategory(category)}
                  className="font-mono text-[9.5px] border border-stone-800 bg-stone-900/60 hover:bg-[#e84b1f] hover:border-[#e84b1f] hover:text-white px-4 py-2 sm:px-5 sm:py-2.5 tracking-widest rounded-xl transition-all duration-300 font-extrabold cursor-pointer uppercase select-none shrink-0"
                >
                  EXPLORE ALL ({categoryPosts.length} ESSAYS)
                </button>
              </div>

              {/* Grid representation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {displayPosts.map((post, idx) => {
                  const isSaved = savedIds.includes(post.id);
                  const isLiked = likedIds.includes(post.id);

                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      className="group flex flex-col justify-between bg-[#0b0b0b] border border-stone-900 rounded-2xl overflow-hidden hover:border-stone-800 transition-all duration-300 relative h-[440px]"
                    >
                      {/* Top bar on card */}
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#e84b1f] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20" />

                      {/* Image Frame */}
                      <div className="h-44 relative bg-stone-950 overflow-hidden shrink-0 pointer-events-auto">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] to-transparent opacity-95" />

                        {/* Top quick badges */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center">
                          <span className="font-mono text-[8px] bg-black/80 border border-stone-800 text-stone-400 py-1 px-2.5 rounded-md tracking-wider font-bold">
                            🔍 {post.readTime}
                          </span>
                          <button
                            onClick={(e) => onToggleBookmark(post, e)}
                            className={`p-2 rounded-lg border text-sm transition-all duration-300 cursor-pointer ${
                              isSaved 
                                ? 'bg-[#e84b1f]/10 border-[#e84b1f]/40 text-[#e84b1f]' 
                                : 'bg-black/60 border-stone-800 text-stone-400 hover:text-white'
                            }`}
                          >
                            <Bookmark size={12} className={isSaved ? "fill-current" : ""} />
                          </button>
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div className="space-y-2">
                          {/* Author line */}
                          <div className="flex items-center space-x-2 text-[10px] text-stone-500">
                            <img 
                              src={post.author.avatar} 
                              alt={post.author.name} 
                              referrerPolicy="no-referrer"
                              className="w-4 h-4 rounded-full object-cover shrink-0"
                            />
                            <span className="font-mono uppercase tracking-widest truncate max-w-[120px]">
                              {post.author.name}
                            </span>
                          </div>

                          <h4 
                            onClick={() => onRead(post)}
                            className="font-serif-display text-base font-semibold text-stone-200 group-hover:text-[#e84b1f] hover:underline cursor-pointer leading-snug line-clamp-2 transition-all"
                          >
                            "{post.title}"
                          </h4>

                          <p className="font-sans text-[11px] leading-relaxed text-stone-400 line-clamp-3">
                            {post.subtitle}
                          </p>
                        </div>

                        {/* Bottom action zone with liking and reading trigger */}
                        <div className="pt-3 border-t border-stone-900/60 flex justify-between items-center">
                          <button
                            onClick={(e) => onLike(post, e)}
                            className={`flex items-center space-x-1.5 font-mono text-[9px] px-2 py-1 rounded-md transition-all ${
                              isLiked 
                                ? 'text-[#e84b1f] bg-[#e84b1f]/5 font-bold' 
                                : 'text-stone-500 hover:text-stone-300'
                            }`}
                          >
                            <motion.span
                              animate={isLiked ? { scale: [1, 1.4, 1] } : {}}
                              transition={{ duration: 0.35 }}
                            >
                              <Heart size={11} className={isLiked ? "fill-current" : ""} />
                            </motion.span>
                            <span>{post.likes.toLocaleString()}</span>
                          </button>

                          <button
                            onClick={() => onRead(post)}
                            className="group/btn font-mono text-[9px] tracking-widest text-[#f5c842] hover:text-[#e84b1f] font-bold uppercase flex items-center gap-1 select-none cursor-pointer"
                          >
                            OPEN ENTRY 
                            <CornerDownRight size={10} className="group-hover/btn:translate-x-0.5 group-hover/btn:translate-y-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative Blueprint summary signoff */}
      <div className="p-8 border border-stone-900 bg-black/60 rounded-2xl flex flex-col md:flex-row items-center justify-between text-left gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-stone-400 font-mono text-[9px] uppercase">
            <Compass size={12} className="text-[#f5c842]" />
            <span>VIVID DIRECTORY MANIFESTO</span>
          </div>
          <h4 className="font-bebas text-lg tracking-wider text-stone-200">
            WANT AN UNCOMPRESSED STREAM OF ALL SECTOR COGNITIONS?
          </h4>
          <p className="font-sans text-xs text-stone-500 max-w-xl leading-relaxed">
            Choose a vertical above to dive deep or type keys into the search input dynamic field in the top navigation bar. Every channel is recorded live.
          </p>
        </div>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            const sInput = document.querySelector('input[type="text"]');
            if (sInput) (sInput as HTMLElement).focus();
          }}
          className="bg-[#f5c842] text-black font-bebas text-xs tracking-widest px-6 py-3 rounded-xl uppercase transition-all duration-300 hover:bg-[#e84b1f] hover:text-white font-bold cursor-pointer"
        >
          SEARCH CENTRAL INDEX
        </button>
      </div>
    </div>
  );
}
