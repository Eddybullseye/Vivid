import React from 'react';
import { motion } from 'motion/react';
import { BlogPost, Category } from '../types';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

interface CategoryStoriesLandingProps {
  posts: BlogPost[];
  onRead: (post: BlogPost) => void;
}

const CATEGORY_THEMES: Record<Category, { title: string; desc: string; accent: string }> = {
  MINDSET: { title: "MINDSET", desc: "Deconstructing modern optimization pressure.", accent: "#e84b1f" },
  STYLE: { title: "STYLE", desc: "Sovereign design & heavy handwoven fibers.", accent: "#f5c842" },
  TRAVEL: { title: "TRAVEL", desc: "Raw overland chronicles & solo journeys.", accent: "#38bdf8" },
  FINANCE: { title: "FINANCE", desc: "Authentic, analogue capital sovereignty.", accent: "#4ade80" },
  WELLNESS: { title: "WELLNESS", desc: "Setting deep uncompromised biology buffers.", accent: "#2dd4bf" },
  FOOD: { title: "FOOD", desc: "Clay pots, basalt shear, & wood-smoke.", accent: "#fb923c" },
  HOME: { title: "HOME & DECOR", desc: "Tactile mineral patinas & slow crafting.", accent: "#a78bfa" },
  CULTURE: { title: "CULTURE", desc: "Fierce sonic currents & moody cinema waves.", accent: "#ec4899" },
  CARS: { title: "CARS", desc: "Pure tactile steering communion & gear sync.", accent: "#f43f5e" },
  EDUCATION: { title: "EDUCATION", desc: "Unstandardized curiosity & trade apprenticeships.", accent: "#a3e635" }
};

export default function CategoryStoriesLanding({ posts, onRead }: CategoryStoriesLandingProps) {
  const categories: Category[] = [
    'MINDSET', 'STYLE', 'TRAVEL', 'FINANCE', 'WELLNESS', 
    'FOOD', 'HOME', 'CULTURE', 'CARS', 'EDUCATION'
  ];

  // For each category, select a highly representative post
  const categoryShowcase = categories.map((cat) => {
    const catPosts = posts.filter(p => p.category === cat);
    // Find the hand-written ones first as they are our key items, or fallback to the generated ones
    const mostExcitingPost = catPosts.find(p => !p.id.includes('-') || p.id.startsWith('morocco') || p.id.startsWith('quiet') || p.id.startsWith('morning')) || catPosts[0];
    
    return {
      category: cat,
      theme: CATEGORY_THEMES[cat],
      post: mostExcitingPost
    };
  }).filter(item => item.post !== undefined);

  return (
    <section className="bg-black border-y border-[#e84b1f]/10 py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#f5f0e8]/10 pb-6 text-left">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <Compass className="text-[#e84b1f] animate-[spin_6s_linear_2]" size={16} />
              <span className="font-mono text-[9px] text-[#e84b1f] tracking-[0.3em] uppercase font-black">// LANDING INDEX PANELS</span>
            </div>
            <h2 className="font-bebas text-4xl sm:text-6xl tracking-wider text-[#f5f0e8] uppercase">
              COORDINATES <span className="text-[#e84b1f]">FROM ALL 10 SPHERES</span>
            </h2>
            <p className="font-serif italic text-xs sm:text-sm text-[#f5f0e8]/45">
              "Every single category actively represented on the landing grid — curated photo-journals and full essays of tactile realness."
            </p>
          </div>
          <span className="font-mono text-[9px] text-[#f5c842] border border-[#f5c842]/20 bg-[#f5c842]/5 px-3 py-1.5 rounded-full uppercase mt-4 md:mt-0 font-bold">
            10 CATEGORIES ACTIVE
          </span>
        </div>

        {/* 10-Post Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categoryShowcase.map(({ category, theme, post }) => (
            <motion.div
              key={category}
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={() => onRead(post)}
              className="bg-[#0b0b0b] border border-white/5 hover:border-[#e84b1f]/35 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between h-80 relative group shadow-lg"
            >
              {/* Image box */}
              <div className="h-36 relative overflow-hidden bg-zinc-900 shrink-0">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 duration-500 ease-in-out transition-all brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] to-transparent opacity-90" />
                
                {/* Category badge */}
                <span 
                  style={{ backgroundColor: `${theme.accent}15`, borderColor: `${theme.accent}45`, color: theme.accent }}
                  className="absolute top-3 left-3 font-mono text-[8.5px] border font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md select-none"
                >
                  {category}
                </span>

                <span className="absolute bottom-2 right-3 font-mono text-[9px] text-white/40">
                  ⏱️ {post.readTime}
                </span>
              </div>

              {/* Text content */}
              <div className="p-4 flex-grow flex flex-col justify-between text-left space-y-2">
                <div className="space-y-1">
                  <h3 className="font-serif-display text-xs sm:text-sm text-white group-hover:text-[#e84b1f] transition-all leading-snug line-clamp-2">
                    "{post.title}"
                  </h3>
                  <p className="font-sans text-[10px] text-[#f5f0e8]/50 line-clamp-3">
                    {post.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-900/60 flex justify-between items-center text-[8.5px] font-mono text-stone-500">
                  <span className="truncate max-w-[80px]">BY {post.author.name.toUpperCase()}</span>
                  <span className="text-[#f5c842] group-hover:text-[#e84b1f] transition-colors uppercase font-bold flex items-center">
                    READ <ArrowRight size={10} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
