# Watashiwa Art (私はART)

A premium, cinematic digital museum dedicated to the history of animation and Japanese anime — not a personal portfolio. Watashiwa Art walks visitors from 17th-century optical toys through the modern global anime industry, covering studios, creators, production pipeline, culture, and the future of the craft.

## Live structure

```
watashiwa-art/
├── index.html          # All page markup and content
├── style.css            # Full design system (dark, glassmorphism, cinematic)
├── script.js            # Loader, cursor, nav, GSAP ScrollTrigger reveals, Three.js hero field
├── favicon.ico           # Site icon (placeholder — replace with a final mark)
├── assets/
│   ├── images/          # Drop replacement imagery here (see MEDIA POLICY below)
│   ├── videos/          # Local video assets, if any (see MEDIA POLICY)
│   └── icons/           # UI icons / social icons
├── README.md
└── .gitignore
```

## Design system

- **Palette:** near-black backgrounds (`#05070A` / `#0F1117`) with glassmorphic surfaces, crimson (`#E63946`) and gold (`#D4AF37`) accents, electric blue and purple used sparingly for supporting categories.
- **Type:** Cinzel (display headlines), Noto Serif JP (Japanese accents/eyebrows), Inter (body copy), Space Grotesk (labels, data, UI chrome).
- **Signature motif:** the zoetrope — the 1834 optical toy that is a direct ancestor of animation — appears as the loading-screen mark, and 35mm-style sprocket rails run down the page edges as a quiet nod to film history.
- **Motion:** GSAP + ScrollTrigger for scroll-based reveals, a lightweight Three.js particle field behind the hero, a custom cursor, and a page-load sequence. All motion respects `prefers-reduced-motion`.

## Media policy — read before deploying

This project **ships with zero AI-generated artwork and zero copyrighted screenshots**. All image slots are elegant, clearly-labeled placeholders (`.img-placeholder` elements in `index.html` / `style.css`) so you can swap in officially licensed or your own photography without touching layout code.

To add real media:

1. Drop your image file into `assets/images/`.
2. Find the corresponding `<div class="... img-placeholder" data-placeholder="...">` in `index.html`.
3. Replace the placeholder `div` contents with an `<img src="assets/images/your-file.jpg" alt="...">`, or set it as a background image in CSS — either works with the existing card layout.

Studio "Official Website" buttons point to each studio's real corporate site. "Official YouTube" buttons currently point to a YouTube search for that studio's name so you always land on legitimate, official content — swap these for the exact channel/trailer URL once you've confirmed it, using a standard responsive iframe embed, e.g.:

```html
<div class="video-embed">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID"
          title="Official trailer" loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
</div>
```

Never re-host or re-upload video files that aren't yours — always embed the official YouTube player.

## Running locally

No build step is required — it's plain HTML/CSS/JS.

```bash
# from inside watashiwa-art/
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository (root of the repo, or a `/docs` folder).
2. In the repo settings, go to **Pages** and set the source branch/folder.
3. GitHub will publish at `https://<username>.github.io/<repo>/`.

No server-side code, database, or build pipeline is required.

## Attribution

All studio names, anime titles, and creator names referenced belong to their respective rights holders. This project is an educational, non-commercial reference site; no ownership or affiliation is claimed or implied.
