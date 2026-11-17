# KitchenProof Design Audit

> Branch: `design/dark-organic` | Audited: 2026-11-17

---

## Styling Approach

- **Primary method**: Tailwind CSS utility classes throughout all components and pages.
- **Custom Tailwind tokens**: Extended via `tailwind.config.ts` — full custom color palette, font families, and custom `boxShadow` values.
- **CSS custom properties (`:root` vars)**: Only two root vars — `--background: #FBFBF9` and `--foreground: #161815`. These are referenced in `body` only; components use inline Tailwind hex literals or custom token names directly.
- **Inline arbitrary Tailwind values**: Heavily used throughout — e.g. `bg-[#143D2B]`, `text-[#5E635D]`, `border-[#E7E7DE]`. This means color changes will require touching many component files, not just a single token file.
- **No CSS Modules, no styled-components, no inline `style={{}}`** (except one dynamic `width` on the evidence progress bar in `SafetyScoreBadge`).
- **`globals.css`**: Minimal — Tailwind directives, two CSS vars, custom scrollbar, and a single `focus-visible` ring color.

---

## Current Fonts

### Font Families Defined (tailwind.config.ts)

| Token | Stack |
|-------|-------|
| `font-sans` (default) | `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`, `sans-serif` |
| `font-serif` | `Newsreader`, `Playfair Display`, `Georgia`, `Cambria`, `Times New Roman`, `serif` |
| `font-mono` | `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`, `monospace` |

### Font Usage in `globals.css` / `layout.tsx`

- `globals.css` body: `font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` (redundant with `font-sans`).
- `layout.tsx` body: `font-sans antialiased` — sets sans as the global default.
- **`font-serif` is used extensively** for display headings (h1, h2, h3, brand logotype in Navbar/Footer, score numerics). **No web font is loaded** — `Newsreader` and `Playfair Display` are listed in the serif stack but never imported via `next/font` or a `<link>`. This means those fonts will never render unless added.

> **⚠️ Concern**: `Newsreader` / `Playfair Display` are in the serif stack but are NOT loaded. All `font-serif` text currently renders as `Georgia` or the system serif fallback.

---

## Current Color Palette

### CSS Custom Properties (globals.css `:root`)

| Variable | Value |
|----------|-------|
| `--background` | `#FBFBF9` (warm off-white) |
| `--foreground` | `#161815` (near-black charcoal) |

### Tailwind Custom Colors (tailwind.config.ts)

| Token | Value(s) |
|-------|---------|
| `background` | `#FBFBF9` |
| `surface` | `#FFFFFF` |
| `surface-subtle` | `#F5F5F0` |
| `surface-muted` | `#EFEFE9` |
| `border` | `#E7E7DE` |
| `border-strong` | `#D0D0C3` |
| **`brand`** | 50–950 scale: `#F0F6F2` → `#081C11` |
| **`forest`** | DEFAULT `#143D2B`, dark `#0E2B1E`, deep `#091D14`, light `#1F593F` |
| **`charcoal`** | 50–950 scale: `#F7F8F7` → `#0C0D0C` |
| **`amber`** | 50–900 scale (standard) |
| **`crimson`** | 50–900 scale (standard) |

### Arbitrary Hex Values Used Inline (most frequent)

These are **not** using the token names — they are raw hex literals scattered across components:

| Hex | Description | Used in |
|-----|-------------|---------|
| `#143D2B` | Forest green (primary brand) | Navbar, Footer, page.tsx, RestaurantCard, explore |
| `#FBFBF9` | Off-white background | Navbar, layout, globals |
| `#161815` | Near-black foreground | Headings, layout body |
| `#5E635D` | Charcoal-500 (muted body text) | Throughout |
| `#444943` | Charcoal-600 (nav links) | Navbar |
| `#323631` | Charcoal-700 (mobile nav text) | Navbar |
| `#E7E7DE` | Border default | Throughout |
| `#D0D0C3` | Border strong | Navbar, explore |
| `#B8D4C2` | Brand-200 (subtle accents) | Navbar, Footer |
| `#DCE9E0` | Brand-100 (banner bg) | Navbar, layout selection |
| `#F0F6F2` | Brand-50 | Navbar, page hero badge |
| `#F5F5F0` | Surface-subtle | hero bg gradient |
| `#EFEFE9` | Surface-muted | RestaurantCard placeholder bg |
| `#8CBA9D` | Brand-300 (footer muted text) | Footer |
| `#1F593F` | Forest-light (hover states) | Navbar, page CTAs |
| `#0F2E1D` | Brand-900 (footer border) | Footer |
| `#1E4F32` | Brand-700 (footer bottom border) | Footer |
| `#868A85` | Charcoal-400 (placeholder/icon) | Throughout |
| `#B91C1C` | Crimson-700 (destructive) | Navbar logout hover |
| `#FEF3C7` | Amber-100 | page.tsx feature card bg |
| `#92400E` | Amber-800 | page.tsx feature card icon |
| `#FEF2F2` | Crimson-50 | page.tsx feature card bg |
| `#991B1B` | Crimson-800 | page.tsx feature card icon |

