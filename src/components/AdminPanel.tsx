import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit3, Trash2, Heart, MessageSquare, Tag, 
  Sparkles, Compass, AlertTriangle, ArrowLeft, Save, 
  Image, User, Check, X, Eye, FileText, ChevronRight, TrendingUp
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { BlogPost, Category, PostComment, Author } from '../types';

interface AdminPanelProps {
  posts: BlogPost[];
  onAddPost: (post: BlogPost) => void;
  onUpdatePost: (id: string, updated: BlogPost) => void;
  onDeletePost: (id: string) => void;
  onPurgeAllPosts?: () => void;
  onClose: () => void;
  onLogout?: () => void;
}

const CATEGORIES: Category[] = [
  'MINDSET', 'STYLE', 'TRAVEL', 'FINANCE', 'WELLNESS', 
  'FOOD', 'HOME', 'CULTURE', 'CARS', 'EDUCATION'
];

type ViewMode = 'dashboard' | 'compose' | 'comments';

// Pre-packaged gorgeous Unsplash editorial imagery categories to select easily
const EDITORIAL_THEMES = [
  { name: "Minimal Concrete", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" },
  { name: "Grainy Overpass", url: "https://images.unsplash.com/photo-1542362567-b07eac79093d?auto=format&fit=crop&w=1200&q=80" },
  { name: "Brutalist Pillar", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80" },
  { name: "Vintage Asphalt", url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80" },
  { name: "Sourdough Wood-smoke", url: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1200&q=80" },
  { name: "Raw Loom Stitch", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80" }
];

export default function AdminPanel({
  posts,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  onPurgeAllPosts,
  onClose,
  onLogout
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState(false);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  
  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<Category | 'ALL'>('ALL');
  
  // Composer Editing States
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<Category>('MINDSET');
  const [imageUrl, setImageUrl] = useState('');
  const [readTime, setReadTime] = useState('7 MIN READ');
  const [authorName, setAuthorName] = useState('Yusuf O.');
  const [authorAvatar, setAuthorAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80');
  const [authorBio, setAuthorBio] = useState('Lead Archival Curator & Chief of Creative Frameworks.');
  
  // Custom multi-field composers
  const [contentParagraphs, setContentParagraphs] = useState<string[]>(['']);
  const [pullQuotes, setPullQuotes] = useState<string[]>(['']);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['ARCHIVE', 'CHRONICLE']);

  // Liking confirmation logic
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  // Chart configuration controls
  const [trendScale, setTrendScale] = useState<'daily' | 'monthly'>('daily');
  const [chartMetric, setChartMetric] = useState<'individual' | 'cumulative'>('individual');

  // Formulate the comment volume trends over time
  const commentTrendData = useMemo(() => {
    const datesMap: Record<string, number> = {};
    const monthlyMap: Record<string, number> = {};

    posts.forEach(post => {
      if (post.comments) {
        post.comments.forEach(c => {
          if (!c.date) return;
          const dStr = c.date.trim().toUpperCase();
          datesMap[dStr] = (datesMap[dStr] || 0) + 1;

          // Also group by Month-Year (e.g., "MAY 2026") for a macro monthly trend
          // Match month, optional day, and year
          const match = dStr.match(/([A-Z]+)\s+\d+,\s*(\d+)/);
          if (match) {
            const mYear = `${match[1]} ${match[2]}`;
            monthlyMap[mYear] = (monthlyMap[mYear] || 0) + 1;
          } else {
            // General fallback month parsing
            const simpleParts = dStr.split(' ');
            if (simpleParts.length >= 3) {
              const mYearFallback = `${simpleParts[0]} ${simpleParts[2]}`;
              monthlyMap[mYearFallback] = (monthlyMap[mYearFallback] || 0) + 1;
            }
          }
        });
      }
    });

    // Convert keys of datesMap to array and sort chronologically
    const sortedDatesStr = Object.keys(datesMap).sort((a, b) => {
      const timeA = Date.parse(a) || 0;
      const timeB = Date.parse(b) || 0;
      return timeA - timeB;
    });

    let runningTotal = 0;
    const dailyData = sortedDatesStr.map(dateStr => {
      const dailyCount = datesMap[dateStr];
      runningTotal += dailyCount;
      return {
        label: dateStr,
        comments: dailyCount,
        cumulative: runningTotal
      };
    });

    // Sort months chronologically
    const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const sortedMonthsStr = Object.keys(monthlyMap).sort((a, b) => {
      const [mA, yA] = a.split(' ');
      const [mB, yB] = b.split(' ');
      if (yA && yB && yA !== yB) return parseInt(yA) - parseInt(yB);
      return monthsOrder.indexOf(mA) - monthsOrder.indexOf(mB);
    });

    let cumulativeMonth = 0;
    const monthlyData = sortedMonthsStr.map(mStr => {
      const count = monthlyMap[mStr];
      cumulativeMonth += count;
      return {
        label: mStr,
        comments: count,
        cumulative: cumulativeMonth
      };
    });

    return {
      daily: dailyData,
      monthly: monthlyData
    };
  }, [posts]);

  // --- STATS COMPUTATION ---
  const stats = useMemo(() => {
    let totalLikes = 0;
    let totalComments = 0;
    const catFrequency: Record<Category, number> = {} as any;
    
    CATEGORIES.forEach(c => { catFrequency[c] = 0; });
    
    posts.forEach(p => {
      totalLikes += p.likes || 0;
      totalComments += (p.comments || []).length;
      if (p.category && CATEGORIES.includes(p.category)) {
        catFrequency[p.category] = (catFrequency[p.category] || 0) + 1;
      }
    });

    return {
      totalArticles: posts.length,
      totalLikes,
      totalComments,
      catFrequency
    };
  }, [posts]);

  // Aggregate comments across all posts for simple management
  const aggregatedComments = useMemo(() => {
    const list: Array<{ post: BlogPost; comment: PostComment }> = [];
    posts.forEach(p => {
      if (p.comments && p.comments.length > 0) {
        p.comments.forEach(c => {
          list.push({ post: p, comment: c });
        });
      }
    });
    // Sort comments (or pseudo-sort if dates are standardized)
    return list;
  }, [posts]);

  // Filtered posts for display
  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategoryFilter === 'ALL' || p.category === selectedCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategoryFilter]);

  // --- COMPOSER HANDLERS ---
  const handleStartCompose = (postToEdit?: BlogPost) => {
    if (postToEdit) {
      setEditingPostId(postToEdit.id);
      setTitle(postToEdit.title);
      setSubtitle(postToEdit.subtitle);
      setCategory(postToEdit.category);
      setImageUrl(postToEdit.imageUrl);
      setReadTime(postToEdit.readTime);
      setAuthorName(postToEdit.author.name);
      setAuthorAvatar(postToEdit.author.avatar);
      setAuthorBio(postToEdit.author.bio);
      setContentParagraphs(postToEdit.content && postToEdit.content.length > 0 ? [...postToEdit.content] : ['']);
      setPullQuotes(postToEdit.quotes && postToEdit.quotes.length > 0 ? [...postToEdit.quotes] : ['']);
      setTags(postToEdit.tags && postToEdit.tags.length > 0 ? [...postToEdit.tags] : ['ARCHIVE']);
    } else {
      // Create new clean slate
      setEditingPostId(null);
      setTitle('');
      setSubtitle('');
      setCategory('MINDSET');
      // Assign default random Unsplash editorial
      const randomTheme = EDITORIAL_THEMES[Math.floor(Math.random() * EDITORIAL_THEMES.length)];
      setImageUrl(randomTheme.url);
      setReadTime('8 MIN READ');
      setAuthorName('Founder Studio');
      setAuthorAvatar('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80');
      setAuthorBio('Archival director coordinating aesthetic systems and tactile materials.');
      setContentParagraphs(['Deconstruct the architectural layout of this concept...', 'Add secondary evidence blocks...']);
      setPullQuotes(['"The ultimate luxury is intentional cognitive buffers."']);
      setTags(['ESSAY', 'MANIFESTO']);
    }
    setViewMode('compose');
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subtitle || !imageUrl) {
      alert("Please ensure the title, description, and image URL are fully specified.");
      return;
    }

    // Filter empty paragraphs and quotes
    const cleanedParagraphs = contentParagraphs.filter(p => p.trim() !== '');
    const cleanedQuotes = pullQuotes.filter(q => q.trim() !== '');

    const authorObj: Author = {
      name: authorName,
      avatar: authorAvatar,
      bio: authorBio
    };

    const postData: BlogPost = {
      id: editingPostId || `post-${Date.now()}`,
      title,
      subtitle,
      category,
      author: authorObj,
      date: editingPostId ? (posts.find(p => p.id === editingPostId)?.date || "JUN 2026") : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
      readTime: readTime.toUpperCase(),
      content: cleanedParagraphs.length > 0 ? cleanedParagraphs : ["Default content paragraph."],
      quotes: cleanedQuotes.length > 0 ? cleanedQuotes : [],
      imageUrl,
      tags: tags.length > 0 ? tags : ["ARCHIVE"],
      likes: editingPostId ? (posts.find(p => p.id === editingPostId)?.likes || 0) : 0,
      comments: editingPostId ? (posts.find(p => p.id === editingPostId)?.comments || []) : []
    };

    if (editingPostId) {
      onUpdatePost(editingPostId, postData);
    } else {
      onAddPost(postData);
    }

    setViewMode('dashboard');
  };

  const handleParagraphChange = (idx: number, val: string) => {
    const updated = [...contentParagraphs];
    updated[idx] = val;
    setContentParagraphs(updated);
  };

  const addParagraphField = () => {
    setContentParagraphs([...contentParagraphs, '']);
  };

  const removeParagraphField = (idx: number) => {
    if (contentParagraphs.length === 1) return;
    setContentParagraphs(contentParagraphs.filter((_, i) => i !== idx));
  };

  const handleQuoteChange = (idx: number, val: string) => {
    const updated = [...pullQuotes];
    updated[idx] = val;
    setPullQuotes(updated);
  };

  const addQuoteField = () => {
    setPullQuotes([...pullQuotes, '']);
  };

  const removeQuoteField = (idx: number) => {
    setPullQuotes(pullQuotes.filter((_, i) => i !== idx));
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim().toUpperCase())) {
      setTags([...tags, tagInput.trim().toUpperCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // --- COMMENT MODERATION HANDLER ---
  const handlePurgeComment = (postId: string, commentId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    // Purge the specific comment
    const updatedComments = post.comments.filter(c => c.id !== commentId);
    const updatedPost = { ...post, comments: updatedComments };
    
    onUpdatePost(postId, updatedPost);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-stone-950 rounded-2xl border border-stone-800">
        <div className="animate-spin text-[#e84b1f]"><Compass size={32} /></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto my-12 sm:my-24 p-6 sm:p-8 border border-stone-800 bg-stone-950 rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-center mb-8">
          <h2 className="font-bebas text-3xl tracking-widest text-[#f5f0e8] uppercase">ADMINISTRATIVE ACCESS</h2>
          <p className="text-stone-400 font-serif-display italic mt-2 text-sm">Sign in with Google to continue.</p>
        </div>
        
        {adminError && <p className="text-red-500 font-mono text-[10px] mb-4 uppercase tracking-widest text-center">Authentication Failed</p>}
        
        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setIsLoading(true);
              const res = await fetch('/api/v1/auth/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: adminEmail, password: adminPassword })
              });
              const data = await res.json();
              if (res.ok && data.success) {
                setIsAuthenticated(true);
                setAdminError(false);
              } else {
                setAdminError(true);
              }
            } catch (err) {
              setAdminError(true);
            } finally {
              setIsLoading(false);
            }
          }}
          className="space-y-4 w-full mb-6"
        >
          <div>
            <input
              type="text"
              value={adminEmail}
              onChange={(e) => {
                setAdminEmail(e.target.value);
                setAdminError(false);
              }}
              placeholder="Email"
              className={`w-full bg-stone-900 border ${adminError ? 'border-red-500' : 'border-stone-800'} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#e84b1f] font-sans text-sm`}
            />
          </div>
          <div>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => {
                setAdminPassword(e.target.value);
                setAdminError(false);
              }}
              placeholder="Passcode"
              className={`w-full bg-stone-900 border ${adminError ? 'border-red-500' : 'border-stone-800'} text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#e84b1f] font-mono text-sm tracking-widest`}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#e84b1f] text-white font-mono text-[10px] tracking-widest font-bold uppercase py-4 rounded-xl hover:bg-[#ff5522] transition-colors cursor-pointer"
          >
            ENTER TERMINAL
          </button>
        </form>

        <div className="relative w-full flex items-center py-2 mb-4">
          <div className="flex-grow border-t border-stone-800"></div>
          <span className="flex-shrink-0 mx-4 text-stone-500 text-xs font-mono tracking-widest uppercase">OR</span>
          <div className="flex-grow border-t border-stone-800"></div>
        </div>

        <button 
          onClick={async () => {
            try {
              setIsLoading(true);
              const res = await fetch('/api/v1/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
              });
              const data = await res.json();
              if (res.ok && data.status === 'success') {
                setIsAuthenticated(true);
                setAdminError(false);
              } else {
                setAdminError(true);
              }
            } catch (err) {
              setAdminError(true);
            } finally {
              setIsLoading(false);
            }
          }}
          className="relative inline-flex items-center justify-center px-4 py-3 bg-white text-stone-950 rounded hover:bg-stone-100 transition-colors cursor-pointer border border-stone-300 w-full rounded-xl w-64 shadow-md font-sans font-medium"
        >
          <div className="flex items-center justify-center w-6 h-6 mr-3">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </div>
          <span>Sign in with Google</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#070707] min-h-screen text-stone-100 font-sans pointer-events-auto selection:bg-[#e84b1f] selection:text-white">
      {/* 1. Header Banner */}
      <div className="border-b border-stone-900 bg-black/65 sticky top-0 z-[100] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center space-x-3.5 text-left">
            <button 
              onClick={onClose}
              className="p-2 border border-stone-900 bg-stone-950/60 rounded-xl text-stone-400 hover:text-white hover:border-stone-800 transition-all cursor-pointer"
              title="Return to Main"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#f5c842] animate-pulse" />
                <span className="font-mono text-[9px] tracking-[0.25em] text-[#f5c842] uppercase font-bold">
                  ADMINISTRATIVE CONTROL CORE
                </span>
              </div>
              <h1 className="font-bebas text-2xl sm:text-3xl tracking-widest uppercase">
                VIVID PANEL <span className="text-[#e84b1f]">v1.4</span>
              </h1>
            </div>
          </div>

          {/* Nav Mode selection button block */}
          <div className="flex items-center space-x-2 bg-stone-950/80 p-1.5 rounded-xl border border-stone-900">
            <button
              onClick={() => setViewMode('dashboard')}
              className={`font-mono text-[9px] tracking-widest px-4 py-2 uppercase rounded-lg transition-all font-bold cursor-pointer ${
                viewMode === 'dashboard' 
                  ? 'bg-[#e84b1f] text-white' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              CHRONICLES ({posts.length})
            </button>
            <button
              onClick={() => handleStartCompose()}
              className={`font-mono text-[9px] tracking-widest px-4 py-2 uppercase rounded-lg transition-all font-bold cursor-pointer ${
                viewMode === 'compose' && !editingPostId
                  ? 'bg-[#e84b1f] text-white' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              + WRITE ESSAY
            </button>
            <button
              onClick={() => setViewMode('comments')}
              className={`font-mono text-[9px] tracking-widest px-4 py-2 uppercase rounded-lg transition-all font-bold cursor-pointer ${
                viewMode === 'comments' 
                  ? 'bg-[#e84b1f] text-white' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              COMMENTS ({aggregatedComments.length})
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="font-mono text-[9px] tracking-widest px-4 py-2 uppercase rounded-lg transition-all font-bold cursor-pointer text-stone-400 hover:text-white hover:bg-red-950/40"
              >
                LOGOUT
              </button>
            )}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* VIEW 1: MAIN DASHBOARD */}
        {viewMode === 'dashboard' && (
          <div className="space-y-12">
            
            {/* KPI STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-stone-900 relative overflow-hidden group hover:border-[#f5c842]/20 transition-all text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[9px] text-[#f5c842] tracking-widest uppercase block font-bold">TOTAL MANUSCRIPTS</span>
                    <h3 className="font-bebas text-5xl text-stone-100 mt-2 tracking-wide font-black">
                      {stats.totalArticles}
                    </h3>
                  </div>
                  <div className="p-3 rounded-xl bg-orange-950/10 text-[#e84b1f] border border-[#e84b1f]/10">
                    <FileText size={20} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-900 flex justify-between items-center text-[10px] font-mono text-stone-500">
                  <span>PUBLISHED ESSAYS</span>
                  <span className="text-emerald-400 font-bold">ACTIVE DATABASE</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-stone-900 relative overflow-hidden group hover:border-[#f5c842]/20 transition-all text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[9px] text-[#f5c842] tracking-widest uppercase block font-bold">ACCUMULATED LIKES</span>
                    <h3 className="font-bebas text-5xl text-stone-100 mt-2 tracking-wide font-black">
                      {stats.totalLikes.toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-3 rounded-xl bg-red-950/10 text-red-400 border border-red-500/10">
                    <Heart size={20} className="fill-current" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-900 flex justify-between items-center text-[10px] font-mono text-stone-500">
                  <span>TACTILE FEEDBACKS</span>
                  <span className="text-[#f5c842] font-bold">SUPABASE DIRECT</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-stone-900 relative overflow-hidden group hover:border-[#f5c842]/20 transition-all text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[9px] text-[#f5c842] tracking-widest uppercase block font-bold">USER COMMENTS</span>
                    <h3 className="font-bebas text-5xl text-stone-100 mt-2 tracking-wide font-black">
                      {stats.totalComments.toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-950/10 text-sky-400 border border-sky-500/10">
                    <MessageSquare size={20} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-900 flex justify-between items-center text-[10px] font-mono text-stone-500">
                  <span>ENGAGEMENT METRICS</span>
                  <button 
                    onClick={() => setViewMode('comments')}
                    className="text-stone-400 hover:text-white underline cursor-pointer"
                  >
                    MANAGE
                  </button>
                </div>
              </div>

            </div>

            {/* SECTOR DISTRIBUTION GAUGES */}
            <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-stone-900 text-left space-y-4">
              <span className="font-mono text-[10px] text-stone-500 tracking-widest uppercase block">
                EDITORIAL STREAM WEIGTHING &middot; SECTOR INDEX DISTRIBUTION
              </span>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {CATEGORIES.map(cat => {
                  const val = stats.catFrequency[cat] || 0;
                  const ratio = stats.totalArticles > 0 ? (val / stats.totalArticles) * 100 : 0;
                  return (
                    <div key={cat} className="p-3.5 rounded-xl bg-black border border-stone-950 flex flex-col justify-between">
                      <span className="font-mono text-[9px] text-stone-400 tracking-wider block">{cat}</span>
                      <div className="mt-2.5 flex items-end justify-between">
                        <span className="font-bebas text-2xl font-bold tracking-wide">{val}</span>
                        <span className="font-mono text-[9px] text-stone-600">({ratio.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-stone-900 h-1 rounded-full overflow-hidden mt-2">
                        <div 
                          className="bg-[#e84b1f] h-full" 
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INTERACTIVE COMMENT VOLUME TREND GRAPH */}
            <div className="bg-[#0c0c0c] border border-stone-900 rounded-2xl p-6 text-left space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-[#e84b1f] tracking-[0.2em] uppercase font-bold flex items-center gap-1.5">
                    <TrendingUp size={11} className="text-[#e84b1f]" /> ANALYTIC TIME-SERIES ENGINE
                  </span>
                  <h3 className="font-bebas text-xl sm:text-2xl tracking-wide uppercase">
                    COMMENT VOLUME CHRONOLOGY SYSTEM
                  </h3>
                  <p className="text-stone-505 text-xs font-sans">
                    Auditing reader engagement volume and cumulative sentiment frequency.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Aggregator selector toggle */}
                  <div className="bg-stone-950 px-1 py-1 rounded-xl border border-stone-900/60 flex space-x-1">
                    <button
                      type="button"
                      onClick={() => setTrendScale('daily')}
                      className={`font-mono text-[9px] tracking-wider py-1 px-3 uppercase rounded-lg transition-all font-bold cursor-pointer whitespace-nowrap ${
                        trendScale === 'daily' 
                          ? 'bg-stone-850 text-white font-black' 
                          : 'text-stone-500 hover:text-stone-300'
                      }`}
                    >
                      DAILY INDEX
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrendScale('monthly')}
                      className={`font-mono text-[9px] tracking-wider py-1 px-3 uppercase rounded-lg transition-all font-bold cursor-pointer whitespace-nowrap ${
                        trendScale === 'monthly' 
                          ? 'bg-stone-855 text-white font-black' 
                          : 'text-stone-500 hover:text-stone-300'
                      }`}
                    >
                      MONTHLY PLOT
                    </button>
                  </div>

                  {/* Metric type selector toggle */}
                  <div className="bg-stone-950 px-1 py-1 rounded-xl border border-stone-900/60 flex space-x-1">
                    <button
                      type="button"
                      onClick={() => setChartMetric('individual')}
                      className={`font-mono text-[9px] tracking-wider py-1 px-3 uppercase rounded-lg transition-all font-bold cursor-pointer whitespace-nowrap ${
                        chartMetric === 'individual' 
                          ? 'bg-[#e84b1f] text-white' 
                          : 'text-stone-500 hover:text-stone-300'
                      }`}
                    >
                      VOL LEVEL
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartMetric('cumulative')}
                      className={`font-mono text-[9px] tracking-wider py-1 px-3 uppercase rounded-lg transition-all font-bold cursor-pointer whitespace-nowrap ${
                        chartMetric === 'cumulative' 
                          ? 'bg-[#e84b1f] text-white' 
                          : 'text-stone-500 hover:text-stone-300'
                      }`}
                    >
                      CUMULATIVE
                    </button>
                  </div>
                </div>
              </div>

              {/* Chart Plot Area container */}
              <div className="h-[340px] w-full bg-black/40 rounded-xl border border-stone-950 p-4 relative flex items-center justify-center">
                {(!commentTrendData[trendScale] || commentTrendData[trendScale].length === 0) ? (
                  <div className="text-center space-y-2">
                    <Compass className="mx-auto text-stone-800 animate-spin" style={{ animationDuration: '6s' }} size={24} />
                    <p className="font-mono text-[9px] tracking-widest text-stone-600 uppercase font-black">NO CHRONOLOGICAL DATA FOUND</p>
                    <p className="text-[11px] text-stone-700 font-sans">Write an introductory comment in an active chronicle to boot timeline records.</p>
                  </div>
                ) : (
                  <div className="w-full h-full relative" style={{ minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={commentTrendData[trendScale]}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="gradientCommentColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartMetric === 'individual' ? '#e84b1f' : '#f5c842'} stopOpacity={0.25} />
                            <stop offset="95%" stopColor={chartMetric === 'individual' ? '#e84b1f' : '#f5c842'} stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#18181b" strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="label" 
                          stroke="#4b5563" 
                          fontSize={9} 
                          fontFamily="monospace"
                          dy={10}
                          tickLine={false}
                          axisLine={{ stroke: '#27272a' }}
                        />
                        <YAxis 
                          stroke="#4b5563" 
                          fontSize={9} 
                          fontFamily="monospace"
                          dx={-5}
                          tickLine={false}
                          axisLine={{ stroke: '#27272a' }}
                          allowDecimals={false}
                        />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const metricLabel = chartMetric === 'individual' ? 'Volume' : 'Cumulative';
                              const value = payload[0].value;
                              return (
                                <div className="bg-stone-950/95 border border-stone-800/80 p-3 rounded-xl shadow-2xl backdrop-blur-md text-left">
                                  <p className="font-mono text-[8.5px] tracking-widest text-[#f5c842] uppercase font-bold">{label}</p>
                                  <div className="mt-1 flex items-center space-x-1.5 text-xs">
                                    <span 
                                      className="w-1.5 h-1.5 rounded-full" 
                                      style={{ backgroundColor: chartMetric === 'individual' ? '#e84b1f' : '#f5c842' }} 
                                    />
                                    <span className="font-mono text-[9px] text-stone-400 uppercase tracking-tight">
                                      {metricLabel}:
                                    </span>
                                    <span className="font-bold font-mono text-stone-100">
                                      {value} {value === 1 ? 'Comment' : 'Comments'}
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey={chartMetric === 'individual' ? 'comments' : 'cumulative'} 
                          stroke={chartMetric === 'individual' ? '#e84b1f' : '#f5c842'} 
                          strokeWidth={2.5}
                          fillOpacity={1} 
                          fill="url(#gradientCommentColor)" 
                          animationDuration={600}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Informative index details metadata banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-black/60 p-4 rounded-xl border border-stone-950 divide-x divide-stone-900">
                <div className="text-left pl-2">
                  <span className="font-mono text-[8px] text-stone-500 uppercase block tracking-widest">RECORD START DATE</span>
                  <span className="font-sans text-sm font-semibold text-stone-200 mt-1 block">
                    {commentTrendData.daily.length > 0 ? commentTrendData.daily[0].label : 'N/A'}
                  </span>
                </div>
                <div className="text-left pl-4">
                  <span className="font-mono text-[8px] text-stone-500 uppercase block tracking-widest">LATEST EVENT DATE</span>
                  <span className="font-sans text-sm font-semibold text-stone-200 mt-1 block">
                    {commentTrendData.daily.length > 0 ? commentTrendData.daily[commentTrendData.daily.length - 1].label : 'N/A'}
                  </span>
                </div>
                <div className="text-left pl-4">
                  <span className="font-mono text-[8px] text-stone-500 uppercase block tracking-widest">PEAK INTERVAL VALUE</span>
                  <span className="font-sans text-sm font-semibold text-stone-200 mt-1 block">
                    {commentTrendData.daily.length > 0 
                      ? Math.max(...commentTrendData.daily.map(d => d.comments)) + ' COMM' 
                      : '0 COMM'}
                  </span>
                </div>
                <div className="text-left pl-4">
                  <span className="font-mono text-[8px] text-[#f5c842] uppercase block tracking-widest font-black">ACTIVE INTEGRITY</span>
                  <span className="font-sans text-sm font-semibold text-emerald-400 mt-1 block flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    LIVE-SYNCED
                  </span>
                </div>
              </div>

            </div>

            {/* SUB-NAV & LIST CONTROLS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-900 pb-5">
              
              <div className="flex items-center space-x-2 bg-stone-950 p-1 rounded-xl border border-stone-900 overflow-x-auto w-full md:w-auto">
                <button
                  onClick={() => setSelectedCategoryFilter('ALL')}
                  className={`font-mono text-[9px] tracking-wider py-1.5 px-3 uppercase rounded-lg transition-all font-bold cursor-pointer whitespace-nowrap ${
                    selectedCategoryFilter === 'ALL' 
                      ? 'bg-stone-800 text-white' 
                      : 'text-stone-500 hover:text-stone-300'
                  }`}
                >
                  ALL CHANNELS
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`font-mono text-[9px] tracking-wider py-1.5 px-3 uppercase rounded-lg transition-all font-bold cursor-pointer whitespace-nowrap ${
                      selectedCategoryFilter === cat 
                        ? 'bg-stone-800 text-white' 
                        : 'text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Text Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH ARCHIVES BY KEY..."
                className="bg-stone-950 text-stone-100 placeholder-stone-700 text-xs font-mono border border-stone-900 rounded-xl px-4 py-2 w-full md:w-72 focus:outline-none focus:ring-1 focus:ring-[#e84b1f] focus:border-[#e84b1f]"
              />

            </div>

            {/* MANUSCRIPT SPREADSHEET */}
            <div className="border border-stone-900 bg-stone-950/30 rounded-2xl overflow-hidden">
              <div className="p-4 bg-stone-950 border-b border-stone-900 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-left">
                <span className="font-mono text-[9px] tracking-widest text-[#f5c842] uppercase font-bold">
                  MANUSCRIPT REGISTRY DATABASE ({filteredPosts.length} FILTERED LIVES)
                </span>
                
                <div className="flex items-center gap-2">
                  {onPurgeAllPosts && posts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPurgeConfirm(true)}
                      className="border border-red-900 hover:bg-red-950/30 text-red-500 font-mono text-[9px] tracking-widest uppercase p-2 px-4 rounded-xl font-bold transition-all flex items-center gap-1.5 hover:scale-[1.02] cursor-pointer"
                    >
                      <Trash2 size={12} /> PURGE DEMO DATA
                    </button>
                  )}

                  <button
                    onClick={() => handleStartCompose()}
                    className="bg-[#e84b1f] hover:bg-[#ff5522] text-white font-mono text-[9px] tracking-widest uppercase p-2 px-4.5 rounded-xl font-bold transition-all flex items-center gap-1.5 hover:scale-[1.03] cursor-pointer"
                  >
                    <Plus size={12} /> NEW CHRONICLE
                  </button>
                </div>
              </div>

              {/* STYLISH CONFIRMATION BANNER */}
              <AnimatePresence>
                {showPurgeConfirm && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-red-950/20 border-b border-red-900/40"
                  >
                    <div className="p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                      <div className="space-y-1">
                        <span className="font-mono text-[8px] text-red-500 tracking-widest uppercase font-extrabold flex items-center gap-1">
                          <AlertTriangle size={12} className="text-red-500" /> DESTRUCTIVE SYSTEM OPERATION
                        </span>
                        <h4 className="font-mono text-xs text-stone-200 uppercase font-bold">
                          Are you sure you want to completely erase all {posts.length} records?
                        </h4>
                        <p className="text-[11px] text-stone-400 font-sans max-w-2xl leading-relaxed">
                          This action wipes out all preset stories, historical data points, engagement logs, and comments from system memory and database sync, establishing a clean slate.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                        <button
                          type="button"
                          onClick={() => setShowPurgeConfirm(false)}
                          className="font-mono text-[9px] tracking-widest text-stone-400 hover:text-white px-4.5 py-2.5 rounded-xl border border-stone-800 hover:border-stone-700 transition-all font-bold cursor-pointer"
                        >
                          ABORT
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onPurgeAllPosts?.();
                            setShowPurgeConfirm(false);
                          }}
                          className="font-mono text-[9px] tracking-widest bg-red-500 hover:bg-red-650 text-white px-4.5 py-2.5 rounded-xl font-black transition-all hover:scale-102 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check size={12} /> CONFIRM PURGE
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Table frame layout view */}
              {filteredPosts.length === 0 ? (
                <div className="p-16 text-center text-stone-500 space-y-2">
                  <Compass className="mx-auto text-stone-700 animate-spin" style={{ animationDuration: '6s' }} size={32} />
                  <p className="font-mono text-[10px] tracking-widest uppercase">No registry index correlates values!</p>
                  <p className="font-sans text-xs text-stone-600 max-w-sm mx-auto">Try clearing search parameters or write a new chronicle entry.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-900 bg-stone-950/70 font-mono text-[9px] text-[#f5f0e8]/45 uppercase tracking-widest select-none">
                        <th className="p-4 font-bold">Cover & Title</th>
                        <th className="p-4 font-bold">Sector</th>
                        <th className="p-4 font-bold">Authorized</th>
                        <th className="p-4 font-bold">Date Limit</th>
                        <th className="p-4 text-center font-bold">Likes</th>
                        <th className="p-4 text-center font-bold">Comments</th>
                        <th className="p-4 text-right font-bold">Admin actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-950">
                      {filteredPosts.map((post) => {
                        const isDeleting = deleteConfirmId === post.id;
                        
                        return (
                          <tr 
                            key={post.id} 
                            className="hover:bg-[#0c0c0c]/85 transition-colors group align-middle"
                          >
                            {/* Graphic + Title */}
                            <td className="p-4 flex items-center space-x-3 max-w-md">
                              <img 
                                src={post.imageUrl} 
                                alt={post.title} 
                                referrerPolicy="no-referrer"
                                className="w-14 h-11 object-cover rounded-lg border border-stone-900 object-center shrink-0 filter grayscale group-hover:grayscale-0 transition-all duration-300"
                              />
                              <div className="space-y-0.5 truncate text-left">
                                <h4 className="font-serif text-[13px] text-stone-200 font-semibold group-hover:text-[#e84b1f] transition-colors leading-tight truncate">
                                  {post.title}
                                </h4>
                                <p className="font-sans text-[10px] text-stone-500 truncate leading-tight">
                                  {post.subtitle}
                                </p>
                              </div>
                            </td>

                            {/* Sector */}
                            <td className="p-4 align-middle">
                              <span className="font-mono text-[9px] text-[#f5c842] border border-stone-900 bg-stone-950 px-2 py-0.5 rounded-md tracking-wider">
                                #{post.category}
                              </span>
                            </td>

                            {/* Authored */}
                            <td className="p-4 align-middle">
                              <div className="flex items-center space-x-1.5">
                                <img 
                                  src={post.author.avatar} 
                                  alt={post.author.name} 
                                  referrerPolicy="no-referrer"
                                  className="w-4 h-4 rounded-full object-cover shrink-0"
                                />
                                <span className="font-mono text-[10px] text-stone-400 capitalize truncate max-w-[80px]">
                                  {post.author.name}
                                </span>
                              </div>
                            </td>

                            {/* Date Limit */}
                            <td className="p-4 font-mono text-[10px] text-stone-500 uppercase align-middle whitespace-nowrap">
                              {post.date}
                            </td>

                            {/* Likes */}
                            <td className="p-4 text-center font-mono text-[10px] text-stone-300 align-middle">
                              ❤️ {post.likes}
                            </td>

                            {/* Comments Count */}
                            <td className="p-4 text-center font-mono text-[10px] text-stone-300 align-middle">
                              💬 {post.comments.length}
                            </td>

                            {/* Actions */}
                            <td className="p-4 text-right align-middle whitespace-nowrap">
                              {isDeleting ? (
                                <div className="flex items-center justify-end space-x-1.5">
                                  <span className="font-mono text-[8px] text-red-500 tracking-wider uppercase font-black">PURGE ESSAY?</span>
                                  <button
                                    onClick={() => {
                                      onDeletePost(post.id);
                                      setDeleteConfirmId(null);
                                    }}
                                    className="p-1.5 bg-red-950/80 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all cursor-pointer"
                                    title="Yes, delete"
                                  >
                                    <Check size={11} />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="p-1.5 bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-100 rounded-lg transition-all cursor-pointer"
                                    title="Cancel delete"
                                  >
                                    <X size={11} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end space-x-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleStartCompose(post)}
                                    className="p-2 border border-stone-900 hover:bg-stone-900 text-stone-300 hover:text-[#f5c842] rounded-xl transition-all cursor-pointer"
                                    title="Edit Chronicle"
                                  >
                                    <Edit3 size={11} />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(post.id)}
                                    className="p-2 border border-stone-950 hover:bg-red-950/40 text-stone-500 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
                                    title="Delete Chronicle"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              )}
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW 2: DRAFTING ROOM (EDITOR/COMPOSER) */}
        {viewMode === 'compose' && (
          <form onSubmit={handleSavePost} className="space-y-10 text-left">
            
            {/* Context bar inside composer */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-950 p-5 rounded-2xl border border-stone-910">
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-[#e84b1f] tracking-widest uppercase block font-bold">// DRAFT SPACE ACTIVE</span>
                <h3 className="font-bebas text-2xl tracking-wide uppercase">
                  {editingPostId ? `EDITING MANUSCRIPT: "${title.slice(0, 30)}..."` : "NEW ESSAY TEXT COMPOSITION"}
                </h3>
              </div>
              
              <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('dashboard')}
                  className="font-mono text-[10px] font-bold tracking-wider uppercase border border-stone-850 px-4 py-2.5 rounded-xl hover:bg-stone-900 transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  <X size={13} /> DISCARD
                </button>
                <button
                  type="submit"
                  className="font-mono text-[10px] font-bold tracking-wider uppercase bg-[#e84b1f] hover:bg-[#ff5522] text-white px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  <Save size={13} /> {editingPostId ? "PUBLISH CHANGES" : "PUBLISH TO STREAM"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* PRIMARY FIELDS COLUMN (LHS) */}
              <div className="lg:col-span-8 space-y-7 bg-[#0c0c0c] border border-stone-900 p-6 rounded-2xl">
                
                <h4 className="font-bebas text-lg text-stone-300 tracking-wider border-b border-stone-900 pb-2 flex items-center gap-2">
                  <Sparkles size={14} className="text-[#f5c842]" /> CORE MANUSCRIPT CONTENT
                </h4>

                {/* Subtitle / Excerpt */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono tracking-widest text-stone-400 uppercase">
                    <label className="font-extrabold flex items-center gap-1">TITLE HEADER <span className="text-[#e84b1f]">*</span></label>
                    <span className={title.length > 55 ? "text-yellow-500" : "text-stone-600"}>{title.length} chars</span>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter heavy-impact display title header..."
                    maxLength={100}
                    required
                    className="w-full bg-[#070707] border border-stone-900 rounded-xl px-4 py-3 text-stone-100 font-serif text-lg focus:outline-none focus:ring-1 focus:ring-[#e84b1f] focus:border-[#e84b1f] transition-all"
                  />
                  <p className="font-sans text-[10px] text-stone-600">The title will render in a striking high-contrast seriffed font on cards.</p>
                </div>

                {/* Subtitle Header */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono tracking-widest text-stone-400 uppercase">
                    <label className="font-extrabold">SUBTITLE TEASER EXCERPT <span className="text-[#e84b1f]">*</span></label>
                    <span className="text-stone-600">{subtitle.length} / 250</span>
                  </div>
                  <textarea
                    rows={3}
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Describe the philosophical premise to tease readers in feed decks..."
                    maxLength={300}
                    required
                    className="w-full bg-[#070707] border border-stone-900 rounded-xl px-4 py-3 text-stone-200 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#e84b1f] focus:border-[#e84b1f] transition-all font-sans"
                  />
                </div>

                {/* RICH TEXT PARAGRAPHS COMPOSER - VERY HIGH POLISH */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-900 pb-2">
                    <label className="font-mono text-[10px] tracking-widest text-stone-400 uppercase font-black">
                      MANUSCRIPT PARAGRAPH BLOCKS ({contentParagraphs.length})
                    </label>
                    <button
                      type="button"
                      onClick={addParagraphField}
                      className="text-[#f5c842] hover:text-[#e84b1f] font-mono text-[9px] tracking-widest uppercase font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={11} /> ADD PARAGRAPH BOX
                    </button>
                  </div>

                  <p className="font-sans text-[10px] text-stone-600 leading-normal">
                    Enter one logical paragraph per box. We distribute pull quotes and spacing algorithms gracefully between these content blocks.
                  </p>

                  <div className="space-y-3">
                    {contentParagraphs.map((par, pIdx) => (
                      <div key={pIdx} className="relative group">
                        
                        <div className="absolute -left-3.5 top-3 text-[10px] font-mono text-stone-600 group-focus-within:text-[#e84b1f]">
                          {String(pIdx + 1).padStart(2, '0')}
                        </div>

                        <textarea
                          rows={4}
                          value={par}
                          onChange={(e) => handleParagraphChange(pIdx, e.target.value)}
                          placeholder={`Deconstruct argument sequence ${pIdx + 1}...`}
                          className="w-full bg-[#070707] border border-stone-900 rounded-xl pl-4 pr-12 py-3 text-[#f5f0e8]/85 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#e84b1f] focus:border-[#e84b1f] transition-all font-serif"
                        />

                        {/* Erase button on box */}
                        <button
                          type="button"
                          onClick={() => removeParagraphField(pIdx)}
                          style={{ opacity: contentParagraphs.length > 1 ? 1 : 0.4 }}
                          className="absolute right-3.5 top-3 text-stone-600 hover:text-red-500 hover:bg-stone-900/60 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Purge paragraph box"
                          disabled={contentParagraphs.length === 1}
                        >
                          <Trash2 size={12} />
                        </button>

                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addParagraphField}
                    className="w-full border border-dashed border-stone-900 hover:border-stone-800 bg-[#070707] text-stone-500 hover:text-white py-3.5 text-xs font-mono tracking-wider rounded-xl uppercase transition-colors font-semibold cursor-pointer"
                  >
                    + APPEND SEQUENTIAL CONTAINER
                  </button>
                </div>

                {/* EDITORIAL QUOTES */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-stone-900 pb-2">
                    <label className="font-mono text-[10px] tracking-widest text-stone-400 uppercase font-black">
                      PULL-QUOTES GRAPHICS ({pullQuotes.length})
                    </label>
                    <button
                      type="button"
                      onClick={addQuoteField}
                      className="text-[#f5c842] hover:text-[#e84b1f] font-mono text-[9px] tracking-widest uppercase font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={11} /> ADD PULL QUOTE
                    </button>
                  </div>

                  <p className="font-sans text-[10px] text-stone-600">
                    Pull-quotes are isolated typographic callouts floated in high display formats inside the layout template.
                  </p>

                  <div className="space-y-2">
                    {pullQuotes.map((q, qIdx) => (
                      <div key={qIdx} className="relative flex gap-2">
                        <input
                          type="text"
                          value={q}
                          onChange={(e) => handleQuoteChange(qIdx, e.target.value)}
                          placeholder="e.g., 'To refuse acceleration is the ultimate victory of sovereignty.'"
                          className="w-full bg-[#070707] border border-stone-900 rounded-xl px-4 py-2.5 text-[#f5c842] font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#e84b1f] focus:border-[#e84b1f]"
                        />
                        <button
                          type="button"
                          onClick={() => removeQuoteField(qIdx)}
                          className="p-2 border border-stone-900 text-stone-600 hover:text-red-500 rounded-xl transition-colors shrink-0 cursor-pointer"
                          title="Erase quote"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              
              {/* METADATA CONFIG COLUMN (RHS) */}
              <div className="lg:col-span-4 space-y-7">
                
                {/* 1. SECTOR CLASSIFICATION & DETAILS */}
                <div className="bg-[#0c0c0c] border border-stone-900 p-6 rounded-2xl text-left space-y-5">
                  <h4 className="font-bebas text-lg text-stone-300 tracking-wider border-b border-stone-900 pb-2 flex items-center gap-1.5">
                    <Compass size={14} className="text-[#e84b1f]" /> CLASSIFICATION
                  </h4>

                  {/* Category dropdown */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] tracking-widest text-stone-400 uppercase font-black block">EDITORIAL SECTOR CHANNEL</label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category)}
                        className="w-full bg-[#070707] border border-stone-900 rounded-xl px-4 py-3 text-stone-200 text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#e84b1f] focus:border-[#e84b1f] cursor-pointer appearance-none"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>#{cat} CHRONICLE</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500 text-[10px] font-mono font-bold">
                        [SELECT]
                      </div>
                    </div>
                  </div>

                  {/* Read Time estimate */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] tracking-widest text-stone-400 uppercase font-black block">READ TIME DESIGNATION</label>
                    <input
                      type="text"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      placeholder="e.g. 8 MIN READ"
                      required
                      className="w-full bg-[#070707] border border-stone-900 rounded-xl px-4 py-2.5 text-stone-200 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#e84b1f] focus:border-[#e84b1f]"
                    />
                  </div>
                </div>

                {/* 2. CHRONICLE IMAGE ANCHOR */}
                <div className="bg-[#0c0c0c] border border-stone-900 p-6 rounded-2xl text-left space-y-5">
                  <h4 className="font-bebas text-lg text-stone-300 tracking-wider border-b border-stone-900 pb-2 flex items-center gap-1.5">
                    <Image size={14} className="text-[#e84b1f]" /> ATMOSPHERIC PHOTO
                  </h4>

                  {/* Image URL preview frame */}
                  {imageUrl && (
                    <div className="relative h-28 w-full bg-stone-950 rounded-xl overflow-hidden border border-stone-900">
                      <img 
                        src={imageUrl} 
                        alt="Preview image" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center filter grayscale contrast-125"
                      />
                      <div className="absolute inset-0 bg-stone-950/40 flex items-center justify-center font-mono text-[8px] tracking-widest text-[#f5c842] uppercase font-bold bg-black/60 opacity-0 hover:opacity-100 transition-opacity">
                        IMAGE RESOLVING ACTIVE
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] tracking-widest text-stone-400 uppercase font-black block">IMAGE FILE URL SOURCE</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Unsplash background string..."
                      required
                      className="w-full bg-[#070707] border border-stone-900 rounded-xl px-4 py-2.5 text-stone-200 font-mono text-[10px] focus:outline-none focus:ring-1 focus:ring-[#e84b1f] focus:border-[#e84b1f]"
                    />
                  </div>

                  {/* Quick Unsplash category presets */}
                  <div className="space-y-2">
                    <span className="font-mono text-[8px] text-stone-500 tracking-wider uppercase block font-bold">ATMOSPHERIC RE-PRESETS:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {EDITORIAL_THEMES.map((theme, tIdx) => (
                        <button
                          key={tIdx}
                          type="button"
                          onClick={() => setImageUrl(theme.url)}
                          className={`text-[9px] text-left p-2 rounded-lg border font-mono tracking-tight cursor-pointer truncate ${
                            imageUrl === theme.url 
                              ? 'border-[#e84b1f]/50 bg-[#e84b1f]/10 text-[#e84b1f] font-bold' 
                              : 'border-stone-900 bg-stone-950 hover:border-stone-800 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          {theme.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. AUTHOR PROTOCOL RECORD */}
                <div className="bg-[#0c0c0c] border border-stone-900 p-6 rounded-2xl text-left space-y-4">
                  <h4 className="font-bebas text-lg text-stone-300 tracking-wider border-b border-stone-900 pb-2 flex items-center gap-1.5">
                    <User size={14} className="text-[#e84b1f]" /> WRITER ATTRIBUTION
                  </h4>

                  <div className="flex gap-3 items-center">
                    <img 
                      src={authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'} 
                      alt="Avatar" 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border border-stone-900 bg-stone-950 object-cover shrink-0"
                    />
                    <div className="space-y-1 w-full">
                      <label className="font-mono text-[9px] tracking-widest text-[#f5c842] uppercase font-bold block">NAME LOG</label>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Yusuf O."
                        required
                        className="w-full bg-[#070707] border border-stone-900 rounded-lg px-3 py-1.5 text-stone-200 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#e84b1f]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] tracking-widest text-stone-400 uppercase font-bold block">AVATAR IMAGE URL</label>
                    <input
                      type="url"
                      value={authorAvatar}
                      onChange={(e) => setAuthorAvatar(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#070707] border border-stone-900 rounded-lg px-3 py-1.5 text-stone-200 font-mono text-[9px] focus:outline-none focus:ring-1 focus:ring-[#e84b1f]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] tracking-widest text-stone-400 uppercase font-bold block">BIOGRAPHY BRIEF</label>
                    <textarea
                      rows={2}
                      value={authorBio}
                      onChange={(e) => setAuthorBio(e.target.value)}
                      placeholder="Brief context line about the curator..."
                      className="w-full bg-[#070707] border border-stone-900 rounded-lg p-3 text-stone-300 text-2xs focus:outline-none focus:ring-1 focus:ring-[#e84b1f]"
                    />
                  </div>
                </div>

                {/* 4. METADATA TAG CHIPS */}
                <div className="bg-[#0c0c0c] border border-stone-900 p-6 rounded-2xl text-left space-y-4">
                  <h4 className="font-bebas text-lg text-stone-300 tracking-wider border-b border-stone-900 pb-2 flex items-center gap-1.5">
                    <Tag size={14} className="text-[#e84b1f]" /> CATEGORY TAGS
                  </h4>

                  {/* Existing tags preview */}
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span 
                        key={tag}
                        className="font-mono text-[8px] bg-black border border-stone-900 text-stone-400 px-2 py-1 rounded-md flex items-center gap-1 group/chip select-none"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-500 transition-colors font-bold text-stone-600 font-sans text-xs cursor-pointer"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Input tag */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="ADD TAG CHIP (Enter)..."
                      className="w-full bg-[#070707] border border-stone-900 rounded-xl px-3.5 py-2 text-stone-200 font-mono text-[10px] focus:outline-none focus:ring-1 focus:ring-[#e84b1f]"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-stone-900 hover:bg-stone-800 text-stone-300 px-4 py-2 font-mono text-[10px] rounded-xl border border-stone-850 uppercase font-black shrink-0 cursor-pointer"
                    >
                      ADD
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </form>
        )}

        {/* VIEW 3: COMMENT MODERATION CONTROL */}
        {viewMode === 'comments' && (
          <div className="space-y-6 text-left">
            
            <div className="border border-stone-900 bg-stone-950/20 max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-5 bg-stone-950 border-b border-stone-900 flex justify-between items-center">
                <span className="font-mono text-[10px] tracking-widest text-[#f5c842] uppercase font-black flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  USER FEEDBACK LOG ENTRIES ({aggregatedComments.length} TOTAL ACTIONS)
                </span>
                
                <span className="font-mono text-[9px] text-stone-600 tracking-widest uppercase">
                  MODERATORS DECK
                </span>
              </div>

              {aggregatedComments.length === 0 ? (
                <div className="p-20 text-center text-stone-500 space-y-2">
                  <MessageSquare className="mx-auto text-stone-800" size={36} />
                  <p className="font-mono text-[10px] tracking-widest uppercase">Commentary stack is clear!</p>
                  <p className="font-sans text-xs text-stone-600 max-w-sm mx-auto">No interactive responses have been submitted to any articles yes.</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-950">
                  {aggregatedComments.map(({ post, comment }) => (
                    <div 
                      key={`${post.id}-${comment.id}`}
                      className="p-6 hover:bg-[#0c0c0c]/80 transition-colors flex flex-col sm:flex-row justify-between items-start gap-4"
                    >
                      <div className="space-y-2.5 max-w-2xl text-left">
                        {/* Header line on comment */}
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-mono">
                          <span className="font-black text-stone-100 uppercase bg-stone-900 px-2 py-0.5 border border-stone-850 rounded">
                            👤 {comment.author}
                          </span>
                          <span className="text-stone-600">&middot;</span>
                          <span className="text-stone-500 uppercase">{comment.date}</span>
                          <span className="text-stone-600">&middot;</span>
                          <span className="text-stone-500/70">BELONGS TO</span>
                          <span className="text-[#e84b1f] hover:underline font-bold max-w-[150px] truncate">
                            "{post.title}"
                          </span>
                        </div>

                        {/* Comment core text */}
                        <p className="font-sans text-stone-300 text-xs sm:text-[13px] leading-relaxed italic bg-black/40 border border-stone-900/50 p-3 rounded-xl">
                          "{comment.text}"
                        </p>
                      </div>

                      <div className="shrink-0">
                        <button
                          onClick={() => handlePurgeComment(post.id, comment.id)}
                          className="flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase text-red-500 border border-red-950/40 hover:border-red-500 bg-red-950/10 hover:bg-red-500 hover:text-white px-3.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold select-none"
                        >
                          <Trash2 size={10} /> PURGE MANUALLY
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
