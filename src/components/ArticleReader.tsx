import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { Heart, Bookmark, ArrowLeft, Send, MessageSquare, Clock, Sparkles, Link, Check } from 'lucide-react';
import { BlogPost, PostComment } from '../types';

interface ArticleReaderProps {
  post: BlogPost;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (post: BlogPost, e?: any) => void;
  onLike: (post: BlogPost, e?: any) => void;
  isLiked: boolean;
  onAddComment: (comment: PostComment) => void;
  allPosts?: BlogPost[];
  onNavigateToPost?: (post: BlogPost) => void;
  key?: string;
}

export default function ArticleReader({
  post,
  onBack,
  isBookmarked,
  onToggleBookmark,
  onLike,
  isLiked,
  onAddComment,
  allPosts = [],
  onNavigateToPost,
}: ArticleReaderProps) {
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [relatedRecommendations, setRelatedRecommendations] = useState<Array<{ postId: string; score: number; reason: string }>>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Sidebar states
  const [sidebarProgress, setSidebarProgress] = useState(0);
  const [miniMailValue, setMiniMailValue] = useState('');
  const [miniMailSubbed, setMiniMailSubbed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setSidebarProgress(Math.min(100, Math.round((window.scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?post=${post.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setShowToast(true);
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
      });
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    if (!post || !allPosts || allPosts.length <= 1) {
      setIsRecommendationsLoading(false);
      setRelatedRecommendations([]);
      return;
    }

    let isMounted = true;
    setIsRecommendationsLoading(true);

    const fetchRecommendations = async () => {
      try {
        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            currentPost: {
              id: post.id,
              title: post.title,
              subtitle: post.subtitle,
              category: post.category,
              tags: post.tags
            },
            allPosts: allPosts.map(p => ({
              id: p.id,
              title: p.title,
              subtitle: p.subtitle,
              category: p.category,
              tags: p.tags
            }))
          })
        });

        if (!response.ok) {
          throw new Error("Failed to fetch AI recommendations");
        }

        const data = await response.json();
        if (isMounted) {
          setRelatedRecommendations(data);
          setIsRecommendationsLoading(false);
        }
      } catch (err) {
        console.error("AI recommendations error:", err);
        if (isMounted) {
          setIsRecommendationsLoading(false);
        }
      }
    };

    fetchRecommendations();

    return () => {
      isMounted = false;
    };
  }, [post.id, allPosts]);

  useEffect(() => {
    try {
      const followed = JSON.parse(localStorage.getItem('followed_authors') || '[]');
      setIsFollowing(followed.includes(post.author.name));
    } catch (e) {
      console.error(e);
    }
  }, [post.author.name]);

  const handleToggleFollow = () => {
    try {
      const followed = JSON.parse(localStorage.getItem('followed_authors') || '[]');
      let updated;
      if (isFollowing) {
        updated = followed.filter((name: string) => name !== post.author.name);
      } else {
        updated = [...followed, post.author.name];
      }
      localStorage.setItem('followed_authors', JSON.stringify(updated));
      setIsFollowing(!isFollowing);
    } catch (e) {
      console.error(e);
    }
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!commentName.trim() || !commentText.trim()) {
      setErrorText('Please specify both your name and an article comment.');
      return;
    }

    const newComment: PostComment = {
      id: Date.now().toString(),
      author: commentName.trim(),
      text: commentText.trim(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).toUpperCase(),
    };

    onAddComment(newComment);
    setCommentText('');
    setCommentName('');
  };

  const recommendedPosts = relatedRecommendations
    .map(rec => {
      const matchedPost = allPosts.find(p => p.id === rec.postId);
      if (!matchedPost) return null;
      return {
        post: matchedPost,
        score: rec.score,
        reason: rec.reason
      };
    })
    .filter((r): r is { post: BlogPost; score: number; reason: string } => r !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#0d0d0d] text-[#f5f0e8] pb-24"
    >
      {/* Top action header */}
      <div className="sticky top-[73px] z-20 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#e84b1f]/30 py-4 px-6 md:px-12 flex justify-between items-center relative">
        {/* Scroll Progress Bar */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#e84b1f] origin-left z-30"
          style={{ scaleX }}
        />

        <button
          onClick={onBack}
          className="group flex items-center space-x-2 text-[#f5f0e8]/80 hover:text-[#e84b1f] transition-colors font-mono text-xs tracking-widest uppercase cursor-pointer"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1.5 transition-transform text-[#e84b1f]" />
          <span>RETURN TO CHRONICLES</span>
        </button>

        <div className="flex items-center space-x-3">
          {/* Like */}
          <button
            onClick={() => onLike(post)}
            className={`flex items-center space-x-2 bg-[#0d0d0d] border border-[#f5f0e8]/15 px-3 py-1.5 transition-colors cursor-pointer rounded-xl ${
              isLiked ? 'text-[#e84b1f] border-[#e84b1f]/35' : 'text-[#f5f0e8]/70 hover:text-[#e84b1f]'
            }`}
          >
            <Heart size={15} fill={isLiked ? '#e84b1f' : 'none'} />
            <span className="font-mono text-xs">{post.likes}</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => onToggleBookmark(post)}
            className={`flex items-center space-x-2 bg-[#0d0d0d] border border-[#f5f0e8]/15 px-3 py-1.5 transition-colors cursor-pointer rounded-xl ${
              isBookmarked ? 'text-[#f5c842] border-[#f5c842]/35' : 'text-[#f5f0e8]/70 hover:text-[#f5c842]'
            }`}
          >
            <Bookmark size={15} fill={isBookmarked ? '#f5c842' : 'none'} />
            <span className="hidden sm:inline font-mono text-xs">ARCHIVE</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-2 bg-[#0d0d0d] border border-[#f5f0e8]/15 px-3 py-1.5 hover:text-[#e84b1f] hover:border-[#e84b1f]/35 transition-colors cursor-pointer rounded-xl text-[#f5f0e8]/70"
            title="Copy Shareable Link"
          >
            <Link size={15} />
            <span className="hidden sm:inline font-mono text-xs">COPY LINK</span>
          </button>
        </div>
      </div>

      {/* 1. Full-width dark gradient banner with faint large decorative text */}
      <div className="relative h-[360px] sm:h-[460px] w-full overflow-hidden bg-black select-none border-b border-[#f5f0e8]/10">
        <motion.img
          initial={{ scale: 1.02 }}
          animate={{ scale: 1.15 }}
          transition={{ duration: 12, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          src={post.imageUrl}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter contrast-125 brightness-[0.35] grayscale object-center"
        />
        {/* Full-width dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/60" />
        
        {/* Dynamic decorative watermark running as background corner elements */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-bebas text-[18vw] tracking-[0.4em] text-[#f5f0e8]/5 uppercase font-black">
            {post.category}
          </span>
        </div>

        {/* Floating Category indicator tag */}
        <div className="absolute bottom-10 left-6 sm:left-12">
          <span className="bg-[#e84b1f] text-white py-2 px-4 font-mono text-xs tracking-[0.25em] uppercase font-bold border border-[#e84b1f]/20 shadow-lg rounded-xl">
            {post.category} DIVISION //
          </span>
        </div>
      </div>

      {/* 2. Constrained Content area with desktop grid layout */}
      <div className="max-w-7xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative text-left">
        
        {/* Left Column: Post details, content parsing, comments, etc */}
        <div className="lg:col-span-8 w-full space-y-10">
          
          {/* Header content: red kicker label, big title, and author byline row */}
          <div className="space-y-4">
            {/* Red kicker name/date label */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#e84b1f] tracking-[0.3em] uppercase font-bold">
              <span>{post.category} CHRONICLE</span>
              <span>·</span>
              <span className="text-[#f5f0e8]/50">{post.date}</span>
            </div>

            {/* Large DM Serif Display Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              className="font-serif-display text-4xl sm:text-5xl lg:text-7xl text-[#f5f0e8] leading-tight font-medium italic"
            >
              "{post.title}"
            </motion.h1>

            {/* Subtitle / Excerpt */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
              className="font-sans text-base sm:text-lg text-[#f5f0e8]/75 leading-relaxed border-l-2 border-[#e84b1f]/30 pl-4"
            >
              {post.subtitle}
            </motion.p>

            <div className="h-px bg-[#f5f0e8]/10 w-full pt-2" />

            {/* Author Byline Row: avatar circle, name, read time, views */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-[#f5f0e8]/10">
              <div className="flex items-center space-x-3">
                {/* Avatar circle */}
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#e84b1f]/40 grayscale"
                />
                <div>
                  <span className="font-mono text-[9px] text-[#f5f0e8]/40 tracking-wider block font-bold">WRITTEN BY</span>
                  <div className="flex items-center gap-2.5">
                    <span className="font-bebas text-base text-[#f5f0e8] tracking-widest uppercase">{post.author.name}</span>
                    <button
                      onClick={handleToggleFollow}
                      className={`font-mono text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 border select-none transition-all duration-300 cursor-pointer rounded-lg ${
                        isFollowing 
                          ? 'bg-[#e84b1f] border-[#e84b1f] text-white hover:bg-transparent hover:text-[#e84b1f]' 
                          : 'bg-transparent border-[#f5f0e8]/20 text-[#f5f0e8]/70 hover:border-[#e84b1f] hover:text-[#e84b1f]'
                      }`}
                    >
                      {isFollowing ? '✓ FOLLOWING' : '+ FOLLOW'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-[10px] font-mono text-[#f5f0e8]/50 uppercase">
                <span className="flex items-center"><Clock size={12} className="mr-1 text-[#e84b1f]" /> {post.readTime}</span>
                <span>•</span>
                <span className="text-[#f5c842] font-bold">14.2K VIEWS</span>
              </div>
            </div>
          </div>

          {/* 3. Long-Form Body Parser */}
          <div className="space-y-6">
            {(() => {
              let paragraphIndex = 0;
              return post.content.map((para, idx) => {
                // Parse H2 section headers (starting with ##)
                if (para.startsWith('## ')) {
                  const headingText = para.replace('## ', '');
                  const headingId = `heading-${headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                  return (
                    <motion.h2 
                      key={idx} 
                      id={headingId}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-20px" }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="font-serif-display text-2xl sm:text-3xl text-[#f5f0e8] mt-12 mb-5 leading-snug font-semibold border-b border-[#e84b1f]/10 pb-2 italic scroll-mt-24"
                    >
                      {headingText}
                    </motion.h2>
                  );
                }

                // Parse H3 subheadings inside red Bebas Neue (starting with ###)
                if (para.startsWith('### ')) {
                  return (
                    <motion.h3 
                      key={idx} 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-20px" }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="font-bebas text-xl text-[#e84b1f] tracking-[0.25em] uppercase mt-10 mb-4 font-bold block"
                    >
                      {para.replace('### ', '')}
                    </motion.h3>
                  );
                }

                // Parse blockquotes starting with "> " (pull-quote with red left border)
                if (para.startsWith('> ')) {
                  return (
                    <blockquote 
                      key={idx} 
                      className="my-10 p-6 sm:p-8 bg-[#e84b1f]/5 relative overflow-hidden pl-7 sm:pl-9 rounded-2xl"
                    >
                      {/* Drawing border line left scaleY(0) -> scaleY(1), transform-origin: top, over 800ms when scroll-active */}
                      <motion.div
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        style={{ transformOrigin: 'top' }}
                        className="absolute left-0 top-0 bottom-0 w-1 bg-[#e84b1f]"
                      />
                      <span className="absolute -top-7 -left-3 text-8xl font-serif text-[#e84b1f]/10 pointer-events-none select-none">“</span>
                      <p className="font-serif-display text-lg sm:text-xl text-[#f5f0e8] italic relative z-10 leading-relaxed">
                        {para.replace('> ', '')}
                      </p>
                    </blockquote>
                  );
                }

                // Parse Bullet lists starting with "- "
                if (para.startsWith('- ')) {
                  return (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, margin: "-20px" }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-start space-x-2.5 my-2 pl-4"
                    >
                      <span className="w-1.5 h-1.5 bg-[#e84b1f] mt-2.5 shrink-0 rounded-full" />
                      <span className="font-sans text-sm sm:text-base text-[#f5f0e8]/85 leading-relaxed">
                        {para.replace('- ', '')}
                      </span>
                    </motion.div>
                  );
                }

                // Parse Styled Tip box starting with [TIP] or ⚠️
                if (para.startsWith('[TIP] ') || para.startsWith('⚠️ ')) {
                  const cleanTipContent = para.replace('[TIP] ', '').replace('⚠️ ', '');
                  return (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-20px" }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-[#121212] border-l-4 border-[#f5c842] p-6 my-8 text-sm text-[#f5f0e8]/80 leading-relaxed font-sans shadow-md rounded-r-2xl"
                    >
                      <span className="font-mono text-[9px] text-[#f5c842] uppercase tracking-[0.25em] block mb-2 font-black">
                        // HANDWRITTEN FIELD ARCHIVE DIRECTIVE
                      </span>
                      <p>{cleanTipContent}</p>
                    </motion.div>
                  );
                }

                // Normal paragraphs (with beautiful floating red dropcap for the very first standard paragraph)
                const renderDropCap = paragraphIndex === 0 && para.length > 20;
                if (renderDropCap) {
                  paragraphIndex++;
                  const firstLetter = para.charAt(0);
                  const restOfPara = para.slice(1);
                  return (
                    <motion.p 
                      key={idx} 
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-30px" }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="font-sans text-base sm:text-lg text-[#f5f0e8]/90 leading-relaxed text-justify text-balance"
                    >
                      <span className="font-serif-display text-5xl sm:text-6xl font-bold text-[#e84b1f] float-left mr-3 mt-1.5 leading-none select-none">
                        {firstLetter}
                      </span>
                      {restOfPara}
                    </motion.p>
                  );
                }

                paragraphIndex++;
                return (
                  <motion.p 
                    key={idx} 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-30px" }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="font-sans text-base sm:text-lg text-[#f5f0e8]/85 leading-relaxed text-justify"
                  >
                    {para}
                  </motion.p>
                );
              });
            })()}
          </div>

          {/* Floating Custom Quote block */}
          {post.quotes && post.quotes.map((quote, qIdx) => (
            <blockquote 
              key={qIdx}
              className="my-10 p-8 bg-[#e84b1f]/5 relative overflow-hidden pl-9 rounded-2xl"
            >
              {/* Drawing border line left scaleY(0) -> scaleY(1), transform-origin: top, over 800ms when scroll-active */}
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'top' }}
                className="absolute left-0 top-0 bottom-0 w-1 bg-[#e84b1f]"
              />
              <p className="font-serif-display text-xl sm:text-2xl text-[#f5f0e8] italic relative z-10 leading-normal">
                "{quote}"
              </p>
              <div className="mt-4 font-mono text-[9px] tracking-widest text-[#e84b1f] uppercase font-bold">
                —— VIVID TRUTH RECORDINGS (EDITORS NOTES)
              </div>
            </blockquote>
          ))}

          {/* Tags footer inside container */}
          <div className="flex flex-wrap gap-2 pt-6 border-t border-[#f5f0e8]/10">
            {post.tags.map(tag => (
              <span key={tag} className="font-mono text-[10px] text-[#e84b1f] bg-[#e84b1f]/10 px-3 py-1 font-semibold uppercase rounded-md">
                #{tag}
              </span>
            ))}
          </div>

          {/* Share Section */}
          <div className="bg-[#121212] border border-[#f5f0e8]/5 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 mt-6">
            <div className="space-y-1 text-center md:text-left font-sans">
              <span className="font-mono text-[9px] text-[#f5c842] tracking-widest uppercase block font-bold">
                SHARE CHRONICLE
              </span>
              <h4 className="font-bebas text-xl text-[#f5f0e8] tracking-widest uppercase font-bold">
                SPREAD THE BOLD WISDOM
              </h4>
              <p className="font-sans text-xs text-[#f5f0e8]/50 leading-relaxed max-w-md">
                Share this chronicle's extreme coordinates and analog wisdom with your design, travel or style circles.
              </p>
            </div>
            
            <button
              onClick={handleCopyLink}
              className="group shrink-0 bg-[#e84b1f] hover:bg-[#f5c842] text-white hover:text-black font-bebas text-xs tracking-widest px-6 py-3 transition-colors duration-300 flex items-center space-x-2 select-none cursor-pointer rounded-xl border border-white/5 font-bold"
            >
              <Link size={13} className="group-hover:rotate-12 transition-transform" />
              <span>COPY SHAREABLE LINK</span>
            </button>
          </div>

          {/* Bio segment about the author in the flow */}
          <div className="bg-[#121212] border border-[#f5f0e8]/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-16 rounded-3xl">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-16 h-16 rounded-full object-cover border border-[#e84b1f]/35 grayscale shrink-0"
            />
            <div className="space-y-2 text-center sm:text-left">
              <span className="font-mono text-[9px] text-[#e84b1f] tracking-widest uppercase block font-bold">
                ABOUT THE CHRONICLER
              </span>
              <h4 className="font-bebas text-xl text-[#f5f0e8] tracking-widest uppercase font-bold">
                {post.author.name}
              </h4>
              <p className="font-sans text-xs sm:text-sm text-[#f5f0e8]/65 leading-relaxed">
                {post.author.bio}
              </p>
              <button
                onClick={handleToggleFollow}
                className="mt-2 text-xs font-mono text-[#f5c842] hover:text-[#e84b1f] uppercase tracking-wider underline transition-colors cursor-pointer"
              >
                {isFollowing ? '✓ Already Curating' : '+ Curate This Author'}
              </button>
            </div>
          </div>

          {/* AI Related Articles Section */}
          <div className="mt-16 border-t border-[#f0f0f0]/5 pt-12">
            <div className="flex items-center space-x-3 mb-8">
              <Sparkles className="text-[#f5c842] glow-text-yellow animate-pulse" size={18} />
              <span className="font-bebas text-2xl tracking-widest text-[#f5f0e8] uppercase font-bold glow-text-yellow">
                AI-CURATED RELATED MANUSCRIPTS
              </span>
            </div>

            {isRecommendationsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-black/40 border border-[#f5f0e8]/5 p-5 space-y-3">
                    <div className="h-4 w-1/4 bg-[#f5f0e8]/10 animate-pulse" />
                    <div className="h-6 w-3/4 bg-[#f5f0e8]/10 animate-pulse" />
                    <div className="h-4 w-2/4 bg-[#f5f0e8]/10 animate-pulse" />
                    <div className="h-12 w-full bg-[#f5f0e8]/5 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : recommendedPosts.length === 0 ? (
              <p className="font-serif-display text-sm text-[#f5f0e8]/30 italic pl-2">
                "No supplementary chronicles aligned with the currents of this text are currently cataloged."
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedPosts.map(({ post: recPost, score, reason }) => (
                  <motion.div
                    key={recPost.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => onNavigateToPost?.(recPost)}
                    className="group bg-black hover:bg-[#121212] border border-[#f5f0e8]/10 hover:border-[#e84b1f]/50 p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 relative rounded-2xl overflow-hidden"
                  >
                    {/* Aspect-ratio image preview inside the recommendation card */}
                    <div className="relative overflow-hidden bg-zinc-950 h-32 mb-4 shrink-0 rounded-xl">
                      <img
                        src={recPost.imageUrl}
                        alt={recPost.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 bg-black/80 px-1.5 py-0.5 text-[8px] font-mono text-[#f5c842] glow-text-yellow border border-[#f5c842]/20 uppercase rounded-md">
                        {Math.round(score * 100)}% Match
                      </div>
                    </div>

                    <div className="flex-grow space-y-2">
                      <span className="font-mono text-[9px] text-[#e84b1f] tracking-widest uppercase font-bold block">
                        {recPost.category}
                      </span>
                      <h5 className="font-bebas text-lg text-[#f5f0e8] group-hover:text-[#e84b1f] transition-colors duration-300 leading-tight uppercase tracking-wider font-bold">
                        {recPost.title}
                      </h5>
                      <p className="font-sans text-[11px] text-[#f5f0e8]/75 line-clamp-2">
                        {recPost.subtitle}
                      </p>
                    </div>

                    {/* AI reason display */}
                    <div className="mt-4 pt-3 border-t border-[#f5f0e8]/5">
                      <span className="font-mono text-[8px] text-[#f5c842] tracking-wider uppercase block mb-1">
                        AI CRITIQUE
                      </span>
                      <p className="font-serif-display text-[11px] leading-relaxed text-[#f5f0e8]/50 italic">
                        "{reason}"
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="border-t border-[#f5f0e8]/15 mt-16 pt-12 space-y-8">
            <div className="flex items-center space-x-3 pb-4 border-b border-[#f5f0e8]/5">
              <MessageSquare className="text-[#e84b1f]" size={20} />
              <h3 className="font-bebas text-2xl tracking-widest uppercase font-bold">
                ESSAY MANUSCRIPT DIALOGUE ({post.comments.length})
              </h3>
            </div>

            {/* Thread list */}
            <div className="space-y-6">
              {post.comments.length === 0 ? (
                <p className="font-serif-display text-sm text-[#f5f0e8]/40 italic pl-2">
                  "No public commentaries registered on this parchment yet. Initiate the response log below."
                </p>
              ) : (
                <div className="space-y-4">
                  {post.comments.map((comm) => (
                    <div key={comm.id} className="p-5 bg-black border border-[#f5f0e8]/5 rounded-2xl relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-xs text-[#f5c842] tracking-wider uppercase font-bold">
                          {comm.author}
                        </span>
                        <span className="font-mono text-[9px] text-[#f5f0e8]/30">
                          {comm.date}
                        </span>
                      </div>
                      <p className="font-sans text-sm text-[#f5f0e8]/80 leading-relaxed">
                        {comm.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmitComment} className="bg-[#121212] p-6 border border-[#e84b1f]/15 space-y-4 rounded-3xl">
              <h4 className="font-bebas text-lg tracking-wider text-[#f5f0e8] uppercase">
                LEAVE A DIALOGUE LOG
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono text-[#f5f0e8]/50 tracking-wider">
                    Journal Pseudonym
                  </label>
                  <input
                    type="text"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="e.g. TactileObserver"
                    className="w-full bg-black text-[#f5f0e8] placeholder-[#f5f0e8]/20 text-xs p-3 border border-[#f5f0e8]/20 focus:border-[#e84b1f] focus:outline-none font-mono uppercase rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-mono text-[#f5f0e8]/50 tracking-wider">
                  Commentary Content
                </label>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Log your deep tactile response on design, routine, or travel coordinates..."
                  className="w-full bg-black text-[#f5f0e8] placeholder-[#f5f0e8]/20 text-xs p-3 border border-[#f5f0e8]/20 focus:border-[#e84b1f] focus:outline-none font-sans rounded-xl"
                />
              </div>

              {errorText && (
                <p className="text-[#e84b1f] font-mono text-xs">
                  ⚠️ {errorText}
                </p>
              )}

              <button
                type="submit"
                className="bg-[#e84b1f] hover:bg-[#f5c842] text-[#f5f0e8] hover:text-[#0d0d0d] font-bebas text-xs tracking-widest px-6 py-3.5 transition-colors duration-300 flex items-center space-x-2 select-none cursor-pointer rounded-xl border border-white/5"
              >
                <Send size={12} />
                <span>PUBLISH TRANSCRIPT COMMENT</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Sticky desktop-only sidebar */}
        <aside className="lg:col-span-4 hidden lg:block sticky top-[150px] space-y-8 bg-[#0a0a09] border border-white/5 p-6 rounded-3xl overflow-y-auto max-h-[82vh] scrollbar-none">
          
          {/* A. AUTHOR CARD */}
          <div className="space-y-4 pb-6 border-b border-white/10 text-left">
            <span className="font-mono text-[9px] text-[#e84b1f] uppercase tracking-widest block font-bold">// THE CHRONICLER</span>
            <div className="flex items-center space-x-3.5">
              <img 
                src={post.author.avatar} 
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover grayscale border border-[#e84b1f]/30"
              />
              <div>
                <h4 className="font-bebas text-lg text-white tracking-widest uppercase font-bold inline-block">{post.author.name}</h4>
                <p className="font-mono text-[9px] text-[#f5c842] uppercase tracking-wider block">VIVID EDITORIAL PARTNER</p>
              </div>
            </div>
            <p className="font-sans text-xs text-[#f5f0e8]/70 leading-relaxed text-balance">
              {post.author.bio}
            </p>
            {/* Social Links placeholder */}
            <div className="flex items-center space-x-3 text-zinc-500 pt-1 text-xs font-mono">
              <span className="text-[9px] text-zinc-500 uppercase font-bold">LINKS:</span>
              <a href="#" className="hover:text-[#e84b1f] lowercase tracking-[0.05em] transition-colors">@vivid_mag</a>
              <span className="text-zinc-800">&middot;</span>
              <a href="#" className="hover:text-[#e84b1f] lowercase tracking-[0.05em] transition-colors">vivid.la/hq</a>
            </div>
          </div>

          {/* B. TABLE OF CONTENTS */}
          {(() => {
            const h2s = post.content
              .filter(para => para.startsWith('## '))
              .map(para => para.replace('## ', ''));
            if (h2s.length === 0) return null;
            return (
              <div className="space-y-3 pb-6 border-b border-white/10 text-left">
                <span className="font-mono text-[9px] text-[#f5c842] uppercase tracking-[0.2em] block font-black">// PARCHMENT NAVIGATION</span>
                <h4 className="font-bebas text-base text-white tracking-widest uppercase">TABLE OF CONTENTS</h4>
                <div className="space-y-2 mt-2">
                  {h2s.map((headingText, hIdx) => {
                    const headingId = `heading-${headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                    return (
                      <button
                        key={hIdx}
                        onClick={() => {
                          const element = document.getElementById(headingId);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="w-full text-left font-serif text-xs text-[#f5f0e8]/60 hover:text-[#e84b1f] transition-all flex items-center space-x-2 py-0.5"
                      >
                        <span className="text-[#e84b1f] font-mono text-[9px]">0{hIdx+1}</span>
                        <span className="truncate">"{headingText}"</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* C. READING PROGRESS */}
          <div className="space-y-2.5 pb-6 border-b border-white/10 text-left">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">// PROGRESS COHERENCE</span>
            <div className="flex justify-between items-center">
              <span className="font-bebas text-sm text-stone-300 tracking-wider">READING METRIC:</span>
              <span className="font-mono text-xs text-[#f5c842] font-black">{sidebarProgress}% COMPLETE</span>
            </div>
            <div className="h-1 w-full bg-[#1b1b1b] rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-[#e84b1f] to-[#f5c842] transition-all duration-150"
                style={{ width: `${sidebarProgress}%` }}
              />
            </div>
          </div>

          {/* D. RELATED RECOMMENDATIONS */}
          {allPosts.length > 0 && (
            <div className="space-y-3 pb-6 border-b border-white/10 text-left">
              <span className="font-mono text-[9px] text-stone-400 uppercase tracking-widest block font-bold">// SUPP CHRONICLES</span>
              <h4 className="font-bebas text-base text-white tracking-widest uppercase">YOU MIGHT ALSO LIKE</h4>
              <div className="space-y-2.5 mt-2">
                {allPosts
                  .filter(p => p.id !== post.id && p.category === post.category)
                  .concat(allPosts.filter(p => p.id !== post.id && p.category !== post.category))
                  .slice(0, 4)
                  .map((rp) => (
                    <div 
                      key={rp.id}
                      onClick={() => onNavigateToPost?.(rp)}
                      className="flex items-center space-x-3 p-2 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl cursor-pointer transition-all group text-left"
                    >
                      <img 
                        src={rp.imageUrl} 
                        alt={rp.title}
                        className="w-10 h-10 rounded-lg object-cover grayscale border border-white/5 shrink-0" 
                      />
                      <div className="min-w-0 flex-grow">
                        <span className="font-mono text-[8px] text-[#e84b1f] uppercase block">{rp.category}</span>
                        <h5 className="font-serif-display text-xs text-white group-hover:text-[#e84b1f] transition-colors truncate">
                          "{rp.title}"
                        </h5>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* E. POPULAR THIS WEEK (TOP 5) */}
          {allPosts.length > 0 && (
            <div className="space-y-3.5 pb-6 border-b border-white/10 text-left">
              <span className="font-mono text-[9px] text-[#f5c842] uppercase tracking-[0.2em] block font-black">// ENERGY DENSE LOGS</span>
              <h4 className="font-bebas text-base text-white tracking-widest uppercase">POPULAR THIS WEEK</h4>
              <div className="space-y-3 mt-2">
                {[...allPosts]
                  .sort((a,b) => b.likes - a.likes)
                  .slice(0, 5)
                  .map((hp, hIdx) => (
                    <div 
                      key={hp.id}
                      onClick={() => onNavigateToPost?.(hp)}
                      className="flex items-start space-x-3 cursor-pointer group text-left"
                    >
                      <span className="font-bebas text-[#e84b1f] text-2xl leading-none">0{hIdx+1}</span>
                      <div className="min-w-0">
                        <span className="font-mono text-[7.5px] text-zinc-500 uppercase block tracking-wider">{hp.category} DIORAMA</span>
                        <h5 className="font-serif-display text-xs text-white group-hover:text-[#e84b1f] transition-all truncate leading-snug">
                          "{hp.title}"
                        </h5>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* F. NEWSLETTER MINI-SIGNUP */}
          <div className="bg-black border border-white/5 p-4 rounded-xl text-left space-y-3">
            <span className="font-mono text-[8.5px] text-[#e84b1f] uppercase tracking-widest block font-bold">// SECURE TELEMETRY</span>
            <p className="font-sans text-[11px] text-[#f5f0e8]/60 leading-normal">
              Receive premium hand-curated archives directly from Lagos studios.
            </p>
            {miniMailSubbed ? (
              <div className="text-[10px] bg-[#e84b1f]/10 text-[#e84b1f] p-2 rounded-xl text-center font-mono">
                ✓ CONNECTED TO HOOKS
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (miniMailValue.trim()) {
                    setMiniMailSubbed(true);
                    setTimeout(() => {
                      setMiniMailSubbed(false);
                      setMiniMailValue('');
                    }, 3000);
                  }
                }}
                className="flex gap-2"
              >
                <input 
                  type="email"
                  value={miniMailValue}
                  onChange={(e) => setMiniMailValue(e.target.value)}
                  placeholder="secure@mail.com"
                  required
                  className="bg-zinc-950 font-mono text-[10px] text-white placeholder-stone-600 px-2.5 py-1.5 rounded-lg flex-grow border border-white/10 focus:outline-none focus:border-[#e84b1f]"
                />
                <button 
                  type="submit"
                  className="bg-[#e84b1f] hover:bg-[#f5c842] hover:text-black text-white px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer"
                >
                  OK
                </button>
              </form>
            )}
          </div>

          {/* G. CURRENT DECLARED VIBE */}
          <div className="border border-dashed border-[#e84b1f]/30 p-4 rounded-xl bg-zinc-950/20 text-left">
            <span className="font-mono text-[8px] text-[#f5c842] uppercase tracking-[0.15em] font-black block mb-1">// WEEKLY VIBE CODES</span>
            <p className="font-serif italic text-xs text-[#f5f0e8]/75 leading-relaxed">
              "This week I'm obsessed with Bode Thomas at 9PM, this essay by Chimamanda, and the fact that mango season is almost here."
            </p>
          </div>

        </aside>

      </div>

      {/* Toast notification confirmation banner */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-black border border-[#e84b1f] shadow-2xl rounded-2xl p-4 flex items-center space-x-3.5 min-w-[280px] max-w-sm sm:min-w-[320px] shadow-red-500/10 pointer-events-auto"
          >
            <div className="w-8 h-8 rounded-full bg-[#e84b1f]/10 border border-[#e84b1f]/30 flex items-center justify-center text-[#e84b1f]">
              <Check size={16} strokeWidth={2.5} />
            </div>
            <div className="flex-grow min-w-0">
              <span className="font-mono text-[9px] text-[#e84b1f] uppercase tracking-widest block font-bold">
                SYSTEM MESSAGE
              </span>
              <p className="font-bebas text-base text-[#f5f0e8] tracking-wider leading-relaxed">
                CHRONICLE LINK COPIED
              </p>
              <p className="font-sans text-[10px] text-[#f5f0e8]/50 overflow-hidden text-ellipsis whitespace-nowrap">
                Copied: {`${window.location.origin}${window.location.pathname}?post=${post.id}`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
