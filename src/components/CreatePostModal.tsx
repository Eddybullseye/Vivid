import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenTool, Image, User, Hash, AlertTriangle, CheckSquare } from 'lucide-react';
import { Category, BlogPost, Author } from '../types';

interface CreatePostModalProps {
  onClose: () => void;
  onCreatePost: (post: BlogPost) => void;
}

const COVER_OPTIONS = [
  { name: 'Turntable Soundscape', url: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1200' },
  { name: 'Sonoran Brutalism', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200' },
  { name: 'Nordic Forest hearth', url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200' },
  { name: 'Sagres Ocean cliff', url: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200' }
];

const CURATOR_OPTIONS: Author[] = [
  {
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    bio: 'Architectural theorist and travel writer capturing monolithic designs that challenge nature.'
  },
  {
    name: 'Kenji Sato',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    bio: 'Sourcing analog secrets between Shibuya and Koenji. Believer in vacuum tubes and slow mornings.'
  },
  {
    name: 'Sven Lindqvist',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=200',
    bio: 'Culinary wanderer, wood-firing enthusiast, exploring remote cooking outposts of the Arctic north.'
  }
];

export default function CreatePostModal({
  onClose,
  onCreatePost,
}: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('MINDSET');
  const [selectedCurator, setSelectedCurator] = useState<Author>(CURATOR_OPTIONS[0]);
  const [useCustomCurator, setUseCustomCurator] = useState(false);
  const [customCuratorName, setCustomCuratorName] = useState('');
  const [customCuratorBio, setCustomCuratorBio] = useState('');
  
  const [content, setContent] = useState('');
  const [quotesText, setQuotesText] = useState('');
  const [coverUrl, setCoverUrl] = useState(COVER_OPTIONS[0].url);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [tags, setTags] = useState('');
  
  const [errorText, setErrorText] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!title.trim()) {
      setErrorText('Please specify a title for your essay.');
      return;
    }
    if (!subtitle.trim()) {
      setErrorText('Please specify an editorial subtitle (lead paragraph summary).');
      return;
    }
    if (!content.trim()) {
      setErrorText('Please write some layout content/paragraphs for your essay.');
      return;
    }

    // Prepare Author block
    let authorBlock: Author = selectedCurator;
    if (useCustomCurator) {
      if (!customCuratorName.trim() || !customCuratorBio.trim()) {
        setErrorText('Please provide your custom curator name and bio line.');
        return;
      }
      authorBlock = {
        name: customCuratorName.trim(),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200', // Default guest curator picture
        bio: customCuratorBio.trim()
      };
    }

    // Process paragraphs
    const contentParagraphs = content
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (contentParagraphs.length === 0) {
      setErrorText('Please enter at least one readable paragraph.');
      return;
    }

    // Process tags list
    const tagsList = tags
      .split(',')
      .map(t => t.trim().toUpperCase())
      .filter(t => t.length > 0);

    if (tagsList.length === 0) {
      tagsList.push('VIVID', selectedCategory);
    }

    // Process pull quotes
    const quotesList = quotesText.trim() 
      ? [quotesText.trim()] 
      : ['Luxury is space, darkness, shadow, and silence in a loud world.'];

    // Read time estimation
    const wordCount = content.split(/\s+/).length || 50;
    const estTime = Math.max(1, Math.round(wordCount / 180));

    const finalImage = customCoverUrl.trim() ? customCoverUrl.trim() : coverUrl;

    const newPost: BlogPost = {
      id: `custom-post-${Date.now()}`,
      title: title.trim().toUpperCase(),
      subtitle: subtitle.trim(),
      category: selectedCategory,
      author: authorBlock,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).toUpperCase(),
      readTime: `${estTime} MIN READ`,
      content: contentParagraphs,
      quotes: quotesList,
      imageUrl: finalImage,
      tags: tagsList,
      likes: Math.floor(Math.random() * 45) + 5, // Small default likes pool
      comments: []
    };

    onCreatePost(newPost);
    setPublishSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0d0d0d]/90 flex items-center justify-center p-4 md:p-8 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="bg-[#000000] border border-[#e84b1f]/30 w-full max-w-3xl overflow-hidden relative rounded-3xl shadow-2xl"
      >
        {/* Top header */}
        <div className="bg-[#0d0d0d] border-b border-[#f5f0e8]/10 py-5 px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2.5 text-[#e84b1f]">
            <PenTool size={18} />
            <h2 className="font-bebas text-xl md:text-2xl tracking-widest text-[#f5f0e8] uppercase">
              VIVID DRAFTING LAB
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#f5f0e8]/50 hover:text-[#e84b1f] font-mono text-xs uppercase tracking-widest cursor-pointer py-1"
          >
            DISCARD DRAFT ×
          </button>
        </div>

        {/* Modal content body */}
        <div className="max-h-[80vh] overflow-y-auto p-6 md:p-8 space-y-6">
          <AnimatePresence mode="wait">
            {!publishSuccess ? (
              <form onSubmit={handlePublish} className="space-y-6">
                
                {/* Error Banner */}
                {errorText && (
                  <div className="bg-[#e84b1f]/10 border border-[#e84b1f] p-4 flex items-start space-x-2.5 rounded-xl">
                    <AlertTriangle className="text-[#e84b1f] shrink-0" size={16} />
                    <p className="font-mono text-xs text-[#f5f0e8]">
                      {errorText}
                    </p>
                  </div>
                )}

                {/* Grid Inputs: Title Subtitle Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Essay Display Title */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-[10px] tracking-widest uppercase font-mono text-[#f5f0e8]/60">
                      ESSAY DISPLAY TITLE (WILL RENDER UPPERCASE)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. THE METALS IN THE BASEMENT"
                      className="w-full bg-[#0d0d0d] text-[#f5f0e8] placeholder-[#f5f0e8]/20 text-xs p-3.5 border border-[#f5f0e8]/20 focus:border-[#e84b1f] focus:outline-none font-bebas text-lg tracking-wide rounded-xl"
                    />
                  </div>

                  {/* Editorial Subtitle */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-[10px] tracking-widest uppercase font-mono text-[#f5f0e8]/60">
                      EDITORIAL LEADER (SUBTITLE)
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="e.g. Challenging the industrial boundaries of raw steel and aluminum panels."
                      className="w-full bg-[#0d0d0d] text-[#f5f0e8] placeholder-[#f5f0e8]/20 text-xs p-3.5 border border-[#f5f0e8]/20 focus:border-[#e84b1f] focus:outline-none font-serif-display italic rounded-xl"
                    />
                  </div>

                  {/* Category Selection block */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] tracking-widest uppercase font-mono text-[#f5f0e8]/60">
                      MAGAZINE COLUMN / SECTION
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as Category)}
                      className="w-full bg-[#0d0d0d] text-[#f5f0e8] text-xs p-3.5 border border-[#f5f0e8]/20 focus:border-[#e84b1f] focus:outline-none font-bebas tracking-widest rounded-xl"
                    >
                      <option value="MINDSET">MINDSET JOURNAL</option>
                      <option value="STYLE">STYLE ARCHIVE</option>
                      <option value="TRAVEL">TRAVEL CHRONICLES</option>
                      <option value="FINANCE">FINANCE LEDGERS</option>
                      <option value="WELLNESS">WELLNESS REFUGES</option>
                      <option value="FOOD">TASTE RITUALS</option>
                      <option value="HOME">HOME & DECOR</option>
                      <option value="CULTURE">CULTURE CRITIQUE</option>
                      <option value="CARS">MOTORING GEAR COGNITION</option>
                      <option value="EDUCATION">SOVEREIGN CRAFT ACADEMICS</option>
                    </select>
                  </div>

                  {/* Tag List */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] tracking-widest uppercase font-mono text-[#f5f0e8]/60">
                      TAG LABELS (COMMA SEPARATED)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="METALS, INDUSTRIAL, DESIGN"
                      className="w-full bg-[#0d0d0d] text-[#f5f0e8] placeholder-[#f5f0e8]/20 text-xs p-3.5 border border-[#f5f0e8]/20 focus:border-[#e84b1f] focus:outline-none font-mono uppercase rounded-xl"
                    />
                  </div>
                </div>

                {/* Curator Section */}
                <div className="border-t border-[#f5f0e8]/10 pt-4 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-widest uppercase font-mono text-[#f5f0e8]/60 flex items-center space-x-1.5">
                      <User size={12} className="text-[#e84b1f]" />
                      <span>EDITORIAL BYLINE / AUTHOR</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setUseCustomCurator(!useCustomCurator)}
                      className="text-[10px] font-mono font-bold text-[#f5c842] hover:text-[#e84b1f] uppercase"
                    >
                      {useCustomCurator ? 'USE VERIFIED STAFF' : 'WRITE UNDER PSEUDONYM'}
                    </button>
                  </div>

                  {!useCustomCurator ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {CURATOR_OPTIONS.map((cur) => {
                        const isSel = selectedCurator.name === cur.name;
                        return (
                          <div
                            key={cur.name}
                            onClick={() => setSelectedCurator(cur)}
                            className={`p-3 border flex items-center space-x-2.5 cursor-pointer bg-[#0d0d0d] transition-colors rounded-xl ${
                              isSel ? 'border-[#e84b1f] bg-[#e84b1f]/5' : 'border-[#f5f0e8]/10 hover:border-[#f5f0e8]/20'
                            }`}
                          >
                            <img
                              src={cur.avatar}
                              alt={cur.name}
                              className="w-8 h-8 rounded-lg object-cover border border-[#f5f0e8]/15 grayscale"
                            />
                            <div>
                              <h5 className="font-bebas text-sm text-[#f5f0e8] leading-tight">
                                {cur.name}
                              </h5>
                              <span className="font-mono text-[8px] text-[#f5f0e8]/50 uppercase block">
                                STAFF WRITER
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0d0d0d] p-4 border border-[#f5f0e8]/10 rounded-2xl">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono text-[#f5f0e8]/40">Pseudonym Name</label>
                        <input
                          type="text"
                          value={customCuratorName}
                          onChange={(e) => setCustomCuratorName(e.target.value)}
                          placeholder="e.g. Maximillion S."
                          className="w-full bg-[#000] text-[#f5f0e8] text-xs p-2.5 border border-[#f5f0e8]/20 focus:border-[#e84b1f] focus:outline-none font-mono rounded-xl"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono text-[#f5f0e8]/40">One-Line Biography Accent</label>
                        <input
                          type="text"
                          value={customCuratorBio}
                          onChange={(e) => setCustomCuratorBio(e.target.value)}
                          placeholder="e.g. Modernist ceramic reviewer or independent synth cataloger."
                          className="w-full bg-[#000] text-[#f5f0e8] text-xs p-2.5 border border-[#f5f0e8]/20 focus:border-[#e84b1f] focus:outline-none font-sans italic rounded-xl"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Essay Cover Selection */}
                <div className="border-t border-[#f5f0e8]/10 pt-4 space-y-3">
                  <span className="text-[10px] tracking-widest uppercase font-mono text-[#f5f0e8]/60 flex items-center space-x-1.5">
                    <Image size={12} className="text-[#e84b1f]" />
                    <span>CHOOSE COVER PHOTOGRAPHY OR CUSTOM RESOURCE URL</span>
                  </span>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {COVER_OPTIONS.map((opt) => {
                      const isSel = coverUrl === opt.url && !customCoverUrl;
                      return (
                        <div
                          key={opt.name}
                          onClick={() => {
                            setCoverUrl(opt.url);
                            setCustomCoverUrl('');
                          }}
                          className={`cursor-pointer transition-all relative overflow-hidden group rounded-xl ${
                            isSel ? 'ring-2 ring-[#e84b1f]' : 'opacity-65 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={opt.url}
                            alt={opt.name}
                            className="w-full h-18 object-cover filter grayscale contrast-125 rounded-xl"
                          />
                          <div className="absolute inset-0 bg-[#000]/65 group-hover:bg-[#000]/25 flex items-center justify-center p-1 rounded-xl">
                            <span className="font-bebas text-[10px] tracking-widest text-center text-white text-ellipsis leading-tight uppercase">
                              {opt.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <input
                    type="url"
                    value={customCoverUrl}
                    onChange={(e) => setCustomCoverUrl(e.target.value)}
                    placeholder="... Or paste a custom Unsplash picture URL"
                    className="w-full bg-[#0d0d0d] text-[#f5f0e8] placeholder-[#f5f0e8]/20 text-xs p-3 border border-[#f5f0e8]/20 focus:border-[#e84b1f] focus:outline-none font-mono rounded-xl"
                  />
                </div>

                {/* Main Content Areas */}
                <div className="border-t border-[#f5f0e8]/10 pt-4 space-y-4">
                  
                  {/* Pull Quote */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] tracking-widest uppercase font-mono text-[#f5f0e8]/60">
                      SIGNATURE INLINE QUOTE (DISPLAYED IN LARGE ACCENT BLOCK)
                    </label>
                    <input
                      type="text"
                      value={quotesText}
                      onChange={(e) => setQuotesText(e.target.value)}
                      placeholder="e.g. Iron tells no stories; it silently registers the pressure of decades."
                      className="w-full bg-[#0d0d0d] text-[#f5f0e8] placeholder-[#f5f0e8]/20 text-xs p-3 border border-[#f5f0e8]/20 focus:border-[#e84b1f] focus:outline-none font-serif-display italic rounded-xl"
                    />
                  </div>

                  {/* Essay body content */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] tracking-widest uppercase font-mono text-[#f5f0e8]/60 flex justify-between">
                      <span>MANUSCRIPT BODY CONTENT (PRESS ENTER TO INITIATED MULTIPLE PARAGRAPHS)</span>
                    </label>
                    <textarea
                      rows={6}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your beautiful essay here. We automatically format the initial letter of your draft into a stunning dropped-cap lead-in..."
                      className="w-full bg-[#0d0d0d] text-[#f5f0e8] placeholder-[#f5f0e8]/20 text-xs p-4 border border-[#f5f0e8]/20 focus:border-[#e84b1f] focus:outline-none font-sans leading-relaxed rounded-xl"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-[#e84b1f] hover:bg-[#f5c842] text-[#f5f0e8] hover:text-[#0d0d0d] font-bebas text-sm tracking-widest py-4 transition-colors duration-300 flex items-center justify-center space-x-2 cursor-pointer uppercase font-black rounded-xl"
                >
                  <PenTool size={16} />
                  <span>PUBLISH COMPOSITION TO CHRONICLES</span>
                </button>

              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-6"
              >
                <div className="mx-auto w-16 h-16 bg-[#f5c842]/10 border border-[#f5c842]/35 flex items-center justify-center text-[#f5c842] rounded-2xl">
                  <CheckSquare size={32} className="animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-bebas text-3xl text-[#f5f0e8] tracking-widest uppercase">
                    ESSAY ARCHIVED SUCCESSFULLY
                  </h3>
                  <p className="font-serif-display text-base text-[#f5c842] italic max-w-md mx-auto leading-relaxed">
                    "Your draft was polished, structured, and injected directly into the active issue streams of VIVID."
                  </p>
                </div>

                <div className="pt-6 flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setPublishSuccess(false);
                      // Clear form
                      setTitle('');
                      setSubtitle('');
                      setContent('');
                      setQuotesText('');
                      setTags('');
                    }}
                    className="px-6 py-3 border border-[#f5f0e8]/15 text-[#f5f0e8]/80 hover:text-white hover:border-white font-bebas text-xs tracking-widest uppercase transition-colors rounded-xl"
                  >
                    Draft another essay
                  </button>

                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-[#e84b1f] hover:bg-[#f5c842] text-white hover:text-[#0d0d0d] font-bebas text-xs tracking-widest uppercase transition-all rounded-xl"
                  >
                    Close drafting lab
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
}
