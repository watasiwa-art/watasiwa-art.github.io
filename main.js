// ===================================================================
// The History of Animation — main.js
// Handles: typewriter, particles, timeline, eras, gallery lightbox,
//          videos, studios, dark mode, smooth scroll, AOS init.
// ===================================================================

import "./style.css";

// -------------------------------------------------------------------
// Data: Timeline milestones
// -------------------------------------------------------------------
const TIMELINE = [
  {
    year: "≈ 40,000 BCE",
    title: "Cave Paintings",
    era: "ancient",
    summary:
      "Paleolithic artists painted herds of animals on cave walls, sometimes with multiple legs — a primal attempt to capture motion in a still image.",
  },
  {
    year: "1600s",
    title: "Magic Lantern",
    era: "mechanical",
    summary:
      "Invented by Christiaan Huygens, the magic lantern projected hand-painted slides onto walls with candlelight — the ancestor of cinema.",
  },
  {
    year: "1832",
    title: "Thaumatrope",
    era: "mechanical",
    summary:
      "John Ayrton Paris's spinning disc fused two images — a bird and a cage — into one through persistence of vision.",
  },
  {
    year: "1834",
    title: "Zoetrope",
    era: "mechanical",
    summary:
      "William G. Horner's drum of slotted images spun into a seamless loop — the first true animation device.",
  },
  {
    year: "1868",
    title: "Flipbook",
    era: "mechanical",
    summary:
      "John Barnes Linnett patented the kineograph, turning pages into motion — animation anyone could hold in their hands.",
  },
  {
    year: "1908",
    title: "Fantasmagorie",
    era: "film",
    summary:
      "Émile Cohl's hand-drawn short is widely considered the first fully animated film — 700 drawings brought to life.",
  },
  {
    year: "1928",
    title: "Steamboat Willie",
    era: "film",
    summary:
      "Walt Disney's synchronized-sound cartoon introduced Mickey Mouse and launched the golden age of American animation.",
  },
  {
    year: "1937",
    title: "Snow White",
    era: "film",
    summary:
      "Disney's Snow White and the Seven Dwarfs became the first full-length cel-animated feature — a turning point for the medium.",
  },
  {
    year: "1958",
    title: "Astro Boy",
    era: "film",
    summary:
      "Osamu Tezuka's Toei-produced work helped ignite the Japanese anime industry and its distinctive visual language.",
  },
  {
    year: "1995",
    title: "Toy Story",
    era: "modern",
    summary:
      "Pixar's Toy Story — the first fully computer-animated feature — reshaped the industry overnight.",
  },
  {
    year: "2001",
    title: "Spirited Away",
    era: "modern",
    summary:
      "Studio Ghibli's Spirited Away won the Oscar for Best Animated Feature, cementing anime's global stature.",
  },
  {
    year: "2020s",
    title: "AI Animation",
    era: "modern",
    summary:
      "Diffusion models and neural rendering now generate motion from text, image, or pose — the next chapter is being written now.",
  },
];

// -------------------------------------------------------------------
// Data: Eras (long-form sections)
// -------------------------------------------------------------------
const ERAS = [
  {
    id: "cave-paintings",
    title: "Cave Paintings",
    year: "≈ 40,000 BCE",
    tagline: "Where the dream of motion began.",
    body: "Deep in the caves of Lascaux and Chauvet, early artists painted animals with overlapping legs — a primitive attempt to suggest galloping, leaping, running. These are the first known gestures toward animation: a wish to capture life, frozen in pigment.",
    image: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Ancient cave painting of running animals",
  },
  {
    id: "magic-lantern",
    title: "Magic Lantern",
    year: "1650s",
    tagline: "Light, smoke, and the first projection.",
    body: "The magic lantern used a concave mirror and candle to project hand-painted glass slides onto walls and clouds of smoke. Itinerant showmen toured Europe with phantasmagoria — ghostly spectacles that prefigured cinema by centuries.",
    image: "https://images.pexels.com/photos/712814/pexels-photo-712814.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Vintage lantern casting warm light in a dark room",
  },
  {
    id: "thaumatrope",
    title: "Thaumatrope",
    year: "1832",
    tagline: "Persistence of vision, on a string.",
    body: "A simple disc with a bird on one side and a cage on the other. Twirled on strings, the eye merges them — the bird appears caged. The thaumatrope gave science a name for the illusion: persistence of vision.",
    image: "https://images.pexels.com/photos/414634/pexels-photo-414634.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Spinning vintage toy disc on a string",
  },
  {
    id: "zoetrope",
    title: "Zoetrope",
    year: "1834",
    tagline: "The drum that learned to gallop.",
    body: "A slotted drum lined with a strip of sequential images. When spun and viewed through the slots, the images blur into motion — a horse galloping, a dancer spinning. The zoetrope was the first true animation machine.",
    image: "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Vintage zoetrope with sequential images",
  },
  {
    id: "flipbook",
    title: "Flipbook",
    year: "1868",
    tagline: "Animation in the palm of your hand.",
    body: "John Barnes Linnett patented the kineograph — a small book whose pages, when flipped, animate a sequence. The flipbook democratized animation: anyone with paper and a thumb could make pictures move.",
    image: "https://images.pexels.com/photos/212869/pexels-photo-212869.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Hand flipping through a small paper book",
  },
  {
    id: "disney",
    title: "Walt Disney",
    year: "1928–1966",
    tagline: "The golden age of the animated feature.",
    body: "From Steamboat Willie's synchronized sound to Snow White's feature-length ambition, Disney transformed animation from novelty to art form. Multiplane cameras, Technicolor, and a stable of legendary animators defined a golden age.",
    image: "https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Classic cinema theater with warm lights",
  },
  {
    id: "japanese-anime",
    title: "Japanese Anime",
    year: "1958–present",
    tagline: "A new visual language emerges.",
    body: "From Osamu Tezuka's Astro Boy to Studio Ghibli's hand-drawn epics, Japan developed a distinctive style — limited animation, bold composition, mature themes — that grew into a global cultural force.",
    image: "https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Japanese-inspired landscape with soft colors",
  },
  {
    id: "cgi",
    title: "CGI Revolution",
    year: "1995–present",
    tagline: "The pixel takes over.",
    body: "Pixar's Toy Story proved that entire films could be rendered frame by frame in software. CGI became the dominant medium, blending physics, lighting, and character into worlds no camera could visit.",
    image: "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Colorful 3D-rendered abstract shapes",
  },
  {
    id: "ai-animation",
    title: "AI Animation",
    year: "2020s",
    tagline: "The next chapter, written in weights.",
    body: "Diffusion models, neural rendering, and motion synthesis now generate animation from text, image, or pose. AI is not replacing the animator — it is giving them a new kind of brush, and the art form is changing faster than ever.",
    image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Abstract neural network visualization",
  },
];

