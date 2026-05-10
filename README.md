# OHRA GEO Operating System

**School project demo — local Next.js dashboard**

A single connected dashboard with 8 AI agent modules to help OHRA improve visibility in AI-generated search results (ChatGPT, Gemini, Perplexity) for Dutch car insurance.

---

## How to run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## What is GEO / AEO?

**GEO** = Generative Engine Optimization. Optimizing content so AI engines (ChatGPT, Gemini, Perplexity) cite and recommend your brand.

**AEO** = Answer Engine Optimization. Structuring content so AI assistants use your pages as the source of their answers.

Unlike traditional SEO (ranking in Google), GEO/AEO is about being _mentioned inside AI-generated answers_ — a fundamentally different challenge. OHRA currently has little/no blog content, making it nearly invisible in AI search results for Dutch car insurance.

---

## Agent 1 — Trend & CEP Discovery

### What it does

1. **Loads customer signal data** — fake Dutch car insurance questions, forum posts, reviews, and AI search queries
2. **Clusters signals into 12 themes** using simple keyword matching (no LLM needed)
3. **Detects Category Entry Points (CEPs)** — the moments in life that trigger insurance decisions
4. **Assigns intent stages** — Awareness → Consideration → Comparison → Purchase → Post-purchase
5. **Identifies competitor gaps** — where OHRA is mentioned far less than competitors
6. **Scores each opportunity** from 0–100 using five sub-scores
7. **Generates content recommendations** with format, title, GEO reason, and schema markup type
8. **Manages a human review workflow** — Approved, Rejected, Needs Review

### How the priority score works

```
Total Score (0–100) = Frequency + Commercial Relevance + Urgency + Competitor Gap + OHRA Opportunity
```

| Sub-score | Max | What it measures |
|-----------|-----|------------------|
| Frequency | 20 | How often this theme appears in customer signals |
| Commercial Relevance | 20 | Revenue potential for OHRA (predefined per theme) |
| Urgency | 20 | How time-sensitive the topic is |
| Competitor Gap | 20 | High=20, Medium=12, Low=5 — how absent OHRA is |
| OHRA Opportunity | 20 | How well OHRA's offering fits this theme |

### The OHRA Visibility Gap

```
Gap Level = f(competitor_density, ohra_density)

competitor_density = total_competitor_mentions / entries_in_theme
ohra_density       = ohra_mentions / entries_in_theme

High gap   → competitor_density > 0.4 AND ohra_density < 0.15
Medium gap → competitor_density > 0.2
Low gap    → everything else
```

### Why human review is included

OHRA operates in a regulated financial services sector. Content that is published without compliance and legal review could:
- Violate Dutch insurance advertising rules (AFM regulations)
- Make unsupported coverage claims
- Damage brand trust if factually incorrect

The dashboard flags every recommendation for human approval before any content enters the writing pipeline. This is not optional — it is the core safety gate of the system.

### Keyword clustering (no LLM)

Each theme has a list of Dutch keywords. The analyzer tests every entry against all keywords and assigns the entry to the first matching theme. Themes are ordered from most-specific to most-generic to avoid false matches.

---

## The Three-Layer Architecture

### Layer 1 — Content Generation (The Factory)
Agents 1–5 work together to discover opportunities, write briefs, draft content, check compliance, and verify technical GEO readiness.

### Layer 2 — Earned Media (The Trust Builder)
Agent 6 tracks OHRA's mentions on third-party platforms and identifies where competitors are being cited instead.

### Layer 3 — Freshness & Tracking (The Guard)
Agents 7–8 monitor published content for staleness and track OHRA's AEO score over time.

---

## How OHRA could scale this in real life

| Current (demo) | Real-world version |
|---|---|
| Fake CSV data | Real data from Reddit API, Google Search Console, review platforms |
| Keyword clustering | LLM-powered topic modeling (Claude/GPT) |
| Manual CSV upload | Automated daily ingestion pipeline |
| localStorage state | Database (PostgreSQL / Supabase) |
| No auth | Role-based access: marketing, compliance, editor |
| Manual export | CMS integration (Contentful, Prismic) |
| Static AEO scores | Weekly automated HubSpot AEO Grader pulls |

---

## Tech stack

- **Next.js 14** — App Router, TypeScript
- **Tailwind CSS** — utility-first styling
- **localStorage** — review status persistence
- **No backend, no database, no API keys**

---

## File structure

```
src/
├── types/
│   ├── index.ts          ← shared types
│   └── agent1.ts         ← Agent 1 specific types
├── data/
│   ├── kpis.ts           ← overview KPI data
│   ├── aeoScores.ts      ← HubSpot AEO Grader fake data
│   ├── pipeline.ts       ← content pipeline steps
│   ├── agents.ts         ← all 8 agent definitions
│   ├── agent1Themes.ts   ← 12 theme configs with CEPs and recommendations
│   └── agent1SampleData.ts ← 62 fake Dutch customer signals
├── lib/
│   ├── utils.ts          ← shared utilities
│   └── agent1Analyzer.ts ← clustering, gap detection, scoring, CSV parse/export
├── components/
│   ├── layout/           ← Sidebar, Header
│   ├── ui/               ← shared reusable components
│   └── agent1/           ← Agent 1 specific tab components
└── app/
    ├── page.tsx          ← Overview Dashboard
    └── agents/
        ├── trend-discovery/  ← Agent 1 (fully built)
        └── [6 other agents]/ ← placeholders (coming next)
```
