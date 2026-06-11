# Design

Visual system for InsaneOnes. Void-black canvas, blood-red voice, bone text.
Committed color strategy: one saturated red carries the brand across a near-black
surface. Character comes from atmosphere (glow, grain, drifting ash, depth) and
type treatment, not from a costume font.

## Theme

Dark, single mode. The surface is the void at world-spawn after dark: obsidian
black, the dull red of a name above a corpse, a distant ember glow at the
horizon, ash in the air. Ominous, lawless, end-game.

## Color

All values OKLCH. Defined as CSS custom properties in `styles.css` under
`:root`.

- `--bg`        `oklch(0.13 0.006 255)` — near-black void, a whisper of cold. Page background.
- `--bg-deep`   `oklch(0.10 0.006 255)` — deepest black, hero base / footer.
- `--surface`   `oklch(0.17 0.008 255)` — raised panels, sections, the IP pill.
- `--surface-2` `oklch(0.21 0.010 255)` — higher elevation: nav-on-scroll, hover, inputs.
- `--line`      `oklch(0.27 0.010 255)` — hairline borders, dividers.
- `--ink`       `oklch(0.93 0.006 70)` — bone white. Body + headings. >12:1 on bg.
- `--muted`     `oklch(0.70 0.010 250)` — ash gray. Secondary text. ~5:1 on bg.
- `--faint`     `oklch(0.52 0.010 250)` — tertiary: captions, disabled, fine print.
- `--blood`     `oklch(0.56 0.205 22)` — primary brand red. Buttons, glows, marks. White text on fill.
- `--blood-deep` `oklch(0.42 0.16 20)` — pressed/darker red, hierarchy.
- `--blood-glow` `oklch(0.64 0.225 24)` — for glows/shadows only, never text bg.
- `--ember`     `oklch(0.70 0.15 55)` — distant lava warmth. Background gradients only, used sparingly.
- `--online`    `oklch(0.74 0.17 150)` — live status: server online. Paired with text + dot.
- `--offline`   `--blood` — server offline reuses blood red, paired with text.

Strategy: Committed. Red appears on every fold but never floods it; the void
dominates, red punctuates. Text-on-red fills use bone/near-white (Helmholtz:
saturated mid-red reads brighter than its luminance).

## Typography

Three families, each with a job. Loaded from Google Fonts.

- **Anton** — display wordmark and giant numerals only. Ultra-condensed, poster
  weight. Used for "INSANEONES", section eyebrows are NOT this. Always with a
  treatment (layered ghost outline, red glow, grain), never plain.
- **Archivo** — the workhorse. Headings at 800–900, body/UI at 400–500. Heavy
  weight contrast carries hierarchy.
- **JetBrains Mono** — server data only: the IP, version string, coordinates,
  player counts, ping. Functional mono (an IP literally is monospace data), not
  decorative "tech" costume.

Scale: fluid `clamp()`, ratio >=1.25 between steps. Hero display max ~5.5rem.
Display letter-spacing tight (-0.02 to -0.03em). Light-on-dark body gets +0.06
line-height. Body line length capped 65–72ch. `text-wrap: balance` on h1–h3.

## Layout

- Full-bleed black canvas, content in a max ~1200px column with fluid gutters.
- Hero is full-viewport with a generated atmospheric scene (canvas ash/ember +
  CSS depth layers + grain + vignette).
- Features render as a "laws of the void" manifesto (negation list with leading
  index numbers and full hairline rules) — deliberately NOT an identical icon-
  card grid.
- How-to-join is a real ordered 4-step sequence (numbers earn their place).
- Gallery is a responsive `auto-fit minmax` grid of owner-swappable tiles;
  defaults are crafted generated SVG/canvas scenes, not flat colored blocks.
- Semantic z-index scale: base < ash-canvas < content < sticky-nav < lightbox-
  backdrop < lightbox < toast.

## Components

- **IP pill**: mono IP on `--surface`, full hairline border, inline copy button
  with "Copied" feedback + toast. The hero's primary affordance.
- **Buttons**: primary = blood fill, bone text, soft red glow on hover; ghost =
  hairline border, bone text, fills on hover. Verb + object labels.
- **Live status**: a dot (`--online`/`--offline`) + text + mono count, fetched
  from mcsrvstat.us. Loading and error states are explicit ("checking…",
  "status unavailable"), never a broken or blank widget.
- **FAQ accordion**: native `<details>`-driven, full keyboard support, hairline
  separators, no side-stripe accents.
- **Lightbox**: native `<dialog>`/portal pattern so it escapes overflow; ESC +
  backdrop close, focus trap.

## Motion

- Page-load: hero wordmark clip-reveal + scale, staggered hero elements, glow
  bloom. One orchestrated entrance, not fade-on-scroll everywhere.
- Ambient: drifting ash + ember flicker on a lightweight canvas in the hero.
- Scroll: subtle staggered reveals via IntersectionObserver. Content is visible
  by default (`.js` gate) so it never ships blank in no-JS or headless renders.
- Easing: ease-out-quart/expo. No bounce, no elastic.
- `prefers-reduced-motion: reduce`: canvas freezes to a static scene, reveals
  become instant, parallax off.

## Editing

`config.js` is the single source of truth for all owner-editable content: name,
tagline, IP, edition, version, Discord link, status host, and the feature/FAQ/
gallery arrays. `main.js` hydrates the DOM from it. Layout and design live in
`index.html` / `styles.css` and rarely need touching.