// -------------------------------------------------------------------
// Data: Gallery images (Pexels stock)
// -------------------------------------------------------------------
const GALLERY = [
  {
    src: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Cave painting of running animals",
    caption: "Cave Paintings — Lascaux, France",
  },
  {
    src: "https://images.pexels.com/photos/712814/pexels-photo-712814.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/712814/pexels-photo-712814.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Magic lantern light projection",
    caption: "Magic Lantern — projection by candlelight",
  },
  {
    src: "https://images.pexels.com/photos/414634/pexels-photo-414634.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/414634/pexels-photo-414634.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Vintage spinning disc toy",
    caption: "Thaumatrope — persistence of vision",
  },
  {
    src: "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Vintage zoetrope device",
    caption: "Zoetrope — the drum of motion",
  },
  {
    src: "https://images.pexels.com/photos/212869/pexels-photo-212869.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/212869/pexels-photo-212869.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Hand flipping a small book",
    caption: "Flipbook — motion in your palm",
  },
  {
    src: "https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Classic cinema theater",
    caption: "Disney — the golden age of cinema animation",
  },
  {
    src: "https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Japanese-inspired landscape",
    caption: "Japanese Anime — a new visual language",
  },
  {
    src: "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "3D-rendered abstract shapes",
    caption: "CGI — the pixel takes over",
  },
];

// -------------------------------------------------------------------
// Data: Embedded YouTube videos
// -------------------------------------------------------------------
const VIDEOS = [
  {
    id: "Z4UyQvRp6cE",
    title: "The History of Animation in 5 Minutes",
    desc: "A whirlwind tour from cave paintings to CGI.",
  },
  {
    id: "YdHzoGB_k4U",
    title: "How the Zoetrope Works",
    desc: "See persistence of vision in action.",
  },
  {
    id: "pS6C5q2r3xQ",
    title: "Studio Ghibli: The Art of Hand-Drawn Animation",
    desc: "Inside the legendary Japanese studio.",
  },
  {
    id: "9B7ti184lYQ",
    title: "The Making of Toy Story",
    desc: "Pixar's CGI revolution, behind the scenes.",
  },
  {
    id: "5Ul5lGvC9sQ",
    title: "Disney's Multiplane Camera",
    desc: "The invention that gave animation depth.",
  },
  {
    id: "2Ymw2d2p5Io",
    title: "AI-Generated Animation Explained",
    desc: "How neural networks are learning to animate.",
  },
];

// -------------------------------------------------------------------
// Data: Famous animation studios
// -------------------------------------------------------------------
const STUDIOS = [
  {
    name: "Walt Disney",
    founded: 1923,
    country: "USA",
    desc: "Pioneer of synchronized sound, Technicolor, and the feature-length animated film. Home of Mickey, Snow White, and the modern renaissance.",
    accent: "from-sky-400 to-indigo-500",
  },
  {
    name: "Studio Ghibli",
    founded: 1985,
    country: "Japan",
    desc: "Miyazaki and Takahata's hand-drawn sanctuary — Spirited Away, Princess Mononoke, My Neighbor Totoro. A byword for craft and wonder.",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    name: "Pixar",
    founded: 1986,
    country: "USA",
    desc: "Invented the CGI feature with Toy Story and has been refining the art of computer-animated storytelling ever since.",
    accent: "from-rose-400 to-pink-500",
  },
  {
    name: "Toei Animation",
    founded: 1948,
    country: "Japan",
    desc: "The studio behind Dragon Ball, Sailor Moon, and One Piece — a pillar of Japanese television and film animation.",
    accent: "from-amber-400 to-orange-500",
  },
  {
    name: "Warner Bros. Animation",
    founded: 1980,
    country: "USA",
    desc: "Heir to Looney Tunes and the Termite Terrace legacy — Bugs, Daffy, and the irreverent spirit of American animation.",
    accent: "from-violet-400 to-purple-500",
  },
  {
    name: "DreamWorks Animation",
    founded: 1994,
    country: "USA",
    desc: "Shrek, Kung Fu Panda, How to Train Your Dragon — the challenger that pushed CGI into new tonal territory.",
    accent: "from-cyan-400 to-blue-500",
  },
];

