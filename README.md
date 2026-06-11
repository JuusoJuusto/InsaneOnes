# InsaneOnes — server website

A single-page site for the InsaneOnes survival anarchy SMP Minecraft server.
No build step, no framework. Just open the files or upload them to any host.

## How to edit (the important part)

**Almost everything you'll want to change lives in one file: `config.js`.**

Open `config.js` in any text editor (Notepad works). Change the text between the
quotes, save, and refresh the page. The three things you asked for are right at
the top:

```js
ip:          "mc.insaneones.xyz",            // your server IP
version:     "26.1.2",                         // the version your world runs on
discordUrl:  "https://discord.gg/insaneones", // your Discord invite
```

The same file also holds the tagline, the "laws", the shop, the join steps, the
FAQ, the gallery captions, and the footer. Each section has a
comment explaining what it does. You don't need to touch any other file to update
content.

> Tip: keep the quotes, commas, and brackets exactly as they are. Only change
> the words inside the quotes.

## Live status

The "Live status" section shows a Minecraft-style server card (icon, MOTD, player
count, version) fetched in real time from [mcstatus.io](https://mcstatus.io),
with [mcsrvstat.us](https://mcsrvstat.us) as a backup, using the `statusHost`
value in `config.js`. The hero also shows a quick online/offline indicator. To
turn all of it off, set `liveStatus: false`. (The card reads your server's live
MOTD and icon, so to change those, change them on the server itself.)

## Adding your own screenshots

1. Put image files in the `assets/` folder (e.g. `assets/base1.png`).
2. In `config.js`, find the `gallery` section and set `src` to the path:
   ```js
   { src: "assets/base1.png", caption: "My base", alt: "Screenshot of a base" },
   ```
3. Leave `src` as `""` to show a crafted placeholder tile instead.

Clicking a real screenshot opens it full-size in a lightbox.

## Social share image (optional)

Drop an image at `assets/og.png` (1200×630 recommended) to get a rich preview
when the link is shared on Discord, Twitter, etc. It's already wired up in
`index.html`.

## Files

| File | What it is |
|------|------------|
| `config.js` | **Edit this.** All your content and settings. |
| `index.html` | Page structure. |
| `styles.css` | Design and colors (CSS variables at the top). |
| `main.js` | Behavior: live status, copy buttons, gallery, etc. |
| `assets/` | Favicon, screenshots, and your share image. |
| `PRODUCT.md` / `DESIGN.md` | Notes on the brand and design system. |

## Publishing to Vercel

This site is Vercel-ready (static, no build step). A `vercel.json` is included
with clean URLs, sensible caching, and basic security headers. Pick one:

**Option A — drag & drop (easiest)**
1. Go to https://vercel.com and sign in (free).
2. Click "Add New… → Project", then drag this whole folder onto the page.
3. Leave all settings as the defaults (Framework Preset: "Other") and click
   Deploy. You'll get a live URL in a few seconds.

**Option B — Vercel CLI**
```bash
npm i -g vercel    # once
vercel             # from this folder; follow the prompts
vercel --prod      # publish to your production URL
```

**Option C — connect a Git repo**
Push this folder to GitHub/GitLab, then "Import Project" in Vercel and select the
repo. Every push auto-deploys.

After it's live, point your domain at it in Vercel's Domains settings (e.g.
`insaneones.xyz`). To update the site later, edit `config.js`, save, and redeploy
(drag the folder again, run `vercel --prod`, or push to Git).

> Any other static host works too (Netlify, Cloudflare Pages, GitHub Pages, plain
> web hosting) — no server or build required. You can also double-click
> `index.html` to preview locally, though the live status and copy button work
> best over `http(s)` rather than `file://`.

---

InsaneOnes is not affiliated with Mojang Studios or Microsoft.
