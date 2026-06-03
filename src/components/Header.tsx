import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, PenTool, Sparkles, Menu, X, Info, Flame, Search, Sun, Moon, Instagram } from 'lucide-react';
import { Category, BlogPost } from '../types';
import VividLogo from './VividLogo';

interface HeaderProps {
  activeCategory: Category | 'ALL' | 'SAVED' | 'MOOD' | 'BLUEPRINT' | 'ADMIN';
  setActiveCategory: (category: Category | 'ALL' | 'SAVED' | 'MOOD' | 'BLUEPRINT' | 'ADMIN') => void;
  savedCount: number;
  openCreateModal: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  posts?: BlogPost[];
}

interface RollingLinkProps {
  children: string;
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
}

function RollingLink({ children, active, onClick }: RollingLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`relative font-mono text-[9px] lg:text-[10px] tracking-[0.2em] lg:tracking-[0.25em] font-bold uppercase cursor-pointer py-1.5 transition-colors duration-200 group/roll overflow-hidden h-7 flex flex-col justify-start select-none ${
        active 
          ? 'text-[#e84b1f]' 
          : 'text-[#f5f0e8]/50 hover:text-[#e84b1f]'
      }`}
    >
      <div className="relative h-4 overflow-hidden flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/roll:-translate-y-4">
        <span className="block h-4 leading-4 transform transition-transform duration-300 group-hover/roll:-translate-y-[2px]">
          {children}
        </span>
        <span className="block h-4 leading-4 text-[#e84b1f]">
          {children}
        </span>
      </div>
      <span className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-[#e84b1f] origin-left transition-transform duration-200 ease-out ${active ? 'scale-x-100' : 'scale-x-0 group-hover/roll:scale-x-100'}`} />
    </button>
  );
}

// Category Manifestos & Article counts as specified in the prompt
const CATEGORY_INFOS = {
  MINDSET: { count: 32, desc: "Real talk about habits, identity, mental health, productivity myths, and growing without the toxic positivity." },
  STYLE: { count: 28, desc: "Fashion from a real perspective. African designers, style evolution, what to wear and why, and honest reviews." },
  TRAVEL: { count: 21, desc: "Solo trips, budget guides, luxury splurges, honest city reviews, and what travel really teaches you about yourself." },
  FINANCE: { count: 19, desc: "Money conversations we don't have enough in Nigeria. Budgeting, investing, debt, and building wealth." },
  WELLNESS: { count: 15, desc: "Real wellness — therapy, rest, boundaries, body image, and what it means to actually take care of yourself." },
  FOOD: { count: 12, desc: "Restaurant guides, recipes, food culture deep-dives, and why African culinary legacy deserves a global seat." },
  HOME: { count: 12, desc: "Making a beautiful, intentional space on a real budget. Lagos apartment tours, styling, and slow decorating." },
  CULTURE: { count: 12, desc: "Art, music, film, Afrobeats, Nollywood, and the broader creative explosion happening across the continent right now." },
  CARS: { count: 12, desc: "Analog steering racks, three-pedal gearboxes, mechanical weight, and raw driver communion on open roads." },
  EDUCATION: { count: 12, desc: "Un-standardized curiosity, architectural apprentice paths, self-directed research, and sovereign craft studies." }
};

