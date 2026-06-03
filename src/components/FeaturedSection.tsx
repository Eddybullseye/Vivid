import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight, Eye, MessageSquare, Flame } from 'lucide-react';
import { BlogPost } from '../types';

interface FeaturedSectionProps {
  primaryPost: BlogPost | null;
  sidePosts: BlogPost[];
  onRead: (post: BlogPost) => void;
  allPosts?: BlogPost[];
}

export default function FeaturedSection({
  primaryPost,
  sidePosts,
  onRead,
  allPosts = []
}: FeaturedSectionProps) {
  // Locate the primary article for our elite editorial grid (MINDSET)
  const mainPost = allPosts.find(p => p.category === 'MINDSET') || primaryPost;

  if (!mainPost) return null;

  // Dynamically extract exactly one representative story from the other 9 custom categories
  const categories: string[] = [
    'STYLE',
    'TRAVEL',
    'FINANCE',
    'WELLNESS',
    'FOOD',
    'HOME',
    'CULTURE',
    'CARS',
    'EDUCATION'
  ];

  const editorials = categories
    .map((cat) => {
      // Find the latest post of this category from allPosts
      const p = allPosts.find((post) => post.category === cat);
      return {
        category: cat,
        title: p ? p.title : `${cat} CHRONICLE`,
        excerpt: p ? p.subtitle : `An elegant sensory translation and critique within our ${cat.toLowerCase()} collection.`,
        post: p || null,
        image: p ? p.imageUrl : "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600"
      };
    })
    .filter((ed) => ed.post !== null);

  return (
    <section className="bg-black border-b border-[#e84b1f]/20 py-16 px-6 relative overflow-hidden">
      {/* Structural Accent Lines */}
      <div className="absolute right-0 top-1/4 w-32 h-px bg-gradient-to-l from-[#e84b1f]/20 to-transparent pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-32 h-px bg-gradient-to-r from-[#e84b1f]/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Editorial Feed Header Section */}
        <div className="flex flex-col items-start border-b border-[#f5f0e8]/10 pb-6 mb-10">
          <div className="flex items-center space-x-2 mb-2">
            <Flame size={14} className="text-[#e84b1f] animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs text-[#e84b1f] tracking-[0.3em] uppercase font-bold text-shadow-red animate-pulse">
              // CHRONICLE MASTER SPREADS
            </span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-6xl tracking-[0.15em] text-[#f5f0e8] uppercase">
            EDITOR'S SELECT SPREAD
          </h2>
          <p className="font-serif-display text-sm sm:text-base text-[#f5f0e8]/55 italic mt-1 max-w-lg">
            A real-time critique of modern survival, high-end design catalogs, and sensory liberation.
          </p>
        </div>

        {/* 1. Large Top Spread: The 5AM Club Didn't Fix Me */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch bg-zinc-950/30 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
          
          {/* Main Hero Visual half column */}
          <div className="lg:col-span-6 relative min-h-[350px] md:min-h-[500px] overflow-hidden group">
            <img
              src={mainPost.imageUrl || "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=1200"}
              alt={mainPost.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 brightness-[0.4] group-hover:scale-105 transition-transform duration-1000 object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0d0d0d]/90" />
            
            <div className="absolute inset-6 flex flex-col justify-between pointer-events-none select-none">
              <span className="font-mono text-[9px] text-[#e84b1f] tracking-[0.4em] uppercase font-black">
                // CRUCIAL TEXTS &middot; EDITORIAL
              </span>
              <span className="font-bebas text-6xl tracking-widest text-white/5 uppercase select-none font-extrabold">
                VIVID
              </span>
            </div>
          </div>

          {/* Detailed Editorial copy card half column */}
          <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-between bg-zinc-950/20">
            <div className="space-y-6">
              
              {/* Category tag */}
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-[#e84b1f] rounded-full animate-pulse" />
                <span className="font-bebas text-sm tracking-[0.25em] text-[#f5c842] uppercase font-bold">
                  {mainPost.category}
                </span>
              </div>

              {/* Jumbo Title */}
              <h3 
                onClick={() => onRead(mainPost)}
                className="font-bebas text-3xl sm:text-5xl lg:text-5xl text-[#f5f0e8] leading-none hover:text-[#e84b1f] transition-all cursor-pointer underline-offset-4 hover:underline select-text uppercase hover-glow-cream"
              >
                "{mainPost.title}"
              </h3>

              {/* 3-4 sentence detailed excerpt */}
              <p className="font-sans text-sm sm:text-base text-[#f5f0e8]/75 leading-relaxed text-justify">
                {mainPost.subtitle || "I tried every morning routine the internet swore by. Thirty days of 5AM alarms, lemon water, and journaling. Here's what nobody warns you about — and the one small shift that actually transformed my mornings."}
                {" The self-improvement industry is worth $13 billion and most of it is making you worse. Rest is not a metric of active morning output; it is the ultimate act of modern rebellion."}
              </p>

              {/* Meta indicators */}
              <div className="flex flex-wrap items-center gap-6 font-mono text-[10px] text-[#f5f0e8]/50 uppercase">
                <span className="flex items-center space-x-1">
                  <Clock size={12} className="text-[#e84b1f]" />
                  <span>8 MIN READ</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Eye size={12} className="text-[#f5c842]" />
                  <span>4,200 VIEWS</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MessageSquare size={12} className="text-[#e84b1f]" />
                  <span>38 COMMENTS</span>
                </span>
              </div>

              {/* Author Bio Snippet overlay card */}
              <div className="bg-white/5 p-4 border-l-4 border-[#e84b1f] rounded-r-2xl space-y-2 mt-4">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={mainPost.author.avatar}
                    alt={mainPost.author.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-lg border border-white/10 filter grayscale object-cover"
                  />
                  <span className="font-bebas text-xs tracking-widest uppercase text-white font-bold">
                    CRAFTED BY {mainPost.author.name}
                  </span>
                </div>
                <p className="font-sans text-[11px] text-white/55 italic leading-normal">
                  "{mainPost.author.bio || "Zara Adeyemi is a Lagos-based writer obsessed with the intersection of self-development and real life."}"
                </p>
              </div>

            </div>

            {/* Read Button */}
            <div className="pt-8 mt-6 border-t border-[#f5f0e8]/5">
              <button
                onClick={() => onRead(mainPost)}
                className="w-full bg-[#e84b1f] hover:bg-[#f5c842] text-white hover:text-black font-mono text-xs tracking-[0.3em] font-extrabold py-4 px-6 uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg cta-shimmer rounded-xl border border-white/5"
              >
                <span>OPEN SPREAD ARTICLE</span>
                <ArrowRight size={13} />
              </button>
            </div>

          </div>
        </div>

        {/* 2. Secondary Bento Spread: 15-Card Featured Grid */}
        <div className="space-y-6">
          <span className="font-mono text-[9px] text-[#f5f0e8]/30 tracking-widest uppercase block border-b border-white/5 pb-3">
            FEATURED CHRONICLES &middot; EDITOR'S CHOICE ({sidePosts.length} STAGES)
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sidePosts.slice(0, 15).map((post, index) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.08 }}
                className="bg-[#0b0b0b] border border-white/5 flex flex-col justify-between group rounded-2xl overflow-hidden hover:border-[#e84b1f]/30 transition-all duration-300 shadow-lg"
              >
                {/* Visual anchor card top */}
                <div className="h-44 relative overflow-hidden bg-zinc-900 shrink-0">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter grayscale contrast-125 brightness-[0.4] group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-700 object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-transparent opacity-90" />
                  
                  {/* Category bubble */}
                  <div className="absolute top-3 left-3 bg-black/85 border border-white/10 px-2.5 py-1 font-mono text-[9px] text-[#f5c842] tracking-widest rounded-lg">
                    #{post.category}
                  </div>
                </div>

                {/* Content body copy */}
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between text-left">
                  <div className="space-y-2">
                    <h4 
                      onClick={() => onRead(post)}
                      className="font-serif-display text-base font-medium text-[#f5f0e8] group-hover:text-[#e84b1f] transition-all cursor-pointer leading-snug line-clamp-2"
                    >
                      "{post.title}"
                    </h4>
                    <p className="font-sans text-[12px] text-[#f5f0e8]/55 leading-relaxed line-clamp-3">
                      {post.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-900 flex justify-between items-center">
                    <span className="font-mono text-[9px] text-[#f5f0e8]/35 uppercase">
                      🕒 {post.readTime}
                    </span>
                    <button
                      onClick={() => onRead(post)}
                      className="font-mono text-[9px] text-[#f5c842] group-hover:text-[#e84b1f] tracking-widest uppercase transition-colors flex items-center gap-1 cursor-pointer font-bold"
                    >
                      READ ENTRY &rarr;
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