// -------------------------------------------------------------------
// Data: Anime timeline (10 chapters)
// -------------------------------------------------------------------
const ANIME_TIMELINE = [
  {
    id: "anime-early",
    chapter: "2",
    year: "1917–1945",
    title: "Early Japanese Animation",
    era: "early",
    summary:
      "The first Japanese animated films — short, hand-drawn, and experimental — appear decades before the word 'anime' exists.",
    body: "The earliest known Japanese animation is from 1917, with works by Jun'ichi Kōuchi, Seitaro Kitayama, and Ōten Shimokawa. These pioneers cut paper, drew on chalkboards, and hand-painted each frame. Most early prints were lost in the 1923 Great Kantō earthquake and wartime bombing, making survivors precious. Kenzō Masaoka's Chikara to Onna no Yo no Naka (1933) is often cited as the first Japanese talkie anime. Wartime propaganda — including Momotaro's Sea Eagle (1945) — funded technique that would later seed peacetime studios.",
    image: "https://images.pexels.com/photos/7061979/pexels-photo-7061979.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Vintage hand-drawn animation frames",
    people: ["Jun'ichi Kōuchi", "Seitaro Kitayama", "Ōten Shimokawa", "Kenzō Masaoka"],
  },
  {
    id: "anime-postwar",
    chapter: "3",
    year: "1945–1960",
    title: "Post-War Era",
    era: "postwar",
    summary:
      "From the ashes of war, Japanese animation rebuilds — shaped by Disney's craft and a hunger for new stories.",
    body: "After 1945, the Japanese animation industry rebuilt itself slowly. The first full-color Japanese animated feature, Hakujaden (The Tale of the White Serpent, 1958), was produced by Toei Animation — a studio explicitly founded to emulate Disney. The influence of Disney's multiplane cameras, lush backgrounds, and full animation was profound, but Japanese animators also began adapting local folklore and manga, planting the seeds of a distinct national style.",
    image: "https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Vintage film reel and projector",
    people: ["Toei Animation", "Hakujaden (1958)"],
  },
  {
    id: "anime-tezuka",
    chapter: "4",
    year: "1952–1989",
    title: "Osamu Tezuka — The God of Manga",
    era: "tezuka",
    summary:
      "The man who built the visual language of modern anime — and the industry that sustains it.",
    body: "Osamu Tezuka (1928–1989) was a manga artist, animator, and founder of Mushi Production. His cinematic panel layouts, recurring character designs, and serialized storytelling earned him the title 'God of Manga.' He pioneered limited animation — reusing cells, holding on still frames, animating only the mouth — not as a compromise but as a style. Astro Boy (1963) became Japan's first serialized television anime and the template for every TV anime to follow. Tezuka's influence on modern anime is foundational: his 'star system' of recurring characters, moral complexity, and big-eyed aesthetic became the medium's DNA.",
    image: "https://images.pexels.com/photos/3747529/pexels-photo-3747529.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Artist drawing manga panels",
    people: ["Osamu Tezuka", "Mushi Production", "Astro Boy (1963)"],
  },
  {
    id: "anime-tv",
    chapter: "5",
    year: "1960s–1970s",
    title: "Rise of Television Anime",
    era: "tv",
    summary:
      "Anime moves into living rooms — Astro Boy, Speed Racer, and Lupin III define a new weekly ritual.",
    body: "Television transformed anime from a cinema event into a weekly ritual. Astro Boy (1963) proved serialized TV anime was viable. Speed Racer (Mach GoGoGo, 1967) brought kinetic racing action and would later entrance global audiences. Lupin III (1971) introduced a stylish adult antihero — a gentleman thief descended from Arsène Lupin — and pioneered the caper genre in anime. Throughout the 1970s, mecha (robot) anime like Mobile Suit Gundam (1979) matured the medium, treating war seriously and selling toys that would fund the industry for decades.",
    image: "https://images.pexels.com/photos/3338497/pexels-photo-3338497.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Vintage television set glowing",
    people: ["Astro Boy", "Speed Racer", "Lupin III", "Mobile Suit Gundam"],
  },
  {
    id: "anime-golden",
    chapter: "6",
    year: "1980s",
    title: "The Golden Age",
    era: "golden",
    summary:
      "Studio Ghibli, Akira, and Dragon Ball — the decade anime became art and phenomenon at once.",
    body: "The 1980s were anime's coming-of-age. Studio Ghibli, founded in 1985 by Hayao Miyazaki and Isao Takahata, released Castle in the Sky (1986) and My Neighbor Totoro (1988) — hand-drawn epics of unmatched craft. Katsuhiro Otomo's Akira (1988) exploded onto screens with 160,000+ animation cels, redefining what anime could look like. Dragon Ball (1986) began a shōnen phenomenon that still drives the industry. Cel animation reached its technical peak — lush backgrounds, fluid action, and a generation of animators trained in its discipline.",
    image: "https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Japanese-inspired landscape with soft colors",
    people: ["Studio Ghibli", "Hayao Miyazaki", "Isao Takahata", "Akira", "Dragon Ball"],
  },
  {
    id: "anime-global",
    chapter: "7",
    year: "1990s",
    title: "Global Expansion",
    era: "global",
    summary:
      "Pokémon, Sailor Moon, Evangelion, and Cowboy Bebop carry anime to every continent.",
    body: "The 1990s turned anime into a global language. Sailor Moon (1992) redefined magical girl anime and became a worldwide hit. Pokémon (1997) fused anime, games, and trading cards into the most valuable media franchise in history. Neon Genesis Evangelion (1995) deconstructed the mecha genre and pushed anime into philosophical territory. Cowboy Bebop (1998) blended jazz, noir, and sci-fi into a style that still defines 'cool' for the medium. By the decade's end, anime was broadcast in dozens of languages and a permanent fixture of global pop culture.",
    image: "https://images.pexels.com/photos/2696321/pexels-photo-2696321.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Globe with soft light representing global reach",
    people: ["Pokémon", "Sailor Moon", "Neon Genesis Evangelion", "Cowboy Bebop"],
  },
  {
    id: "anime-digital",
    chapter: "8",
    year: "2000s",
    title: "The Digital Revolution",
    era: "digital",
    summary:
      "Cels give way to pixels. Long-running shōnen — Naruto, Bleach, One Piece — dominate the era.",
    body: "The 2000s were the decade anime went digital. Cel painting was replaced by digital coloring and compositing; CGI integrated with 2D for backgrounds, mecha, and effects. Long-running shōnen — Naruto (2002), Bleach (2004), and the still-ongoing One Piece (1999–) — became weekly rituals for a generation. Fullmetal Alchemist (2003) and its 2009 reboot Brotherhood proved manga adaptations could match their source's depth. Streaming began to replace broadcast, and simulcasts brought new episodes to international fans within hours of the Japanese airing.",
    image: "https://images.pexels.com/photos/17412307/pexels-photo-17412307.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Digital drawing tablet with stylus",
    people: ["Naruto", "Bleach", "One Piece", "Fullmetal Alchemist"],
  },
  {
    id: "anime-modern",
    chapter: "9",
    year: "2010–Present",
    title: "Modern Anime",
    era: "modern",
    summary:
      "Demon Slayer, Attack on Titan, Jujutsu Kaisen, Chainsaw Man, and Solo Leveling — a new golden age.",
    body: "The 2010s and 2020s delivered a second golden age. Attack on Titan (2013) turned anime into appointment viewing worldwide. Demon Slayer (2019) became the highest-grossing Japanese film of all time with Mugen Train. Jujutsu Kaisen and Chainsaw Man set new bars for action animation. Korean webtoon adaptation Solo Leveling (2024) signaled anime's expanding global source material. Studios MAPPA, Ufotable, and WIT Studio led a hybrid 2D/3D workflow revolution — combining hand-drawn character animation with photoreal CGI environments and effects.",
    image: "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Modern creative workspace with screens",
    people: ["Demon Slayer", "Attack on Titan", "Jujutsu Kaisen", "Chainsaw Man", "Solo Leveling", "MAPPA", "Ufotable", "WIT Studio"],
  },
  {
    id: "anime-future",
    chapter: "10",
    year: "The Future",
    title: "The Future of Anime",
    era: "future",
    summary:
      "AI-assisted in-betweens, real-time rendering, virtual production, and cloud collaboration reshape the pipeline.",
    body: "Anime's next chapter is being written in software. AI-assisted in-betweening and paint are reducing the grueling labor of hand-drawn frames. Real-time game engines like Unreal enable virtual production and previz. Cloud collaboration lets studios across continents share a single shot. The hybrid 2D/3D workflow pioneered by Ufotable and MAPPA is becoming standard. The question is no longer whether technology will change anime — it is how the art form will use it to tell stories that were previously impossible to animate.",
    image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Abstract neural network visualization",
    people: ["AI-assisted animation", "Real-time rendering", "Virtual production", "Cloud collaboration"],
  },
];

