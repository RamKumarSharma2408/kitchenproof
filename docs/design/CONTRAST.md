# KitchenProof Contrast Audit & Token Verification Matrix

**Standard**: WCAG 2.2 AA / AAA  
**Evaluator**: Automated Color Contrast Matrix (Relative Luminance Formula per WCAG 2.1 SC 1.4.3 & SC 1.4.11)  
**Date**: 17 November 2026  
**Status**: 100% PASS (Zero Failures)

---

## 1. Token Contrast Ratios (WCAG 2.2 SC 1.4.3 & 1.4.11)

| Foreground Token | Background Token | Usage Context | Minimum Required | Measured Ratio | WCAG 2.2 Compliance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--text (#EAF1EC)` | `--bg (#0E1512)` | Primary page body text & headings | 4.5:1 (Normal Text) | **16.12:1** | ✅ **PASS (AAA)** |
| `--text (#EAF1EC)` | `--surface (#151F1A)` | Card titles, modal body, header text | 4.5:1 (Normal Text) | **14.72:1** | ✅ **PASS (AAA)** |
| `--text (#EAF1EC)` | `--surface-raised (#1C2923)` | Surface-raised text, table headers | 4.5:1 (Normal Text) | **13.15:1** | ✅ **PASS (AAA)** |
| `--text-muted (#A9B8AF)` | `--bg (#0E1512)` | Descriptions, timestamps, metadata | 4.5:1 (Normal Text) | **8.96:1** | ✅ **PASS (AAA)** |
| `--text-muted (#A9B8AF)` | `--surface (#151F1A)` | Subtitles, table metadata on cards | 4.5:1 (Normal Text) | **8.18:1** | ✅ **PASS (AAA)** |
| `--text-muted (#A9B8AF)` | `--surface-raised (#1C2923)` | Form helper text, chip descriptions | 4.5:1 (Normal Text) | **7.31:1** | ✅ **PASS (AAA)** |
| `--accent (#7CC49A)` | `--bg (#0E1512)` | Focus rings, large metrics, icons | 3.0:1 (UI / Large) | **9.01:1** | ✅ **PASS (AAA)** |
| `--accent (#7CC49A)` | `--surface (#151F1A)` | Active tab borders, brand checkmarks | 3.0:1 (UI Components) | **8.22:1** | ✅ **PASS (AAA)** |
| `--accent (#7CC49A)` | `--surface-raised (#1C2923)` | Badges, interactive icons | 3.0:1 (UI Components) | **7.35:1** | ✅ **PASS (AAA)** |
| `--bg (#0E1512)` | `--accent (#7CC49A)` | Primary button label text | 4.5:1 (Normal Text) | **9.01:1** | ✅ **PASS (AAA)** |
| `--warning (#E3B04B)` | `--bg (#0E1512)` | Pending review alerts & icons | 4.5:1 (Normal Text) | **9.32:1** | ✅ **PASS (AAA)** |
| `--warning (#E3B04B)` | `--surface (#151F1A)` | Warning status chips | 4.5:1 (Normal Text) | **8.51:1** | ✅ **PASS (AAA)** |
| `--warning (#E3B04B)` | `--surface-raised (#1C2923)` | Timeline warning calls | 4.5:1 (Normal Text) | **7.61:1** | ✅ **PASS (AAA)** |
| `--danger (#EC8A7B)` | `--bg (#0E1512)` | Critical non-compliance alerts | 4.5:1 (Normal Text) | **7.48:1** | ✅ **PASS (AAA)** |
| `--danger (#EC8A7B)` | `--surface (#151F1A)` | Expired evidence badges | 4.5:1 (Normal Text) | **6.83:1** | ✅ **PASS (AA)** |
| `--danger (#EC8A7B)` | `--surface-raised (#1C2923)` | Error messages, report badges | 4.5:1 (Normal Text) | **6.10:1** | ✅ **PASS (AA)** |
| `--info (#76B9C4)` | `--bg (#0E1512)` | Statutory info tooltips | 4.5:1 (Normal Text) | **8.38:1** | ✅ **PASS (AAA)** |
| `--info (#76B9C4)` | `--surface (#151F1A)` | Category metadata chips | 4.5:1 (Normal Text) | **7.65:1** | ✅ **PASS (AAA)** |
| `--info (#76B9C4)` | `--surface-raised (#1C2923)` | Audit record tags | 4.5:1 (Normal Text) | **6.84:1** | ✅ **PASS (AA)** |
| `--border-strong` | `--bg (#0E1512)` | Form inputs, interactive button borders | 3.0:1 (WCAG 1.4.11) | **3.53:1** | ✅ **PASS (AA)** |
| `--border-strong` | `--surface (#151F1A)` | Card interactive boundaries | 3.0:1 (WCAG 1.4.11) | **3.44:1** | ✅ **PASS (AA)** |

---

## 2. Adjustments Made During Contrast Verification

1. **`--border-strong` Opacity Adjustment**:
   - Initial value: `rgba(122, 180, 140, 0.35)` yielded a calculated contrast of **2.01:1** against `--bg`, falling short of the WCAG 1.4.11 boundary requirement for interactive controls (minimum 3.0:1).
   - Adjusted value: `rgba(124, 196, 154, 0.55)` (blending to `#4B755D` against `--bg` and `#4E7A60` against `--surface`).
   - New contrast ratio: **3.53:1** against canvas and **3.44:1** against surface, fully satisfying WCAG 2.1 SC 1.4.11 Non-Text Contrast.

2. **Demarcation & Non-Color Dependence**:
   - Every verification state (VERIFIED, EXPIRED, ACTION REQUIRED, PENDING REVIEW) is paired with a distinct vector icon (`ShieldCheck`, `AlertTriangle`, `AlertCircle`, `Clock`) in addition to explicit uppercase text labels.
   - Score gauges and progress meters feature programmatic `role="img"` or visible text fractions (`/100`), ensuring complete non-dependence on color perception.

3. **Focus Ring Accessible Visibility**:
   - Focus ring token `--focus-ring (#7CC49A)` provides **9.01:1** contrast against `--bg` and **8.22:1** against `--surface` with a mandatory `2px solid` thickness and `3px` offset, exceeding the WCAG 2.2 SC 2.4.13 Focus Appearance requirement.
