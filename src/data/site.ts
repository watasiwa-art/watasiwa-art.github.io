// Every word on this site comes from this file. Placeholders to replace are
// marked TODO: the name, the email, the social links and the studio credits.

export type SceneId = 'wind' | 'neon' | 'rooftop' | 'run' | 'sky' | 'model' | 'portrait'

export const site = {
  name: 'Nirob Nahian Ahmmed',
  navName: 'Nirob',
  nameJp: 'ニロブ・ナヒアン・アーメド',
  heroName: ['Nirob', 'Nahian'], // the hero sets these on separate lines
  role: '2D animator',
  roleDetail: 'Key animation · In-betweens · Character design',
  roleJp: '原画・動画・キャラクターデザイン',
  location: 'Dhaka',
  timezone: 'Asia/Dhaka',
  target: 'Tokyo',
  email: 'nirobnahianahmmed@gmail.com',
  available: true,
  availability: 'Open to a studio position',
  intro:
    'I draw the frames between the poses, and the ones that make the pose land. Self-taught, four years in, looking for a seat in a Japanese animation studio — starting wherever a studio needs hands.',
  heroNote: 'Dhaka → Tokyo. 24 frames a second, no shortcuts.',
  socials: [{ label: 'X', href: 'https://x.com/nirob_oan' }],
  marquee: [
    '原画 Key animation',
    '動画 In-betweens',
    'キャラクターデザイン Character design',
    'レイアウト Layout',
    '絵コンテ Storyboard',
    '撮影 Compositing',
  ],
  facts: [
    { label: 'Based in', value: 'Dhaka, BD' },
    { label: 'Relocating to', value: 'Tokyo, JP' },
    { label: 'Japanese', value: 'JLPT N3' },
    { label: 'Software', value: 'CSP · TVPaint · RETAS' },
  ],
  // Your own artwork. Put the files in public/art/ and set the path here —
  // a path replaces the drawn placeholder everywhere that image appears.
  images: {
    hero: '', // e.g. '/art/hero.jpg' — 16:9, 1600px or wider
    portrait: '', // e.g. '/art/portrait.jpg' — 4:5
  },
}

export interface Project {
  slug: string
  title: string
  titleJp: string
  category: string
  categoryJp: string
  year: string
  cut: string
  scene: SceneId
  image?: string
  tint: string
  summary: string
  role: string[]
  specs: Array<[string, string]>
  body: string[]
  frames: Array<{
    label: string
    jp: string
    zoom: number
    origin: string
    caption: string
    image?: string
  }>
  size: 'large' | 'small'
}

