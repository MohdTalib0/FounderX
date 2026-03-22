# Wrively — Product Overview
> Last updated: March 2026

---

## What It Is

Wrively is an AI LinkedIn ghostwriter for founders and individual creators. It generates posts, rewrites drafts, remixes viral content, and suggests comments — all in the user's own voice, built from their brand context set up during onboarding.

Two modes: **Company brand** (posting as a startup) and **Individual** (posting as a person — founder, consultant, creator, executive).

---

## Tech Stack

- **Frontend:** React + TypeScript, Vite, Tailwind CSS, Zustand (auth store), React Router v6
- **Backend:** Supabase (Postgres, Auth, Edge Functions, RLS)
- **AI:** OpenRouter API — model configured via `OPENROUTER_MODEL_NAME` secret (currently `meta-llama/llama-3.3-70b-instruct`)
- **Hosting:** Netlify (frontend), Supabase (backend + edge functions)

---

## Plans

| Plan    | Posts/mo | Comments/mo | Rewrites/mo | Persona regen | History  |
|---------|----------|-------------|-------------|---------------|----------|
| Free    | 12       | 15          | 5           | 1 time        | 30 days  |
| Starter | 80       | 100         | 40          | Anytime       | 90 days  |
| Pro     | Unlimited| Unlimited   | Unlimited   | Anytime       | Full     |
| Beta    | Unlimited| Unlimited   | Unlimited   | Anytime       | Full     |

---

## User Flow

### 1. Landing / Public Pages
- `/` — Landing page with hero, features, pricing (Free + Starter + Pro cards)
- `/for-individuals` — Individual/personal brand landing
- `/pricing` — Full public pricing page with comparison table + FAQ
- `/login` — Sign in (email + password, eye toggle on password)
- `/signup` — Sign up (email + password, eye toggle)

### 2. Auth
- Email/password auth via Supabase Auth
- Email confirmation sent on signup with redirect to `/auth/callback`
- `/auth/callback` — handles token exchange, redirects to `/dashboard` or `/onboarding`

### 3. Onboarding (`/onboarding`)
Four-step flow, shown only to users who haven't completed onboarding.

**Step 0 — Mode select**
- "My company" (brand mode) or "Myself" (individual mode)
- Sets `is_individual` flag on the company record

**Step 1 — Identity**
- Brand: startup name + one-sentence description
- Individual: your name + what you do

**Step 2 — Stage / Role + Industry**
- Brand: Idea / MVP / Live / Scale
- Individual: Founder / Creator / Consultant / Executive (stored as stage values: idea/mvp/live/scale)
- Industry multi-select (AI/ML, SaaS, B2B, etc.)

**Step 3 — Audience + Goal**
- Target audience (free text)
- Primary goal: Get early users / Build audience / Attract investors / Hire

**Step 4 — Personality**
- The Builder (raw progress, build-in-public)
- The Storyteller (narrative, lessons)
- The Analyst (frameworks, data)
- The Contrarian (bold takes, debates)

**Generating screen** — animated 4-step progress while:
1. Company record saved to DB (`is_individual` set)
2. `generate-persona` edge function called → creates persona statement + 3 content pillars
3. `generate-post` edge function called on first content pillar → first post generated

**Reveal screen** — shows:
- Persona statement (typewriter animation)
- 3 content pillar pills
- First post (Bold variation) with Copy CTA
- "Try other versions →" → `/dashboard/write?postId=<id>`
- "I'll do this later" → `/dashboard?onboarded=1`

### 4. Dashboard (authenticated + onboarded)

All dashboard routes live under `/dashboard` inside `DashboardLayout` (sidebar + mobile nav).

---

## Dashboard Pages

### Home (`/dashboard`)

**Greeting** — time-aware (Good morning/afternoon/evening) + first name. Shows company name + stage/role badge.

