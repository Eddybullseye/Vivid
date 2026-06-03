import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ArrowUpDown, Heart, Bookmark } from 'lucide-react';
import { BlogPost } from '../types';

interface ArticlesGridProps {
  posts: BlogPost[];
  onRead: (post: BlogPost) => void;
  savedIds: string[];
  likedIds: string[];
  onToggleBookmark: (post: BlogPost, e: React.MouseEvent) => void;
  onLike: (post: BlogPost, e: React.MouseEvent) => void;
  activeCategory: string;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const imageVariants = {
  hidden: { scale: 1 },
  visible: { scale: 1 },
  hover: { scale: 1.05, rotate: 1.2 }
};

const CATEGORY_DETAILS: Record<string, { name: string; emoji: string; desc: string }> = {
  MINDSET: { name: 'MINDSET JOURNAL', emoji: '🧠', desc: 'Deconstructing modern optimization pressure and setting mental anchors.' },
  STYLE: { name: 'STYLE ARCHIVE', emoji: '🕶️', desc: 'Sovereign design, dense fibers, and tactile aesthetics beyond transient retail trends.' },
  TRAVEL: { name: 'TRAVEL CHRONICLES', emoji: '🧭', desc: 'Immersive overland notes and raw geographical reckonings across the globe.' },
  FINANCE: { name: 'FINANCE LEDGERS', emoji: '📊', desc: 'Separating lifestyle hype from authentic, analog capital sovereignty.' },
  WELLNESS: { name: 'WELLNESS REFUGES', emoji: '🌱', desc: 'Dismantling high-frequency grind culture in pursuit of deep biological rest.' },
  FOOD: { name: 'TASTE RITUALS', emoji: '🔥', desc: 'Celebrating raw clay pots, volcanic grindstones, and wood-smoke acoustics.' },
  HOME: { name: 'HOME & DECOR', emoji: '📐', desc: 'Brutalist apartments, slow interior crafting, and tactile mineral patinas.' },
  CULTURE: { name: 'CULTURE CRITIQUE', emoji: '🏺', desc: 'Tracing fierce sonic currencies and moody handheld cinema waves.' },
  CARS: { name: 'MOTORING GEAR COGNITION', emoji: '🏎️', desc: 'Pure mechanical connection, lightweight vehicles, and open tarmac sanctuary.' },
  EDUCATION: { name: 'SOVEREIGN CRAFT ACADEMICS', emoji: '📚', desc: 'Custom curriculums, visceral apprenticeships, and cognitive stamina.' }
};

function ArticleCard({
  post,
  index,
  savedIds,
  likedIds,
  onToggleBookmark,
  onLike,
  onRead
}: {
  key?: string | number;
  post: BlogPost;
  index: number;
  savedIds: string[];
  likedIds: string[];
  onToggleBookmark: (post: BlogPost, e: React.MouseEvent) => void;
  onLike: (post: BlogPost, e: React.MouseEvent) => void;
  onRead: (post: BlogPost) => void;
}) {
  const isBookmarked = savedIds.includes(post.id);
  const isLiked = likedIds.includes(post.id);

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: false, margin: '-50px' }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.05 }}
      className="group flex flex-col justify-between bg-[#1a1a1a] border border-[#f5f0e8]/10 hover:border-transparent trace-card hover:-translate-y-3 hover:shadow-[0_30px_70px_rgba(232,75,31,0.2)] transition-all duration-500 relative rounded-2xl overflow-hidden"
    >
      {/* Accent red top line on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#e84b1f] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20" />

      {/* Dark gradient thumbnail container */}
      <div className="relative overflow-hidden bg-zinc-950 h-64 shrink-0">
        <motion.img
          variants={imageVariants}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          src={post.imageUrl}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 contrast-115 brightness-75 transition-all duration-700 object-center"
        />
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#e84b1f]/10 to-transparent mix-blend-multiply opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

        {/* Faint category text as a decorative element watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-bebas text-5xl tracking-[0.3em] text-[#f5f0e8]/5 uppercase group-hover:text-white/10 transition-colors">
            {post.category}
          </span>
        </div>

        {/* Category Tag in solid red */}
        <span className="absolute top-4 left-4 font-bebas text-xs tracking-widest bg-[#e84b1f] text-white px-3 py-1 font-bold rounded-lg shadow-sm">
          {post.category}
        </span>

        {/* Date Overlays */}
        <span className="absolute bottom-4 left-4 font-mono text-[9px] tracking-wider text-[#f5f0e8]/60 uppercase">
          {post.date}
        </span>
      </div>

      {/* Content body */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Serif Post Title */}
          <h3 
            onClick={() => onRead(post)}
            className="font-serif-display text-xl sm:text-2xl text-[#f5f0e8] group-hover:text-[#e84b1f] leading-tight transition-colors cursor-pointer select-none"
          >
            "{post.title}"
          </h3>

          {/* Short Excerpt */}
          <p className="font-sans text-xs sm:text-sm text-[#f5f0e8]/75 leading-relaxed line-clamp-3">
            {post.subtitle || "A detailed exploration into uncompromised tactile design, acoustic fidelity, and visceral human focus details worldwide."}
          </p>

          {/* Tag list */}
          <div className="flex flex-wrap gap-1 md:gap-1.5 pt-2">
            {post.tags.map(tag => (
              <span key={tag} className="font-mono text-[8px] text-[#f5f0e8]/40 bg-[#0d0d0d] px-2 py-1 uppercase border border-[#f5f0e8]/5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer with Read More in red & read-time */}
        <div className="pt-6 mt-6 border-t border-[#f5f0e8]/10 flex items-center justify-between">
          <button
            onClick={() => onRead(post)}
            className="font-mono text-xs tracking-widest text-[#e84b1f] hover:text-[#f5c842] font-black uppercase transition-colors flex items-center space-x-1"
          >
            <span>Read More</span>
            <span className="transform group-hover:translate-x-[6px] transition-transform duration-300">→</span>
          </button>

          <div className="flex items-center space-x-3 text-[10px] font-mono text-[#f5f0e8]/40">
            <span>{post.readTime}</span>
            <div className="flex items-center space-x-2">
              <motion.button
                whileTap={{ scale: 0.8 }}
                whileHover={{ scale: 1.25 }}
                transition={{ type: "spring", stiffness: 450, damping: 11 }}
                onClick={(e) => onToggleBookmark(post, e)}
                className={`p-1.5 rounded-lg border border-white/5 bg-zinc-900/40 flex items-center justify-center transition-colors ${
                  isBookmarked ? 'text-[#f5c842] border-[#f5c842]/20 bg-[#f5c842]/5' : 'text-[#f5f0e8]/45 hover:text-[#f5c842]'
                }`}
                aria-label="Bookmark"
              >
                <Bookmark size={11} className={isBookmarked ? "fill-current" : ""} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.8 }}
                whileHover={{ scale: 1.25 }}
                transition={{ type: "spring", stiffness: 450, damping: 11 }}
                onClick={(e) => onLike(post, e)}
                className={`p-1.5 rounded-lg border border-white/5 bg-zinc-900/40 flex items-center justify-center transition-colors ${
                  isLiked ? 'text-[#e84b1f] border-[#e84b1f]/20 bg-[#e84b1f]/5' : 'text-[#f5f0e8]/45 hover:text-[#e84b1f]'
                }`}
                aria-label="Like"
              >
                <Heart size={11} className={isLiked ? "fill-current" : ""} />
              </motion.button>
              <span>{post.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function ArticlesGrid({
  posts,
  onRead,
  savedIds,
  likedIds,
  onToggleBookmark,
  onLike,
  activeCategory,
  searchQuery,
  setSearchQuery,
}: ArticlesGridProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const currentSearchQuery = searchQuery !== undefined ? searchQuery : localSearchQuery;
  const currentSetSearchQuery = setSearchQuery !== undefined ? setSearchQuery : setLocalSearchQuery;
  const [sortBy, setSortBy] = useState<'NEWEST' | 'POPULAR'>('NEWEST');

  // 1. Search filter: Match titles, category, tags, authors, subtitles
  const filteredPosts = posts.filter(post => {
    const query = currentSearchQuery.toLowerCase();
    const titleMatch = post.title.toLowerCase().includes(query);
    const subMatch = post.subtitle.toLowerCase().includes(query);
    const tagsMatch = post.tags.some(tag => tag.toLowerCase().includes(query));
    const authorMatch = post.author.name.toLowerCase().includes(query);
    const catMatch = post.category.toLowerCase().includes(query);

    return titleMatch || subMatch || tagsMatch || authorMatch || catMatch;
  });

  // 2. Sort filter: Newest vs Popular
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'POPULAR') {
      return b.likes - a.likes;
    }
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    return dateB - dateA;
  });

  const isCategorizedLayout = activeCategory === 'ALL' && !currentSearchQuery;
  const categoriesList = ['MINDSET', 'STYLE', 'TRAVEL', 'FINANCE', 'WELLNESS', 'FOOD', 'HOME', 'CULTURE', 'CARS', 'EDUCATION'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Editorial Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-[#e84b1f]/20 pb-8">
        <div>
          <div className="font-mono text-[10px] text-[#e84b1f] tracking-widest uppercase font-bold mb-1.5">
            // LIVE FEED JOURNAL
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex flex-col items-start">
              <h2 className="font-bebas text-4xl sm:text-5xl lg:text-5xl tracking-wider text-[#f5f0e8] uppercase">
                {isCategorizedLayout ? 'CHRONICLE VOLUMES' : 'RECENT POSTS'}<span className="text-[#e84b1f]">.</span>
              </h2>
              {/* Dynamic horizontal heading line */}
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: 120 }}
                viewport={{ once: false }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="h-[1.5px] bg-[#e84b1f]"
              />
            </div>
            <button 
              onClick={() => {
                currentSetSearchQuery('');
                setSortBy('NEWEST');
              }}
              className="font-mono text-[11px] text-[#e84b1f] hover:text-[#f5c842] tracking-widest uppercase border-b border-[#e84b1f] pb-0.5 transition-colors mt-1 sm:mt-0 text-left"
            >
              VIEW ALL DIRECTORIES
            </button>
          </div>
          <p className="font-serif-display text-xs text-[#f5f0e8]/50 italic mt-2">
            Displaying {isCategorizedLayout ? 'all categories' : `${sortedPosts.length} transcripts`} with absolute sovereign focus.
          </p>
        </div>

        {/* Search, Filter Tools */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={currentSearchQuery}
              onChange={(e) => currentSetSearchQuery(e.target.value)}
              placeholder="Search library, tags, categories..."
              className="w-full bg-[#1a1a1a] text-[#f5f0e8] placeholder-[#f5f0e8]/30 text-xs py-3.5 pl-10 pr-4 border border-[#f5f0e8]/10 hover:border-[#e84b1f] focus:border-[#e84b1f] focus:outline-none transition-colors font-mono uppercase rounded-xl"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#f5f0e8]/40" size={14} />
          </div>

          {/* Sort Controller */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortBy(sortBy === 'NEWEST' ? 'POPULAR' : 'NEWEST')}
              className="bg-[#1a1a1a] hover:bg-[#e84b1f]/10 border border-[#f5f0e8]/10 px-4 py-3 text-xs font-mono uppercase text-[#f5f0e8] flex items-center space-x-2 transition-colors cursor-pointer rounded-xl width-full text-left"
            >
              <ArrowUpDown size={12} className="text-[#e84b1f]" />
              <span>SORT: <b className="text-[#f5c842]">{sortBy}</b></span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Articles - Branch on whether categorized shelf or normal search list */}
      {sortedPosts.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-[#e84b1f]/25 bg-[#0d0d0d] rounded-2xl">
          <h3 className="font-bebas text-3xl text-[#f5f0e8] tracking-widest uppercase mb-2">
            NO ESSAYS DISCOVERED
          </h3>
          <p className="font-sans text-sm text-[#f5f0e8]/50 max-w-sm mx-auto mb-6 leading-relaxed">
            We couldn't find any articles matching your exact query. Try selecting another category or typing another keyword.
          </p>
          <button
            onClick={() => currentSetSearchQuery('')}
            className="border-b-2 border-[#e84b1f] text-[#e84b1f] hover:text-[#f5c842] hover:border-[#f5c842] font-mono text-xs uppercase tracking-widest transition-colors py-1"
          >
            Clear Search Filter
          </button>
        </div>
      ) : isCategorizedLayout ? (
        /* Categorized Shelves Layout containing blogs from each category */
        <div className="space-y-16">
          {categoriesList.map((cat, catIdx) => {
            const catPosts = sortedPosts.filter(p => p.category === cat);
            if (catPosts.length === 0) return null;

            const detail = CATEGORY_DETAILS[cat] || { name: cat, emoji: '▪', desc: 'Curated chronicle feed.' };

            return (
              <div key={cat} className="space-y-6 progress-trigger border-l border-[#e84b1f]/20 pl-4 sm:pl-6">
                {/* Horizontal Separator & Category Header info */}
                <div className="border-b border-[#f5f0e8]/10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
                  <div>
                    <div className="flex items-wrap items-center gap-2.5">
                      <span className="text-2xl filter saturate-75 select-none">{detail.emoji}</span>
                      <h3 className="font-bebas text-2xl sm:text-3xl tracking-widest text-[#f0eade] uppercase transition-colors hover:text-[#e84b1f]">
                        {detail.name}
                      </h3>
                      <span className="font-mono text-[9px] text-[#e84b1f] bg-[#e84b1f]/10 border border-[#e84b1f]/20 px-2.5 py-0.5 rounded-full font-bold">
                        {catPosts.length} {catPosts.length === 1 ? 'CHRONICLE' : 'CHRONICLES'}
                      </span>
                    </div>
                    <p className="font-serif italic text-xs sm:text-sm text-[#f5f0e8]/50 mt-1 max-w-2xl">
                      "{detail.desc}"
                    </p>
                  </div>
                </div>

                {/* Grid of articles for this category */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {catPosts.map((post, postIndex) => (
                    <ArticleCard
                      key={post.id}
                      post={post}
                      index={postIndex}
                      savedIds={savedIds}
                      likedIds={likedIds}
                      onToggleBookmark={onToggleBookmark}
                      onLike={onLike}
                      onRead={onRead}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Standard Flat Search List or Specific Category View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map((post, index) => (
            <ArticleCard
              key={post.id}
              post={post}
              index={index}
              savedIds={savedIds}
              likedIds={likedIds}
              onToggleBookmark={onToggleBookmark}
              onLike={onLike}
              onRead={onRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