// These six are personal studies, not production credits. If you have real
// studio work, replace the titles, roles, years and body copy — and change the
// "personal studies" line in the work section header on the home page.
export const projects: Project[] = [
  {
    slug: 'windward',
    title: 'Windward',
    titleJp: '風上の少女',
    category: 'Key animation',
    categoryJp: '原画',
    year: '2026',
    cut: 'C-012',
    scene: 'wind',
    // image: '/art/windward.jpg', // replace the drawn cut with your own frame
    tint: '#2a1420',
    summary:
      'A two-minute personal short about a girl who climbs a hill to feel the weather change: boards, layouts, genga and timing, all drawn alone.',
    role: ['Key animation', 'Layout', 'In-betweens, cuts 4–9'],
    specs: [
      ['Format', '16:9 · 24 fps'],
      ['Cuts', '48'],
      ['Drawings', '1,240'],
      ['Runtime', '2 min 10 s'],
      ['Tools', 'Clip Studio Paint, After Effects'],
    ],
    body: [
      'A girl climbs a hill to meet the weather. That is the whole story: no dialogue, one location, and about ninety seconds of wind that has to feel like it is pushing back.',
      'I boarded it myself, laid out the hill and the horizon so the camera could stay low, then animated the turn on twos. The hair and the scarf are the acting — they lead the body by two frames, which is the only trick in the whole cut.',
      '1,240 drawings, four months of evenings, and one hard-won lesson: a held pose with moving cloth reads as animation even when nothing else moves.',
    ],
    frames: [
      { label: 'Genga 01', jp: '原画：振り向き', zoom: 1.35, origin: '42% 46%', caption: 'The turn. Two key poses, six in-betweens, and a three-frame hold on the eyes.' },
      { label: 'Douga 02', jp: '動画：布の先行', zoom: 1.7, origin: '62% 50%', caption: 'Cloth leading the shoulder. The scarf is two frames ahead of the arm all the way through.' },
      { label: 'Shiage 03', jp: '仕上げ・撮影', zoom: 1.15, origin: '55% 38%', caption: 'Colour and comp: one light source, warm rim, grain at 4%.' },
    ],
    size: 'large',
  },
  {
    slug: 'neon-district',
    title: 'Neon District',
    titleJp: 'ネオン街',
    category: 'Background art',
    categoryJp: '美術',
    year: '2026',
    cut: 'BG-07',
    scene: 'neon',
    tint: '#101828',
    summary:
      'A rain-soaked alley study in perspective and wet light: three vanishing points, twenty-three signs, and a puddle that had to reflect more than the street did.',
    role: ['Background art', 'Colour design'],
    specs: [
      ['Format', '16:9 · digital painting'],
      ['Signs painted', '23'],
      ['Layers', '41'],
      ['Tools', 'Photoshop, After Effects'],
    ],
    body: [
      'A back-alley study in perspective and wet light. Three vanishing points, twenty-three signs, and a puddle that had to reflect more than the street did.',
      'Painting this was an exercise in restraint: the neon does the colour work, so everything else stays close to black. The rain sits on its own layer at 12 frames, deliberately slower than the flicker.',
      'I keep coming back to this file when I need to remember that background art is not decoration — it is the reason the character looks like they live somewhere.',
    ],
    frames: [
      { label: 'Rough 01', jp: '下書き：消失点', zoom: 1.3, origin: '50% 55%', caption: 'Three-point setup, drawn over the photo reference before any colour.' },
      { label: 'Paint 02', jp: '彩色：濡れた光', zoom: 1.8, origin: '28% 62%', caption: 'Wet street. Every light has a reflection, and every reflection is dirtier than its source.' },
      { label: 'Comp 03', jp: '撮影：雨', zoom: 1.2, origin: '70% 40%', caption: 'Rain, bloom and a slow push-in. The signs flicker on an eight-frame cycle.' },
    ],
    size: 'small',
  },
  {
    slug: 'rooftop-0340',
    title: 'Rooftop, 03:40',
    titleJp: '屋上の午前三時',
    category: 'Storyboard & layout',
    categoryJp: '絵コンテ',
    year: '2025',
    cut: 'SC-22',
    scene: 'rooftop',
    tint: '#141a2c',
    summary:
      'A one-page board for a scene with no dialogue: two people on a roof at three in the morning, one of them about to say something and not saying it.',
    role: ['Storyboard', 'Layout', 'Timing'],
    specs: [
      ['Format', '16:9 · 6 panels'],
      ['Cuts', '1'],
      ['Duration', '38 s'],
      ['Tools', 'Red pencil, Clip Studio Paint'],
    ],
    body: [
      'The tension is in the cutting, not the drawing. Six panels, two of them held too long on purpose, and one cut where the camera refuses to move while the character does.',
      'The city is a silhouette with a few hundred careless windows. The figure is barely twelve lines. Everything that matters is in the negative space between them.',
      'Drawn in about four hours with a red pencil and a ruler, then cleaned up digitally. I like boards that already tell you the timing.',
    ],
    frames: [
      { label: 'Panel 02', jp: '絵コンテ：沈黙', zoom: 1.4, origin: '45% 55%', caption: 'The wide hold. Nothing moves for two and a half seconds except the wires.' },
      { label: 'Panel 04', jp: 'レイアウト：視線', zoom: 1.9, origin: '30% 45%', caption: 'Screen direction: she looks frame-left, the city fills frame-right, the cut never turns around.' },
      { label: 'Panel 06', jp: '撮影：月', zoom: 1.25, origin: '72% 25%', caption: 'Moon at f/2. The last panel is the only one with a light source in frame.' },
    ],
    size: 'small',
  },
  {
    slug: 'sprint',
    title: 'Sprint',
    titleJp: '疾走',
    category: 'In-between animation',
    categoryJp: '動画',
    year: '2025',
    cut: 'C-08',
    scene: 'run',
    tint: '#efe3cf',
    summary:
      'A run cycle studied honestly and then broken on purpose: thirty-two drawings, timed on twos, with a smear frame where the foot comes down.',
    role: ['In-betweens', 'Cleanup', 'Timing'],
    specs: [
      ['Format', '16:9 · 24 fps'],
      ['Drawings', '32'],
      ['Timing', '2s and 3s'],
      ['Cycle', '12 frames'],
    ],
    body: [
      'The first pass was anatomically correct and completely dead. The fix was spacing, not drawing: the same poses, redistributed so the contact is almost a hold and the recovery is three frames long.',
      'Thirty-two drawings on twos, cleaned up by hand, with one deliberately broken frame at the plant. That smear is the difference between a diagram of a run and a run.',
      'This is the cut I send when a studio asks whether I can handle action. It is less a portfolio piece than a stress test.',
    ],
    frames: [
      { label: 'Key 01', jp: '原画：接地', zoom: 1.5, origin: '56% 60%', caption: 'Contact pose. The weight is on the front foot and the head is already ahead of it.' },
      { label: 'Douga 02', jp: '動画：中割り', zoom: 1.85, origin: '50% 50%', caption: 'In-betweens on twos, volume held through the hip.' },
      { label: 'Smear 03', jp: '流し：一コマ', zoom: 1.3, origin: '62% 66%', caption: 'One frame of smear at the plant. Nobody sees it; everybody feels it.' },
    ],
    size: 'large',
  },
  {
    slug: 'skyward',
    title: 'Skyward',
    titleJp: '空へ',
    category: 'Background art',
    categoryJp: '美術',
    year: '2024',
    cut: 'BG-03',
    scene: 'sky',
    tint: '#bfd9e8',
    summary:
      'Sixteen paintings of the same sky at different hours, for a short that never got finished — and one aeroplane that keeps not arriving.',
    role: ['Background art', 'Colour scripts'],
    specs: [
      ['Format', '16:9 · digital painting'],
      ['Studies', '16'],
      ['Layers', '5 per study'],
      ['Tools', 'Photoshop, After Effects'],
    ],
    body: [
      'Cloud studies for a short that never got finished: sixteen paintings of the same sky at different hours, and one aeroplane that keeps not arriving.',
      'Hand-painted with a five-brush setup, then comped with a slow parallax so the layers separate as the camera drifts. The clouds move at three different speeds, which is the whole illusion.',
      'I still use these as lighting references. The rule I learned here: the horizon is never the brightest thing — the cloud edge is.',
    ],
    frames: [
      { label: 'Study 04', jp: '朝：層雲', zoom: 1.4, origin: '40% 62%', caption: 'Morning. Three layers, one light direction, nothing saturated.' },
      { label: 'Study 11', jp: '夕：反射', zoom: 1.8, origin: '66% 58%', caption: 'Late light bouncing off the underside of the deck.' },
      { label: 'Comp 16', jp: '撮影：飛行機', zoom: 1.2, origin: '50% 30%', caption: 'The plane, one pixel wide, crossing in eleven seconds.' },
    ],
    size: 'small',
  },
  {
    slug: 'model-kaede',
    title: 'Model sheet — Kaede',
    titleJp: 'キャラクター設定：カエデ',
    category: 'Character design',
    categoryJp: 'キャラクターデザイン',
    year: '2024',
    cut: 'DESIGN-01',
    scene: 'model',
    tint: '#efe9dd',
    summary:
      'A turnaround and expression set for a character who is always slightly too cold: a girl in an oversized coat who never quite looks at you.',
    role: ['Character design', 'Model sheet', 'Expression set'],
    specs: [
      ['Views', 'Front, 3/4, back'],
      ['Expressions', '6'],
      ['Proportions', '6.5 heads · 158 cm'],
      ['Tools', 'Clip Studio Paint'],
    ],
    body: [
      'Everything here is built to be drawn by someone else: six head heights, three views, consistent collar and cuff details, and a hair mass simple enough to hold in memory between cuts.',
      'I kept the silhouette plain on purpose — an oversized coat, one bag strap, hair that moves as one shape. A design that is easy to redraw is a design that survives an episode.',
      'The expression sheet is where the character actually appeared. Same face, six degrees of distance. That is the part I care about most in a model sheet.',
    ],
    frames: [
      { label: 'Sheet 01', jp: '設定：正面', zoom: 1.25, origin: '34% 44%', caption: 'Front. Construction lines left visible, six head heights marked.' },
      { label: 'Turn 02', jp: '設定：三面図', zoom: 1.7, origin: '62% 44%', caption: 'Three-quarter and back, with the coat hem falling on the same line in every view.' },
      { label: 'Face 03', jp: '表情：六種', zoom: 1.45, origin: '72% 82%', caption: 'Six expressions, one face. The eyes do the work; the mouth barely moves.' },
    ],
    size: 'small',
  },
]

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug)

