# KitchenProof Brand & Visual Identity Guidelines

## 1. Logo Identity & Design Rationale

### Chosen Concept: Pot-Lid & Check-Mark Handle
The KitchenProof mark unites the domestic cloche/pot lid with a crisp evidence check mark integrated into its handle. It visually asserts that behind the delivery container sits a physically audited kitchen whose hygiene practices have been certified under Schedule 4 standards.

### Documented Alternative (Not Shipped): Kitchen Window & Ledger Motif
An alternative concept explored a gridded kitchen order-pass window cross-referenced with horizontal audit ledger lines. While rigorous, it lacked the immediate emotional recognition and compact 16px silhouette achieved by the pot-lid check handle.

---

## 2. Logo Assets Inventory

| Asset File | Format / Dimensions | Usage |
| :--- | :--- | :--- |
| `public/logo-mark.svg` | SVG (viewBox `0 0 32 32`) | Standalone icon, favicon base, mobile navigation |
| `public/logo-wordmark.svg` | SVG (190 x 36 px) | Full brand header, investor & press collateral |
| `public/favicon.svg` | SVG (viewBox `0 0 32 32`) | Vector browser tab favicon (dark mode native) |
| `public/favicon.ico` | Binary ICO (32 x 32 px) | Legacy browser tab icon |
| `public/apple-touch-icon.png` | PNG (180 x 180 px) | iOS Home Screen bookmark icon |
| `public/icon-192.png` | PNG (192 x 192 px) | Android PWA app launcher icon |
| `public/icon-512.png` | PNG (512 x 512 px) | PWA splash screen & high-res asset |
| `public/og-image.png` | PNG (1200 x 630 px) | OpenGraph and Twitter card social share preview |

---

## 3. Clear-Space & Minimum Size Rules

### Minimum Size
- **Digital Mark (`logo-mark.svg`)**: Minimum display size is `16 x 16 px`. At this scale, the 2.5px stroke width preserves complete legibility of both the dome arc and the handle check tick.
- **Digital Wordmark (`logo-wordmark.svg`)**: Minimum display width is `120 px`. Below 120px, use `logo-mark.svg` alone.
- **Print Reproduction**: Minimum print size for mark is `6 mm` height.

### Clear-Space
- Maintain a minimum exclusion zone around the mark equal to **0.5X** (where X equals the height of the mark).
- No text, borders, illustrations, or background clutter may intrude into this boundary.

---

## 4. Color Palette Tokens

The KitchenProof palette is rooted in an organic, dark-charcoal forest foundation rather than sterile pure black (`#000000`).

| Token | Hex / Value | Role |
| :--- | :--- | :--- |
| `--bg` | `#0E1512` | Deep charcoal-forest page canvas |
| `--surface` | `#151F1A` | Card containers, navigation header, footer background |
| `--surface-raised`| `#1C2923` | Interactive surfaces, hover states, input fields |
| `--text` | `#EAF1EC` | High-contrast primary reading text (14.2:1 against `--bg`) |
| `--text-muted` | `#A9B8AF` | Secondary labels, descriptions, timestamps (8.5:1 against `--bg`) |
| `--accent` | `#7CC49A` | Brand accent, primary verification check, action highlights |
| `--accent-strong` | `#5AAF7E` | Active interactive state, hover on buttons |
| `--warning` | `#E3B04B` | Pending review, action required indicators |
| `--danger` | `#EC8A7B` | Critical violations, failed gates, expired documents |
| `--info` | `#76B9C4` | Informational tooltips, category metadata |
| `--border-subtle`| `rgba(122, 180, 140, 0.12)` | Quiet decorative boundaries between surfaces |
| `--border-strong`| `rgba(122, 180, 140, 0.35)` | Interactive control boundaries (WCAG 1.4.11 compliant >3:1) |
| `--focus-ring` | `#7CC49A` | Accessible 2px focus outline with 3px offset |

---

## 5. Typography

### Primary Headings: Fraunces
- **Classification**: Optical humanist soft-serif.
- **Loading**: Self-hosted via `next/font/google` (`display: swap`, zero third-party runtime CDN calls).
- **Voice**: Authoritative, editorial, historical inspection ledger feel without harsh modern sans sterile coldness.

### Body & UI: Source Sans 3
- **Classification**: Humanist sans-serif.
- **Loading**: Self-hosted via `next/font/google` (`display: swap`).
- **Voice**: Neutral, exceptionally legible at small sizes (11px–14px), dense data tables, and audit logs.

### Fluid Type Scale
- `h1`: `clamp(2rem, 5vw + 1rem, 3.75rem)` | line-height: `1.15` | weight: `700`
- `h2`: `clamp(1.5rem, 3vw + 0.5rem, 2.5rem)` | line-height: `1.2` | weight: `600`
- `h3`: `clamp(1.125rem, 2vw + 0.25rem, 1.75rem)` | line-height: `1.25` | weight: `600`
- `h4`: `clamp(1rem, 1.5vw + 0.25rem, 1.25rem)` | line-height: `1.3` | weight: `500`
- Body `p`: line-height `1.65` | measure capped at `70ch` for optimal reading fatigue prevention.
