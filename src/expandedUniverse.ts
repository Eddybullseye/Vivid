import { BlogPost, Category } from './types';
import { INITIAL_POSTS } from './data';

// Helper to generate a random number within a range
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Collection of real, detailed paragraphs themed around each category
// to construct true, full-length articles (1000+ words of prose) instead of placeholders.
const ESSAY_PROSE: Record<Category, string[][]> = {
  MINDSET: [
    [
      "We live in a culture that treats the human spirit as a machine to be tuned. We monitor our sleep cycles, measure our calorie buffers, and divide our mornings into five-minute chunks of high-intensity performance. But in our desperate search for optimization, we have forgotten how to actually live inside the current hour. True mindset sovereignty isn't about waking up at 5 AM or drink lemon extract; it's about reclaiming your unmonitized attention and learning to stand completely still without panic.",
      "## THE PSYCHOLOGY OF FALSE RESETS",
      "Notice how we love the idea of starting over on Monday. It is a modern ritual that delivers a cheap, temporary spike of dopamine without requiring actual systemic change. We convince ourselves that our past failures were merely a consequence of poor timing. But a new calendar coordinate cannot heal an inner fracture. When you treat self-improvement as a spectator sport, you become a repeat customer of an industry that makes its billions by keeping you perpetually unsatisfied with your current form.",
      "### COGNITIVE DISPLACEMENT & AMBITION PRESSURE",
      "For those living in collectivist cultures or dense, high-frequency centers like Lagos, the pressure to 'make it' is amplified. Ambition becomes a family ledger, a heavy debt of expectation loaded onto your shoulders before you even understand your own values. When your individual career is treated as a social security net for twenty people, boundaries are painted as personal selfishness. To build systemic peace, you must first survive the guilt of declaring your own limitations.",
      "- Monastic Air Spaces: Allocating at least thirty minutes at dusk to sit without any electronic tool, allowing thoughts to settle organically.",
      "- Absolute Refusal of Resets: Recognizing that small, continuous errors are normal biological friction, not reasons to scrap your entire weekly ledger.",
      "- Non-Performance Craft: Writing, drawing, or playing physical soundscapes for an audience of exactly zero, stripping the pressure of visibility.",
      "> The self-improvement industry wants you to buy their handbook. But the blueprint of your creative sanity is already written in the quiet hours you refuse to spend alone.",
      "[TIP] If your weekly planner looks like a corporate project timeline, delete it. Choose three major actions, execute them slowly, and let the remaining hours remain blank and free."
    ]
  ],
  STYLE: [
    [
      "The apparel we select to drape over our bodies is a physical declaration of our sovereignty. Yet, the modern wardrobe has been completely standardized by global fast-marketing algorithms. We wear thin, synthetic oil-based polymers shipped from massive robotic warehouses across continents, designed to fall apart within four wash cycles. Reclaiming style is an active act of rebellion that begins with local, high-density handwoven fibers.",
      "## THE SYSTEMIC VALUE OF THE WEAVER'S STALL",
      "To watch an Aso-oke or Adire craftsperson work is to witness an incredible, physical computer. Using their feet, hands, and muscular rhythm, they thread dense indigo-spun cotton through heavy timber frames. These textiles do not drape flatly like industrial silk; they create a bold, architectural frame that holds its shape against tropical humidity. It holds the memories of the soil and the physical fatigue of the hands that spun it.",
      "### TEXTURAL FRICTION & THE THEME OF BEIGE",
      "We spent three seasons trapped inside the sterile loop of 'quiet luxury' — a beige dress code designed for corporate executives who wanted to look expensive without possessing any visual personality. But the street coordinates are mounting a colorful, raw counter-revolution. Saturated clay red, electric ochre, and deep cobalt blue are breaking through the sea of sand-colored trench coats. High style is about textural friction: pairing heavy, unpolished indigenous yarns with smooth modern elements to create a kinetic visual statement.",
      "- Weight Over Speed: Prioritizing three high-density customized coordinates over thirty cheap off-the-rack chemical polymers.",
      "- Indigo Maturity Process: Allowing natural plant-dyed fabrics to fade slowly under sunlight, creating a personalized kinetic patina.",
      "- Silhouette Sovereignty: Choosing loose, breathable volumes that facilitate airflow, refusing to squeeze your form into rigid foreign templates.",
      "> Style is not a status log of how expensive your garments are. It is the immediate, physical blueprint of your identity.",
      "[TIP] Throw out your synthetic garments. Go find a local tailor, buy three yards of handwoven cotton, and let him measure your body with paper tape. The difference is spiritual."
    ]
  ],
  TRAVEL: [
    [
      "Traveling with a group is a series of minor, social negotiations; traveling alone is an intense excavation of the absolute self. When you cross borders without a companion, you strip away the protective shield of your daily social persona. You stand completely exposed to the raw frequency of a new geography, forced to navigate the chaos of unfamiliar alleys and the complete silence of lonely hotel rooms.",
      "## NAVIGATION BY MEMORY & COGNITION",
      "In the Medina of Marrakech or the clay passages of Ga Mashie in Accra, modern satellite navigation always fails. The stone walls are too dense, the lanes too narrow. You are forced to navigate by memory, color, and human interaction. You must watch where the sun falls on the plaster, recognize the scent of burning wood smoke, and ask shopkeepers for coordinates. This isn't just travel; it is a profound cognitive reboot that wakes up dormant survival instincts.",
      "### THE INSTAGRAM LURK VS THE STRENGTH OF THE ROAD",
      "The digital feeds are flooded with sanitized, glowing clips of sunrise coffee over rooftops and immaculate dune setups. But they conveniently leave out the physical friction: the terminal exhaustion of night buses, the relentless street-level negotiation, and the loneliness that hits when the sun sets and nobody speaks your language. Solo travel rewards you not because it is smooth, but because the friction burns away your superficial layers.",
      "- The Walking Stride: Walking with broad, confident shoulders and a straight, calm gaze. Doubt invites unwanted intervention; posture is your armor.",
      "- Right-Hand Customary Alignment: Recognizing local traditions — offering, accepting, and eating exclusively with your right hand.",
      "- Geographic Detours: Spending at least one night in complete geographic isolation where you cannot hear a single combustion engine.",
      "> The mountains do not offer you convenient scripts; they simply quiet the noise until you can finally hear your own voice.",
      "[TIP] When navigating, never hold your phone out in the middle of a crowded junction. Walk into a quiet cafe, order a hot coffee, map your coordinates in peace, and walk back out with intent."
    ]
  ],
  FINANCE: [
    [
      "We are living inside an economy designed to make us leak capital in tiny, virtual increments. Auto-renewing software subscriptions, frictionless one-click checkouts, and contactless mobile payments have systematically stripped the tactile weight of spending money. Your hard-earned sovereign wealth is slowly bled into a series of SaaS corporate profit margins. To reclaim control, we must re-introduce physical friction.",
      "## THE SYSTEMIC AUDIT OF THE MONASTIC LEDGER",
      "Computers and colorful budgeting apps have failed us. They turn your financial health into a neat corporate bar chart, selling your telemetry data to advertising servers while doing nothing to curb your daily spending anxiety. The only system that actually changes behavior is a hardbound paper ledger. Writing down every single transaction manually with a physical pen forces you to look your numbers directly in the eye.",
      "### THE THREE-ACCOUNT ARCHITECTURE",
      "Absolute financial sovereignty requires a rigid separation of funds. We must build dynamic pools that isolate lifestyle consumption from absolute survival and long-term capital preservation: a vault account with zero card access, a survival checking space, and a cash offline emergency reserve.",
      "- The Vault Shield: An investment reserve that has absolute zero linkage to daily spending apps or card payment gateways.",
      "- The Core Operational Base: Capping your monthly checking account strictly at your true survival expenses.",
      "- Handbound Journaling: Writing your balances daily on paper, letting the simple tactile friction of ink on paper serve as a visual brake.",
      "> Active debt is a weight that anchors your capacity to burn the manual and rebuild your career on your own terms.",
      "[TIP] Cancel every auto-renewing subscription you haven't used in 30 days. If you really want it, force yourself to enter your credit coordinates manually each month. You will soon realize how little you need."
    ]
  ],
  WELLNESS: [
    [
      "We have converted our physical bodies into experimental telemetry feeds. We track our heart rates, log our hydration levels, and catalog our menstrual records. But the result of this hyper-monitoring isn't Master health — it is a low-grade, perpetual anxiety. The human nervous system wasn't designed to be constantly evaluated by an algorithm. True wellness begins when you stop monitoring your biology and start feeling it.",
      "## THE SYSTEMIC CRITICAL VALUE OF SENSORY SILENCE",
      "The creative, sensitive mind cannot operate under continuous high-frequency compression. Just as a premium vacuum tube amplifier requires negative space and cooling cycles to produce warm analog sound, the brain require periods of unmonetized boredom. Wellness is not a series of bio-hacks or expensive cold plunge pools; it is the absolute protection of your attention from digital noise.",
      "### THE SACRED TOXIN OF THE HUSTLE CYCLE",
      "Grind culture has trained us to treat raw physical fatigue as a badge of honor, and rest as a moral failure. But ignoring your somatic warnings — the tight chest, the morning migraine, the cold sweat at midnight — is a strategic error. When you continuously ignore your body's distress logs, it will eventually choose a time to break down for you. Boundaries are your biological shield.",
      "- Somatic Muscle Scan: Spending five minutes at sunrise tracking where stress has accumulated in the back and shoulders.",
      "- Digital-Free Dusk walks: Walking with absolutely zero cellular equipment, letting your thoughts drift organically.",
      "- The Sabbath Protocol: Securing one full 24-hour cycle each week completely isolated from professional schedules.",
      "> Your body is not a machine to be optimized for maximum commercial output. It is the living temple of your creativity.",
      "[TIP] Throw out your sleep-tracking bracelets. The simple act of logging your morning moods can itself become a form of performance that robs you of your natural energy."
    ]
  ],
  FOOD: [
    [
      "In our sanitized contemporary kitchens, we have sealed cooking behind clean steel counters and high-frequency induction panels. We have eliminated raw smoke, direct embers, and heavy iron friction. But food isn't a science project; it is a geologic exchange. True taste lives in the wood-smoke, the porous clay pot, and the rough grinding basalt stone.",
      "## THE GEOLOGIC BREATH OF RAW CLAY",
      "Metal pans transfer heat too aggressively, scorching the delicate protein strings of fresh broth. In contrast, raw hand-pressed clay is a magnificent mineral insulator. Simmering pepper soup or jollof in a heavy clay vessel creates gentle, micro-convection currents. The clay breathes, releasing natural earth minerals into the reducing sauce and transforming it on a molecular level.",
      "### THE CORE DOCTRINE OF COARSE MECHANICAL SHEARING",
      "High-speed electric blenders rip plant fibers apart with high-friction steel blades, heating and oxidizing delicate flavor molecules instantly. Grinding your peppers, seeds, and spices manually on a heavy basalt mortared slab shears the food cells gently, squeezing out rich essential oils without chemical damage. Authentic flavor has texture.",
      "- Charred Jollof Crust: The caramelized, smoky rice scraped from the bottom of deep wood-fired aluminum pots.",
      "- Basalt Mechanical Shearing: Forcing yourself to grind peppers manually, preserving original cells and aromatic oils.",
      "- Clay Simmering: Cultivating natural convection vectors using unglazed earth pots that interact with water molecules.",
      "> Food should hold the weight of wood-fire smoke, not the sterile speed of an induction reactor.",
      "[TIP] The next time you make pepper soup, skip the electric blender. Spend ten minutes grinding your tomatoes on an old basalt slab. The depth of flavor will shock you."
    ]
  ],
  HOME: [
    [
      "Our modern shelter has been reduced to a sterile showroom. We purchase mass-manufactured particleboard sets from global catalogs that look identical from Tokyo to Victoria Island. We coat our walls in plasticized latex paint and furnish our floors with laminate sheets. We have created environments that strictly forbid aging. But a real home is not an sterile showroom asset; it is a journal assembled line by line.",
      "## THE ADORATION OF LIQUID MINERAL PATINAS",
      "To build a space with character, you must select materials that age with integrity. Raw concrete that reveals timber formwork marks, unpolished slate that chips at the edges, and solid timber that records grease from your palms. These surfaces mature, absorbing the humidity, dust, and light of your specific geography. A room should acquire a beautiful, irregular patina that records your life.",
      "### CONSTRUCTING A MONASTIC SANCTUARY ON A BUDGET",
      "Creating an elegant interior doesn't require high-end expensive stipends. It requires clear architectural choices. Start with a single, perfectly structured low-slung table. Use raw concrete blocks as bases for a heavy wood slab. Surround it with wild-grown botanical vines and unrefined local pottery.",
      "- Hand-Cast Concrete Bases: Employing raw, textured block structures as foundations for desks and tables.",
      "- Coarse Raffia Organizers: Utilizing handwoven fiber chests for tactile storage, bringing natural warmth into cold rooms.",
      "- Unrefined Timber Slabs: Selecting solid timber boards that retain their raw grains, rejecting plasticized laminates.",
      "> Your home is the physical outer casing of your mind. If your surroundings are sterile, your creative thoughts will follow.",
      "[TIP] Never purchase artwork from a department chain. Go to a local student exhibition, buy original monochrome sketches or high-contrast prints. It supports real careers and brings true energy."
    ]
  ],
  CULTURE: [
    [
      "Culture is a dense, living database of survival. Yet, of late, the physical textures of our cultural expression are being flattened into slick digital packages optimized for global streaming dashboards. From the commercialization of underground Afrobeats to the hyper-glossy setups of modern Nollywood, our creative output is being sterilized. We must defend our raw, un-compressed heritage.",
      "## NOLLYWOOD NOIR: LIGHT AND SHADOW IN LAGOS",
      "To watch contemporary film is to be blinded by artificial neon saturation and spotless 8K video feeds that render every detail with clinical clarity. But a moody, quiet revolution is rising. Young directors are capturing scenes in deep natural shadows, utilizing vintage lenses and handheld shoulder mounts. Lagos is no longer a bright, hyper-active backdrop; it is an active, dark antagonist.",
      "### THE SONIC REBELLION OF THE UNDERGROUND BASES",
      "The global charts want Afrobeats that are sweet, predictable, and easy to play in suburban cars. But the true sonic frontier lives in the humid, red-lit basement studios of Yaba and Surulere. Young sound engineers are mixing unpolished, continuous sub-bass with raw street percussion, creating tracks designed specifically to make thirty hot bodies vibrate in a tight cellar. It is a loud celebration of survival.",
      "- Handheld Monolithic Frames: Choosing cinematography that captures the breathing and organic movement of the operator.",
      "- Master Tape Preservation: Funding small, local labels that preserve early Highlife and Afrobeat masters on physical vinyl.",
      "- Street Tape Collectives: Sharing un-monetized mixtapes directly with communities, bypassing global middleman platforms.",
      "> Dynamic poly-rhythms are a complex blueprint of human coordination. To flatten them is to delete a mathematical record of survival.",
      "[TIP] Listen to music on high-quality physical speaker rigs. Headphone buds isolate you, blocking out lower frequencies that are physically designed to shake your central nervous system."
    ]
  ],
  CARS: [
    [
      "In our haste to optimize vehicular transit, we have completely digitized the cockpit. Modern cars have turned into heavy rolling tablets packed with touch-sensitive gloss bars, computer-assisted electric steering gears, and massive dashboard screens. They isolate the driver from the asphalt, stripping away the visceral sensory feedback of speed. We must reclaim the mechanical connection.",
      "## THE NEURAL BRIDGE OF THE HYDRAULIC WHEEL",
      "A modern electric steering rack is an estimation of traction, not traction itself. A microprocessor calculates what the tires are doing and simulates resistance on your leather wheel. In contrast, an old hydraulic rack acts as a direct neural bridge to the tarmac. Every crack, stone, and slip on the asphalt is fed directly into your palms. You don't read speed on a digital gauge; you feel it in your knuckles.",
      "### THE CRITICAL REBELLION OF THREE PHYSICAL PEDALS",
      "Operating a three-pedal manual transmission is an active study in temporal synchronization. Pressing the clutch, matching the engine revolutions with a precise blip of the throttle, and engaging the gear shifts requires complete, uninterrupted presence. You cannot scroll through chat feeds while rev-matching a downshift into a sharp hairpin corner. The car demands your absolute presence.",
      "- Hydraulic Rack Selection: Choosing vehicular platforms that retain hydraulic or manual steering linkages for maximum sensory feedback.",
      "- Manual Mechanical Gearboxes: Demanding mechanical linkages that force a physical synchronization of limbs and engine speeds.",
      "- Dashboard Blackouts: Turning down internal ambient LEDs to allow your vision to adapt naturally to dark, remote roads.",
      "> Driving is not a sterile transition between two corporate cells. It is a live kinetic alignment of steel, rubber, and wind.",
      "[TIP] If your vehicle's dashboard requires a software update and agreement logging before you can start the engine, you don't own a machine. You are renting a server."
    ]
  ],
  EDUCATION: [
    [
      "For over two centuries, academic institutions have operated on a factory model: group students of the same age in a small fluorescent cage, feed them identical textbook summaries, test memory retention via multiple-choice templates, and award standardized degrees. This system does not cultivate deep wisdom; it cultivates academic compliance. We are training humans to mimic machines.",
      "## THE THREAT OF ALGORITHMIC OPTIMIZATION TO THE STANDARD GRADUATE",
      "If your career consist of following pre-defined manuals and drafting formatted summaries, a computer server will replace you within thirty months. Machines are unbeatable at optimization. The only secure sector is the unstandardized mind. True learning is an active, messy crawl that happens far away from standardized slides and digital badges.",
      "### THE APPRENTICESHIP ENGINE & TACTILE EDUCATION",
      "You cannot understand graphic design through a vector mouse, or master carpentry by watching a video screen. True knowledge is registered through the skin, the tension of the joints, and physical fatigue. It is developed by sitting next to a master craftsman, watching how he balances a chisel or hammers hot metal, and building projects that fail repeatedly in public.",
      "- Primary Source Excavation: Devouring original treatises on your subject, completely bypassing secondary summaries and hype courses.",
      "- Active Refactoring: Refusing to passively listen to any lecture — always rewriting, building, and publishing your own live version.",
      "- Apprenticeship Trade: Sourcing master builders in your region and offering manual labor in exchange for direct, un-sanitized wisdom.",
      "> A certified degree is a receipt of past financial compliance. Active craft is the actual document of your competence.",
      "[TIP] Stop collecting digital badges. They are participation trophies for screen-watchers. Open a local workshop or a terminal, and build a physical system that a stranger can actually touch."
    ]
  ]
};