**Today's Next Step strip** — smart contextual prompt (one at a time, priority order):
1. Rate a post that's been published 20-96 hours ago → links to History
2. Copy a post generated today but not yet copied → links to Write with postId
3. Generate today (if it's Mon/Wed/Fri and under 3 posts this week) → links to Write

**First-visit block** (`?onboarded=1`) — shows the generated post with 3-step checklist (brand created → post generated → post on LinkedIn), copy button, mark-as-posted.

**Weekly Plan card** (hidden on first visit) — 3 topic slots (Mon/Wed/Fri) generated from content pillars using a weekly rotation. Each slot shows: done/today/upcoming state, suggested topic, generate/write-again CTA.

**Founder Scoreboard** (after 3+ posts) — 3 stats: Published count, Copy rate %, Avg rating. Hidden if all zero.

**Persona strip** — shows persona statement + content pillar pills. Label: "Your founder brand" or "Your personal brand" (individual).

**Persona refresh prompt** — appears at 10/20/30/40 post milestones, dismissible.

**Weekly tracker + Quick actions** — side-by-side grid:
- Left: Mon/Wed/Fri dots (light up as week progresses), last week count
- Right: 4 quick action links (Write Post, Rewrite Draft, Get Comments, Remix a Post)

**Recent posts** (last 3) — each card shows variation badge, relative time, truncated text, 3 icons: open in Write (`PenLine`), quote card (`ImageDown`), copy (`CopyButton`). Header shows "Recent · last 3" with "View all →" link.

---

### Write Post (`/dashboard/write`)

Core feature. URL param: `?postId=<id>` loads existing post, `?topic=<text>` pre-fills topic.

**Topic input** — free text, generate button.

**3 variation tabs** — Safe / Bold / Spicy (controversial). Each tab shows the full post text.

**Per-post actions:**
- Copy (tracks `was_copied`, sets `selected_variation`)
- Image/quote card (`ImageDown`) — opens QuoteCard modal
- Adjust (`Sliders`) — 4 refinement options: Too formal / Too generic / Too long / Sounds AI (gated behind first copy)

**Post to LinkedIn** — marks as published, prompts "Did you post it?" confirmation strip (stays until dismissed).

**Rate it** (after publishing) — 1/2/3 star rating stored as `performance_rating`.

**Usage limit** — `UpgradeWall` shown when monthly post limit hit.

**New user gating** (`is_individual` + 0 copies + 0 published) — `Sliders` (Adjust) hidden until first copy. `ImageDown` always visible.

---

### Rewrite Draft (`/dashboard/rewrite`)

Paste a rough draft → AI rewrites it into a clean LinkedIn post.

**Output:**
- 3 hook options (swappable without regenerating)
- Full rewritten post using Hook 1 by default
- Copy, swap hooks

---

### Remix a Post (`/dashboard/remix`)

Paste any viral LinkedIn post → AI analyzes its structure and adapts it to the founder's voice.

**Output:**
- Analysis breakdown: Structure, Hook type, Tone, Why it works (colored chips)
- Adapted version card with copy button
- Saved to `remixed_posts` table

---

### Get Comments (`/dashboard/engage`)

Paste any LinkedIn post → AI generates 3 comments in the founder's voice.

**3 comment types:**
- Insightful — adds perspective, references specific post detail
- Curious — genuine question about a specific point
- Bold — respectful disagreement or strong take

Each comment has a copy button.

---

### History (`/dashboard/history`)

All generated content in one view. Filter tabs: All / Posts / Comments / Rewrites / Remixes.

**Post cards** — show variation badge, topic, timestamp, truncated text, expand/collapse, copy, quote card, publish toggle, rate.

**Comment cards** — show comment type, source post preview, copy.

**Rewrite cards** — show hooks (swappable), rewritten post, copy.

**Remix cards** — show source post preview, adapted version, expand/collapse, copy.

---

### Settings (`/dashboard/settings`)

- Edit company/brand info (name, description, audience, industry, stage, goal, personality, keywords, tone)
- Regenerate persona (calls `generate-persona` edge function again)
- Profile name/email display

---

### Plans & Usage (`/dashboard/upgrade`)

Available to all logged-in users. Shows:

**Current usage section** — progress bars for posts / comments / rewrites used vs limit this month. Color coded: normal → amber at 80% → red at 100%. Shows "resets in X days".

**Plan cards** (free/starter users only) — Starter ($9/mo) and Pro ($19/mo) cards. Current plan dimmed. Next logical plan highlighted with primary accent. CTAs send a mailto for now.

**Pro/Beta users** — just usage bars + green "no limits" confirmation.

---

## Navigation

### Sidebar (desktop, 220px fixed left)
**Create section:** Home, Write Post, Rewrite Draft, Remix a Post
**Engage section:** Get Comments
**Library section:** History, Settings

**Bottom of sidebar:**
- Usage bar (posts used / limit) — free + starter only
- "X of Y posts left / Upgrade to Pro →" nudge — links to `/dashboard/upgrade`
- User avatar (initial), name, plan badge
- Sign out button

### Mobile Nav (bottom bar, 5 items)
Home · Write · Rewrite · Engage · History

Remix is sidebar-only on mobile (occasional use feature).

---

## Edge Functions (Supabase)

All functions share `_shared/openrouter.ts` (API calls, 25s timeout) and `_shared/prompts.ts` (prompt builders + parsers).

| Function | What it does |
|---|---|
| `generate-persona` | Creates persona statement + 3 content pillars from company data |
| `generate-post` | Generates 3 post variations (Safe/Bold/Debate) + debate retry logic |
| `generate-comments` | Generates 3 comments (Insightful/Curious/Bold) |
| `rewrite-draft` | Rewrites rough draft → 3 hooks + full post |
| `refine-post` | Refines a single post (too formal/generic/long/AI-sounding) |
| `remix-post` | Analyzes viral post + writes adapted version |

**Model:** Configured via `OPENROUTER_MODEL_NAME` Supabase secret. Default: `meta-llama/llama-3.3-70b-instruct`.

---

## Key DB Tables

| Table | Purpose |
|---|---|
| `profiles` | User plan, usage counters, onboarded flag, full name |
| `companies` | Brand context — name, description, persona, pillars, `is_individual` |
| `generated_posts` | All 3 variations per generation, copy/publish/rating tracking |
| `generated_comments` | Comments per source post |
| `rewritten_drafts` | Rewrite outputs with hooks |
| `remixed_posts` | Remix outputs with analysis + adapted version |

---

## Individual vs Company Mode

`is_individual` flag on the `companies` table drives all conditional behavior:

- **Onboarding:** "What's your name?" vs "What's your startup called?", Role picker vs Stage picker
- **AI prompts:** `PERSONAL BRAND: Name (individual)` vs `COMPANY: Name: description`, `ROLE: Founder` vs `STAGE: mvp`
- **Dashboard:** "Your personal brand" vs "Your founder brand" label
- **Stage badge:** Shows role (Founder/Creator/Consultant/Executive) vs startup stage (Idea/MVP/Live/Scale)
