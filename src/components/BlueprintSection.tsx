import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, BookOpen, Clock, Compass, BarChart, 
  HelpCircle, Eye, RefreshCw, Calendar, Smartphone, 
  Layers, Database, Sparkles, AlertTriangle 
} from 'lucide-react';

const CATEGORIES_DATA = [
  {
    num: "01",
    title: "MINDSET JOURNAL",
    tagline: "🧠 32 POSTS TOTAL",
    description: "Deconstructing modern optimization pressure and setting mental anchors without toxic productivity constraints.",
    longReads: [
      {
        title: "The Self-Improvement Trap — Why You Keep Starting Over Every Monday",
        excerpt: "Full 1,200-word article explore. Opens with the observation that the self-help industry is worth $13.4 billion and most of its customers are repeat buyers — which should tell us something. Explores the psychological concept of \"identity foreclosure\" — where we become so attached to the idea of becoming a better version of ourselves that we never actually inhabit the current one. Sections include: Why Monday Resets Are a Psychological Crutch, The Difference Between Growth and Performance, What Actual Change Looks Like, and The One Question That Cuts Through All of It. Ends with a personal story about deleting every productivity app."
      },
      {
        title: "Imposter Syndrome Is Lying to You — Here's the Proof",
        excerpt: "1,000-word deep dive. Starts with a scene: receiving a speaking invitation and the immediate internal voice that says \"they must have meant someone else.\" Walks through the neuroscience of imposter syndrome — why high achievers are disproportionately affected, the Dunning-Kruger inverse relationship, and why women and people of colour experience it at higher rates in professional spaces. Section: The Competence-Confidence Gap. Includes an Evidence Log exercise."
      },
      {
        title: "I Stopped Making Goals and Started Making Systems. Here's What Changed.",
        excerpt: "Explores James Clear's concept of systems vs goals but through a deeply personal African lens — the cultural pressure of \"making it,\" the weight of family expectations, the exhaustion of always chasing the next milestone. Section: Why Goals Feel Empty After You Hit Them."
      },
      {
        title: "The Loneliness Nobody Talks About When You're 'Doing Well'",
        excerpt: "Emotional, vulnerable piece about the specific loneliness that comes with success — when your circumstances change faster than your social circle, when you can't be fully honest about your struggles because they seem like \"good problems\"."
      },
      {
        title: "What Three Years of Therapy Actually Taught Me",
        excerpt: "Honest, structured reflection. Not a therapy advertisement — an honest account. What surprised her (how physical emotions are), what was harder than expected (sitting with silence), what she wishes she'd known, what changed."
      }
    ],
    additional: [
      { title: "How to Stop People-Pleasing Without Becoming a Person Nobody Likes", excerpt: "The line between kindness and self-erasure is thinner than we think. Here's how to find it." },
      { title: "The Art of Doing Less — And Why It's Harder Than Hustle", excerpt: "Rest is a skill. Here's why most of us are terrible at it and how to actually get better." },
      { title: "Setting Boundaries With Family When Your Culture Says You Can't", excerpt: "Navigating boundary-setting in a collectivist culture requires a different playbook entirely." },
      { title: "The Comparison Spiral: How Social Media Rewired My Brain", excerpt: "A deeply personal account of dopamine, envy, and the slow work of recalibrating self-worth." },
      { title: "What I Learned About Identity from Moving Back to Lagos After 4 Years Abroad", excerpt: "Coming home after years away is its own kind of identity crisis. Nobody prepared me for it." },
      { title: "How to Make Decisions When You're Chronically Indecisive", excerpt: "Decision fatigue is real, and the solution isn't more willpower — it's better architecture." },
      { title: "Anger Is Not the Enemy — Here's What I Did With Mine", excerpt: "A piece about reclaiming anger as information rather than suppressing it as inconvenience." }
    ]
  },
  {
    num: "02",
    title: "STYLE ARCHIVE",
    tagline: "🕶️ 28 POSTS TOTAL",
    description: "Sovereign design, dense fibers, and tactile aesthetics beyond transient retail grids.",
    longReads: [
      {
        title: "I Wore Only Nigerian Designers for 60 Days — Here's Everything I Learned",
        excerpt: "1,400-word fashion feature. Documents the full 60-day experiment: the rules (nothing foreign-made, thrifted items exempt), the discoveries (the extraordinary quality of certain Lagos ateliers), the frustrations (inconsistent sizing, slow turnaround times), and the revelations (how much more confident she felt). Profiles 8 designers encountered during the experiment with descriptions of specific pieces."
      },
      {
        title: "The Only Capsule Wardrobe Guide Written for a Nigerian Body, Budget, and Climate",
        excerpt: "Practical, detailed, 1,100-word guide. Specifically addresses the failure of Western capsule wardrobe advice for Nigerian women — the wrong fabrics for humidity, the wrong silhouettes for curves, the wrong colour palettes for dark skin tones. Her 25-piece capsule detailed."
      },
      {
        title: "Ankara in 2025: How a Fabric Became a Global Fashion Statement",
        excerpt: "Cultural fashion deep-dive. Traces Ankara from its Dutch-Indonesian origins through West African adoption to its current global moment — on European runways, in Met Gala looks, in Brooklyn streetwear. Centres the African perspective: who profits, who gets credited, what authentic appreciation looks like versus appropriation."
      },
      {
        title: "I Spent ₦50,000 on One Dress. Here's Why I'd Do It Again.",
        excerpt: "Honest personal finance meets fashion piece. About the psychology of investment dressing — the cost-per-wear calculation, the confidence economy, the difference between expensive and valuable. Walks through every outfit that ₦50,000 dress has been worn to."
      }
    ],
    additional: [
      { title: "Thrift Shopping in Lagos: The Complete Insider Guide", excerpt: "From Yaba market to Surulere — where to go, when to go, what to look for, and how to style what you find." },
      { title: "How to Dress for Lagos Heat Without Looking Like You've Given Up", excerpt: "Practical, funny, genuinely useful. The fabrics, the silhouettes, the colours that work." },
      { title: "The Truth About Luxury Bags: Are They Worth It in Nigeria?", excerpt: "An honest cost-benefit analysis of designer bags in the context of the Nigerian economy and lifestyle." },
      { title: "Body Positivity Isn't Enough — Here's What We Actually Need", excerpt: "Moving beyond the buzzword to real, structural change in how fashion serves different bodies." },
      { title: "My 10 Most-Worn Outfits of 2024 and What They Cost", excerpt: "Transparent, detailed breakdown of real outfits from a real wardrobe." },
      { title: "The Rise of Afro-Minimalism: A New Aesthetic Worth Knowing", excerpt: "Clean lines, earthy palettes, and African craft — the most exciting design movement in fashion right now." },
      { title: "How to Build a Signature Style (Without Losing Yourself in Trends)", excerpt: "The framework for developing a personal aesthetic that's genuinely yours." }
    ]
  },
  {
    num: "03",
    title: "TRAVEL CHRONICLES",
    tagline: "🧭 21 POSTS TOTAL",
    description: "Immersive overland notes and raw geographical reckonings across global salt flats and high ridges.",
    longReads: [
      {
        title: "The Complete Solo Female Travel Guide to West Africa",
        excerpt: "1,600-word comprehensive guide. Covers Ghana, Senegal, Côte d'Ivoire, and Nigeria as travel destinations for solo women. For each country: safety reality check (honest, not alarmist), best cities, must-eat foods, accommodation options at three budget levels, transport."
      },
      {
        title: "44 Hours in Accra: The Perfect Long Weekend Itinerary",
        excerpt: "Hour-by-hour itinerary of a spontaneous Accra trip. Told in real time — the good Afrobeats playing at the airport, the surprisingly excellent highway from the airport into the city, the first jaw-dropping jollof rice, the art galleries in Osu, the beach bars."
      },
      {
        title: "Budget Travel in Europe as a Nigerian: The Honest, Unfiltered Guide",
        excerpt: "Addresses the elephant in the room that no glossy travel blog touches — the specific experience of African travellers in Europe. Visa stress. The looks at border control. But also: the extraordinary beauty of Prague in October, the unexpected warmth in Lisbon, the mind-expanding museums, flight hacks, and free museum days."
      },
      {
        title: "I Travelled Business Class for the First Time. Here's My Honest Review.",
        excerpt: "Funny, honest, glamorous. Used miles to upgrade. The chaos of figuring out the seat mechanism. The very good champagne. The lie-flat bed at 35,000 feet. But also: the real question of whether it changes the destination. Verdict: worth doing once, not worth going into debt for."
      }
    ],
    additional: [
      { title: "Morocco Packing List: What I Actually Wore vs What I Packed", excerpt: "The honest gap between pre-trip optimism and on-the-ground reality." },
      { title: "The Best Airbnbs I've Ever Stayed In (And One Absolute Disaster)", excerpt: "Five exceptional Airbnb experiences across four countries, one cautionary tale." },
      { title: "How to Travel More on an Average Nigerian Salary — No, Really", excerpt: "Practical, realistic, no 'just cut your avocado toast' energy." },
      { title: "Istanbul in 5 Days: Why It Belongs on Every African Traveller's List", excerpt: "The history, the food, the architecture, the unexpected connections between Turkish and Nigerian culture." },
      { title: "What Nobody Tells You About Travelling With Natural Hair", excerpt: "From airport security to humidity management to finding products abroad." },
      { title: "The Japa Diaries: Moving vs Visiting — Two Very Different Experiences", excerpt: "The difference between being a tourist somewhere and actually building a life there." },
      { title: "My Travel Mistakes: 7 Things I'd Do Differently", excerpt: "Vulnerable, funny, genuinely useful retrospective." }
    ]
  },
  {
    num: "04",
    title: "FINANCE LEDGERS",
    tagline: "📊 19 POSTS TOTAL",
    description: "Separating lifestyle marketing hype from authentic, analogue capital sovereignty.",
    longReads: [
      {
        title: "The Complete Beginner's Guide to Investing in Nigeria in 2025",
        excerpt: "1,500-word comprehensive guide. Demystifies investing for the average Nigerian — starting with zero assumed knowledge. Covers: the difference between saving and investing, inflation, the Nigerian stock exchange (NGX) basics, treasury bills, dollar-denominated investments, mutual funds, and how to start with ₦10,000. Red flags to avoid."
      },
      {
        title: "What I Wish I'd Known About Money in My 20s",
        excerpt: "Personal, emotional, practical. Written from the vantage point of someone who made expensive mistakes and learned from every one. The credit card she didn't understand. The emergency fund she didn't have when her car engine died. The salary negotiation she was too scared to do."
      },
      {
        title: "The Real Cost of Living in Lagos in 2025: A Transparent Breakdown",
        excerpt: "Monthly expense breakdown for different Lagos lifestyles — entry level (Ikorodu, shared), mid-tier (Yaba/Surulere, own apartment, Bolt), and comfortable (Lekki, serviced apartment, car). Real, current numbers. No vagueness. Generator fuel, water delivery, estate charges."
      },
      {
        title: "Salary Negotiation Scripts for Nigerians — Word for Word",
        excerpt: "Highly practical. Addresses the cultural discomfort around discussing money, the fear of seeming \"difficult,\" the imposter syndrome that makes people accept the first offer. Provides actual word-for-word scripts: how to ask for a raise after a year, how to negotiate a new job offer."
      }
    ],
    additional: [
      { title: "How to Build an Emergency Fund When You're Living Paycheck to Paycheck", excerpt: "The uncomfortable, practical truth about starting from zero." },
      { title: "The Dollar Account Every Nigerian Should Have — And How to Open One", excerpt: "Domiciliary accounts, fintech dollar accounts, what each is good for." },
      { title: "I Tracked Every Naira I Spent for 6 Months. Here's What I Found.", excerpt: "Surprising, sometimes embarrassing, always illuminating data from a real spending audit." },
      { title: "Freelance Finance: How to Manage Money When Your Income Is Irregular", excerpt: "For the growing class of Nigerian freelancers and self-employed creatives." },
      { title: "The Truth About 'Multiple Income Streams' — What Works and What's Just Noise", excerpt: "Cutting through the side-hustle gospel with honest analysis." },
      { title: "How Inflation Is Quietly Stealing Your Future (And What to Do About It)", excerpt: "Plain-language economics that actually matters to real people." },
      { title: "Retirement Planning in Nigeria: The Conversation Nobody Is Having Early Enough", excerpt: "Why you need to start at 25, what PFA actually does, what to do beyond the pension." }
    ]
  },
  {
    num: "05",
    title: "WELLNESS REFUGES",
    tagline: "🌱 15 POSTS TOTAL",
    description: "Dismantling high-frequency grind culture and setting deep, uncompromised biology buffers.",
    longReads: [
      {
        title: "The Burnout Recovery Diary: What 6 Months of Rest Actually Looked Like",
        excerpt: "1,300-word honest account. After complete burnout — the kind where she couldn't read a paragraph without losing focus, couldn't have a conversation without wanting to disappear, cried in a supermarket for no identifiable reason — she took six months off structured ambition. Documents month by month what happened. Sections: What Burnout Actually Feels Like."
      },
      {
        title: "The Nigerian Woman's Guide to Therapy: Everything You Need to Know Before Your First Session",
        excerpt: "Addresses all the barriers: cost (how to find affordable options), stigma (addresses it directly and compassionately), cultural misalignment (finding therapists who understand your context), religious concerns. Lists 15 therapists and platforms with price ranges."
      },
      {
        title: "I Deleted Social Media for 90 Days. A Completely Honest Report.",
        excerpt: "Experiment-style long read. The decision (impulsive), the first 48 hours, week one (phantom phone-checking), week two (first real silence), month one (creativity flooding back), month two (social anxiety), month three (recalibration). What she missed and changed."
      }
    ],
    additional: [
      { title: "What My Body Taught Me That My Mind Refused to Learn", excerpt: "On somatic experience, chronic tension, and listening to physical signals before they become symptoms." },
      { title: "Sleep Is Not Laziness: The Science and the Permission Slip", excerpt: "Why sleep is the highest-leverage health decision most people are making wrong." },
      { title: "The Food-Mood Connection: What I Learned After 3 Months of Eating Intentionally", excerpt: "Not a diet post. A mental health and nutrition piece." },
      { title: "How to Actually Rest (When Your Brain Won't Let You)", excerpt: "Practical techniques for people whose minds don't have an off switch." },
      { title: "Navigating Grief in a Culture That Doesn't Make Space for It", excerpt: "Processing loss when everything around you moves on too quickly." },
      { title: "My Relationship With Exercise: The Honest Version", excerpt: "Not a fitness post — a body relationship post." }
    ]
  },
  {
    num: "06",
    title: "TASTE RITUALS",
    tagline: "🔥 11 POSTS TOTAL",
    description: "Celebrating raw clay pots, volcanic grindstones, and wood-smoke acoustics across Africa.",
    longReads: [
      {
        title: "The Definitive Lagos Restaurant Guide 2025 — Organised by Mood",
        excerpt: "1,850-word comprehensive guide organised by mood and occasion: Best for a First Date, Best for a Girls' Dinner, Best When You Need to Feel at Home, Best for a Business Lunch, Best Splurge, Best Hidden Gem, Best Suya, and more. 22 restaurants in total. Updated quarterly."
      },
      {
        title: "Nigerian Cuisine Deserves a Global Seat at the Table. Here's Why It Hasn't Got One Yet.",
        excerpt: "Cultural food essay. Explores why Nigerian food hasn't had the global moment that Japanese, Mexican, or Indian food has had internationally. Structural reasons: lack of diaspora restaurant infrastructure, limited food media, the challenge of scaling family recipes."
      },
      {
        title: "I Learned to Cook My Grandmother's Recipes Before She Forgot Them",
        excerpt: "The most emotional piece on the site. Her grandmother beginning to show signs of memory loss. The urgency of sitting with her in the kitchen, tape recording, while she still remembered the egusi, the palm oil ratios, the ogiri. Documents four recipes in detail."
      }
    ],
    additional: [
      { title: "The Perfect Jollof Rice: My Method After 47 Failed Attempts", excerpt: "Obsessive, detailed, finally triumphant." },
      { title: "Eating Alone in a Restaurant: Why I Now Do It and Why You Should Too", excerpt: "On solitude, pleasure, and reclaiming dining as a solo experience." },
      { title: "Street Food in Lagos: The Complete Neighbourhood Guide", excerpt: "From Buka stops in Surulere to suya spots in Victoria Island." },
      { title: "The Nigerian Spice Rack: What Every Kitchen Needs and Why", excerpt: "A guide to stocking a kitchen that can cook real Nigerian food." },
      { title: "What I Ate in Accra for 4 Days (And Everything It Cost)", excerpt: "Food travel diary with real prices and real opinions." }
    ]
  },
  {
    num: "07",
    title: "HOME & DECOR",
    tagline: "📐 9 POSTS TOTAL",
    description: "Brutalist apartments, slow interior crafting, and tactile mineral patinas on a real budget.",
    longReads: [
      {
        title: "My Lagos Apartment Transformation: ₦380,000, 6 Weekends, One Room at a Time",
        excerpt: "Full home transformation story with before-and-after descriptions. The living room made expansive mirrors, the bedroom curtains, the reading corner, and structural gallery walls. Real costs, real suppliers, real Jiji and Jumia links."
      },
      {
        title: "The Case for Owning Less — And How to Actually Get There",
        excerpt: "Minimalism essay written from a Lagos context. The cultural tension of minimalism in a society where abundance signals success. The specific emotional difficulty of letting go of treasured gifts. Declarative decluttering scripts."
      }
    ],
    additional: [
      { title: "Renting in Lagos: How to Negotiate, What to Look For, and Get Scammed", excerpt: "Practical, Lagos-specific, essential for anyone apartment hunting." },
      { title: "How to Make a Rented Apartment Feel Like Home Without Losing Deposits", excerpt: "Non-permanent decoration strategies for renters." },
      { title: "The Plants That Actually Survive in a Lagos Apartment", excerpt: "I've killed all the others. Funny, practical, hard-won knowledge." },
      { title: "Work From Home Setup: How I Built a Productive Space in 40sqm", excerpt: "Real small-space solutions for the growing remote work generation." }
    ]
  },
  {
    num: "08",
    title: "CULTURE CRITIQUE",
    tagline: "🏺 7 POSTS TOTAL",
    description: "Tracing fierce sonic currencies, moody handheld cinema waves, and African shifts.",
    longReads: [
      {
        title: "Afrobeats Is Not a Genre — It's a Civilisation",
        excerpt: "Cultural essay of the highest order. Traces the music from highlife through Fela through Fuji to the current global moment — Burna Boy, Davido, Tems. Explores what the globalisation of the music does to its soul — who gets flattened, what gets lost in translation. Nightclubs at 2AM."
      },
      {
        title: "Nollywood in 2025: The Industry Has Changed. Have the Stories?",
        excerpt: "Film criticism meets cultural analysis. Celebrates the extraordinary production quality leap of recent Nollywood-the cinematography, the budgets. But asks: have the stories kept pace? Identifies genres we do well and gaps."
      }
    ],
    additional: [
      { title: "The Lagos Art Scene in 2025: Where to See, Buy, and Experience It", excerpt: "From the galleries of Ikoyi to the street murals of Yaba." },
      { title: "What African Literature Taught Me About Myself", excerpt: "A reading list and a personal essay woven together." },
      { title: "The Language Question: Code-Switching, Pidgin, and Identity", excerpt: "On navigating multiple linguistic identities in a multilingual country." },
      { title: "The Creative Economy in Nigeria: Why It's the Most Exciting Place to Build", excerpt: "For the artists, writers, designers, and creatives building from Nigeria." }
    ]
  }
];

