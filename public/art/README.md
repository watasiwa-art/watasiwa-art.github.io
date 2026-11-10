# Your artwork goes here

Every cut on the site is currently a vector placeholder drawn in code. Drop a
file in this folder and point the site at it — your image replaces the drawing
everywhere that cut appears.

## Where to set the paths

All of it lives in `src/data/site.ts`.

| What | Field | Shape |
| --- | --- | --- |
| Hero key visual | `site.images.hero` | 16:9, 1600px or wider |
| Portrait (About page) | `site.images.portrait` | 4:5, 1200px or taller |
| One cut's main frame | `projects[n].image` | 16:9 or 4:5 |
| A still on a cut's detail page | `projects[n].frames[n].image` | 4:3 |
| Reel poster frame | `reel.cover` | 16:9 |
| Reel video | `reel.video` | MP4 (H.264), under ~20 MB |

Example:

```ts
images: {
  hero: '/art/hero.jpg',
  portrait: '/art/portrait.jpg',
},
```

```ts
{
  slug: 'windward',
  image: '/art/windward.jpg',
  // ...
}
```

## Notes

- Paths start at the site root: `public/art/foo.jpg` is served at `/art/foo.jpg`.
- JPG, PNG and WebP work; GIF, WebP and APNG keep animating inside the frame.
- Cards crop with `object-cover`, so keep the subject away from the extreme edges.
- Leave a field as `''` and the drawn placeholder stays.
- On a detail page the three stills are cropped 4:3; `zoom` and `origin` in the
  project data still control that crop.
- Everything in `public/` is served publicly. No private work, no client files
  you do not have permission to show.