export const reel = {
  title: 'Showreel',
  titleJp: '作品集',
  runtime: '01:12',
  year: '2026',
  note: 'Six cuts, no music budget, one borrowed track.',
  // Drop an MP4 in public/art/ and set the path: the reel player uses it
  // instead of cycling the six cuts. Keep it under ~20 MB so it streams fast.
  video: '', // e.g. '/art/reel.mp4'
  cover: '', // e.g. '/art/reel-cover.jpg' — 16:9 poster frame
}

export const process = [
  { jp: '絵コンテ', en: 'Storyboard', body: 'Read the scene. Decide what the audience is allowed to see, and when.' },
  { jp: 'レイアウト', en: 'Layout', body: 'Camera, perspective, character placement — the floor plan of the cut.' },
  { jp: '原画', en: 'Key animation', body: 'The extreme poses, and the timing chart that explains them to everyone else.' },
  { jp: '動画', en: 'In-betweens', body: 'The frames between, spaced so the movement reads at 24 frames a second.' },
  { jp: '仕上げ', en: 'Finishing', body: 'Clean lines, flat colour, and the shadow that puts the character in the room.' },
  { jp: '撮影', en: 'Compositing', body: 'Camera moves, light, grain. The last ten percent that sells the other ninety.' },
]

export const capabilities = [
  {
    title: 'Key animation',
    titleJp: '原画',
    body: 'The poses that carry a scene: the turn, the hit, the held breath. Timed on twos, with timing charts a second animator can actually follow.',
  },
  {
    title: 'In-between animation',
    titleJp: '動画',
    body: 'Clean, consistent in-betweens that hold volume and line weight, at whatever spacing the key animator asks for. Fast, and honest about when a cut needs another pass.',
  },
  {
    title: 'Character design',
    titleJp: 'キャラクターデザイン',
    body: 'Model sheets, turnarounds and expression sets built to survive being drawn by a whole episode’s worth of people.',
  },
  {
    title: 'Layout & storyboard',
    titleJp: 'レイアウト・絵コンテ',
    body: 'Camera, perspective and screen direction solved before a single frame is drawn, so the cut does not have to be fixed in compositing.',
  },
]