> **⚠️ Concern**: Token names are defined in `tailwind.config.ts` but components almost universally use raw hex values (`bg-[#143D2B]`) instead of `bg-forest`. This creates a maintenance burden and means changing the brand green requires a multi-file find-replace rather than a single token edit.

---

## Heading Styles Inventory

| Element | Classes | Location |
|---------|---------|----------|
| `h1` | `text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#161815] tracking-tight leading-[1.12]` | Home hero |
| `h1` | `text-3xl sm:text-4xl font-serif font-bold text-[#161815] mt-1 tracking-tight` | Explore page |
| `h1` | `text-3xl sm:text-4xl font-serif font-bold text-[#161815] tracking-tight` | Restaurant profile |
| `h2` | `text-3xl sm:text-4xl font-serif font-bold text-[#161815] mt-2 tracking-tight` | Home transparency section |
| `h3` | `font-serif font-bold text-lg text-[#161815] group-hover:text-[#143D2B] transition-colors line-clamp-1` | RestaurantCard |
| `h3` | `font-serif font-bold text-lg text-[#161815]` | Home feature cards |
| `h4` | `text-xs font-semibold uppercase tracking-wider text-white mb-4` | Footer section headers |
| `strong` (display) | `text-lg font-serif font-black text-[#161815]` | Home trust indicators |
| Score numeral | `text-5xl font-black tracking-tight text-[#161815] font-serif` | SafetyScoreBadge (lg) |
| Score numeral | `text-2xl font-black font-serif text-[#161815]` | RestaurantCard |

**Pattern**: All editorial headings use `font-serif font-bold` on `text-[#161815]`. The active/hover brand accent is `text-[#143D2B]`. Subheadings are uppercase tracking-wider in `text-xs` (consistent eyebrow label pattern).

---

## Dark/Black Borders Found

**Grep command run:**
```
Get-ChildItem -Recurse -Include "*.tsx","*.ts","*.css" src |
  Select-String -Pattern "border-black|border-gray-8|border-gray-9|border-slate-8|border-slate-9|border-zinc-8|border-zinc-9|ring-black|outline-black"
```

**Result: No matches found.**

Zero instances of `border-black`, `ring-black`, `outline-black`, or any dark gray/slate/zinc border-8x/9x patterns in the entire `src/` tree. All borders use the custom token system (`border-[#E7E7DE]`, `border-[#D0D0C3]`, `border-[#143D2B]`, `border-[#0F2E1D]`) or semantic named tokens.

---

## Images and Icons

### Next.js `<Image>` Components

| Location | `src` / Pattern | Alt / Notes |
|----------|----------------|-------------|
| `RestaurantCard.tsx` | `{restaurant.coverImageUrl}` (dynamic) | `{restaurant.name}` — with `fill` layout and `sizes` prop |
| `restaurants/[slug]/page.tsx` | Imported `Image` from `next/image` — dynamic `coverImageUrl` | Restaurant cover photo |

No static image imports (`import img from "..."`) found in audited files.

### Lucide-React Icon Imports