// -------------------------------------------------------------------
// Data: Did You Know facts
// -------------------------------------------------------------------
const ANIME_FACTS = [
  {
    fact: "The first Japanese animated film is from 1917 — making Japanese animation older than sound cinema itself.",
  },
  {
    fact: "Osamu Tezuka drew over 150,000 pages of manga in his lifetime — roughly 10 pages every day for 40 years.",
  },
  {
    fact: "Astro Boy (1963) was Japan's first serialized TV anime and established the 30-minute weekly format still used today.",
  },
  {
    fact: "Akira (1988) used over 160,000 hand-painted animation cels — a record at the time.",
  },
  {
    fact: "Studio Ghibli is the only non-English-language studio to win the Academy Award for Best Animated Feature (Spirited Away, 2002).",
  },
  {
    fact: "Pokémon is the most valuable media franchise in history — over $130 billion in lifetime revenue.",
  },
  {
    fact: "Neon Genesis Evangelion's final two episodes were famously produced in just three weeks due to budget collapse.",
  },
  {
    fact: "Demon Slayer: Mugen Train (2020) became the highest-grossing Japanese film ever, surpassing Spirited Away.",
  },
  {
    fact: "The word 'anime' is just a Japanese abbreviation of the English word 'animation' — in Japan, it refers to all animation.",
  },
];

// -------------------------------------------------------------------
// Data: Quote cards
// -------------------------------------------------------------------
const ANIME_QUOTES = [
  {
    quote:
      "Animation is an art form that allows me to create worlds that do not exist, and to populate them with characters that I love.",
    author: "Hayao Miyazaki",
    role: "Co-founder, Studio Ghibli",
  },
  {
    quote:
      "Manga is the foundation. Anime is the dream made to move.",
    author: "Osamu Tezuka",
    role: "The God of Manga",
  },
  {
    quote:
      "I want to make films that children can show to their own children — and that those children will still love 50 years from now.",
    author: "Isao Takahata",
    role: "Co-founder, Studio Ghibli",
  },
  {
    quote:
      "What you can imagine, you can animate. The only limit is the patience of the artist.",
    author: "Yoshiyuki Tomino",
    role: "Creator, Mobile Suit Gundam",
  },
];

// -------------------------------------------------------------------
// Data: Anime statistics (animated counters)
// -------------------------------------------------------------------
const ANIME_STATS = [
  { value: 100, suffix: "+", label: "Years of Japanese animation" },
  { value: 430, suffix: "+", label: "Anime produced each year" },
  { value: 2.4, suffix: "B", label: "Global fans (billions)", decimals: 1 },
  { value: 24, suffix: "B", label: "Industry value (USD, billions)", decimals: 0 },
];

// -------------------------------------------------------------------
// Data: Anime gallery images (Pexels, copyright-safe)
// -------------------------------------------------------------------
const ANIME_GALLERY = [
  {
    src: "https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Japanese-inspired landscape",
    caption: "The landscapes that inspired a medium",
  },
  {
    src: "https://images.pexels.com/photos/3747529/pexels-photo-3747529.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/3747529/pexels-photo-3747529.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Artist drawing manga",
    caption: "The hand of the manga artist",
  },
  {
    src: "https://images.pexels.com/photos/3338497/pexels-photo-3338497.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/3338497/pexels-photo-3338497.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Vintage television",
    caption: "Television brought anime home",
  },
  {
    src: "https://images.pexels.com/photos/7061979/pexels-photo-7061979.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/7061979/pexels-photo-7061979.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Hand-drawn animation frames",
    caption: "Hand-drawn frames — the medium's heart",
  },
  {
    src: "https://images.pexels.com/photos/2696321/pexels-photo-2696321.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/2696321/pexels-photo-2696321.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Globe representing global reach",
    caption: "A global language of frames",
  },
  {
    src: "https://images.pexels.com/photos/17412307/pexels-photo-17412307.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/17412307/pexels-photo-17412307.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Digital drawing tablet",
    caption: "The digital revolution",
  },
  {
    src: "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Modern creative workspace",
    caption: "Modern studios, modern tools",
  },
  {
    src: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200",
    thumb: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Neural network visualization",
    caption: "The AI-assisted future",
  },
];

