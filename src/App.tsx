import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturedSection from './components/FeaturedSection';
import CategoriesSection from './components/CategoriesSection';
import AboutSection from './components/AboutSection';
import ArticlesGrid from './components/ArticlesGrid';
import ArticleReader from './components/ArticleReader';
import MoodBoard from './components/MoodBoard';
import NewsletterWidget from './components/NewsletterWidget';
import CreatePostModal from './components/CreatePostModal';
import { BlogPost, Category, PostComment } from './types';
import { INITIAL_POSTS } from './data';
import { getExpandedPosts } from './expandedUniverse';
import BlueprintSection from './components/BlueprintSection';
import NewHomepageSections from './components/NewHomepageSections';
import CategoryStoriesLanding from './components/CategoryStoriesLanding';
import CategorizedHub from './components/CategorizedHub';
import AdminPanel from './components/AdminPanel';
import { Bookmark, Flame, Sparkles, ArrowUp } from 'lucide-react';
import Preloader from './components/Preloader';
import VividLogo from './components/VividLogo';
import CustomCursor from './components/CustomCursor';

export default function App() {
  // 1. Core States
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL' | 'SAVED' | 'MOOD' | 'BLUEPRINT' | 'ADMIN'>('ALL');
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll Tracking for reading progress and back-to-top button
  const [scrollPercent, setScrollPercent] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollPercent(window.scrollY / totalHeight);
      }
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Load and sync data from full-stack backend
  useEffect(() => {
    const cachedSaved = localStorage.getItem('vivid_saved_ids');
    const cachedLiked = localStorage.getItem('vivid_liked_ids');

    // First load from memory cache quickly
    const cachedPosts = localStorage.getItem('vivid_posts');
    if (cachedPosts) {
      try {
        setPosts(JSON.parse(cachedPosts));
      } catch (e) {
        setPosts(getExpandedPosts());
      }
    } else {
      setPosts(getExpandedPosts());
    }

    // Now issue robust direct fetch request to live Express/Supabase database
    fetch("/api/posts")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("HTTP error");
      })
      .then(data => {
        if (data && data.length > 0) {
          setPosts(data);
          localStorage.setItem('vivid_posts', JSON.stringify(data));
        }
      })
      .catch(err => {
        console.log("ℹ️ Standard local mode: Using embedded memory cache fallback.", err);
      });

    if (cachedSaved) {
      try { setSavedPostIds(JSON.parse(cachedSaved)); } catch (e) {}
    }
    if (cachedLiked) {
      try { setLikedPostIds(JSON.parse(cachedLiked)); } catch (e) {}
    }
  }, []);

  // Sync active post to URL query parameters for live shareable routes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activePost) {
      if (params.get('post') !== activePost.id) {
        params.set('post', activePost.id);
        window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
      }
    } else {
      if (params.has('post')) {
        params.delete('post');
        const queryStr = params.toString();
        const newUrl = queryStr ? `${window.location.pathname}?${queryStr}` : window.location.pathname;
        window.history.pushState({}, '', newUrl);
      }
    }
  }, [activePost]);

  // Handle initialization of deep-linked article
  useEffect(() => {
    if (posts.length > 0 && !activePost) {
      const params = new URLSearchParams(window.location.search);
      const postId = params.get('post');
      if (postId) {
        const foundPost = posts.find(p => p.id === postId);
        if (foundPost) {
          setActivePost(foundPost);
        }
      }
    }
  }, [posts, activePost]);

  // 3. Sync triggers
  const savePostsToStorage = (updatedPosts: BlogPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('vivid_posts', JSON.stringify(updatedPosts));
  };

  const handleToggleBookmark = (post: BlogPost, e?: any) => {
    if (e) e.stopPropagation();
    let updated;
    if (savedPostIds.includes(post.id)) {
      updated = savedPostIds.filter(id => id !== post.id);
    } else {
      updated = [...savedPostIds, post.id];
    }
    setSavedPostIds(updated);
    localStorage.setItem('vivid_saved_ids', JSON.stringify(updated));
  };

  const handleLike = (post: BlogPost, e?: any) => {
    if (e) e.stopPropagation();
    
    let updatedLikesIds;
    let increment = 1;

    if (likedPostIds.includes(post.id)) {
      updatedLikesIds = likedPostIds.filter(id => id !== post.id);
      increment = -1;
    } else {
      updatedLikesIds = [...likedPostIds, post.id];
    }

    setLikedPostIds(updatedLikesIds);
    localStorage.setItem('vivid_liked_ids', JSON.stringify(updatedLikesIds));

    // Update inside list state
    const updatedList = posts.map(p => {
      if (p.id === post.id) {
        return { ...p, likes: Math.max(0, p.likes + increment) };
      }
      return p;
    });

    savePostsToStorage(updatedList);
    
    // Update active post if open
    if (activePost && activePost.id === post.id) {
      setActivePost({ ...activePost, likes: Math.max(0, activePost.likes + increment) });
    }

    // Sync seamlessly with backend
    fetch(`/api/posts/${post.id}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ increment })
    }).catch(err => console.error("Database failed to sync like:", err));
  };

  const handleCreatePost = (newPost: BlogPost) => {
    const updated = [newPost, ...posts];
    savePostsToStorage(updated);

    // Sync seamlessly with backend
    fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    }).catch(err => console.error("Database failed to create post:", err));
  };

  const handleUpdatePost = (postId: string, updatedPost: BlogPost) => {
    const updated = posts.map(p => p.id === postId ? updatedPost : p);
    savePostsToStorage(updated);
    if (activePost && activePost.id === postId) {
      setActivePost(updatedPost);
    }

    // Sync seamlessly with backend
    fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost)
    }).catch(err => console.error("Database failed to update post:", err));
  };

  const handleDeletePost = (postId: string) => {
    const updated = posts.filter(p => p.id !== postId);
    savePostsToStorage(updated);
    if (activePost && activePost.id === postId) {
      setActivePost(null);
    }

    // Sync seamlessly with backend
    fetch(`/api/posts/${postId}`, {
      method: "DELETE"
    }).catch(err => console.error("Database failed to delete post:", err));
  };

  const handlePurgeAllPosts = () => {
    savePostsToStorage([]);
    if (activePost) {
      setActivePost(null);
    }

    // Sync seamlessly with backend
    fetch("/api/posts/purge", {
      method: "POST"
    }).catch(err => console.error("Database failed to purge posts:", err));
  };

  const handleAddComment = (comment: PostComment) => {
    if (!activePost) return;

    const updatedList = posts.map(p => {
      if (p.id === activePost.id) {
        return { ...p, comments: [comment, ...p.comments] };
      }
      return p;
    });

    savePostsToStorage(updatedList);
    setActivePost({ ...activePost, comments: [comment, ...activePost.comments] });

    // Sync seamlessly with backend
    fetch(`/api/posts/${activePost.id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment)
    }).catch(err => console.error("Database failed to record comment:", err));
  };

  // Helper selectors
  const visiblePosts = posts.filter(post => {
    if (activeCategory === 'ALL' || activeCategory === 'SAVED' || activeCategory === 'MOOD' || activeCategory === 'BLUEPRINT') return true;
    return post.category === activeCategory;
  });

  const savedPosts = posts.filter(post => savedPostIds.includes(post.id));

  // Determine primary & side featured posts
  const primaryPost = visiblePosts.length > 0 ? visiblePosts[0] : null;
  const sidePosts = visiblePosts.length > 1 ? visiblePosts.slice(1, 16) : [];

  // Remaining list excludes featured elements to avoid duplication
  const gridViewPosts = activeCategory === 'SAVED' 
    ? savedPosts 
    : (activeCategory === 'ALL'
        ? visiblePosts.slice(16) // Skip primary and 15 side posts for home grid
        : (primaryPost ? visiblePosts.slice(1) : visiblePosts));

  return (
    <>
      {/* Trailing fine-grain mouse custom cursor */}
      <CustomCursor />

      {/* Immersive Preloader Overlay */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader key="app-preloader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#0d0d0d] text-[#f5f0e8] font-sans antialiased flex flex-col justify-between">
      
      {/* Thin Fixed Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#e84b1f] z-[60] origin-left transition-all duration-300 ease-out" 
        style={{ transform: `scaleX(${scrollPercent})` }}
      />
      
      {/* Absolute Header Navigation */}
      <Header
        activeCategory={activeCategory}
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          setActivePost(null); // Clear reader on category navigation
          setSearchQuery(''); // Also clear search queries
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedPostIds.length}
        openCreateModal={() => setIsCreateOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={(query) => {
          setSearchQuery(query);
          if (query) {
            setActivePost(null); // Clear active article on search to display matching cards
          }
        }}
        posts={posts}
      />

      {/* Main Body */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {/* Active Reader Mode */}
          {activePost ? (
            <ArticleReader
              key={`reader-${activePost.id}`}
              post={activePost}
              onBack={() => {
                setActivePost(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isBookmarked={savedPostIds.includes(activePost.id)}
              onToggleBookmark={handleToggleBookmark}
              onLike={handleLike}
              isLiked={likedPostIds.includes(activePost.id)}
              onAddComment={handleAddComment}
              allPosts={posts}
              onNavigateToPost={(post) => {
                setActivePost(post);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            // Feed & Boards Directory Views
            <motion.div
              key={`feed-${activeCategory}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category selector triggers */}

              {/* 1. Admin Management Deck Panel */}
              {activeCategory === 'ADMIN' ? (
                <AdminPanel
                  posts={posts}
                  onAddPost={handleCreatePost}
                  onUpdatePost={handleUpdatePost}
                  onDeletePost={handleDeletePost}
                  onPurgeAllPosts={handlePurgeAllPosts}
                  onClose={() => {
                    setActiveCategory('ALL');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ) : activeCategory === 'BLUEPRINT' ? (
                <BlueprintSection />
              ) : activeCategory === 'SAVED' ? (
                <div className="max-w-7xl mx-auto px-6 py-12">
                  <div className="border-b border-[#e84b1f]/20 pb-8 mb-12">
                    <span className="font-mono text-[9px] text-[#e84b1f] tracking-widest uppercase font-bold">
                      VISUAL CACHE
                    </span>
                    <h2 className="font-bebas text-5xl tracking-widest text-[#f5f0e8] uppercase">
                      YOUR ARCHIVED COLLECTIBLES
                    </h2>
                    <p className="font-serif-display text-base text-[#f5f0e8]/50 italic">
                      Chronicles and high-end essays you have pinned for slow contemplation.
                    </p>
                  </div>

                  {savedPosts.length === 0 ? (
                    <div className="py-24 text-center border border-dashed border-[#e84b1f]/20 bg-[#000000]/50">
                      <Bookmark size={32} className="mx-auto text-[#e84b1f]/60 mb-4 animate-bounce" />
                      <h3 className="font-bebas text-2xl text-[#f5f0e8] tracking-widest uppercase mb-1">
                        YOUR ARCHIVES ARE EMPTY
                      </h3>
                      <p className="font-serif-display text-sm text-[#f5f0e8]/40 italic max-w-sm mx-auto mb-6">
                        "Go back to the catalog, discover rich essays, and press save to preserve analog wisdom here."
                      </p>
                      <button
                        onClick={() => setActiveCategory('ALL')}
                        className="bg-[#e84b1f] text-white font-bebas text-xs tracking-widest px-6 py-2.5 uppercase transition-colors hover:bg-[#f5c842] hover:text-[#0d0d0d] cursor-pointer"
                      >
                        Explore Journals
                      </button>
                    </div>
                  ) : (
                    <ArticlesGrid
                      posts={savedPosts}
                      onRead={(p) => {
                        setActivePost(p);
                        window.scrollTo({ top: 0 });
                      }}
                      savedIds={savedPostIds}
                      likedIds={likedPostIds}
                      onToggleBookmark={handleToggleBookmark}
                      onLike={handleLike}
                      activeCategory="SAVED"
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
                  )}
                </div>
              ) : activeCategory === 'MOOD' ? (
                /* 2. Custom Interactive MoodBoard View */
                <MoodBoard />
              ) : (
                /* 3. Standard Magazine Layout (Hero + Featured + Grid) */
                <div className="space-y-0">
                  {/* New Premium Two-Column Hero on main ALL view */}
                  {activeCategory === 'ALL' && searchQuery === '' && (
                    <HeroSection
                      onReadLatest={() => {
                        const target = document.getElementById('hub-section-MINDSET');
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      onMeetMe={() => {
                        const element = document.getElementById('newsletter-section');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    />
                  )}

                  {/* Clean, categorized dashboard hub exclusively on ALL page with no search query */}
                  {activeCategory === 'ALL' && searchQuery === '' && posts.length > 0 ? (
                    <CategorizedHub
                      posts={posts}
                      onRead={(p) => {
                        setActivePost(p);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onSelectCategory={(cat) => {
                        setActiveCategory(cat);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      savedIds={savedPostIds}
                      likedIds={likedPostIds}
                      onToggleBookmark={handleToggleBookmark}
                      onLike={handleLike}
                    />
                  ) : (
                    /* Render standard flat filtered list (including searches and specific categories) */
                    <ArticlesGrid
                      posts={activeCategory === 'ALL' ? posts : gridViewPosts}
                      onRead={(p) => {
                        setActivePost(p);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      savedIds={savedPostIds}
                      likedIds={likedPostIds}
                      onToggleBookmark={handleToggleBookmark}
                      onLike={handleLike}
                      activeCategory={activeCategory}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
                  )}

                  {/* Categories stream selection section (available on categorised list pages) */}
                  {activeCategory !== 'ALL' && activeCategory !== 'SAVED' && activeCategory !== 'MOOD' && (
                    <CategoriesSection
                      posts={posts}
                      onSelectCategory={(cat) => {
                        setActiveCategory(cat);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onSelectPost={(post) => {
                        setActivePost(post);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  )}

                  {/* Custom About Founder Section (ONLY on main ALL category page) */}
                  {activeCategory === 'ALL' && searchQuery === '' && (
                    <AboutSection
                      onSubscribe={() => {
                        const widget = document.getElementById('newsletter-section');
                        if (widget) {
                          widget.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    />
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Newsletter Widget - embedded gracefully above footer */}
      <NewsletterWidget />

      {/* Immersive four-column footer */}
      <footer className="bg-black border-t border-[#f5f0e8]/10 py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-left">
          
          {/* Column 1 — Brand Logo & Manifesto */}
          <div className="space-y-4">
            <button
              onClick={() => {
                setActivePost(null);
                setActiveCategory('ALL');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-bebas text-3xl tracking-widest text-[#f5f0e8] uppercase hover:text-[#e84b1f] transition-colors cursor-pointer flex items-center space-x-2.5 font-extrabold text-left"
            >
              <VividLogo size={32} className="text-[#e84b1f]" />
              <span>VIVID<span className="text-[#e84b1f]">.</span><span className="text-[#e84b1f]">.</span></span>
            </button>
            <p className="font-sans text-[11px] text-[#f5f0e8]/50 leading-relaxed text-justify">
              We deconstruct modern lifestyles with zero filter. A fierce curation of modern brutalist design monuments, pure acoustic vinyl soundscapes, sub-zero open fires, and the extreme coordinates of human travel.
            </p>
            <div className="font-mono text-[9px] text-[#e84b1f]/75 tracking-widest uppercase font-bold">
              EST. 2024 &middot; LAGOS & CO.
            </div>
          </div>

          {/* Column 2 — All 8 Directories / Categories */}
          <div className="space-y-4">
            <span className="font-mono text-[9px] text-[#f5c842] tracking-[0.25em] block uppercase font-black">
              // DIRECTORIES
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono tracking-wider">
              {['MINDSET', 'STYLE', 'TRAVEL', 'FINANCE', 'WELLNESS', 'FOOD', 'HOME', 'CULTURE', 'CARS', 'EDUCATION'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActivePost(null);
                    setActiveCategory(cat as any);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#e84b1f] text-[#f5f0e8]/65 transition-colors cursor-pointer text-left block"
                >
                  #{cat}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3 — Resources & Navigation */}
          <div className="space-y-4">
            <span className="font-mono text-[9px] text-[#f5c842] tracking-[0.25em] block uppercase font-black">
              // CHRONICLE LINKS
            </span>
            <div className="space-y-2 text-[11px] font-mono select-none">
              <button
                onClick={() => {
                  setActivePost(null);
                  setActiveCategory('ALL');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#e84b1f] text-[#f5f0e8]/65 transition-colors cursor-pointer block text-left w-full"
              >
                1. HOME CATALOG
              </button>
              <button
                onClick={() => {
                  setActivePost(null);
                  setActiveCategory('SAVED');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#e84b1f] text-[#f5f0e8]/65 transition-colors cursor-pointer block text-left w-full"
              >
                2. SAVED VAULT
              </button>
              <button
                onClick={() => {
                  setActivePost(null);
                  setActiveCategory('MOOD');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#e84b1f] text-[#f5f0e8]/65 transition-colors cursor-pointer block text-left w-full"
              >
                3. MOODBOARD DIRECTORY
              </button>
              <button
                onClick={() => {
                  setIsCreateOpen(true);
                }}
                className="hover:text-[#e84b1f] text-[#e84b1f]/80 transition-colors cursor-pointer block text-left w-full font-bold"
              >
                4. WRITE CONTRIBUTION +
              </button>
            </div>
          </div>

          {/* Column 4 — Lagos HQ Coordinates */}
          <div className="space-y-4">
            <span className="font-mono text-[9px] text-[#f5c842] tracking-[0.25em] block uppercase font-black">
              // LAGOS HQ COORDINATES
            </span>
            <div className="space-y-2.5 text-[11px] font-mono text-[#f5f0e8]/55 leading-relaxed">
              <div>
                <span className="text-[#e84b1f] font-bold">📍 ADDRESS:</span> 
                <p className="mt-0.5">14 Taruwa Cres, Victoria Island, Lagos, Nigeria.</p>
              </div>
              <div>
                <span className="text-[#e84b1f] font-bold">📧 INQUIRIES:</span> 
                <p className="mt-0.5 select-all">editorial-desk@vivid.news</p>
              </div>
            </div>
          </div>

        </div>

        {/* Thick footer separator bottom */}
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-[#f5f0e8]/30 uppercase tracking-widest gap-4">
          <span>© 2026 VIVID CHRONICLE LTD.</span>
          <span>CURATED METICULOUSLY ACCROSS SHIBUYA, BERLIN AND LAGOS</span>
        </div>
      </footer>

      {/* Drafting room Modal component */}
      <AnimatePresence>
        {isCreateOpen && (
          <CreatePostModal
            onClose={() => setIsCreateOpen(false)}
            onCreatePost={(post) => {
              handleCreatePost(post);
              // Set the active category to ALL to view list immediately
              setActiveCategory('ALL');
              setActivePost(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Back-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ y: -4, scale: 1.1 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-[#e84b1f] hover:bg-[#f5c842] text-white hover:text-black rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer group"
          >
            <ArrowUp size={18} className="translate-y-[-1px] group-hover:scale-y-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
