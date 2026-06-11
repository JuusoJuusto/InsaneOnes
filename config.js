/* ============================================================================
   InsaneOnes — SITE CONFIG
   ----------------------------------------------------------------------------
   This is the ONLY file you need to edit to update the site.
   Change the values between the quotes. Don't touch the punctuation around them
   (the quotes, commas, and brackets). Save, then refresh the page.

   The things you'll most likely change are right at the top:
       server IP, Discord link, and version.
   ============================================================================ */

window.SITE = {

  /* ── 1. THE ESSENTIALS — edit these first ───────────────────────────────── */

  name:        "InsaneOnes",                 // Server name (shown everywhere)
  kind:        "Survival Anarchy SMP",       // What kind of server it is
  tagline:     "There are no rules. Only survival.",

  ip:          "mc.insaneones.xyz",          // ← YOUR SERVER IP
  edition:     "Java Edition",               // e.g. "Java Edition"
  version:     "26.1.2",                      // ← the version the world runs on
  anyVersion:  true,                          // true = players can join from any version
  versionNote: "any version",                 // short label shown next to the version
  premiumOnly: true,                          // true = paid Java accounts only (no cracked)

  discordUrl:  "https://discord.gg/jt53SpqaA7", // ← YOUR DISCORD INVITE LINK
  discordLabel:"discord.gg/jt53SpqaA7",          // What the link says on screen

  /* Live status is pinged from the free mcstatus.io API (with mcsrvstat.us as a
     backup). Set this to your server address (usually the same as `ip`).
     Set `liveStatus` to false to hide all the live status bits. */
  liveStatus:  true,
  statusHost:  "mc.insaneones.xyz",

  /* ── 2. HERO (the first thing visitors see) ─────────────────────────────── */

  hero: {
    kicker:  "Survival Anarchy SMP",          // small label above the title
    // Lead line under the IP. Keep it short.
    intro:   "A survival anarchy SMP where the world never resets, the economy is yours to run, and you can join from any version. Build something. Watch someone take it.",
    primaryCta: "Copy IP & Play",
    ghostCta:   "Join the Discord",
  },

  /* ── LAUNCH COUNTDOWN (big countdown at the top until the server opens) ──── */
  /* Set enabled:false (or delete this block) once it has launched.            */

  launch: {
    enabled: true,
    // When the server opens. ISO format, with your timezone offset at the end.
    // Below = Friday 12 June 2026, 23:59, Finland time (UTC+3 in summer).
    date:     "2026-06-12T23:59:00+03:00",
    label:    "Server opens in",             // small label above the numbers
    dateText: "Friday 12 June · 23:59",      // the human-readable opening time
    liveText: "The gates are open. Get in.", // shown once the countdown hits zero
  },

  /* ── 3. LIVE STATUS (the \"look at the server\" card) ─────────────────────── */

  status: {
    kicker:  "Live status",
    heading: "Don't take our word for it.",
    body:    "This is mc.insaneones.xyz, pinged live every time the page loads. Green means the gates are open.",
  },

  /* ── 4. WHAT IT IS (the statement section) ──────────────────────────────── */

  about: {
    heading: "This is not a server. It's a sentence.",
    // Each string is its own paragraph. Add or remove lines freely.
    body: [
      "InsaneOnes is a survival anarchy SMP. No rules, no claims, and no staff standing between you and the next player who wants what you have. You make it on your own terms, or you don't make it.",
      "The world never resets, so everything you do leaves a mark. There's a real player economy with a shop and a market, and no map wipe is coming to bail you out of a bad trade or a worse alliance.",
      "It is not hardcore, you respawn when you die. You just respawn with nothing, while everything you were carrying becomes someone else's to spend.",
    ],
    pullQuote: "Build something. Watch someone take it.",
  },

  /* ── 5. THE LAWS OF THE VOID (what makes the server what it is) ──────────── */
  /* These are your headline features. Add or remove items freely. */

  laws: [
    { title: "There are no rules",      body: "Grief, raid, betray, build empires, burn them down. Nothing here is against the rules, because there are none." },
    { title: "The world never resets",  body: "One permanent world, no wipes, no rollbacks. Every base you raid and every scar you leave stays forever." },
    { title: "No admin will save you",  body: "Staff don't police the world, return your items, or undo your death. You are completely on your own." },
    { title: "A real player economy",   body: "Earn coins, buy and sell at the shop, run your own store, or get rich off everyone else's mistakes." },
    { title: "Proximity voice chat",    body: "Simple Voice Chat is built in. Hear footsteps behind you, cut deals, and catch last words in real-time proximity voice. Grab the mod and talk." },
    { title: "Any version welcome",     body: "The world runs on 26.1.2, but you don't have to. Connect from almost any Minecraft version you've got." },
    { title: "Not pay-to-win, not hardcore", body: "You respawn when you die, and you can't buy your way to the top. The grind is real and so are the losses." },
  ],

  /* ── 6. THE SHOP ────────────────────────────────────────────────────────── */
  /* If you have a web store, put its link in `url` and a button appears.
     Leave `url` as "" to just describe the in-game shop. */

  shop: {
    kicker:  "Player economy",
    heading: "Spend it, sell it, lose it.",
    body:    "InsaneOnes runs on coins. Earn them, hoard them, or blow them all on something you'll lose in a raid an hour later. The economy is part of the game.",
    url:     "",                              // optional web store link, e.g. "https://store.insaneones.xyz"
    cta:     "Open the store",
    // What the shop system includes. Add or remove freely.
    features: [
      { name: "Server shop",   body: "Buy and sell blocks, gear, and resources for coins, any time." },
      { name: "Player shops",  body: "Set up your own store and sell your loot to everyone else." },
      { name: "Auction house", body: "Put rare drops under the hammer. Highest bidder takes it home." },
      { name: "Bounties",      body: "Put a price on someone's head and pay out when they drop." },
    ],
  },

  /* ── 7. HOW TO JOIN (the steps) ─────────────────────────────────────────── */

  join: {
    heading: "How to drop in",
    steps: [
      { title: "Open Minecraft: Java Edition", body: "Launch on whatever version you like, the server takes almost any of them." },
      { title: "Open Multiplayer → Add Server", body: "From the main menu, choose Multiplayer, then Add Server." },
      { title: "Paste the address", body: "Drop in the server IP below. The server name is up to you." },
      { title: "Join Server", body: "Hit Join and load in. From here, you're on your own." },
    ],
    note: "Java Edition with a premium (paid) Minecraft account is required. Cracked clients cannot connect. For proximity voice, also install the Simple Voice Chat mod (Fabric).",
  },

  /* ── 8. GALLERY ─────────────────────────────────────────────────────────── */
  /* To use your own screenshots: drop image files in the /assets folder and set
     `src` to "assets/your-file.png". Leave `src` as "" to show a crafted
     placeholder tile instead. `alt` is read aloud by screen readers. */

  gallery: {
    heading: "Dispatches from the world",
    note: "Real screenshots. Add your own in the assets folder.",
    shots: [
      { src: "", caption: "Spawn, after dark",        alt: "A dark Minecraft spawn area at night" },
      { src: "", caption: "A base that didn't last",  alt: "The ruins of a griefed Minecraft base" },
      { src: "", caption: "Market day at spawn",       alt: "Players trading at a Minecraft shop area" },
      { src: "", caption: "Nether highway, 10k out",   alt: "A long nether tunnel highway far from spawn" },
      { src: "", caption: "What's left of an alliance",alt: "A ruined shared base after a betrayal" },
      { src: "", caption: "First night, last night",   alt: "A lone player at night in a hostile world" },
    ],
  },

  /* ── 9. FAQ ─────────────────────────────────────────────────────────────── */

  faq: {
    heading: "Before you log on",
    items: [
      { q: "Is it hardcore?",                a: "No. You respawn when you die, you just drop everything you were carrying. Death is a setback, not the end of your run." },
      { q: "Is it really no rules?",         a: "Yes. Griefing, raiding, scamming, alliances and betrayal are all fair game. The only limits are Minecraft's own mechanics." },
      { q: "Is there a shop?",               a: "Yes. There's a server shop and a full player economy. Earn coins, buy and sell, open your own shop, or get rich off other people's mistakes." },
      { q: "Is there voice chat?",          a: "Yes. The server runs Simple Voice Chat, so you get real-time proximity voice in-game. Install the Simple Voice Chat mod (Fabric) to hear and talk to players near you. It's optional, but on an anarchy server you'll want to hear who's sneaking up." },
      { q: "What version can I join on?",    a: "The world runs on 26.1.2, but you can connect from almost any Minecraft version. Use whatever you've got installed." },
      { q: "Do I need a premium account?",   a: "Yes. InsaneOnes is Java Edition and requires an official, paid Minecraft account. Cracked clients can't join." },
      { q: "Is it pay-to-win?",              a: "No. The shop runs on in-game coins you earn by playing. You can't buy power with real money." },
      { q: "Do you reset the map?",          a: "No. The world is permanent. What happens in it stays in it." },
    ],
  },

  /* ── 10. DISCORD CALL-TO-ACTION ─────────────────────────────────────────── */

  discordCta: {
    heading: "The war room is on Discord",
    body: "Announcements, alliances, drama, market deals, and everyone you're about to betray. Get in before you log on.",
    button: "Join the Discord",
  },

  /* ── 11. FOOTER ─────────────────────────────────────────────────────────── */

  footer: {
    // Extra links shown in the footer. Add or remove freely.
    // For an on-page section use "#status", "#about", "#laws", "#shop",
    // "#join", "#gallery", "#faq". For an external link, use a full https URL.
    links: [
      { label: "Live status", url: "#status" },
      { label: "The Laws",    url: "#laws" },
      { label: "Shop",        url: "#shop" },
      { label: "Join",        url: "#join" },
      { label: "Gallery",     url: "#gallery" },
      { label: "FAQ",         url: "#faq" },
    ],
    // Social links. Delete any you don't use; leave the array empty for none.
    socials: [
      { label: "Discord", url: "https://discord.gg/jt53SpqaA7" },
    ],
    disclaimer: "InsaneOnes is not affiliated with Mojang Studios or Microsoft. Minecraft is a trademark of Mojang Synergies AB.",
  },

};