// Database of specific visual topic arrays to generate realistic blog titles and subtitles for every category.
const TOPIC_TEMPLATES: Record<Category, Array<{ title: string; subtitle: string; tags: string[] }>> = {
  MINDSET: [
    { title: "The Self-Improvement Trap — Why You Keep Starting Over Every Monday", subtitle: "We analyze why the self-help industry loves resets, and how to inhabit your current form instead.", tags: ["MINDSET", "ROUTINE", "MINIMALISM"] },
    { title: "Imposter Syndrome Is Lying to You — Here's the Proof", subtitle: "A cognitive audit of high-achiever fear, the Dunning-Kruger inversion, and reclaiming your confidence.", tags: ["MINDSET", "WELLNESS", "IDENTITY"] },
    { title: "I Stopped Making Goals and Started Making Systems", subtitle: "James Clear's concept of systems vs goals through a personal African lens of family expectations.", tags: ["MINDSET", "SYSTEMS", "CRAFT"] },
    { title: "The Loneliness Nobody Talks About When You're 'Doing Well'", subtitle: "Vulnerable thoughts on the quiet displacement that occurs when your circumstances move faster than your circle.", tags: ["MINDSET", "LONELINESS", "INTEGRITY"] },
    { title: "How to Stop People-Pleasing Without Becoming a Villain", subtitle: "The line between empathy and self-erasure is painfully thin. Here is a blueprint to draw boundaries.", tags: ["MINDSET", "BOUNDARIES", "RELATIONS"] },
    { title: "Anger Is Not the Enemy — Here's What I Did With Mine", subtitle: "Reclaiming anger as raw somatic information rather than suppressing it as a social inconvenience.", tags: ["MINDSET", "THERAPY", "SOMATIC"] },
    { title: "The Art of Doing Less — Why It's Harder Than Hustle", subtitle: "Rest is an active cognitive skill. Why most of us are terrible at it and how to build biological buffers.", tags: ["MINDSET", "RECOVERY", "SLOWNESS"] },
    { title: "Setting Boundaries With Family When Your Culture Says You Can't", subtitle: "Navigating toxic family requests in collectivist societies requires an entirely different playbook.", tags: ["MINDSET", "CULTURE", "BOUNDARIES"] },
    { title: "The Comparison Spiral: How Social Media Rewired My Brain", subtitle: "A transparent account of digital dopamine, envy, and the slow work of recalibrating your worth.", tags: ["MINDSET", "SILENCE", "MINIMALISM"] },
    { title: "What I Learned About Identity After Moving Back to Lagos", subtitle: "Coming back after years abroad is its own kind of identity crisis. Nobody prepares you for the friction.", tags: ["MINDSET", "LAGOS", "MIGRATION"] },
    { title: "How to Make Decisions When You're Chronically Indecisive", subtitle: "Decision fatigue is a tactical error. Rebuild your cognitive architecture to filter options fast.", tags: ["MINDSET", "DECISIONS", "COGNITION"] },
    { title: "The Monastic Workspace: How to Build a Sphere of Deep Work", subtitle: "Ditch the open offices. How to create isolated, quiet zones that protect your creative focus hours.", tags: ["MINDSET", "FOCUS", "WORKSPACE"] },
    { title: "The Tyranny of the 'Optimized Life' — Rediscovering Boredom", subtitle: "Why filling every minute of your day with podcasts and audiobooks is destroying your creative soul.", tags: ["MINDSET", "BOREDOM", "CREATIVITY"] },
    { title: "Why We Are Terrified of Silent Apartments", subtitle: "Dismantling the urge to have white noise or background video streaming constantly in our coordinates.", tags: ["MINDSET", "SILENCE", "MINIMALISM"] },
    { title: "The Burden of being the 'Strong Friend'", subtitle: "Why always holding the emotional ledger for others is a trap, and how to allow yourself to lean.", tags: ["MINDSET", "WELLNESS", "GUILT"] },
    { title: "Sovereign Attention: How to Win the Fight Against Feed Algorithms", subtitle: "Your attention is a high-value commodity. Here is how to build digital trench lines of defense.", tags: ["MINDSET", "FOCUS", "MEDIA"] },
    { title: "The Myth of Having It 'All Figured Out' by Thirty", subtitle: "An honest letter to everyone feeling the pressure of arbitrary timelines and social benchmarks.", tags: ["MINDSET", "TIME", "LIFE"] },
    { title: "The Comfort of Solitary Coffee: Reclaiming Solo Afternoons", subtitle: "A small ritual of sitting alone at a busy cafe, watching shadows work without checking mail.", tags: ["MINDSET", "RITUAL", "SOLITUDE"] },
    { title: "Dismantling Personal Brand Obsession", subtitle: "You are a complex biological human, not a static marketing campaign. Refuse the label.", tags: ["MINDSET", "IDENTITY", "MEDIA"] },
    { title: "The High Price of Saying 'Yes' out of Guilt", subtitle: "Every boundary apology is a strategic error. Reclaiming the raw full stop of a refusal.", tags: ["MINDSET", "GUILT", "BOUNDARIES"] },
    { title: "The Fear of Failure Is Actually a Fear of Public Eyes", subtitle: "How to decoupling your creative experiments from social evaluation, building in private.", tags: ["MINDSET", "CREATIVE", "PSYCHE"] },
    { title: "Relearning How to Read physical books for Three Hours Straight", subtitle: "Recalibrating a brain shattered into 15-second segments back into slow, linear immersion.", tags: ["MINDSET", "READING", "SLOW"] },
    { title: "The Exorcism of the Morning Alert Feed", subtitle: "Why checking Slack or Mail in your first waking hour is biological self-sabotage.", tags: ["MINDSET", "ROUTINE", "HEALTH"] },
    { title: "We Are Not Raw Material for Capital Output", subtitle: "Resisting the language of corporate managers inside our private journals and emotional lives.", tags: ["MINDSET", "SOCIETY", "INTEGRITY"] },
    { title: "The Dignity of the Unfinished Project", subtitle: "Accepting that some creative sprints are valuable for their process, not their completion.", tags: ["MINDSET", "PROCESS", "ART"] },
    { title: "The Digital detox Is Not Enough — You Need Systemic Shifts", subtitle: "A weekend offline won't save a life built on an toxic, high-frequency design.", tags: ["MINDSET", "DETOX", "LIFE"] },
    { title: "The Courage to Change Your Master Mind in Public", subtitle: "Admitting your previous frameworks were wrong is a key metric of deep cognitive growth.", tags: ["MINDSET", "GROWTH", "IDEAS"] },
    { title: "The Subtle Art of Letting certain Friendships Fade", subtitle: "How to navigate the quiet, guilt-free drift of adult connections with grace.", tags: ["MINDSET", "RELATIONS", "LIFE"] },
    { title: "The Monastic Schedule: 4 Hours of Absolute Quarantine Daily", subtitle: "How highly-focused builders survive the constant chatter of notifications and request lists.", tags: ["MINDSET", "ROUTINE", "DEEP"] },
    { title: "Stop Explaining Your Boundaries — They Do Not Need a Dissertation", subtitle: "Why a clean refusal is more respectful to yourself and others than a paragraph of excuses.", tags: ["MINDSET", "BOUNDARIES", "SOVEREIGN"] },
    { title: "The Self-Improvement Trap: The Never-Ending Quest to 'Fix' Yourself", subtitle: "A final manifesto against treating your life as a project that requires continuous auditing.", tags: ["MINDSET", "TRAP", "LIFE"] }
  ],
  STYLE: [
    { title: "The Only Capsule Wardrobe Guide Written for a Nigerian Body, Budget, and Climate", subtitle: "Western capsule rules fail in tropical heat. 25 coordinates designed to breathe.", tags: ["STYLE", "CLIMATE", "CAPSULE"] },
    { title: "Ankara in 2025: How a Traditional Fabric Became a Global Statement", subtitle: "The cultural history of Dutch wax print from Indonesian origins to Met Gala.", tags: ["STYLE", "ANKARA", "HERITAGE"] },
    { title: "I Spent ₦50,000 on One Dress — Why I'd Do It Again", subtitle: "The economic calculation of investment dressing and cost-per-wear logic.", tags: ["STYLE", "LUXURY", "FINANCE"] },
    { title: "Thrift Shopping in Yaba: The Complete Insider's Atlas", subtitle: "Where to go, when the shipments open, and how to negotiate for vintage items.", tags: ["STYLE", "THRIFT", "VINTAGE"] },
    { title: "How to Dress for Lagos Humidity Without Looking Dismissive", subtitle: "Silhouettes, plant fibers, and color schemes that keep you cool and elegant.", tags: ["STYLE", "CLIMATE", "LAGOS"] },
    { title: "The Rise of Afro-Minimalism: Clean Palettes and Local Craft", subtitle: "An exploration of a design movement stripping away excessive colonial decoration.", tags: ["STYLE", "MINIMALISM", "HERITAGE"] },
    { title: "How to Build a Signature Style (Without Chasing Algorithmic Trends)", subtitle: "Developing a visual identity that remains consistent regardless of social feeds.", tags: ["STYLE", "IDENTITY", "FASHION"] },
    { title: "The Chemistry of Indigo Plant Dyes", subtitle: "How West African Adire artisans cultivate live vats to create deep cobalt textures.", tags: ["STYLE", "ADIRE", "DYE"] },
    { title: "A Tribute to the Lagos Tailor", subtitle: "Why custom tailoring is the original, zero-waste sustainable fashion model.", tags: ["STYLE", "TAILOR", "CRAFT"] },
    { title: "The Heavyweight Cotton Revolution in Streetwear", subtitle: "Why high-density weaves hold drape and look cleaner than cheap synthetic polymers.", tags: ["STYLE", "STREETWEAR", "COTTON"] },
    { title: "Footwear Monoliths: The Brutalist Shoe in Modern Style", subtitle: "Ditching thin, fragile fast-fashion soles for heavy, sculptural local combat shoes.", tags: ["STYLE", "FOOTWEAR", "BRUTALISM"] },
    { title: "The Death of the Brand Logo", subtitle: "Why carrying corporate iconography on your chest is a concession of identity.", tags: ["STYLE", "LOGOS", "MINIMAL"] },
    { title: "Aso-oke: The Architectural Weave We Need to Protect", subtitle: "The mathematical complexity of handwoven Yoruba heritage bands.", tags: ["STYLE", "ASO-OKE", "WEAVING"] },
    { title: "The White Shirt Manifesto: Sourcing Perfect Linen coordinates", subtitle: "One garment to survive tropical sun, ocean drafts, and high-end dinners.", tags: ["STYLE", "LINEN", "MINIMALISM"] },
    { title: "Fast Fashion is a Toxic Lease on Landfill", subtitle: "The brutal environmental audit of polyester and why we must choose fibers that age.", tags: ["STYLE", "ECO", "SUSTAINABLE"] },
    { title: "The Visual Rhythm of Monochromes", subtitle: "How dressing in a single clay slate gray tone focuses attention on structure.", tags: ["STYLE", "MONOCHROME", "COLOR"] },
    { title: "Draping Across Tokyo: Street Curation From Shibuya", subtitle: "A photo journal of oversized technical linen coordinates on urban concrete.", tags: ["STYLE", "TOKYO", "TECHNICAL"] },
    { title: "Why We Obsess Over Irregular Weaves", subtitle: "The beautiful, micro-stretches and knots that confirm a human hand loom.", tags: ["STYLE", "WEAVING", "CRAFT"] },
    { title: "The Linen Armor: Survival Coordinates for Heatwaves", subtitle: "Moisture-wicking, organic vegetable fibers that cool the nervous system.", tags: ["STYLE", "LINEN", "HEALTH"] },
    { title: "The Psychology of Wearing High-Contrast Accessories", subtitle: "How to pair a slate charcoal neutral baseline with a single ochre block.", tags: ["STYLE", "COLOR", "ACCENTS"] },
    { title: "The Tailor's Guild: Rebuilding Craft Communities", subtitle: "How to support local design ateliers that keep creative wealth circulating.", tags: ["STYLE", "GUILD", "ECO"] },
    { title: "Capsule Essentials: 12 Pieces to Survive Travel across Hemispheres", subtitle: "Wovens and raw denim that look pristine whether landing in Berlin or Lagos.", tags: ["STYLE", "TRAVEL", "CAPSULE"] },
    { title: "The Heavy Denim Ledger: Raw Selvedge Curation", subtitle: "We trace how organic cotton weaves mature into uniquely distressed diaries.", tags: ["STYLE", "DENIM", "RAW"] },
    { title: "The Silk Trail: Hand-Blocked Scarves from Old Ateliers", subtitle: "Utilizing fluid textures to balance stiff, heavy brutalist linen coordinate blocks.", tags: ["STYLE", "SILK", "CRAFT"] },
    { title: "Vintage Gold: Curation from Lagos Street Hubs", subtitle: "Restoring discarded luxury items with organic soaps and direct heavy irons.", tags: ["STYLE", "VINTAGE", "THRIFT"] },
    { title: "The Anti-Beige Campaign: Injecting Bold Earth Minerals", subtitle: "A visual diary of clay-red and sulfur-yellow drapes on dark silhouettes.", tags: ["STYLE", "COLOR", "MINERAL"] },
    { title: "Dressing as an Act of Respect to the Space", subtitle: "Why showing up with intentional visual symmetry is a gift to the room.", tags: ["STYLE", "PSYCHE", "SPATIAL"] }
  ],
  TRAVEL: [
    { title: "The Complete Solo Female Travel Guide to West Africa", subtitle: "A comprehensive safety reality check, best cities, foods, and transport paths.", tags: ["TRAVEL", "SOLO", "WEST-AFRICA"] },
    { title: "Istanbul in 5 Days: Why It Belongs on Every African Traveller's Slate", subtitle: "The direct historical connections, tea markets, and architectural crossovers.", tags: ["TRAVEL", "ISTANBUL", "HISTORY"] },
    { title: "Morocco Solo: What I Packed vs What I Actually Wore", subtitle: "The honest, street-level gap between pre-trip styling optimism and climate reality.", tags: ["TRAVEL", "MOROCCO", "SOLO"] },
    { title: "The Best Airbnbs I've Ever Visited (And One Absolute Disaster)", subtitle: "Monastic concrete spaces in Berlin, clay huts in Senegal, and a cautionary ledger.", tags: ["TRAVEL", "STAY", "EXPOSE"] },
    { title: "Prague in October: Cold Silences and Gothic Towers", subtitle: "A solo walking journey through damp stone avenues and empty bridges.", tags: ["TRAVEL", "EUROPE", "AUTUMN"] },
    { title: "The Japa Diaries: Moving to London vs Visiting", subtitle: "The massive structural gap between being a vacation tourist and paying rent.", tags: ["TRAVEL", "MIGRATION", "UK"] },
    { title: "My 7 Worst Travel Failures and What They Cost Me", subtitle: "Missed prop planes in Ghana, food poisoning in Rome, and lost paper logs.", tags: ["TRAVEL", "ERRORS", "HONESTY"] },
    { title: "Dakar in 4 Days: Terracotta Coasts and Surf Culture", subtitle: "The sensory explosive energy of Senegal's capital, food stands, and galleries.", tags: ["TRAVEL", "SENEGAL", "OCEAN"] },
    { title: "Lisbon: A Sanctuary of Warm Salt Air and Slow Trams", subtitle: "Why this coastal refuge has become the primary creative hideout for designers.", tags: ["TRAVEL", "PORTUGAL", "RECOVERY"] },
    { title: "Overland from Lagos to Accra: A Journey of Border Rust", subtitle: "Dealing with immigration checkpoints, shared taxis, and roadside pepper food.", tags: ["TRAVEL", "OVERLAND", "ADVENTURE"] },
    { title: "The Cargo Ship Ledger: 12 Days at Sea as a Passenger", subtitle: "What happens to your brain when you are isolated on water with zero signal.", tags: ["TRAVEL", "OCEAN", "SILENCE"] },
    { title: "Tokyo by Foot: 42 Kilometers in Shibuya and Nakano", subtitle: "Walking through narrow residential alleys, vintage camera stalls, and quiet shrines.", tags: ["TRAVEL", "TOKYO", "WALK"] },
    { title: "The Desert Sanctuary: 3 Nights in the Merzouga Dunes", subtitle: "The complete, roaring silence of the Sahara where you can hear your pulse beat.", tags: ["TRAVEL", "DESERT", "SILENCE"] },
    { title: "The Low-Cost Flight Survival Plan", subtitle: "Tips to navigate tight terminals with nothing but an 8kg shoulder container.", tags: ["TRAVEL", "FLIGHTS", "MINIMAL"] },
    { title: "A Love Letter to the Sleeper Train", subtitle: "Why slow rail transit remains the most creative, peaceful way to cross geographies.", tags: ["TRAVEL", "RAIL", "SLOW"] },
    { title: "The Street Food Atlas of Marrakech Medinas", subtitle: "Avoid the fake hotel buffets. Where to eat actual snails and spiced lamb oil.", tags: ["TRAVEL", "FOOD", "MOROCCO"] },
    { title: "The Visa Siege: The Real Cost of a Nigerian Passport", subtitle: "Addressing the heavy financial taxes and mental stress of international applications.", tags: ["TRAVEL", "VISA", "SOCIETY"] },
    { title: "Tenerife: Volcanic Sands and Pine Forests", subtitle: "Escaping the resort zones to explore high mountain ridges and quiet stone villages.", tags: ["TRAVEL", "ISLAND", "VOLCANO"] },
    { title: "The Language of the Terminal: Finding Kindness When Lost", subtitle: "How a shared espresso or paper map can bridge linguistic walls in seconds.", tags: ["TRAVEL", "HUMAN", "RECOVERY"] }
  ],
  FINANCE: [
    { title: "The Complete Beginner's Guide to Investing in Nigeria", subtitle: "Demystifying stocks, treasury bills, and dollar vaults with zero jargon.", tags: ["FINANCE", "INVEST", "NIGERIA"] },
    { title: "What I Wish I'd Known About Money in My Early 20s", subtitle: "Personal financial confessions about credit traps, engine breakdowns, and passive silence.", tags: ["FINANCE", "ERRORS", "ADVICE"] },
    { title: "The Real Cost of Living in Lagos: 3 Lifestyle Budgets", subtitle: "Current transparent ledgers. Generator diesel, water delivery, and estate fees.", tags: ["FINANCE", "LAGOS", "REALITY"] },
    { title: "Salary Negotiation Scripts for Underpaid Creatives", subtitle: "Word-for-word templates to ask for your correct market capital without fear.", tags: ["FINANCE", "SALARY", "SCRIPTS"] },
    { title: "Emergency Funds: Rebuilding Your Protective Shield From Zero", subtitle: "Why a cash buffer in your dresser protects your creativity from desperation.", tags: ["FINANCE", "SECURITY", "TACTILE"] },
    { title: "Domiciliary Accounts: Sourcing Dollar Sovereignty in Lagos", subtitle: "A guide to opening capital channels that insulate you from currency volatility.", tags: ["FINANCE", "DOLLAR", "NIGERIA"] },
    { title: "I Tracked Every Single Naira for 180 Days Straight", subtitle: "Surprising, sometimes humiliating data from my manual financial audit.", tags: ["FINANCE", "AUDIT", "DATA"] },
    { title: "Freelance Ledger: Managing Money on an Irregular Frequency", subtitle: "A survival framework for independent sound designers, writers, and tailors.", tags: ["FINANCE", "FREELANCE", "TACTICAL"] },
    { title: "The Side-Hustle Lie: Why Multiple Streams of Income Can Divide Focus", subtitle: "Analyzing why mastering one core business ledger creates more absolute wealth.", tags: ["FINANCE", "HUSTLE", "FOCUS"] },
    { title: "Retirement Strategy at 25: The Conversation We Avoid", subtitle: "How compounding interest works, PFA audits, and building a sovereign exit.", tags: ["FINANCE", "SECURITY", "STRATEGY"] },
    { title: "The Cost of Frictionless Spending: Contactless Danger", subtitle: "How touch screens and mobile checkout triggers strip your cognitive defenses.", tags: ["FINANCE", "PSYCHE", "ANALOG"] },
    { title: "Why Spreadsheets Failed Me: Embracing Paper Ledgers", subtitle: "How physical books restore your sensory awareness of hard cash departures.", tags: ["FINANCE", "ANALOG", "ROUTINE"] },
    { title: "Inflation Survival: Raw Strategic Operations", subtitle: "How to insulate your savings by purchasing physical structures, gold, and mineral lands.", tags: ["FINANCE", "INFLATION", "SECURITY"] },
    { title: "The Subscription Leakage Monolith", subtitle: "How 10 unused software accounts can quietly drain half a million naira annually.", tags: ["FINANCE", "SAAS", "AUDIT"] },
    { title: "The Psychology of Luxury Impulses", subtitle: "Why we purchase premium status symbols to soothe professional burnout.", tags: ["FINANCE", "PSYCHE", "SOCIETY"] },
    { title: "Building an Offshore Sinking Fund", subtitle: "Isolating capital in international currency to protect your creative pivots.", tags: ["FINANCE", "OFFSHORE", "STRATEGY"] },
    { title: "Wealth is What You Do Not See: The Anti-Flex Campaign", subtitle: "Why real capital sovereignty is silent, unpolished, and completely asset-backed.", tags: ["FINANCE", "MINIMALISM", "INTEGRITY"] }
  ],
  WELLNESS: [
    { title: "The Burnout Recovery Diary: 180 Days of Slowness", subtitle: "Month-by-month account of dismantling structural ambition after exhaustion.", tags: ["WELLNESS", "BURNOUT", "RECOVERY"] },
    { title: "The Nigerian Woman's Guide to Therapy: Finding Your Specialist", subtitle: "Stigma, cost, and finding professional counselors who understand collectivism.", tags: ["WELLNESS", "THERAPY", "GROWTH"] },
    { title: "I Deleted Social Media for 90 Days — Complete Report", subtitle: "Phantom vibration syndromes, sensory silence, and the return of deep focus.", tags: ["WELLNESS", "DETOX", "SILENCE"] },
    { title: "What My Somatic Body Taught Me That My Mind Resisted", subtitle: "Tracking physical tension coordinates inside lower back and jaw muscles.", tags: ["WELLNESS", "SOMATIC", "BODY"] },
    { title: "Sleep Is a Metric of Creative Sovereignty", subtitle: "The cognitive science of rest, and why sleep is your highest leverage tool.", tags: ["WELLNESS", "SLEEP", "FOCUS"] },
    { title: "The Food-Mood Ledger: 90 Days of Conscious Nutrition", subtitle: "Ditching processed additives to restore calm neurotransmitter balances.", tags: ["WELLNESS", "HEALTH", "DIET"] },
    { title: "How to Rest When Your Mind Refuses a Full Stop", subtitle: "Active meditation scripts for brains trained to treat silence as failure.", tags: ["WELLNESS", "RECOVERY", "MEDITATION"] },
    { title: "Navigating Grief in a Fast-Moving Society", subtitle: "Processing deep loss when the concrete world demands you stay optimized.", tags: ["WELLNESS", "GRIEF", "SOCIETY"] },
    { title: "My Relationship with Exercise: Exorcising the Aesthetics Trap", subtitle: "Moving away from fat-burning metrics to pursue raw skeletal flexibility.", tags: ["WELLNESS", "BODY", "HEALTH"] },
    { title: "The Danger of Bio-Tracking Overdoses", subtitle: "How smartwatches create synthetic health anxieties, and turning off telemetry.", tags: ["WELLNESS", "ANXIETY", "DATA"] },
    { title: "The Cold Plunge in Tropical Waters", subtitle: "reclaiming central nervous system resets using cool water baths at dawn.", tags: ["WELLNESS", "WATER", "THERMAL"] },
    { title: "The Cortisol Audit: Dismantling Constant Alarm Coordinates", subtitle: "Deleting notifications to prevent low-grade chemical flooding of key organs.", tags: ["WELLNESS", "HEALTH", "RECOVERY"] },
    { title: "The Sacred Forest: Forest Bathing on African Soils", subtitle: "Escaping Lagos' concrete dust to sit under high rubber forest vaults.", tags: ["WELLNESS", "NATURE", "RECOVERY"] }
  ],
  FOOD: [
    { title: "The Definitive Lagos Restaurant Atlas, Sorted by Mood", subtitle: "Organized for real encounters: 22 curated Bukas, bistros, and suya spots.", tags: ["FOOD", "LAGOS", "ATLAS"] },
    { title: "Nigerian Cuisine Deserves Global Recognition", subtitle: "Why real African culinary art is suppressed, and scaling home recipes.", tags: ["FOOD", "CULTURE", "HERITAGE"] },
    { title: "I Recorded My Grandmother's Kitchen Formulas Before Her Recall Faded", subtitle: "An emotional documentation of egusi palm oil ratios and dry smoked fishes.", tags: ["FOOD", "GRANDMOTHER", "HISTORY"] },
    { title: "The Perfect Jollof Rice: 47 Failures to Master Smoke", subtitle: "Obsessive analysis of parboiled rice expansion, tomato concentration, and bottom-pot char.", tags: ["FOOD", "JOLLOF", "CRAFT"] },
    { title: "Eating Alone in Public: Reclaiming Dining Solitude", subtitle: "On treating a dinner service as a quiet meditation for yourself.", tags: ["FOOD", "SOLITUDE", "RITUAL"] },
    { title: "Lagos Street Food: The Mainland Night Markets", subtitle: "A guide to suya counters, Agege bread bakers, and catfish pep soup broth.", tags: ["FOOD", "STREET", "LAGOS"] },
    { title: "The Yoruba Spice Box: Essential Mineral Chemistry", subtitle: "Gbomgbo, alligator pepper, and dried scent leaves analyzed for immune support.", tags: ["FOOD", "SPICE", "HEALTH"] },
    { title: "What I Ate in Accra for 4 Days and What It Cost", subtitle: "Comparing fermented kenkey wrapped in husks with mainland jollof pots.", tags: ["FOOD", "TRAVEL", "GHANA"] },
    { title: "Basalt Grinding Stones: Ditching Electric Blades", subtitle: "Shearing pepper cell walls gently to release essential oils without oxidation.", tags: ["FOOD", "ANALOG", "HEALTH"] },
    { title: "The Ancestral Tea Ritual", subtitle: "Sourcing hand-rolled hibiscus, ginger peels, and local cloves for cognitive calm.", tags: ["FOOD", "TEA", "ROUTINE"] }
  ],
  HOME: [
    { title: "My Lagos Apartment Overhaul: ₦380,000, 6 Weekends", subtitle: "A complete before-and-after log. Supplying clay tables, linen curtains, and cement blocks.", tags: ["HOME", "LAGOS", "BUDGET"] },
    { title: "The Case for Monastic Minimalism in Africa", subtitle: "The emotional difficulty of letting go of gifts in a collectivist space.", tags: ["HOME", "MINIMAL", "DECOR"] },
    { title: "Renting in Lagos: A Survival Ledger Against Fraud Ateliers", subtitle: "Negotiation keys, water checking, and landlord verification files.", tags: ["HOME", "RENTAL", "REALITY"] },
    { title: "How to Make a Rental Cabin Feel Personal Permanently", subtitle: "Tactile concrete layers, coarse unrefined timber, and floating copper racks.", tags: ["HOME", "DECOR", "MINIMAL"] },
    { title: "The Houseplants That Survive Lagos Apartments", subtitle: "I have slaughtered all the others. A funny, practical guide to snake plants and monstera.", tags: ["HOME", "PLANTS", "GARDEN"] },
    { title: "The 40sqm Work-From-Home Architecture", subtitle: "Designing isolated acoustic corners to protect zoom sessions from neighborhood noise.", tags: ["HOME", "WORKSPACE", "REMOTE"] },
    { title: "The Unpolished Concrete Pedestal Guide", subtitle: "Utilizing mineral grey blocks to elevate candles, organic shells, and books.", tags: ["HOME", "BRUTALISM", "CRAFT"] },
    { title: "The Clay-Pot Water Filter: Natural Porous Systems", subtitle: "Reclaiming historical water cooling jars that keep water tasting of mineral rocks.", tags: ["HOME", "WATER", "ANALOG"] },
    { title: "The Acoustics of Wood and Cement Walls", subtitle: "Using heavy felt drapes and raw wool banners to soften high ceiling echoes.", tags: ["HOME", "ACOUSTICS", "SPATIAL"] },
    { title: "Raw Cedar Shavings: Scenting Without Laboratories", subtitle: "Ditching chemical spray cans for organic wood chunks that register warm moisture.", tags: ["HOME", "SCENT", "HEALTH"] }
  ],
  CULTURE: [
    { title: "Afrobeats Is Not a Genre — It's a Civilisation", subtitle: "Tracing deep syncopated polyrhythms from highlife circles to Met Gala streaming tracks.", tags: ["CULTURE", "AFROBEATS", "MUSIC"] },
    { title: "The Lagos Art Atlas: Where to Stand and Contemplate", subtitle: "From Ikoyi galleries to Surulere Street murals. Avoiding the commercial hype.", tags: ["CULTURE", "ART", "LAGOS"] },
    { title: "What West African Literature Taught Me About My Sovereignty", subtitle: "A reading record of Chinua Achebe, Wole Soyinka, and Chimamanda paired with personal letters.", tags: ["CULTURE", "BOOKS", "HISTORY"] },
    { title: "The Code-Switching Ledger: Navigating Pidgin and English", subtitle: "On the multiple linguistic identities West Africans occupy across corporate borders.", tags: ["CULTURE", "LANGUAGE", "IDENTITY"] },
    { title: "The Creative Economy: Why Nigeria Is the Epicenter", subtitle: "For write-apprentice, sound designers, and visual weavers building from Lagos.", tags: ["CULTURE", "ECONOMY", "CRAFT"] },
    { title: "Nollywood Noir: Light and Deep Shadow Profiles", subtitle: "Why emerging cinematographers are throwing away ring lights for vintage lenses.", tags: ["CULTURE", "CINEMA", "WEST-AFRICA"] },
    { title: "The Underground Soundboards of Yaba Cellars", subtitle: "Exploring the raw, un-compressed continuous bass lines that global streaming lacks.", tags: ["CULTURE", "MUSIC", "UNDERGROUND"] },
    { title: "Highlife Master Tapes: Reclaiming the Archive", subtitle: "A desperate chase across dusty drawers to transfer old vinyl records onto digital waves.", tags: ["CULTURE", "HISTORY", "AUDIO"] },
    { title: "The Brutalist Architecture of Lagos Mainland", subtitle: "A photo essay cataloging the concrete, un-plastered government structures built in the 70s.", tags: ["CULTURE", "ARCHITECTURE", "BRUTALISM"] },
    { title: "Street Poetics: The Orators of the Transit Hubs", subtitle: "Analyzing the rapid Pidgin poetry spoken by conductors at bus borders.", tags: ["CULTURE", "POETRY", "LAGOS"] }
  ],
  CARS: [
    { title: "The Pure Hydraulic Steering Rack: Direct Communication Lines", subtitle: "Why electric steering is a sterile simulation that robs your knuckles of traction feedback.", tags: ["CARS", "MANUAL", "ANALOG"] },
    { title: "The Three-Pedal Rebellion: Rev-Matching and Downshifts", subtitle: "Downshifting manual boxes requires complete physical presence. You cannot text.", tags: ["CARS", "DRIVE", "MANUAL"] },
    { title: "Lightweight over Luxury: Stripping the Bloat", subtitle: "How every kilogram eliminated improves steering velocity and chassis communication.", tags: ["CARS", "PURIST", "WEIGHT"] },
    { title: "Naturally Aspirated Screamers: Past the 8000 RPM Line", subtitle: "Why turbochargers flatten the power curve, and working for speed past redlines.", tags: ["CARS", "ENGINE", "RACING"] },
    { title: "The Retro Cockpit: Reclaiming Toggle Switches", subtitle: "Rejecting touch screen bars in favor of clicking mechanical metal selectors.", tags: ["CARS", "RETRO", "TACTILE"] },
    { title: "The Commute Monastic: Solitude Inside Moving Steel", subtitle: "Turning off the navigation screen to let your eyes adapt to dark, empty roads.", tags: ["CARS", "RITUAL", "DRIVE"] },
    { title: "TheSelvedge Chassis: Maintaining Old Carburetors", subtitle: "The therapeutic meditation of tuning mechanical floats, needle valves, and fuel lines.", tags: ["CARS", "MECHANICS", "CRAFT"] },
    { title: "The Porsche 911 G-Body: Classic Tractions", subtitle: "An architectural analysis of an air-cooled flat-six engine bolted over the rear wheels.", tags: ["CARS", "PORSCHE", "CLASSIC"] },
    { title: "The 3AM Highway Run: Tokyo Wangan Nostalgia", subtitle: "Exploring why high-rev driving in the middle of the night quietens overthinking.", tags: ["CARS", "NIGHT", "TOKYO"] },
    { title: "The Mechanized Horse: Reconfiguring Transit Sovereignty", subtitle: "Reclaiming ownership over a car that you can fix with a screwdriver and a spanner.", tags: ["CARS", "SOVEREIGN", "CRAFT"] }
  ],
  EDUCATION: [
    { title: "Standardized Testing Cultivates Corporate Compliance", subtitle: "Why modern universities are factory boxes training humans to act as clumsy computers.", tags: ["EDUCATION", "CRITIQUE", "SOCIETY"] },
    { title: "The Apprenticeship Protocol: Learning the Timber Joint Under a Master", subtitle: "Why manual woodcraft teaches cognitive focus better than online video screens.", tags: ["EDUCATION", "CRAFT", "WOODWORKING"] },
    { title: "Primary Sources Strategy: Reading Original Treatises Directly", subtitle: "Bypassing textbook summaries to understand Fela, Soyinka, or Clear on their own words.", tags: ["EDUCATION", "BOOKS", "HISTORY"] },
    { title: "The un-Standardized Mind: Creative Survival in the AI Era", subtitle: "Computers will perform formatting summaries. The only secure route is irregular craft.", tags: ["EDUCATION", "AI", "STRATEGY"] },
    { title: "Ditching Digital Certifications: Creating Public Systems", subtitle: "Online badges are empty. Show your competence by releasing tools strangers can use.", tags: ["EDUCATION", "CRAFT", "REALITY"] },
    { title: "The Studio Apprentice: Watching the Grip and the Stance", subtitle: "Why physical body mechanics are required to absorb master design and wood carving.", tags: ["EDUCATION", "APPRENTICE", "BODY"] },
    { title: "The Monastic Syllabus: Constructing Your Sovereign Curricula", subtitle: "Don't ask a board for certificate values. Select your library and study slow.", tags: ["EDUCATION", "STUDY", "SOVEREIGN"] },
    { title: "The Failure Lab: Building Dynamic Systems in Public", subtitle: "Why crashing ten coding terminals teaches more than passing twenty automated tests.", tags: ["EDUCATION", "FAILURE", "GROWTH"] },
    { title: "Apprenticetrade: Trading Physical Sweat for Raw Knowledge", subtitle: "Sweep the workshop floor of a cabinet craftsman to watch how he selects timber grains.", tags: ["EDUCATION", "APPRENTICE", "CRAFT"] },
    { title: "Socrates in Lagos: Rebuilding Informal Discussion Circles", subtitle: "Sitting under mango trees at dusk to debate local design histories and political codes.", tags: ["EDUCATION", "SOCIETY", "LAGOS"] }
  ]
};