export default function Header({
  activeCategory,
  setActiveCategory,
  savedCount,
  openCreateModal,
  searchQuery = '',
  setSearchQuery,
  posts = [],
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  
  // Custom scroll tracking states according to design concepts
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Search input state on header
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);

  // Interactive Dark/Light mode state
  const [darkMode, setDarkMode] = useState(true);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const topicsRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = ['MINDSET', 'STYLE', 'TRAVEL', 'FINANCE', 'WELLNESS', 'FOOD', 'HOME', 'CULTURE', 'CARS', 'EDUCATION'];

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync internal search value if external state changes
  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  // Handle outside click to collapse search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (topicsRef.current && !topicsRef.current.contains(event.target as Node)) {
        setTopicsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input on click expand
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // ⚡ Throttled Scroll Listener using requestAnimationFrame with Hide-on-Fast-Down-Scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const dy = currentScrollY - lastScrollY;

      // Scroll threshold check
      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Scrolling direction for opacity locked-in indicator
      if (currentScrollY > 40) {
        if (dy < 0) {
          setIsScrollingUp(true); // scrolling up
        } else if (dy > 0) {
          setIsScrollingUp(false); // scrolling down
        }
      } else {
        setIsScrollingUp(false);
      }

      // Floating header follows continuously on scroll
      setIsHidden(false);

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollToNewsletter = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('newsletter-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    if (setSearchQuery) {
      setSearchQuery(val);
    }
  };

  const handleToggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (!newMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  // Helper to retrieve the 3 most recent post titles under a specific category or fallback to gorgeous defaults
  const getRecentTitlesForCategory = (cat: Category): string[] => {
    const catPosts = posts.filter(p => p.category === cat);
    if (catPosts.length > 0) {
      return catPosts.slice(0, 3).map(p => p.title);
    }
    // Fallbacks matching editorial prompt content exactly
    const fallbacks: Record<Category, string[]> = {
      MINDSET: ["The 5AM Club Didn't Fix Me", "The Honest Guide to Relocating", "Setting Boundaries Without Guilt"],
      STYLE: ["Quiet Luxury Is Over", "I Wore Only Nigerian Designers", "Style Evolution Beyond the Grid"],
      TRAVEL: ["3 Weeks Solo in Morocco", "44 Hours in Accra: Zero Regrets", "Desolate Coordinates: Rif Mountains"],
      FINANCE: ["I Paid Off ₦2M in 14 Months", "Money Conversations We Don't Have", "Wealth Generation on an Irregular Salary"],
      WELLNESS: ["I Quit Hustle Culture", "What Therapy Actually Taught Me", "Resting in a Chaotic Neighborhood"],
      FOOD: ["The Lagos Food Scene in 2025", "Hearth Fire Cookery out of Kaduna", "Pepper Soup Purifying Rituals"],
      HOME: ["The Lagos Apartment Makeover", "Slow Decorating on a Budget", "Tactile Concrete Interior Accents"],
      CULTURE: ["Art Scene Explosion in Lagos", "Afrobeats: The Sonic Frontier", "Nollywood's New Architectural Wave"],
      CARS: ["The Death of the Hydraulic Steering Wheel", "Three-Pedal Communion", "The Joy of the Drive"],
      EDUCATION: ["The Trap of the Graduate Template", "Self-Directed Research Laws", "Apprenticeship Over Standardized Badges"]
    };
    return fallbacks[cat] || [];
  };

  // 🎨 Smooth Responsive Width mapping
  let widthStyle = '100%';
  if (isScrolled) {
    if (windowWidth < 480) {
      widthStyle = 'calc(100% - 32px)';
    } else if (windowWidth <= 1024) {
      widthStyle = 'min(90%, 680px)';
    } else if (windowWidth > 1440) {
      widthStyle = '1080px';
    } else {
      widthStyle = '980px';
    }
  }

  const isHomeActive = activeCategory === 'ALL' && !topicsOpen;
  const isAboutActive = aboutOpen;
  const isTopicsActive = topicsOpen || (activeCategory !== 'ALL' && activeCategory !== 'SAVED' && activeCategory !== 'MOOD');
  const isSavedActive = activeCategory === 'SAVED';

  const [logoHovered, setLogoHovered] = useState(false);

  return (
    <>
      {/* 1. Thin Secondary Top Bar above Nav (hidden on scroll) */}
      <div 
        style={{
          height: isScrolled ? '0px' : '36px',
          opacity: isScrolled ? 0 : 1,
          pointerEvents: isScrolled ? 'none' : 'auto',
          transition: 'height 400ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease',
        }}
        className="w-full bg-[#070707] text-[#f5f0e8]/55 border-b border-[#f5f0e8]/5 z-[1001] relative overflow-hidden flex items-center justify-between px-6 sm:px-12 text-[10px] font-mono tracking-widest uppercase"
      >
        <div className="flex items-center space-x-2">
          <span className="text-[#e84b1f]">📍</span>
          <span>Reading from Lagos? We write for you.</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 text-[#f5f0e8]/50">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#e84b1f] transition-colors">X.com</a>
            <span>·</span>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#e84b1f] transition-colors">Instagram</a>
            <span>·</span>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#e84b1f] transition-colors">Pinterest</a>
          </div>
          
          <button 
            onClick={handleToggleDarkMode}
            className="flex items-center space-x-1 text-[#f5f0e8]/80 hover:text-[#f5c842] transition-colors cursor-pointer uppercase select-none font-bold"
          >
            {darkMode ? (
              <>
                <Sun size={10} className="text-[#f5c842]" />
                <span>LIGHT</span>
              </>
            ) : (
              <>
                <Moon size={10} className="text-[#e84b1f]" />
                <span>DARK</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Floating Header Navigation */}
      <motion.header
        initial={{ y: '-120%', x: '-50%', scaleY: 0.8 }}
        animate={isHidden ? {
          y: ['0%', '0%', '-120%'],
          scaleY: [1.0, 0.8, 0.8],
          x: '-50%',
          clipPath: isScrolled ? 'inset(0 1% 0 1% round 30px)' : 'inset(0 0% 0 0% round 0px)'
        } : {
          y: ['-120%', '0%', '0%'],
          scaleY: [0.8, 0.8, 1.0],
          x: '-50%',
          clipPath: isScrolled ? 'inset(0 1% 0 1% round 30px)' : 'inset(0 0% 0 0% round 0px)'
        }}
        transition={{ 
          duration: 0.5, 
          times: isHidden ? [0, 0.18, 1] : [0, 0.82, 1],
          ease: [0.16, 1, 0.3, 1] 
        }}
        style={{
          position: 'fixed',
          left: '50%',
          top: isScrolled ? '18px' : '36px',
          width: widthStyle,
          borderRadius: '20px',
          backgroundColor: isScrolled 
            ? 'rgba(13, 13, 13, 0.94)' 
            : 'rgba(13, 13, 13, 0.98)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(232, 75, 31, 0.08), 0 2px 12px rgba(0,0,0,0.5)',
          willChange: 'transform, border-radius, top',
          transition: 'width 450ms cubic-bezier(0.16, 1, 0.3, 1), top 450ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="z-[1000] border overflow-visible shadow-lg"
      >
        <div className={`mx-auto px-6 max-w-7xl flex items-center justify-between ${isScrolled ? 'py-2.5 sm:py-3' : 'py-4 sm:py-5'}`}>
          
          {/* Menu triggers for mobile */}
          <div className="flex min-[480px]:hidden items-center z-10">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-[#f5f0e8]/80 hover:text-[#e84b1f] transition-all p-1 mr-2"
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Left: Blog Logo VIVID. */}
          <div className="flex items-center">
            <div 
              className="flex items-center cursor-pointer group space-x-2.5" 
              onClick={() => {
                setActiveCategory('ALL');
                setTopicsOpen(false);
                if (setSearchQuery) setSearchQuery('');
              }}
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
            >
              <VividLogo 
                size={isScrolled ? 22 : 28} 
                animated={logoHovered} 
                className="text-[#e84b1f] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 pointer-events-none" 
              />
              <span className={`font-bebas tracking-[0.2em] text-[#f5f0e8] group-hover:text-white transition-all duration-300 uppercase select-none font-bold ${isScrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`}>
                VIVID
                <span className="text-[#e84b1f] font-black inline-block glow-text-red logo-dot-1">.</span>
                <span className="text-[#e84b1f] font-black inline-block glow-text-red logo-dot-2">.</span>
              </span>
            </div>
          </div>

          {/* Center: Nav links */}
          <nav className="hidden min-[480px]:flex items-center space-x-5 lg:space-x-8">
            
            {/* HOME */}
            <RollingLink
              active={isHomeActive}
              onClick={() => {
                setActiveCategory('ALL');
                setTopicsOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              HOME
            </RollingLink>

            {/* BLUEPRINT */}
            <RollingLink
              active={activeCategory === 'BLUEPRINT'}
              onClick={() => {
                setActiveCategory('BLUEPRINT');
                setTopicsOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              BLUEPRINT
            </RollingLink>

            {/* ABOUT */}
            <RollingLink
              active={isAboutActive}
              onClick={() => setAboutOpen(true)}
            >
              ABOUT
            </RollingLink>

            {/* TOPICS / MEGA MENU (ON HOVER / CLICK TRIGGER) */}
            <div 
              onMouseEnter={() => setTopicsOpen(true)} 
              className="relative py-1.5"
            >
              <RollingLink
                active={isTopicsActive}
                onClick={() => setTopicsOpen(!topicsOpen)}
              >
                {`TOPICS ${topicsOpen ? '[-]' : '[+]'}`}
              </RollingLink>
            </div>

            {/* SAVED */}
            <RollingLink
              active={isSavedActive}
              onClick={() => {
                setActiveCategory('SAVED');
                setTopicsOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {`SAVED ${savedCount > 0 ? `(${savedCount})` : ''}`}
            </RollingLink>

            {/* NEWSLETTER */}
            <RollingLink
              active={false}
              onClick={scrollToNewsletter}
            >
              NEWSLETTER
            </RollingLink>

            {/* ADMIN */}
            <RollingLink
              active={activeCategory === 'ADMIN'}
              onClick={() => {
                setActiveCategory('ADMIN');
                setTopicsOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              ADMIN
            </RollingLink>
          </nav>

          {/* Far Right: Solid red Subscribe CTA + Expandable Search */}
          <div className="flex items-center space-x-2.5 sm:space-x-4">
            
            {/* Expandable Search Input Container */}
            <div ref={searchContainerRef} className="relative flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="SEARCH ARCHIVE..."
                style={{
                  width: searchOpen ? (windowWidth < 640 ? '110px' : '180px') : '0px',
                  opacity: searchOpen ? '1' : '0',
                  transition: 'width 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="bg-black/98 text-[#f5f0e8] placeholder-[#f5f0e8]/25 text-[9px] font-mono tracking-wider uppercase border border-[#e84b1f]/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#e84b1f] px-3 py-1.5 focus:border-[#e84b1f]"
              />
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                style={{
                  transform: searchOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="p-1 text-[#f5f0e8]/80 hover:text-[#e84b1f] bg-black/40 border border-white/5 rounded-xl transition-colors cursor-pointer select-none p-1.5 mr-0.5"
                title="Search Chronicles"
              >
                <Search size={14} className="sm:w-4 sm:h-4 w-3.5 h-3.5" />
              </button>
            </div>

            {/* Solid Red Subscribe CTA */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              onClick={scrollToNewsletter}
              className="relative overflow-hidden bg-[#e84b1f] hover:bg-[#ff5522] text-[#f5f0e8] font-mono font-bold tracking-[0.2em] uppercase cursor-pointer select-none transition-all duration-300 flex items-center justify-center group/cta rounded-xl px-4 py-2 text-[9px] lg:text-[10px] shadow-md border border-white/5"
            >
              <span className="absolute inset-x-0 top-0 bottom-0 block w-[200%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
              <span className="min-[1025px]:inline hidden text-[9px] lg:text-[10px]">SUBSCRIBE</span>
              <span className="min-[1025px]:hidden inline text-xs font-black">→</span>
            </motion.button>
          </div>
        </div>

        {/* 3. Dropdown Mega Menu for Topics Grid */}
        <AnimatePresence>
          {topicsOpen && (
            <motion.div
              ref={topicsRef}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onMouseLeave={() => setTopicsOpen(false)}
              className="absolute left-0 right-0 top-full bg-[#0d0d0d]/98 border border-white/15 shadow-2xl rounded-2xl overflow-hidden mt-3 pointer-events-auto"
            >
              {/* 4-column category grid - displaying all 8 categories */}
              <div className="mx-auto max-w-7xl px-8 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {categories.map((cat) => {
                  const info = CATEGORY_INFOS[cat];
                  const titles = getRecentTitlesForCategory(cat);
                  return (
                    <div key={cat} className="space-y-4 border-r border-[#f5f0e8]/5 pr-4 last:border-0">
                      <div>
                        <h4 
                          onClick={() => {
                            setActiveCategory(cat);
                            setTopicsOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="font-bebas text-2xl tracking-[0.1em] text-[#e84b1f] hover:text-[#f5c842] transition-colors cursor-pointer uppercase font-extrabold select-none hover-glow-red"
                        >
                          {cat}
                        </h4>
                        <p className="font-sans text-[11px] text-[#f5f0e8]/60 leading-relaxed mt-1">
                          {info.desc}
                        </p>
                      </div>

                      {/* 3 clickable recent posts or placeholders */}
                      <div className="space-y-2.5">
                        <span className="font-mono text-[8px] text-[#f5c842] tracking-widest uppercase block font-bold">RECENT TEXTS:</span>
                        <ul className="space-y-1.5">
                          {titles.map((t, tIdx) => (
                            <li key={tIdx}>
                              <button
                                onClick={() => {
                                  // Trigger navigation to this article via searching it or selecting category
                                  setActiveCategory(cat);
                                  setTopicsOpen(false);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="block text-left font-serif-display text-xs text-[#f5f0e8]/80 hover:text-[#e84b1f] truncate transition-colors cursor-pointer"
                              >
                                {tIdx + 1}. "{t}"
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* View All Posts linkage bottom */}
                      <div className="pt-2 border-t border-[#f5f0e8]/5">
                        <button
                          onClick={() => {
                            setActiveCategory(cat);
                            setTopicsOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="font-mono text-[9px] text-[#f5c842] hover:text-[#e84b1f] tracking-widest uppercase transition-colors flex items-center cursor-pointer"
                        >
                          View All {info.count} Posts &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ticker/All divisions row at very bottom of mega menu */}
              <div className="bg-black/90 py-3.5 px-8 flex justify-between items-center border-t border-[#f5f0e8]/10 text-[10px] font-mono tracking-widest text-[#f5f0e8]/45">
                <span>✦ TACTILE REGISTRY CHRONICLE PORTAL</span>
                <button
                  onClick={() => {
                    setActiveCategory('ALL');
                    setTopicsOpen(false);
                  }}
                  className="text-[#e84b1f] hover:text-white uppercase font-bold"
                >
                  [ VIEW ALL ARCHIVED CHRONICLES ]
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Dynamic Full-screen Overlay Menu (slides from the right) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[2000] overflow-hidden min-[480px]:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#0d0d0d]/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 bottom-0 w-full h-full bg-[#0d0d0d]/98 p-8 flex flex-col justify-between border-l border-[#e84b1f]/20 shadow-2xl"
            >
              <div className="flex justify-between items-center pb-4 border-b border-[#f5f0e8]/10">
                <div className="flex items-center space-x-2">
                  <VividLogo size={20} animated={true} className="text-[#e84b1f]" />
                  <span className="font-bebas text-lg tracking-[0.15em] text-[#e84b1f] glow-text-red pt-0.5">
                    VIVID COHORT
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#f5f0e8]/80 hover:text-[#e84b1f] bg-neutral-950 p-1.5 border border-neutral-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col space-y-4 my-auto text-left">
                {[
                  {
                    label: 'JOURNALS FEED',
                    onClick: () => {
                      setActiveCategory('ALL');
                    },
                    isActive: activeCategory === 'ALL',
                  },
                  {
                    label: 'VIVID BLUEPRINT',
                    onClick: () => {
                      setActiveCategory('BLUEPRINT');
                    },
                    isActive: activeCategory === 'BLUEPRINT',
                  },
                  {
                    label: 'ABOUT PHILOSOPHY',
                    onClick: () => {
                      setAboutOpen(true);
                    },
                    isActive: aboutOpen,
                  },
                  {
                    label: `SAVED VAULT (${savedCount})`,
                    onClick: () => {
                      setActiveCategory('SAVED');
                    },
                    isActive: activeCategory === 'SAVED',
                  },
                  {
                    label: 'MOODBOARD DIRECTORY',
                    onClick: () => {
                      setActiveCategory('MOOD');
                    },
                    isActive: activeCategory === 'MOOD',
                    isYellow: true
                  },
                  {
                    label: 'ADMIN DECK CONTROL',
                    onClick: () => {
                      setActiveCategory('ADMIN');
                    },
                    isActive: activeCategory === 'ADMIN',
                    isYellow: true
                  },
                  {
                    label: 'DRAFT CONTRIBUTION',
                    onClick: () => {
                      openCreateModal();
                    },
                    isRed: true
                  }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      item.onClick();
                    }}
                    className={`font-bebas text-3xl sm:text-4xl tracking-widest text-left uppercase transition-colors select-none cursor-pointer py-1.5 
                      ${item.isActive 
                        ? 'text-[#e84b1f] glow-text-red' 
                        : (item.isRed 
                            ? 'text-[#e84b1f] hover:text-[#ff5522] glow-text-red font-bold animate-pulse' 
                            : (item.isYellow 
                                ? 'text-[#f5c842] hover:text-white glow-text-yellow' 
                                : 'text-[#f5f0e8]/80 hover:text-[#e84b1f]'))}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-[#f5f0e8]/10 text-left">
                <span className="font-mono text-[9px] text-[#f5f0e8]/30 tracking-widest uppercase block mb-1">
                  TACTILE REGISTRY DIRECTORIES
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setMobileMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`text-left font-mono text-[10px] tracking-wider py-1.5 px-2 bg-black border text-[#f5f0e8]/75 transition-colors uppercase ${
                        activeCategory === cat ? 'border-[#e84b1f] text-[#e84b1f]' : 'border-[#f5f0e8]/10 hover:border-[#e84b1f]/50'
                      }`}
                    >
                      #{cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle in mobile menu */}
              <div className="pt-4 flex justify-between items-center border-t border-white/5">
                <span className="font-mono text-[9px] text-white/40">THEME CONFIGURATION:</span>
                <button
                  onClick={handleToggleDarkMode}
                  className="bg-[#121212] border border-white/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white"
                >
                  {darkMode ? "🌙 Ambient Night" : "☀️ Editorial Light"}
                </button>
              </div>

              <div className="pt-4 border-t border-[#f5f0e8]/5 text-center shrink-0">
                <span className="font-bebas text-lg tracking-[0.25em] text-[#f5f0e8]/30 select-none">
                  VIVID CHRONICLE v4.5
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About VIVID Philosophy Modal markup */}
      <AnimatePresence>
        {aboutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAboutOpen(false)}
            className="fixed inset-0 z-[3000] bg-[#0d0d0d]/95 flex items-center justify-center p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full p-8 md:p-10 border border-[#e84b1f]/35 bg-[#000000] space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 text-8xl font-bebas text-[#e84b1f]/5 pointer-events-none select-none">
                VIVID
              </div>

              <div className="flex items-center justify-between border-b border-[#f5f0e8]/10 pb-4">
                <div className="flex items-center space-x-2">
                  <Flame size={20} className="text-[#e84b1f] glow-text-red" />
                  <h3 className="font-bebas text-2xl tracking-[0.1em] text-[#f5f0e8] uppercase glow-text-cream">
                    VIVID PHILOSOPHY
                  </h3>
                </div>
                <button
                  onClick={() => setAboutOpen(false)}
                  className="text-[#f5f0e8]/50 hover:text-[#e84b1f] font-mono text-xs uppercase cursor-pointer"
                >
                  DISMISS [×]
                </button>
              </div>

              <div className="space-y-4">
                <p className="font-serif-display text-xl text-[#f5c842] italic leading-relaxed glow-text-yellow">
                  "In an epoch of rapid streaming, auto-curated algorithms, and sterile mass-produced pixels, VIVID stands as a monument to uncompromising physical reality."
                </p>

                <p className="font-sans text-[#f5f0e8]/80 text-sm sm:text-base leading-relaxed text-justify">
                  VIVID is a bold, modern lifestyle critique and editorial journal covering high-end tactile crafts. Our contributors research the globe for pure acoustic fidelity, brutalist landscape aggregates, raw culinary wood smoke, and desolate physical coordinates.
                </p>

                <div className="bg-[#e84b1f]/5 border border-[#e84b1f]/20 p-4.5 space-y-2">
                  <span className="font-mono text-[9px] text-[#e84b1f] tracking-widest uppercase font-bold block glow-text-red">
                    EDITORIAL DIVISION MANIFESTOS:
                  </span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono text-[#f5f0e8]/85">
                    <div>🧠 MINDSET: Toxic-productivity refusal.</div>
                    <div>📐 STYLE: Local artisanal pride.</div>
                    <div>🏕️ TRAVEL: Real, unmonetized treks.</div>
                    <div>💰 FINANCE: Complete debt liberation.</div>
                    <div>🍀 WELLNESS: Uncompromised rest boundaries.</div>
                    <div>🥘 FOOD: Wood-heat culinary roots.</div>
                    <div>🪴 HOME: Budget Slow Interior style.</div>
                    <div>🎷 CULTURE: Creative African shifts.</div>
                    <div>🏎️ CARS: Pure tactile wheel communion.</div>
                    <div>📚 EDUCATION: Self-directed sovereign craft.</div>
                  </div>
                </div>

                <p className="font-sans text-xs text-[#f5f0e8]/45 italic">
                  Curated quarterly between Shibuya (Japan), Berlin (Germany), and Lagos (Nigeria).
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setAboutOpen(false)}
                  className="bg-[#e84b1f] hover:bg-[#f5c842] text-white hover:text-[#0d0d0d] font-bebas text-xs tracking-widest px-6 py-3 uppercase transition-all"
                >
                  ENTER THE REALM
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
