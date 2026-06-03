import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Category, BlogPost } from '../types';

interface CategoriesSectionProps {
  onSelectCategory: (category: Category | 'ALL') => void;
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

interface CategoryCell {
  name: string;
  emoji: string;
  count: number;
  id: string;
  linkedCategory: Category | 'ALL';
}

const CATEGORY_CELLS: CategoryCell[] = [
  { id: '01', name: 'MINDSET', emoji: '🧠', count: 14, linkedCategory: 'MINDSET' },
  { id: '02', name: 'STYLE', emoji: '🕶️', count: 22, linkedCategory: 'STYLE' },
  { id: '03', name: 'TRAVEL', emoji: '🧭', count: 18, linkedCategory: 'TRAVEL' },
  { id: '04', name: 'FINANCE', emoji: '📊', count: 9, linkedCategory: 'FINANCE' },
  { id: '05', name: 'WELLNESS', emoji: '🌱', count: 31, linkedCategory: 'WELLNESS' },
  { id: '06', name: 'FOOD', emoji: '🔥', count: 16, linkedCategory: 'FOOD' },
  { id: '07', name: 'HOME & DECOR', emoji: '📐', count: 25, linkedCategory: 'HOME' },
  { id: '08', name: 'CULTURE', emoji: '🏺', count: 42, linkedCategory: 'CULTURE' },
  { id: '09', name: 'CARS', emoji: '🏎️', count: 12, linkedCategory: 'CARS' },
  { id: '10', name: 'EDUCATION', emoji: '📚', count: 19, linkedCategory: 'EDUCATION' }
];

function WatermarkNumber({ target, inView }: { target: number; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();
    let animationFrameId: number;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * target);
      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [inView, target]);

  return <>{count < 10 ? `0${count}` : count}</>;
}

interface CategoryCardProps {
  key?: string | number;
  cell: CategoryCell;
  index: number;
  onSelectCategory: (category: Category | 'ALL') => void;
  isHovered: boolean;
  isAnyHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  categoryPosts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

function CategoryCard({ 
  cell, 
  index, 
  onSelectCategory, 
  isHovered, 
  isAnyHovered, 
  onHover, 
  onLeave,
  categoryPosts,
  onSelectPost
}: CategoryCardProps) {
  const [isInView, setIsInView] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 90 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      viewport={{ once: false, margin: '-20px' }}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      animate={{
        scale: isHovered ? 1.02 : isAnyHovered ? 0.97 : 1,
        opacity: isHovered ? 1 : isAnyHovered ? 0.6 : 1,
        borderColor: isHovered ? '#e84b1f' : 'rgba(245, 240, 232, 0.1)',
      }}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() => {
        onSelectCategory(cell.linkedCategory);
        const anchor = document.getElementById('featured-section-anchor');
        if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
      }}
      className="group relative p-6 flex flex-col justify-between h-auto min-h-[16rem] cursor-pointer category-sweep overflow-hidden select-none bg-zinc-950/60 border border-zinc-900 shadow-md hover:shadow-2xl rounded-2xl transition-all duration-300"
    >
      {/* Giant Faint Number Watermark with dynamic count-up */}
      <span className="absolute -bottom-6 -right-5 font-bebas text-9xl text-[#f5f0e8]/3 tracking-tighter transition-colors group-hover:text-[#e84b1f]/5 pointer-events-none select-none">
        <WatermarkNumber target={parseInt(cell.id, 10)} inView={isInView} />
      </span>

      <div>
        {/* Top content: emoji and count */}
        <div className="flex justify-between items-start relative z-10">
          <motion.span 
            whileHover={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-3xl filter saturate-75 inline-block cursor-pointer"
          >
            {cell.emoji}
          </motion.span>
          <span className="font-mono text-[9px] text-[#e84b1f] font-bold tracking-widest uppercase transition-colors">
            {categoryPosts.length} {categoryPosts.length === 1 ? 'CHRONICLE' : 'CHRONICLES'}
          </span>
        </div>

        {/* Bottom content: Title */}
        <div className="space-y-1 relative z-10 pt-4">
          <h4 className="font-bebas text-xl sm:text-2xl text-[#f5f0e8] group-hover:text-[#f5c842] transition-colors tracking-widest uppercase">
            {cell.name}
          </h4>
          <span className="font-mono text-[8px] text-[#e84b1f] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
            EXPLORE COLUMN →
          </span>
        </div>
      </div>

      {/* Embedded Live Blog Links */}
      <div className="mt-4 pt-3 border-t border-[#f5f0e8]/10 space-y-2 relative z-20 w-full">
        <div className="font-mono text-[8px] text-[#f5f0e8]/40 tracking-wider uppercase mb-1.5 font-bold">
          // Live Feed:
        </div>
        {categoryPosts.slice(0, 2).map((post) => (
          <button
            key={post.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPost(post);
            }}
            className="w-full text-left font-sans text-[11px] text-[#f5f0e8]/75 hover:text-[#e84b1f] flex items-start group/blog transition-colors cursor-pointer py-0.5"
          >
            <span className="text-[#e84b1f] mr-1.5 font-bold">▪</span>
            <span className="line-clamp-2 leading-snug underline decoration-transparent group-hover/blog:decoration-[#e84b1f] transition-all">
              {post.title}
            </span>
          </button>
        ))}
        {categoryPosts.length === 0 && (
          <span className="font-serif italic text-[10px] text-[#f5f0e8]/30">No journals active</span>
        )}
      </div>
    </motion.div>
  );
}

export default function CategoriesSection({ onSelectCategory, posts, onSelectPost }: CategoriesSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#0d0d0d] border-b border-[#e84b1f]/20 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with extending horizontal line */}
        <div className="mb-10 relative">
          <span className="font-mono text-xs text-[#e84b1f] tracking-[0.3em] uppercase font-bold mb-2 block">
            // Exploring Streams
          </span>
          <h2 className="font-bebas text-5xl tracking-[0.15em] text-[#f5f0e8] uppercase relative inline-block">
            CATEGORIES<span className="text-[#e84b1f]">.</span>
          </h2>
          {/* Section heading horizontal line that extends when heading is in view */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: false }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="h-[1px] bg-[#e84b1f]/35 mt-2"
          />
        </div>

        {/* 10-Cell Grid with rounded cards & gaps */}
        <div 
          style={{ perspective: 800 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {CATEGORY_CELLS.map((cell, index) => {
            const categoryPosts = posts.filter(p => p.category === cell.linkedCategory);
            return (
              <CategoryCard 
                key={cell.id} 
                cell={cell} 
                index={index} 
                onSelectCategory={onSelectCategory}
                isHovered={hoveredIndex === index}
                isAnyHovered={hoveredIndex !== null}
                onHover={() => setHoveredIndex(index)}
                onLeave={() => setHoveredIndex(null)}
                categoryPosts={categoryPosts}
                onSelectPost={onSelectPost}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}
