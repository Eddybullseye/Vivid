import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Quote, RefreshCw } from 'lucide-react';
import { INITIAL_MOODBOARD } from '../data';

const ADDITIONAL_QUOTES = [
  'Space is the canvas of the modern mind. Do not crowd it.',
  'Let raw cedar tell its age. Wood retains memory of rain.',
  'If sand could speak, it would praise the silence of desert concrete walls.',
  'Vinyl requires contact. Analog is human because it wears and scars.',
  'Smoke cures. Fire transforms. True cooking burns the ego.',
  'The traveler is a ghost passing through ancient stones.',
  'Shadows are just as crucial as light - they compose the architecture.'
];

export default function MoodBoard() {
  const [moodItems, setMoodItems] = useState(INITIAL_MOODBOARD);
  const [curActiveCategory, setCurActiveCategory] = useState<'ALL' | 'DESIGN' | 'SOUND' | 'TASTE' | 'TRAVEL'>('ALL');
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [editorialInspiration, setEditorialInspiration] = useState(
    '“We do not decorate. We reveal the raw truth of spaces, sounds, and spirits.”'
  );

  const handleGenerateInspiration = () => {
    const randomIndex = Math.floor(Math.random() * ADDITIONAL_QUOTES.length);
    setEditorialInspiration(`“${ADDITIONAL_QUOTES[randomIndex]}”`);
  };

  const filteredMoodItems = curActiveCategory === 'ALL'
    ? moodItems
    : moodItems.filter(item => item.category === curActiveCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Editorial Header */}
      <div className="border-b border-[#e84b1f]/20 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="font-mono text-[10px] text-[#f5c842] tracking-widest uppercase font-bold mb-1.5 flex items-center space-x-1.5">
            <Sparkles size={12} className="text-[#f5c842]" />
            <span>ATMOSPHERIC VIBE BOARD</span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl tracking-wider text-[#f5f0e8] uppercase">
            VIVID MOOD GALLERY
          </h2>
          <p className="font-serif-display text-sm sm:text-base text-[#f5f0e8]/50 italic">
            Visual compositions capturing the philosophy of uncompromising raw lifestyles.
          </p>
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'DESIGN', 'SOUND', 'TASTE', 'TRAVEL'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCurActiveCategory(cat as any)}
              className={`px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase transition-colors rounded-xl ${
                curActiveCategory === cat
                  ? 'bg-[#e84b1f] text-white border border-[#e84b1f]'
                  : 'bg-transparent text-[#f5f0e8]/70 border border-[#f5f0e8]/15 hover:border-[#e84b1f] hover:text-[#e84b1f]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main interactive quote generator banner */}
      <div className="bg-[#e84b1f]/5 border border-[#e84b1f]/25 p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden rounded-3xl shadow-xl">
        <div className="absolute top-0 right-0 p-8 text-7xl font-bebas text-[#e84b1f]/5 pointer-events-none select-none">
          VIVID PHILOSOPHY
        </div>
        
        <div className="space-y-3 max-w-2xl relative z-10">
          <span className="font-mono text-[9px] text-[#e84b1f] tracking-widest uppercase font-bold">
            DAILY DEVOTIONAL INSPIRATION
          </span>
          <motion.p 
            key={editorialInspiration}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif-display text-lg sm:text-2xl text-[#f5f0e8] italic leading-relaxed"
          >
            {editorialInspiration}
          </motion.p>
        </div>

        <button
          onClick={handleGenerateInspiration}
          className="bg-[#e84b1f] hover:bg-[#f5c842] text-[#f5f0e8] hover:text-[#0d0d0d] font-bebas text-xs tracking-widest px-6 py-4 flex items-center space-x-2 transition-colors shrink-0 cursor-pointer uppercase rounded-xl border border-white/5 shadow-md"
        >
          <RefreshCw size={12} className="animate-spin duration-1000" />
          <span>Curate New Thought</span>
        </button>
      </div>

      {/* Mood items grid (bento) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <AnimatePresence mode="popLayout">
          {filteredMoodItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={{ y: -6 }}
              onClick={() => setSelectedQuote(item.quote)}
              className="bg-[#121212] border border-[#f5f0e8]/10 p-4 flex flex-col justify-between group cursor-pointer hover:border-[#f5c842]/40 transition-all duration-300 relative h-96 rounded-2xl overflow-hidden shadow-sm animate-fade-in"
            >
              {/* Image box */}
              <div className="h-56 w-full overflow-hidden mb-4 relative bg-zinc-950 rounded-xl shadow-inner">
                <img
                  src={item.imageUrl}
                  alt={item.category}
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 contrast-125 transition-all duration-700"
                />
                <span className="absolute bottom-2 right-2 bg-[#0d0d0d] text-[#f5c842] border border-[#f5c842]/30 text-[9px] font-mono tracking-widest px-2 py-0.5 uppercase rounded-md font-bold">
                  {item.category}
                </span>
              </div>

              {/* Quote details */}
              <div className="space-y-2 flex-grow flex flex-col justify-end">
                <div className="flex items-center space-x-1 text-[#e84b1f]/60">
                  <Quote size={12} fill="#e84b1f" className="opacity-40" />
                  <span className="font-mono text-[8px] uppercase tracking-wider font-bold text-[#e84b1f]">
                    ATMOSPHERIC FRAGMENT
                  </span>
                </div>
                <p className="font-serif-display text-sm text-[#f5f0e8]/80 leading-relaxed italic line-clamp-3">
                  "{item.quote}"
                </p>
              </div>

              {/* Hover effect highlight */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-[#f5c842] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quote zoom modal overlay */}
      <AnimatePresence>
        {selectedQuote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedQuote(null)}
            className="fixed inset-0 z-50 bg-[#0d0d0d]/95 flex items-center justify-center p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-xl w-full text-center space-y-6 p-8 border border-[#e84b1f]/20 bg-[#000000] relative rounded-3xl shadow-2xl"
            >
              <div className="absolute top-4 right-4 text-[#f5f0e8]/40 hover:text-[#e84b1f] cursor-pointer" onClick={() => setSelectedQuote(null)}>
                ✕
              </div>
              <Quote size={40} className="mx-auto text-[#e84b1f] animate-pulse" />
              <p className="font-serif-display text-2xl sm:text-3xl text-[#f5f0e8] italic leading-normal px-4">
                "{selectedQuote}"
              </p>
              <div className="w-16 h-0.5 bg-[#f5c842] mx-auto" />
              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="font-bebas text-xs tracking-widest text-[#e84b1f] hover:text-[#f5c842] uppercase"
              >
                DISMISS VISUAL
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