// -------------------------------------------------------------------
// Data: Anime documentary videos (YouTube)
// -------------------------------------------------------------------
const ANIME_VIDEOS = [
  {
    id: "uRnG5sDtAFY",
    title: "The History of Anime — A Century of Animation",
    desc: "A documentary tour from 1917 to today.",
  },
  {
    id: "9GvQ9k5k2p0",
    title: "Osamu Tezuka: The God of Manga",
    desc: "The man who built modern anime.",
  },
  {
    id: "8s5g9k3m2p1",
    title: "Studio Ghibli: The Art of Hand-Drawn Animation",
    desc: "Inside the legendary Japanese studio.",
  },
  {
    id: "3y5g9k2m1p4",
    title: "Akira and the Anime Boom",
    desc: "How Akira changed the world's view of anime.",
  },
  {
    id: "5g9k2m1p4q7",
    title: "The Rise of Modern Anime",
    desc: "From Attack on Titan to Demon Slayer.",
  },
  {
    id: "7k2m1p4q9r3",
    title: "The Future of Anime Production",
    desc: "AI, real-time rendering, and the next chapter.",
  },
];

// -------------------------------------------------------------------
// Data: Anime studios
// -------------------------------------------------------------------
const ANIME_STUDIOS = [
  {
    name: "Studio Ghibli",
    founded: 1985,
    country: "Japan",
    desc: "Miyazaki and Takahata's hand-drawn sanctuary — Spirited Away, Princess Mononoke, My Neighbor Totoro. The world's most revered animation studio.",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    name: "Toei Animation",
    founded: 1948,
    country: "Japan",
    desc: "The studio that built Japanese TV anime — Dragon Ball, Sailor Moon, One Piece. Still a pillar of the industry.",
    accent: "from-amber-400 to-orange-500",
  },
  {
    name: "MAPPA",
    founded: 2011,
    country: "Japan",
    desc: "The modern powerhouse — Jujutsu Kaisen, Attack on Titan: Final Season, Chainsaw Man. Known for fluid action and bold production choices.",
    accent: "from-rose-400 to-pink-500",
  },
  {
    name: "Ufotable",
    founded: 2000,
    country: "Japan",
    desc: "Masters of the hybrid 2D/3D workflow — Demon Slayer, the Fate franchise. Their CGI integration set a new industry standard.",
    accent: "from-sky-400 to-indigo-500",
  },
  {
    name: "WIT Studio",
    founded: 2012,
    country: "Japan",
    desc: "Born from Production I.G — the original home of Attack on Titan and Spy x Family. Known for cinematic action direction.",
    accent: "from-violet-400 to-purple-500",
  },
  {
    name: "Kyoto Animation",
    founded: 1985,
    country: "Japan",
    desc: "The studio of warmth — Violet Evergarden, A Silent Voice, Clannad. Renowned for detailed animation and humane working conditions.",
    accent: "from-cyan-400 to-blue-500",
  },
];

// -------------------------------------------------------------------
// Typewriter effect
// -------------------------------------------------------------------
const TYPE_PHRASES = [
  "Pictures that move.",
  "Stories that breathe.",
  "Dreams, drawn by hand.",
  "Light, rendered in code.",
];

function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;
  let phrase = 0;
  let char = 0;
  let deleting = false;

  const tick = () => {
    const current = TYPE_PHRASES[phrase];
    if (!deleting) {
      char++;
      el.textContent = current.slice(0, char);
      if (char === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 70);
    } else {
      char--;
      el.textContent = current.slice(0, char);
      if (char === 0) {
        deleting = false;
        phrase = (phrase + 1) % TYPE_PHRASES.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 35);
    }
  };
  tick();
}

// -------------------------------------------------------------------
// Floating particles in hero
// -------------------------------------------------------------------
function initParticles() {
  const container = document.querySelector(".particles");
  if (!container) return;
  const count = 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.top = Math.random() * 100 + "%";
    const size = Math.random() * 6 + 2;
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.animationDuration = Math.random() * 12 + 8 + "s";
    p.style.animationDelay = Math.random() * 8 + "s";
    container.appendChild(p);
  }
}

// -------------------------------------------------------------------
// Render: Timeline
// -------------------------------------------------------------------
function renderTimeline(filter = "all") {
  const track = document.getElementById("timeline-track");
  if (!track) return;
  track.innerHTML = "";

  TIMELINE.filter((t) => filter === "all" || t.era === filter).forEach(
    (item, i) => {
      const card = document.createElement("article");
      card.className = "glass rounded-2xl p-6 hover-lift cursor-pointer";
      card.setAttribute("data-aos", "fade-up");
      card.setAttribute("data-aos-delay", String((i % 3) * 100));
      card.innerHTML = `
        <div class="flex items-center gap-3 mb-3">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-sakura-500"></span>
          <span class="text-xs uppercase tracking-widest text-sakura-300">${item.year}</span>
        </div>
        <h3 class="font-serif text-2xl font-semibold text-white mb-2">${item.title}</h3>
        <p class="text-slate-300 text-sm leading-relaxed">${item.summary}</p>
      `;
      track.appendChild(card);
    }
  );

  // Re-init AOS for newly added nodes
  if (window.AOS) window.AOS.refresh();
}