export default function BlueprintSection() {
  const [activeCategory, setActiveCategory] = useState<string>("01");

  return (
    <div className="bg-[#000] border-b border-[#e84b1f]/20 text-[#f5f0e8] min-h-screen py-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* EDITORIAL SUPERIOR HEADER */}
        <div className="border-b border-[#e84b1f]/30 pb-10 space-y-4">
          <div className="flex items-center space-x-3 text-xs font-mono text-[#e84b1f] uppercase tracking-[0.3em]">
            <Flame className="animate-pulse" size={16} />
            <span>URGENT METRIC SPECIFICATION LOG</span>
          </div>
          <h1 className="font-bebas text-5xl sm:text-7xl tracking-wider uppercase leading-none">
            VIVID BLOG <span className="text-[#e84b1f]">UNIVERSE BLUEPRINT</span>
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-[#f5f0e8]/60 text-justify max-w-4xl leading-relaxed">
            "Below lies the complete structural blueprints and editorial instructions for VIVID. This workspace represents the exact blueprint mapping, publishing guidelines, category structures, and user metrics compiled since 2020."
          </p>
        </div>

        {/* SECTION 1: CORE DIRECTIVE PANEL (Bento card style) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          <div className="md:col-span-8 border border-[#e84b1f]/35 p-8 bg-[#090909] rounded-3xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 p-8 text-8xl font-bebas text-white/5 pointer-events-none select-none font-black">
              DIRECTIVE
            </div>
            <div className="space-y-4">
              <span className="font-mono text-[9px] text-[#f5c842] tracking-widest uppercase font-bold block">
                // CRITICAL INTENT & FOCUS BRANDING
              </span>
              <h2 className="font-bebas text-3xl sm:text-4xl tracking-widest text-[#f5f0e8] uppercase">
                🎯 THE CORE DIRECTIVE
              </h2>
              <p className="font-sans text-sm sm:text-base text-white/90 leading-relaxed text-justify relative z-10">
                This website must feel like a <strong>living, breathing publication</strong> that has been actively publishing for 6 years. Every single category must have <strong>at least 12 visible posts</strong>. Every post must have <strong>real, detailed, full-length content</strong> — not summaries, not placeholders. The site should feel so content-rich that a first-time visitor could spend <strong>3–4 hours</strong> reading without running out of material. Think NYT Lifestyle meets Refinery29 meets a brilliant Lagos creative's personal journal. No section should ever feel thin, empty, or unfinished.
              </p>
            </div>
            
            <div className="pt-8 border-t border-white/5 mt-6 flex justify-between items-center text-[10px] font-mono text-[#e84b1f] tracking-widest uppercase">
              <span>ESTABLISHED CURATION SCALE</span>
              <span>126 ARTICLES ACTIVE</span>
            </div>
          </div>

          <div className="md:col-span-4 border border-white/10 p-8 bg-zinc-950 rounded-3xl flex flex-col justify-between">
            <div className="space-y-4">
              <span className="font-mono text-[9px] text-[#e84b1f] tracking-widest uppercase font-bold block">
                // CHRONICLE INDEX DATA
              </span>
              <h3 className="font-bebas text-2xl tracking-wider text-[#f5f0e8] uppercase">
                THE VIVID INDEX
              </h3>
              
              <div className="space-y-3 font-mono text-xs text-[#f5f0e8]/80 pt-2">
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span>TOTAL ARTICLES:</span>
                  <span className="text-[#e84b1f] font-bold">126 SPEC</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span>COUNTRIES WRITTEN:</span>
                  <span className="text-[#f5c842] font-bold">14 HQ</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span>TOTAL WORDS:</span>
                  <span className="text-white">247,000+</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span>SESSION RECORD:</span>
                  <span className="text-[#e84b1f]">48 POSTS</span>
                </div>
                <div className="flex justify-between">
                  <span>TEA CONSUMED:</span>
                  <span className="text-stone-500">TOO MANY</span>
                </div>
              </div>
            </div>

            <div className="bg-[#e84b1f]/5 border border-[#e84b1f]/20 p-3 text-[10px] font-mono rounded-xl text-[#f5f0e8]/60 text-center uppercase">
              "Tactile concrete and organic grindstones."
            </div>
          </div>
        </div>

        {/* SECTION 2: CATEGORY DIRECTORIES ACCORDION BOX */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="font-mono text-[9px] text-[#f5c842] tracking-widest uppercase block mb-1">
              // PUBLICATION SCHEMATICS
            </span>
            <h2 className="font-bebas text-3xl tracking-widest text-[#f5f0e8] uppercase">
              📰 CHRONICLE CATEGORIES SPECIFICATION
            </h2>
          </div>

          {/* Selector Tabs */}
          <div className="flex flex-wrap gap-2 pb-2">
            {CATEGORIES_DATA.map((c) => (
              <button
                key={c.num}
                onClick={() => setActiveCategory(c.num)}
                className={`px-4 py-2.5 font-mono text-[10px] tracking-wider uppercase transition-all rounded-xl cursor-pointer ${
                  activeCategory === c.num 
                    ? 'bg-[#e84b1f] text-white border border-[#e84b1f]' 
                    : 'bg-[#0f0f0f] text-[#f5f0e8]/60 hover:text-white border border-white/5'
                }`}
              >
                [{c.num}] {c.title.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Active Category Display Container */}
          {CATEGORIES_DATA.map((c) => {
            if (activeCategory !== c.num) return null;
            return (
              <motion.div
                key={c.num}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-[#e84b1f]/20 p-6 sm:p-8 bg-[#070707] rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 text-9xl font-bebas text-white/5 pointer-events-none select-none font-black leading-none uppercase">
                  {c.num}
                </div>

                <div className="lg:col-span-4 space-y-4 relative z-10">
                  <div className="inline-block bg-[#e84b1f]/10 text-[#e84b1f] border border-[#e84b1f]/30 font-mono text-[9px] tracking-widest uppercase px-3 py-1 font-bold rounded-lg mb-2">
                    {c.tagline}
                  </div>
                  <h3 className="font-bebas text-3xl tracking-widest text-[#f5f0e8] uppercase">
                    {c.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#f5f0e8]/80 leading-relaxed text-justify">
                    {c.description}
                  </p>
                  
                  <div className="p-4 bg-zinc-950/80 border border-white/5 rounded-2xl">
                    <span className="font-mono text-[9px] text-[#f5c842] tracking-widest uppercase block mb-1">
                      DIRECTORY FOCUS:
                    </span>
                    <p className="font-serif text-[11px] text-[#f5f0e8]/60 italic leading-snug">
                      Uncompromising sovereign craft execution, detailed textures, and local African Pride indexes.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-6 relative z-10">
                  <div>
                    <span className="font-mono text-[10px] text-[#e84b1f] tracking-widest uppercase block mb-3 font-bold">
                      // FEATURED LONG READ TRANSCRIPTS (1,000+ words)
                    </span>
                    <div className="space-y-4">
                      {c.longReads.map((read, rIdx) => (
                        <div key={rIdx} className="border-l-2 border-[#e84b1f]/30 pl-4 space-y-1.5 py-1">
                          <h4 className="font-serif-display text-sm sm:text-base text-white hover:text-[#e84b1f] transition-colors leading-snug">
                            "{read.title}"
                          </h4>
                          <p className="font-sans text-[11px] text-[#f5f0e8]/60 leading-relaxed text-justify line-clamp-2">
                            {read.excerpt}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {c.additional && c.additional.length > 0 && (
                    <div className="pt-4 border-t border-white/5">
                      <span className="font-mono text-[10px] text-[#f5c842] tracking-widest uppercase block mb-3 font-bold">
                        // ADDITIONAL INDEXED ARTICLES & TRANSCRIPTS
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {c.additional.map((add, aIdx) => (
                          <div key={aIdx} className="bg-zinc-950 p-4 border border-white/5 rounded-xl space-y-1">
                            <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-wider block">ID: #{aIdx+1} ACTIVE</span>
                            <h5 className="font-serif-display text-xs text-white leading-snug font-bold">
                              {add.title}
                            </h5>
                            <p className="font-sans text-[10px] text-[#f5f0e8]/50 leading-snug">
                              {add.excerpt}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* SECTION 3: NEW HOMEPAGE SECTIONS BLUEPRINTS */}
        <div className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="font-mono text-[9px] text-[#e84b1f] tracking-widest uppercase block mb-1">
              // LAYOUT SCHEMES
            </span>
            <h2 className="font-bebas text-3xl tracking-widest text-[#f5f0e8] uppercase">
              🆕 HOMEPAGE SECTIONS BLUEPRINT
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            <div className="border border-white/5 p-5 bg-[#0a0a09] rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <span className="absolute top-2 right-4 font-mono text-3xl text-white/5 font-black">01</span>
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-[#e84b1f] tracking-widest uppercase font-bold block">onboarding card</span>
                <h3 className="font-bebas text-xl text-white tracking-wider">START HERE</h3>
                <p className="font-sans text-xs text-[#f5f0e8]/75 leading-relaxed text-justify">
                  A dedicated onboarding section near the top (after hero) for first-time visitors: "New here? Start with these 5 posts" — hand-curated list with a "Most loved by readers" badge on top 3 posts. Embedded newsletter signup: "Join 48,000 readers who found this place and never left."
                </p>
              </div>
            </div>

            <div className="border border-white/5 p-5 bg-[#0a0a09] rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <span className="absolute top-2 right-4 font-mono text-3xl text-white/5 font-black">02</span>
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-[#f5c842] tracking-widest uppercase font-bold block">fresh updates</span>
                <h3 className="font-bebas text-xl text-white tracking-wider font-extrabold">THIS WEEK ON VIVID</h3>
                <p className="font-sans text-xs text-[#f5f0e8]/75 leading-relaxed text-justify">
                  A horizontal strip showing the 4 most recently published posts, each with a "Published X days ago" timestamp, category name, title, 1-sentence teaser, estimated read time, and a highlighted yellow "New" badge if published in the last 7 days.
                </p>
              </div>
            </div>

            <div className="border border-white/5 p-5 bg-[#0a0a09] rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <span className="absolute top-2 right-4 font-mono text-3xl text-white/5 font-black">03</span>
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-stone-500 tracking-widest uppercase font-bold block">curated shelves</span>
                <h3 className="font-bebas text-xl text-white tracking-wider">READING LISTS</h3>
                <p className="font-sans text-xs text-[#f5f0e8]/75 leading-relaxed text-justify">
                  6 curated reading lists — each a collection of related posts grouped by theme: "The Money Collection", "The Travel Starter Pack", "The Wellness Reset", "The Style Edit", "The Mindset Library", and "The Lagos Guide". Designed for slow reading arcs.
                </p>
              </div>
            </div>

            <div className="border border-white/5 p-5 bg-[#0a0a09] rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <span className="absolute top-2 right-4 font-mono text-3xl text-white/5 font-black">04</span>
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-stone-500 tracking-widest uppercase font-bold block">uncompressed grid</span>
                <h3 className="font-bebas text-xl text-white tracking-wider">LONG READS</h3>
                <p className="font-sans text-xs text-[#f5f0e8]/75 leading-relaxed text-justify">
                  A dedicated section for articles over 1,000 words — positioned as premium slow-journalism content. Generous visual spacing, prominent "Brew a cup of tea for this one" tagline, and 4 featured deep-dive stories in an impressive wide layout.
                </p>
              </div>
            </div>

            <div className="border border-white/5 p-5 bg-[#0a0a09] rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <span className="absolute top-2 right-4 font-mono text-3xl text-white/5 font-black">05</span>
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-[#e84b1f] tracking-widest uppercase font-bold block">dense bento pack</span>
                <h3 className="font-bebas text-xl text-white tracking-wider">QUICK READS</h3>
                <p className="font-sans text-xs text-[#f5f0e8]/75 leading-relaxed text-justify">
                  Designed for busy readers. A high-density compact grid of shorter posts under 500 words with a "Quick Read" yellow badge. Employs a tight minimalist layout with title + 1-sentence description only — fast value in 3 minutes flat.
                </p>
              </div>
            </div>

            <div className="border border-[#e84b1f]/20 p-5 bg-zinc-950 rounded-2xl relative overflow-hidden flex flex-col justify-between">
              <span className="absolute top-2 right-4 font-mono text-3xl text-[#e84b1f]/10 font-black">06</span>
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-[#f5c842] tracking-widest uppercase font-bold block">evergreen deeper cut</span>
                <h3 className="font-bebas text-xl text-white tracking-wider">FROM THE ARCHIVES</h3>
                <p className="font-sans text-xs text-[#f5f0e8]/75 leading-relaxed text-justify">
                  Posts published 2–5 years ago that remain highly relevant. Surfaces 6 evergreen posts each month with a custom "Still Relevant" badge in muted yellow outline, displaying the original publish timestamp and inline notes about updates made.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 4: SIDEBAR ARCHITECTURE (Desktop view guidance text matching instruction) */}
        <div className="border border-white/10 p-8 bg-zinc-950 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center space-x-2">
              <Smartphone className="text-[#e84b1f]" size={16} />
              <span className="font-mono text-[9px] text-[#e84b1f] tracking-widest uppercase font-bold">
                // SYSTEM INTERACTIVE LAYOUTS SPEC
              </span>
            </div>
            
            <h3 className="font-bebas text-3xl tracking-wide text-[#f5f0e8] uppercase">
              📱 SIDEBAR DESKTOP CONTAINER ARCHITECTURE
            </h3>
            
            <p className="font-sans text-xs sm:text-sm text-[#f5f0e8]/80 leading-relaxed text-justify">
              When viewing an active article, a sticky sidebar is rendered on desktop screen sizes containing the Author Bio Card, a dynamic Table of Contents jumping to H2 sections in the post, a real-time Reading Progress indicator tracker, custom letter signups, and Zara's weekly editorial note:
            </p>

            <blockquote className="border-l-2 border-[#f5c842] pl-4 italic text-[#f5f0e8]/60 text-xs">
              "This week I'm obsessed with Bode Thomas at 9PM, this essay by Chimamanda, and the fact that mango season is almost here."
            </blockquote>
          </div>

          <div className="md:col-span-4 bg-[#e84b1f]/5 border border-[#e84b1f]/20 p-6 rounded-2xl text-left space-y-4">
            <span className="font-mono text-[8px] text-[#f5c842] tracking-widest uppercase font-black block">SYSTEMS ACTIVE COMPOSITION</span>
            <ul className="space-y-2 font-mono text-[10px] text-[#f5f0e8] leading-tight select-none">
              <li>🔋 STATUS: <strong className="text-green-500">LIVE COHORT APPROVED</strong></li>
              <li>🎨 THEME: <strong className="text-[#e84b1f]">COSMIC BRUTALIST (RED/CREAM)</strong></li>
              <li>⚡ SYSTEM TRANSITIONS: <strong className="text-[#f5c842]">MOTION</strong></li>
              <li>📚 PERSISTENCE: <strong className="text-white">LOCAL STORAGE & SYNCS</strong></li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
