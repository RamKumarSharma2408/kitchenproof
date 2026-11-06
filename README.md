# KitchenProof™
**"Know What's Cooking Behind Your Order"**

> An independent food safety transparency platform engineered to solve information asymmetry in Indian food delivery by making verified kitchen hygiene, regulatory compliance, cold-chain integrity, and statutory lab tests accessible to consumers.

---

## 🌟 Overview

Mainstream food delivery platforms show appetizing food photography, delivery estimates, and taste reviews (e.g. 4.8★). However, consumers cannot easily check:
- Valid FSSAI registration or state/central license status.
- Date and findings of the most recent on-site physical hygiene inspection.
- Potable water lab testing to **IS 10500** standards.
- Cold-chain temperature logs (maintaining chillers $\le 4^\circ\text{C}$).
- Periodic pest control contracts and Form IX food handler medical fitness.

**KitchenProof** bridges this gap through an evidence-backed transparency ecosystem built on **FSSAI Schedule 4** General Hygienic and Sanitary Benchmarks.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | **Next.js 14.2 (App Router)** | React 18, Server Components, Streaming SSR, API Route Handlers |
| **Language** | **TypeScript 5.6** | Strict end-to-end type safety |
| **Styling** | **Tailwind CSS 3.4** | Custom corporate theme (`forest`, `brand`, `charcoal`) |
| **Database & ORM** | **Prisma 5.22 + SQLite** | 13 normalized relational models; swappable with PostgreSQL |
| **Authentication** | **jose (JWT) + bcryptjs** | Stateless `HttpOnly` cookie sessions (`kp_session`) with cost factor 12 |
| **Icons & Design** | **Lucide React** | Lightweight, accessible SVG icons |
| **Test Runner** | **Node.js Native Test Suite** | 10 end-to-end user journeys executed in <500 ms |

---

## 👥 Multi-Role User Workflows

```
┌─────────────────────────────────────────────────────────────┐
│                      KitchenProof Ecosystem                  │
├──────────────┬──────────────────┬──────────────┬────────────┤
│  Consumers   │ Restaurant Owner │  Inspectors  │   Admin    │
│  (/explore)  │ (/dashboard/owner)│(/dashboard/  │(/dashboard/│
│              │                  │  inspector)  │   admin)   │
├──────────────┼──────────────────┼──────────────┼────────────┤
│ Search &     │ Upload lab tests │ 5-category   │ National   │
│ filter city  │ & pest contracts │ field audit  │ compliance │
│ kitchens     │ in digital vault │ rubric input │ governance │
│              │                  │              │            │
│ 100-pt score │ Request on-site  │ Verify /     │ Immutable  │
│ deconstruct  │ auditor review   │ reject vault │ audit log  │
│              │                  │ certificates │ streams    │
│ Bookmark &   │ View citizen     │ Automatic    │ Quarantine │
│ file reports │ CAPA feedback    │ score recalcs│ unverified │
└──────────────┴──────────────────┴──────────────┴────────────┘
```

---

## 📊 100-Point Scoring Methodology (FSSAI Schedule 4)

Kitchen safety scores are dynamically computed from on-site physical audit rubrics across five weighted categories:

$$\text{Safety Score} = \sum_{i=1}^{5} \left( \frac{\text{Score Obtained}_i}{\text{Max Score}_i} \times \text{Weight}_i \right)$$

1. **Personal Hygiene & Facility Sanitation (25%)**: Handwash stations, hairnets, clean uniforms, Form IX staff medical certificates.
2. **Food Handling, Storage & Preparation (25%)**: Color-coded cutting boards, raw/cooked segregation, FIFO labeling.
3. **Pest Control & Infestation Prevention (15%)**: Monthly commercial contracts, fly insect killers, rodent bait traps.
4. **Temperature Control & Cold Chain (15%)**: Chiller logs ($\le 4^\circ\text{C}$), hot-holding tables ($\ge 65^\circ\text{C}$).
5. **Kitchen Infrastructure & Water Potability (20%)**: IS 10500 potable water bacteriological tests, grease traps, FoSTaC supervisor certificate.

*Scores map to 1–5 Smiles (Excellent 90–100, Good 80–89, Fair 70–79, Needs Improvement 60–69, Action Required <60).*

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- Node.js 18.17+ or 20+
- Git

### 2. Clone and Install
```bash
git clone https://github.com/ramsharma4u/kitchenproof.git
cd kitchenproof
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```
*(The default `.env.example` points to `file:./dev.db` and is pre-configured for local testing).*

### 4. Database Setup & Seed Data
```bash
# Push Prisma schema to SQLite
npm run db:push

# Seed authentic restaurants & test accounts
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demonstration & Test Accounts

All accounts use password: `KitchenProof@123`

| Role | Email | Target Dashboard |
|---|---|---|
| **Platform Administrator** | `admin@kitchenproof.in` | `/dashboard/admin` |
| **Accredited Lead Auditor** | `dr.anil.inspector@example.com` | `/dashboard/inspector` |
| **Restaurant Owner** | `priya.owner@example.com` | `/dashboard/owner` |
| **Citizen Consumer** | `rahul.consumer@example.com` | `/dashboard/consumer` |

*(The `/login` screen includes 1-click preset buttons to instantly fill credentials for any role).*

---

## 🧪 Testing & Verification

Run the automated integration and workflow test suite:
```bash
npm test
```
Executes 10 automated user journeys covering:
1. User registration, password hashing (`bcryptjs`), and JWT session cookies (`jose`).
2. Search and multi-facet filtering (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Gurugram, Pune).
3. Kitchen profile hydration and 5-category score breakdown.
4. Watchlist bookmarking and un-saving.
5. Citizen hygiene incident report submission.
6. Owner document upload to compliance vault.
7. Inspector document verification and attestation.
8. Physical inspection scoring and automated score recalculation.
9. Historical score deltas and timestamp logging.
10. Anti-tampering score caps for unverified claims.

---

## 🚢 Deployment (Vercel Hobby Tier)

KitchenProof is engineered for zero-cost deployment on the Vercel Hobby Tier:

1. **Build Verification**:
   ```bash
   npm run build
   ```
2. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```
3. **Frontend-Only / Demonstration Mode**:
   When deployed without an external database, KitchenProof automatically activates **Interactive Demonstration Mode**, populating pre-audited restaurant profiles, compliance vaults, scoring consoles, and governance metrics.

---

## ⚖️ Regulatory & Legal Disclosures

- **Independent Platform**: KitchenProof is an independent consumer transparency ecosystem. We are neither a government agency nor a substitute for statutory inspections conducted by the Food Safety and Standards Authority of India (FSSAI) or municipal health authorities.
- **Accredited Verification**: Only documents reviewed and attested by certified third-party auditors display the `VERIFIED` status badge. Unverified self-reported claims are explicitly capped at a maximum ceiling score of 50/100.

---

## 📄 License

Licensed under the [MIT License](LICENSE).