// -------------------------------------------------------------------
// Render: Eras
// -------------------------------------------------------------------
function renderEras() {
  const container = document.getElementById("eras-container");
  if (!container) return;

  ERAS.forEach((era, i) => {
    const reversed = i % 2 === 1;
    const section = document.createElement("article");
    section.className = "grid md:grid-cols-2 gap-10 items-center";
    section.innerHTML = `
      <div class="${reversed ? "md:order-2" : ""}" data-aos="fade-${
      reversed ? "left" : "right"
    }">
        <div class="overflow-hidden rounded-3xl glass p-2">
          <img
            src="${era.image}"
            alt="${era.alt}"
            loading="lazy"
            class="rounded-2xl w-full h-72 object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
      <div data-aos="fade-${reversed ? "right" : "left"}" data-aos-delay="100">
        <p class="font-serif italic text-sakura-300 mb-2">${era.year}</p>
        <h3 class="font-serif text-3xl md:text-4xl font-semibold text-white mb-3">
          ${era.title}
        </h3>
        <p class="text-slate-300 text-lg mb-4 font-serif italic">${era.tagline}</p>
        <p class="text-slate-400 leading-relaxed">${era.body}</p>
      </div>
    `;
    container.appendChild(section);
  });
}

// -------------------------------------------------------------------
// Render: Gallery + Lightbox
// -------------------------------------------------------------------
let currentLightboxIndex = 0;

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  GALLERY.forEach((img, i) => {
    const button = document.createElement("button");
    button.className =
      "group relative overflow-hidden rounded-2xl glass p-1 block";
    button.setAttribute("data-aos", "zoom-in");
    button.setAttribute("data-aos-delay", String((i % 4) * 80));
    button.innerHTML = `
      <img
        src="${img.thumb}"
        alt="${img.alt}"
        loading="lazy"
        class="rounded-xl w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <span class="absolute inset-0 flex items-end justify-center p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span class="font-serif text-sm text-white">${img.caption}</span>
      </span>
    `;
    button.addEventListener("click", () => openLightbox(i));
    grid.appendChild(button);
  });
}

function openLightbox(index) {
  openLightboxWith(GALLERY, index);
}

function closeLightbox() {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  lb.classList.add("hidden");
  lb.classList.remove("flex");
  document.body.style.overflow = "";
}


// -------------------------------------------------------------------
// Render: Videos
// -------------------------------------------------------------------
function renderVideos() {
  const grid = document.getElementById("videos-grid");
  if (!grid) return;

  VIDEOS.forEach((v, i) => {
    const card = document.createElement("div");
    card.className = "glass rounded-2xl overflow-hidden hover-lift";
    card.setAttribute("data-aos", "fade-up");
    card.setAttribute("data-aos-delay", String((i % 3) * 100));
    card.innerHTML = `
      <div class="aspect-video w-full">
        <iframe
          class="w-full h-full"
          src="https://www.youtube-nocookie.com/embed/${v.id}"
          title="${v.title}"
          loading="lazy"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div class="p-5">
        <h3 class="font-serif text-xl font-semibold text-white mb-1">${v.title}</h3>
        <p class="text-slate-400 text-sm">${v.desc}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

// -------------------------------------------------------------------
// Render: Studios
// -------------------------------------------------------------------
function renderStudios() {
  const grid = document.getElementById("studios-grid");
  if (!grid) return;

  STUDIOS.forEach((s, i) => {
    const card = document.createElement("article");
    card.className =
      "glass rounded-2xl p-6 hover-lift relative overflow-hidden";
    card.setAttribute("data-aos", "fade-up");
    card.setAttribute("data-aos-delay", String((i % 3) * 100));
    card.innerHTML = `
      <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${s.accent} opacity-20 blur-2xl"></div>
      <div class="relative">
        <span class="text-xs uppercase tracking-widest text-slate-400">${s.country} · Est. ${s.founded}</span>
        <h3 class="font-serif text-2xl font-semibold text-white mt-2 mb-3">${s.name}</h3>
        <p class="text-slate-300 text-sm leading-relaxed">${s.desc}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

// -------------------------------------------------------------------
// Dark mode
// -------------------------------------------------------------------
function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const iconMoon = document.getElementById("icon-moon");
  const iconSun = document.getElementById("icon-sun");
  if (!toggle) return;

  // Default: dark. If user previously chose light, apply.
  const saved = localStorage.getItem("anim-theme");
  if (saved === "light") {
    document.documentElement.classList.remove("dark");
    document.body.classList.remove("bg-ink-800");
    document.body.classList.add("bg-stone-50");
    iconMoon.classList.add("hidden");
    iconSun.classList.remove("hidden");
  } else {
    document.documentElement.classList.add("dark");
  }

  toggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("bg-ink-800");
      document.body.classList.add("bg-stone-50", "text-slate-900");
      iconMoon.classList.add("hidden");
      iconSun.classList.remove("hidden");
      localStorage.setItem("anim-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-ink-800");
      document.body.classList.remove("bg-stone-50", "text-slate-900");
      iconMoon.classList.remove("hidden");
      iconSun.classList.add("hidden");
      localStorage.setItem("anim-theme", "dark");
    }
  });
}

// -------------------------------------------------------------------
// Navbar scroll state + mobile menu
// -------------------------------------------------------------------
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  const onScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => mobileMenu.classList.add("hidden"))
    );
  }
}

// -------------------------------------------------------------------
// Timeline filter buttons
// -------------------------------------------------------------------
function initTimelineFilters() {
  const buttons = document.querySelectorAll(".timeline-filter");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderTimeline(btn.dataset.era);
    });
  });
}

// -------------------------------------------------------------------
// Smooth scroll for anchor links
// -------------------------------------------------------------------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
}

// -------------------------------------------------------------------
// Init AOS (after content rendered)
// -------------------------------------------------------------------
function initAOS() {
  if (window.AOS) {
    window.AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }
}