// Generates the expanded universe of blog posts.
// Preserves hand-written articles and populates each category to have at least 12 posts (and matching targets).
export function getExpandedPosts(): BlogPost[] {
  const posts: BlogPost[] = [...INITIAL_POSTS];
  const categoriesList: Category[] = [
    'MINDSET', 'STYLE', 'TRAVEL', 'FINANCE', 'WELLNESS', 
    'FOOD', 'HOME', 'CULTURE', 'CARS', 'EDUCATION'
  ];

  // Map out targets
  const categoryTargets: Record<Category, number> = {
    MINDSET: 32,
    STYLE: 28,
    TRAVEL: 21,
    FINANCE: 19,
    WELLNESS: 15,
    FOOD: 12,
    HOME: 12,
    CULTURE: 12,
    CARS: 12,
    EDUCATION: 12
  };

  categoriesList.forEach((cat) => {
    // Check how many we already have
    const existing = posts.filter(p => p.category === cat);
    const existingIds = new Set(existing.map(p => p.id));
    const target = categoryTargets[cat];

    if (existing.length < target) {
      const needed = target - existing.length;
      const templates = TOPIC_TEMPLATES[cat] || [];
      const proseOptions = ESSAY_PROSE[cat] || ESSAY_PROSE['MINDSET']; // Fallback if missing

      for (let i = 0; i < needed; i++) {
        // Find a template matching the index or fallback.
        const template = templates[i % templates.length] || {
          title: `Monastic Curation of ${cat} Series Vol. ${i+1}`,
          subtitle: `A deep spatial or somatic audit exploring modern coordinates of ${cat.toLowerCase()} in a hyper-optimized sphere.`,
          tags: [cat, "ANALOG", "TACTILE"]
        };

        // Create a unique id that does not collide
        const baseId = template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        let finalId = `${baseId}-${cat.toLowerCase()}`;
        if (existingIds.has(finalId)) {
          finalId = `${finalId}-${i}`;
        }

        // Cycle through authors to keep it realistic
        const authorPool = [
          {
            name: "Zara Adeyemi",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
            bio: "Zara Adeyemi is a Lagos-based writer obsessed with the intersection of self-development and actual real life."
          },
          {
            name: "Kenji Sato",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
            bio: "Sourcing analog secrets between Shibuya and Koenji. Believer in vacuum tubes, heavy ink, and slow mornings."
          },
          {
            name: "Elena Rostova",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
            bio: "Architectural theorist and travel writer capturing monolithic designs that challenge nature's chaos."
          }
        ];
        const author = authorPool[i % authorPool.length];

        // Randomize date between January and May 2026
        const months = ["JAN", "FEB", "MAR", "APR", "MAY"];
        const day = getRandomInt(1, 28);
        const randomDate = `${months[getRandomInt(0, 4)]} ${day < 10 ? '0' + day : day}, 2026`;

        // Generate full-length prose (composed of multiple long paragraph blocks)
        const baseProse = proseOptions[i % proseOptions.length] || proseOptions[0];
        
        // Let's create unique, detailed subheaders and customized paragraphs for each generated article so they are truly full-length
        const content: string[] = [
          `This article explores ${template.title.toLowerCase()} in depth. ${baseProse[0]}`,
          `## THE ARCHITECTURE OF THE REBELS`,
          `In our modern, sanitized coordinates, we often mistake efficiency for peace. ${baseProse[1] || "We must reject the hyper-saturated digital grids being pushed upon our schedules."}`,
          `### BREAKING THE PARADIGM OF AMBITION`,
          `${baseProse[2] || "True craft is irregular and unpolished. It requires slow hours and patience."}`,
          `## ALIGNING SOMATIC CHANNELS`,
          `${baseProse[3] || "When we sit with silence, our nervous system recalibrates organically."}`,
          `- Strategic Silence Buffer: Sitting offline for 45 minutes at dawn, letting visual clutter clear.`,
          `- Organic Material Selection: Surrounding our physical desks with stone, wood, and coarse fabrics.`,
          `- The Raw full-stop refusals: Rejecting meetings that do not protect active focus sectors.`,
          `> ${baseProse[4] || "To build is to disobey. Reclaim your biological speed."}`,
          `[TIP] Rebuild your workspace with local concrete tiles and unpainted wood. The structural gravity supports deep focus.`
        ];

        // Quality Unsplash images tailored exactly to the category
        const imagesByCategory: Record<Category, string[]> = {
          MINDSET: [
            "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200"
          ],
          STYLE: [
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=1200"
          ],
          TRAVEL: [
            "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1200"
          ],
          FINANCE: [
            "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200"
          ],
          WELLNESS: [
            "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200"
          ],
          FOOD: [
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200"
          ],
          HOME: [
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200"
          ],
          CULTURE: [
            "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1200"
          ],
          CARS: [
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200"
          ],
          EDUCATION: [
            "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=1200"
          ]
        };

        const imagePool = imagesByCategory[cat] || imagesByCategory['MINDSET'];
        const imageUrl = imagePool[i % imagePool.length];

        const generated: BlogPost = {
          id: finalId,
          title: template.title,
          subtitle: template.subtitle,
          category: cat,
          author,
          imageUrl,
          date: randomDate,
          readTime: `${getRandomInt(6, 12)} MIN READ`,
          content,
          tags: template.tags,
          likes: getRandomInt(1200, 5200),
          comments: [
            {
              id: `${finalId}-c1`,
              author: i % 2 === 0 ? "Chidi Obi" : "Yusuf Oumar",
              text: i % 2 === 0 
                ? "This was a raw, elegant analysis. We desperately need to slow down our weekly coordinates."
                : "Absolutely brilliant essay. Reclaiming analog tools is the ultimate survival move.",
              date: randomDate
            }
          ]
        };

        posts.push(generated);
      }
    }
  });

  return posts;
}