export const studioSpec = [
  {
    title: 'Software',
    titleJp: '使用ソフト',
    rows: [
      'Clip Studio Paint — daily',
      'TVPaint — roughs, cleanup',
      'RETAS Stylos — learning',
      'Toon Boom Harmony — working knowledge',
      'After Effects — compositing',
      'Photoshop — background paint',
    ],
  },
  {
    title: 'Language',
    titleJp: '言語',
    rows: [
      'Japanese — JLPT N3, studying for N2',
      'English — fluent',
      'Bengali — native',
      'Studio terms — 原画, 動画, 撮影, レイアウト',
    ],
  },
  {
    title: 'Logistics',
    titleJp: '条件',
    rows: [
      'Based in Dhaka (UTC+6)',
      'Ready to relocate to Tokyo',
      'Remote test cuts welcome',
      'Comfortable with studio naming conventions',
      'Open to starting in 動画',
    ],
  },
]

// TODO: replace these with your real counts and level.
export const stats = [
  { value: '1,240', label: 'drawings in one short' },
  { value: '48', label: 'cuts animated' },
  { value: 'N3', label: 'Japanese, aiming N2' },
]

// TODO: replace with real jobs, clients or studios.
export const experience = [
  {
    period: '2024 — now',
    title: 'Independent animation practice',
    detail: 'Personal shorts and cut studies — boarded, timed, cleaned up and composited alone',
  },
  {
    period: '2022 — 2024',
    title: 'Character art & illustration',
    detail: 'Model sheets, expression sets, and a long stubborn study of anatomy',
  },
  {
    period: '2019 — 2022',
    title: 'Self-taught, in public',
    detail: 'Daily drawing, animation courses, timing charts taped to the wall',
  },
]

export const about = {
  statement:
    'I would rather draw a hundred frames that move than one frame that impresses.',
  paragraphs: [
    'I am an animator, not an illustrator who occasionally animates. The part I care about is the movement: how a head turns, how weight shifts from one foot to the other, how a character can be read from a single silhouette at a glance.',
    'I learned this outside a studio, which means I learned it slowly and in the wrong order — illustration first, then timing, then layout. What it gave me is a habit of finishing things alone, on a deadline, without anyone standing behind me.',
    'Japan is the reason I started. Not one film in particular, but the fact that an entire industry decided drawing every frame was worth the cost. I want to work inside that standard, learn the naming and the workflow and the manners of a production line, and start wherever a studio needs hands.',
  ],
  why: [
    'Looking for a position in key animation or in-between animation, in Tokyo or remotely.',
    'Comfortable starting at 動画 and working up. I would rather earn the seat than be given it.',
    'Happy to take a paid or unpaid test cut, and to work to a studio’s own templates, layer names and file conventions.',
  ],
}