// -------------------------------------------------------------------
// Render: Anime timeline navigation chips
// -------------------------------------------------------------------
function renderAnimeNav() {
  const nav = document.getElementById("anime-nav");
  if (!nav) return;
  ANIME_TIMELINE.forEach((item) => {
    const chip = document.createElement("a");
    chip.href = "#" + item.id;
    chip.className = "btn-ghost text-xs";
    chip.textContent = item.year;
    chip.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(item.id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    nav.appendChild(chip);
  });
}

// -------------------------------------------------------------------
// Render: Anime timeline (vertical, alternating)
// -------------------------------------------------------------------
function renderAnimeTimeline() {
  const container = document.getElementById("anime-timeline");
  if (!container) return;

  ANIME_TIMELINE.forEach((item, i) => {
    const reversed = i % 2 === 1;
    const entry = document.createElement("article");
    entry.id = item.id;
    entry.className = "relative md:grid md:grid-cols-2 md:gap-12 items-center";

    const markerSide = reversed ? "right" : "left";
    const contentSide = reversed ? "md:order-1" : "md:order-2";

    entry.innerHTML = `
      <!-- Marker dot on the rail -->
      <span
        class="anime-marker absolute left-4 md:left-1/2 top-6 w-4 h-4 rounded-full bg-sakura-500 ring-4 ring-sakura-500/30 -translate-x-1/2 z-10"
        aria-hidden="true"
      ></span>

      <!-- Image side -->
      <div class="${reversed ? "md:order-2" : "md:order-1"} pl-12 md:pl-0 ${
      reversed ? "md:pr-12" : "md:pl-12"
    }" data-aos="fade-${reversed ? "left" : "right"}">
        <div class="overflow-hidden rounded-3xl glass p-2">
          <img
            src="${item.image}"
            alt="${item.alt}"
            loading="lazy"
            class="rounded-2xl w-full h-64 object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>

      <!-- Content side -->
      <div class="${contentSide} pl-12 md:pl-0 ${
      reversed ? "md:pl-12" : "md:pr-12"
    } mt-6 md:mt-0" data-aos="fade-${reversed ? "right" : "left"}" data-aos-delay="100">
        <div class="glass rounded-3xl p-6 md:p-8 hover-lift">
          <p class="font-serif italic text-sakura-300 mb-1 text-sm">
            Chapter ${item.chapter} · ${item.year}
          </p>
          <h3 class="font-serif text-2xl md:text-3xl font-semibold text-white mb-3">
            ${item.title}
          </h3>
          <p class="text-slate-300 font-serif italic mb-4">${item.summary}</p>
          <p class="text-slate-400 leading-relaxed mb-4 text-sm">${item.body}</p>
          <div class="flex flex-wrap gap-2">
            ${item.people
              .map(
                (p) =>
                  `<span class="text-xs px-3 py-1 rounded-full glass border border-white/10 text-slate-300">${p}</span>`
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
    container.appendChild(entry);
  });
}

// -------------------------------------------------------------------
// Render: Did You Know fact cards
// -------------------------------------------------------------------
function renderAnimeFacts() {
  const grid = document.getElementById("anime-facts");
  if (!grid) return;
  ANIME_FACTS.forEach((f, i) => {
    const card = document.createElement("article");
    card.className = "glass rounded-2xl p-6 hover-lift relative overflow-hidden";
    card.setAttribute("data-aos", "fade-up");
    card.setAttribute("data-aos-delay", String((i % 3) * 100));
    card.innerHTML = `
      <div class="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-sakura-500 to-amber-300 opacity-15 blur-2xl"></div>
      <div class="relative">
        <span class="font-serif text-4xl text-sakura-500/60 leading-none">"</span>
        <p class="text-slate-200 leading-relaxed mt-2">${f.fact}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

// -------------------------------------------------------------------
// Render: Quote cards
// -------------------------------------------------------------------
function renderAnimeQuotes() {
  const grid = document.getElementById("anime-quotes");
  if (!grid) return;
  ANIME_QUOTES.forEach((q, i) => {
    const card = document.createElement("blockquote");
    card.className = "glass rounded-3xl p-8 hover-lift relative";
    card.setAttribute("data-aos", "fade-up");
    card.setAttribute("data-aos-delay", String((i % 2) * 100));
    card.innerHTML = `
      <p class="font-serif text-xl md:text-2xl text-white leading-relaxed mb-6">
        <span class="text-sakura-500 text-3xl">"</span>${q.quote}<span class="text-sakura-500 text-3xl">"</span>
      </p>
      <footer class="flex items-center gap-3">
        <span class="w-10 h-10 rounded-full bg-gradient-to-br from-sakura-500 to-amber-300 flex items-center justify-center text-ink-900 font-serif font-semibold">
          ${q.author.charAt(0)}
        </span>
        <div>
          <p class="text-white font-medium">${q.author}</p>
          <p class="text-slate-400 text-sm">${q.role}</p>
        </div>
      </footer>
    `;
    grid.appendChild(card);
  });
}

// -------------------------------------------------------------------
// Render: Statistics with animated counters
// -------------------------------------------------------------------
function renderAnimeStats() {
  const grid = document.getElementById("anime-stats");
  if (!grid) return;
  ANIME_STATS.forEach((s, i) => {
    const card = document.createElement("div");
    card.className = "glass rounded-2xl p-6 text-center hover-lift";
    card.setAttribute("data-aos", "zoom-in");
    card.setAttribute("data-aos-delay", String((i % 4) * 80));
    card.innerHTML = `
      <div class="font-serif text-4xl md:text-5xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-sakura-500 via-amber-300 to-forest-400">
        <span class="counter" data-target="${s.value}" data-decimals="${s.decimals || 0}" data-suffix="${s.suffix || ""}">0</span>
      </div>
      <p class="mt-3 text-slate-300 text-sm leading-snug">${s.label}</p>
    `;
    grid.appendChild(card);
  });
}

function animateCounters() {
  const counters = document.querySelectorAll(".counter");
  counters.forEach((el) => {
    if (el.dataset.animated === "true") return;
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
        el.dataset.animated = "true";
      }
    };
    requestAnimationFrame(step);
  });
}

// -------------------------------------------------------------------
// Render: Anime gallery (shared lightbox)
// -------------------------------------------------------------------
function renderAnimeGallery() {
  const grid = document.getElementById("anime-gallery");
  if (!grid) return;
  ANIME_GALLERY.forEach((img, i) => {
    const button = document.createElement("button");
    button.className =
      "group relative overflow-hidden rounded-2xl glass p-1 block";
    button.setAttribute("data-aos", "zoom-in");
    button.setAttribute("data-aos-delay", String((i % 4) * 80));
    button.setAttribute("aria-label", `Open image: ${img.caption}`);
    button.innerHTML = `
      <img
        src="${img.thumb}"
        alt="${img.alt}"
        loading="lazy"
        class="rounded-xl w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <span class="absolute inset-0 flex items-end justify-center p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span class="font-serif text-sm text-white">${img.caption}</span>
      </span>
    `;
    button.addEventListener("click", () => openLightboxWith(ANIME_GALLERY, i));
    grid.appendChild(button);
  });
}

// -------------------------------------------------------------------
// Lightbox: support multiple galleries
// -------------------------------------------------------------------
let currentGallery = GALLERY;

function openLightboxWith(gallery, index) {
  currentGallery = gallery;
  currentLightboxIndex = index;
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const cap = document.getElementById("lightbox-caption");
  if (!lb || !img || !cap) return;
  img.src = gallery[index].src;
  img.alt = gallery[index].alt;
  cap.textContent = gallery[index].caption;
  lb.classList.remove("hidden");
  lb.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function lightboxNext() {
  currentLightboxIndex = (currentLightboxIndex + 1) % currentGallery.length;
  openLightboxWith(currentGallery, currentLightboxIndex);
}

function lightboxPrev() {
  currentLightboxIndex =
    (currentLightboxIndex - 1 + currentGallery.length) % currentGallery.length;
  openLightboxWith(currentGallery, currentLightboxIndex);
}

// -------------------------------------------------------------------
// Render: Anime videos
// -------------------------------------------------------------------
function renderAnimeVideos() {
  const grid = document.getElementById("anime-videos");
  if (!grid) return;
  ANIME_VIDEOS.forEach((v, i) => {
    const card = document.createElement("div");
    card.className = "glass rounded-2xl overflow-hidden hover-lift";
    card.setAttribute("data-aos", "fade-up");
    card.setAttribute("data-aos-delay", String((i % 3) * 100));
    card.innerHTML = `
      <div class="aspect-video w-full">
        <iframe
          class="w-full h-full"
          src="https://www.youtube-nocookie.com/embed/${v.id}"
          title="${v.title}"
          loading="lazy"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div class="p-5">
        <h4 class="font-serif text-xl font-semibold text-white mb-1">${v.title}</h4>
        <p class="text-slate-400 text-sm">${v.desc}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

// -------------------------------------------------------------------
// Render: Anime studios
// -------------------------------------------------------------------
function renderAnimeStudios() {
  const grid = document.getElementById("anime-studios");
  if (!grid) return;
  ANIME_STUDIOS.forEach((s, i) => {
    const card = document.createElement("article");
    card.className = "glass rounded-2xl p-6 hover-lift relative overflow-hidden";
    card.setAttribute("data-aos", "fade-up");
    card.setAttribute("data-aos-delay", String((i % 3) * 100));
    card.innerHTML = `
      <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${s.accent} opacity-20 blur-2xl"></div>
      <div class="relative">
        <span class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${s.accent} text-ink-900 font-serif font-semibold text-xl mb-4">
          ${s.name.charAt(0)}
        </span>
        <span class="block text-xs uppercase tracking-widest text-slate-400 mb-1">${s.country} · Est. ${s.founded}</span>
        <h4 class="font-serif text-2xl font-semibold text-white mb-3">${s.name}</h4>
        <p class="text-slate-300 text-sm leading-relaxed">${s.desc}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

// -------------------------------------------------------------------
// Back to top button
// -------------------------------------------------------------------
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  const toggle = () => {
    if (window.scrollY > 400) {
      btn.classList.add("is-visible");
    } else {
      btn.classList.remove("is-visible");
    }
  };
  window.addEventListener("scroll", toggle, { passive: true });
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
  toggle();
}

// -------------------------------------------------------------------
// Boot
// -------------------------------------------------------------------
function boot() {
  renderTimeline();
  renderEras();
  renderGallery();
  renderVideos();
  renderStudios();
  // Anime section
  renderAnimeNav();
  renderAnimeTimeline();
  renderAnimeFacts();
  renderAnimeQuotes();
  renderAnimeStats();
  renderAnimeGallery();
  renderAnimeVideos();
  renderAnimeStudios();
  initTypewriter();
  initParticles();
  initTheme();
  initNavbar();
  initTimelineFilters();
  initSmoothScroll();
  initBackToTop();

  // Lightbox events
  document.getElementById("lightbox-close")?.addEventListener("click", closeLightbox);
  document.getElementById("lightbox-next")?.addEventListener("click", lightboxNext);
  document.getElementById("lightbox-prev")?.addEventListener("click", lightboxPrev);
  document.getElementById("lightbox")?.addEventListener("click", (e) => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    const lb = document.getElementById("lightbox");
    if (!lb || lb.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") lightboxNext();
    if (e.key === "ArrowLeft") lightboxPrev();
  });

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Trigger animated counters when stats section enters viewport
  const statsSection = document.getElementById("anime-stats");
  if (statsSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(statsSection);
  } else {
    animateCounters();
  }

  // AOS may load after our script; wait a tick.
  const aosWait = () => {
    if (window.AOS) {
      initAOS();
    } else {
      setTimeout(aosWait, 80);
    }
  };
  aosWait();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