| Component | Icons Imported |
|-----------|---------------|
| `Navbar.tsx` | `ShieldCheck`, `Search`, `LayoutDashboard`, `LogOut`, `User`, `Menu`, `X`, `ChevronRight` |
| `Footer.tsx` | `ShieldCheck`, `HeartHandshake`, `FileText`, `ExternalLink` |
| `page.tsx` (home) | `ShieldCheck`, `Search`, `CheckCircle2`, `AlertCircle`, `HelpCircle`, `TrendingUp`, `FileCheck2`, `Thermometer`, `Sparkles`, `Bug`, `Award`, `ArrowRight`, `ExternalLink` |
| `explore/page.tsx` | `Search`, `Filter`, `ShieldCheck`, `MapPin`, `SlidersHorizontal`, `RefreshCw`, `X` |
| `RestaurantCard.tsx` | `ShieldCheck`, `MapPin`, `Calendar`, `Star`, `AlertTriangle`, `Clock` |
| `SafetyScoreBadge.tsx` | `ShieldCheck`, `AlertTriangle`, `AlertCircle`, `Info` |
| `restaurants/[slug]/page.tsx` | `ShieldCheck`, `MapPin`, `Calendar`, `AlertTriangle`, `FileText`, `Star`, `CheckCircle2`, `Clock`, `ExternalLink`, `Droplet`, `Flame`, `Bug`, `Thermometer`, `Award`, `Users`, `Info`, `Building`, `HelpCircle` |

**Icon library**: 100% Lucide React. No other icon libraries in use.

---

## Template-Like Patterns Found

| Pattern | Location | Notes |
|---------|----------|-------|
| **Card grid** | `page.tsx` home (features section), `explore/page.tsx` | `grid grid-cols-1 md:grid-cols-3 gap-8` — repeated 3-col card layout |
| **Article card** (`RestaurantCard`) | Used on home and explore | `rounded-xl border border-[#E7E7DE] shadow-subtle` — standard card shell |
| **Eyebrow label** | Home, Explore, Restaurant profile | `text-xs font-semibold uppercase tracking-wider text-[#143D2B]` |
| **Sticky top banner** | `Navbar.tsx` | Forest-green announcement bar pattern |
| **Search + filter bar** | `explore/page.tsx` | `bg-white p-5 rounded-xl border border-[#E7E7DE]` control panel |
| **Status pill/badge** | `RestaurantCard`, `SafetyScoreBadge`, restaurant profile | Consistent `inline-flex ... px-2.5 py-1 rounded-full text-xs font-semibold border` badge |
| **Score display block** | `SafetyScoreBadge` (sm/md/lg), `RestaurantCard` | Reused across card and profile views |
| **12-col hero grid** | `page.tsx` home hero, restaurant profile header | `grid grid-cols-1 lg:grid-cols-12` with 7+5 or 8+4 split |
| **Hero comparison card** | `page.tsx` home right column | Simulated "delivery app vs. kitchen reality" dual-card visual — domain-specific but potentially reusable |
| **Footer 4-col grid** | `Footer.tsx` | `grid grid-cols-1 md:grid-cols-4 gap-10` |
| **Evidence progress bar** | `SafetyScoreBadge` (lg) | Custom inline `width` style on `h-2 rounded-full` bar |
| **Demo data notice badge** | `RestaurantCard`, restaurant profile | `bg-black/75 backdrop-blur-sm text-white` overlay badge on image |

---

## Routes Inventoried

| Route | File | Type |
|-------|------|------|
| `/` | `src/app/page.tsx` | Server Component (async, `force-dynamic`) |
| `/explore` | `src/app/explore/page.tsx` | Client Component (`use client`) |
| `/restaurants/[slug]` | `src/app/restaurants/[slug]/page.tsx` | Server Component (async, `force-dynamic`) |
| *(global layout)* | `src/app/layout.tsx` | Server Layout — wraps all routes with `Navbar` + `Footer` |

**Shared components audited:** `Navbar.tsx`, `Footer.tsx`, `RestaurantCard.tsx`, `SafetyScoreBadge.tsx`

---

## Summary of Concerns for Dark-Organic Redesign

1. **Token adoption gap**: Custom Tailwind tokens exist (`forest`, `charcoal`, `brand`) but components use raw hex values. Any dark-mode palette swap will require a systematic find-replace or migration to CSS vars.
2. **No web font loaded**: `font-serif` is critical to the editorial voice but falls back to `Georgia`. Must add `next/font` for `Newsreader` or `Playfair Display` in the sprint.
3. **No dark border patterns** to remove — the existing border palette is already subtle/organic.
4. **Demo data badge** uses `bg-black/75` — this will need revisiting for a dark theme where black overlay on dark imagery may lose contrast.
5. **Inline arbitrary color classes are pervasive** — the design sprint should evaluate migrating to CSS custom properties for the new dark-organic palette to avoid the same scalability problem repeating.
