# Wrively — Future Enhancements & Phase Roadmap
### PM + UI/UX Lead + Tech Lead Alignment
**Date:** March 2026
**Status:** Living document — updated monthly

---

## Current State (March 2026)

### What's shipped
- Onboarding wizard (4 questions → persona → first post)
- Write Post (3 variations: Safe / Bold / Spicy)
- Rewrite Draft (rough text → polished post + 3 hooks)
- Get Comments (3 typed comments: Insightful / Curious / Bold)
- Remix a Post (steal a structure, make it yours)
- History (all content types, performance ratings)
- Settings (brand, persona, account, password, notifications)
- Free tools (Headline Analyzer, Post Checker, Voice Analyzer)
- Paddle billing (Free / Starter $9 / Pro $19)
- SEO pages (blog, comparisons, persona pages, hook examples, post examples)
- Light + dark mode
- Email templates (confirm signup, reset password)

### Stack
Vite + React + TypeScript, Tailwind CSS, Supabase (DB + Auth + Edge Functions), OpenRouter (AI), Paddle (billing), Netlify (hosting)

---

## Phase 1 — Strengthen the Core (April 2026)
*Theme: Make existing features better before adding new ones*

### 1.1 Post Scheduling Prep
**What:** After generating a post, let users set a reminder: "Post this on Wednesday at 9am"
**Why:** The gap between "copy" and "post on LinkedIn" is where habit breaks. A reminder closes it.
**How:** Local push notification (mobile) / email reminder (web). NOT auto-posting — users stay in control.
**Complexity:** Low (Edge Function cron + push notification)

### 1.2 LinkedIn Profile Import (Paste-Based)
**What:** During onboarding or in Settings, add a field: "Paste your LinkedIn headline and About section." Feed it into persona generation for richer, more accurate voice.
**Why:** The 4 onboarding questions are good but generic. LinkedIn About + headline contain real positioning language, industry context, and writing tone signals.
**How:** Text field → stored on company record → injected into persona generation prompt
**Complexity:** Low

### 1.3 Post Performance Tracking
**What:** After posting on LinkedIn, user returns and logs: impressions, comments, reposts. Wrively shows which variation style (Safe/Bold/Spicy) performs best for them over time.
**Why:** Closes the feedback loop. Currently Wrively generates but never learns from real-world results.
**How:** Manual input (LinkedIn doesn't provide API for post analytics). Simple form: "How did it do?" + 3 fields. Store in generated_posts table.
**Complexity:** Low-Medium

### 1.4 Variation Refinement Controls
**What:** After generating, user can tweak: "Make it shorter" / "More specific" / "Less formal" / "Add a CTA" — regenerates just that variation, not all three.
**Why:** The current "Refine" flow exists but is limited. Per-variation refinement makes the output 90% right instead of 70%.
**How:** Additional AI call with the original variation + refinement instruction. Single variation regeneration.
**Complexity:** Medium

### 1.5 Topic Suggestions Engine
**What:** Dashboard shows 3 AI-suggested topics daily based on: industry, company stage, recent posts (avoid repeats), trending themes.
**Why:** "What should I post about?" is the #1 reason founders don't open Wrively on a given day. Remove the decision.
**How:** Edge Function cron (daily) → generates 3 topics → stores in DB → shown on Dashboard
**Complexity:** Medium

---

## Phase 2 — Growth Loops (June 2026)
*Theme: Turn users into distribution*

### 2.1 Referral System
**What:** Each user gets a referral link. Referred user signs up → referrer gets 1 month of Starter free. Referred user gets extended free trial (20 posts instead of 12 first month).
**Why:** Founder-to-founder word of mouth is the highest-converting channel. Incentivize it.
**How:** `referrals` table already exists. Add referral link generation, tracking, and reward fulfillment via Paddle coupon codes.
**Complexity:** Medium

### 2.2 Public Voice Layer Page
**What:** Users can optionally publish their Voice Layer as a public page: `wrively.com/@username`. Shows: persona summary, writing style, sample topics, CTA to try Wrively.
**Why:** Founders share "how I built my posting system" on LinkedIn all the time. Give them a page to link to that drives signups.
**How:** Public route, server-rendered, pulls from company/persona data.
**Complexity:** Medium

### 2.3 Team / Multi-Brand Support
**What:** One account can manage multiple brand voices (e.g., personal + company page). Switch between them without logging out.
**Why:** Founders often post from personal AND company accounts. Consultants manage multiple clients.
**How:** Multiple companies per user (already supported in DB). Add a brand switcher in the sidebar.
**Complexity:** Low (DB supports it, UI needs the switcher)

### 2.4 Content Calendar View
**What:** Weekly view showing: which days you posted, which days you have drafts ready, suggested topics for empty days.
**Why:** Visual accountability. Founders who see 3 green dots (Mon/Wed/Fri) feel momentum. Empty dots create healthy urgency.
**How:** Read from generated_posts (was_copied + created_at) + topic suggestions. Calendar grid UI component.
**Complexity:** Medium

---

## Phase 3 — Intelligence Layer (September 2026)
*Theme: Wrively gets smarter the more you use it*

### 3.1 Voice Evolution
**What:** After every 20 posts, Wrively re-analyzes your Voice Layer: "Your writing has shifted — you're using more storytelling hooks and shorter sentences. Update your persona?" One-click accept.
**Why:** Your voice evolves. A persona built 6 months ago may not match how you write today. Writely should grow with you.
**How:** Periodic analysis job (Edge Function) that compares recent posts against original persona. Suggest delta.
**Complexity:** Medium-High

### 3.2 Engagement Pattern Analysis
**What:** Based on logged performance data (Phase 1.3), Wrively identifies patterns: "Your Bold posts on Tuesdays get 2x more engagement than Safe posts on Fridays."
**Why:** Personalized posting strategy based on actual data, not generic LinkedIn advice.
**How:** Requires sufficient data (50+ posts with performance logged). Statistical analysis + AI summary.
**Complexity:** High (requires data accumulation first)

### 3.3 Hook Library (Personal)
**What:** Wrively auto-extracts every hook you've used, categorizes them, and shows which ones performed best. "Your top hooks: Contrarian (avg 47 comments), Story (avg 32 comments)."
**Why:** Hooks are the #1 driver of LinkedIn post performance. Knowing your best hooks is a competitive advantage.
**How:** Parse first 2 lines of every generated post, classify hook type, correlate with performance.
**Complexity:** Medium

### 3.4 Competitor Voice Comparison
**What:** Paste a competitor's LinkedIn profile URL → Wrively analyzes their posting style, frequency, hook patterns → shows how your voice differs.
**Why:** Differentiation is hard when everyone sounds the same. Seeing the contrast helps founders sharpen their positioning.
**How:** User pastes 3-5 of competitor's posts (we can't scrape LinkedIn). AI compares against your Voice Layer.
**Complexity:** Medium

### 3.5 Priority AI (Pro Feature)
**What:** Pro users get faster AI responses using higher-quality models (Claude 3.5 Sonnet) instead of the default model.
**Why:** Speed and quality differentiation for paying users. Listed as a Pro feature since launch — need to actually implement it.
**How:** Check plan in Edge Function → route to different OpenRouter model. Already partially supported in openrouter.ts.
**Complexity:** Low

---

## Phase 4 — Platform (January 2027)
*Theme: From tool to platform*

### 4.1 API Access (Pro+)
**What:** REST API for programmatic post generation. Developers and agencies can integrate Wrively into their workflows.
**Why:** Opens enterprise/agency segment. API customers have highest LTV in SaaS.
**How:** New API keys system, rate limiting, documentation. Edge Functions already are the API — add auth key layer.
**Complexity:** Medium-High

### 4.2 Chrome Extension
**What:** When browsing LinkedIn, highlight any post → right-click → "Remix with Wrively" / "Generate comment with Wrively." Results appear in a side panel.
**Why:** Meet the user where they already are. Zero context switching.
**How:** Chrome extension that calls existing Edge Functions. OAuth with Supabase session.
**Complexity:** Medium

### 4.3 LinkedIn Carousel Generator
**What:** Turn any Wrively post into a carousel (PDF slide deck optimized for LinkedIn). Choose template, colors adapt to brand.
**Why:** Carousels get 3x the engagement of text posts on LinkedIn. High-value Pro feature.
**How:** HTML → PDF generation (server-side). Template system with brand color injection.
**Complexity:** High

### 4.4 AI Voice Training (Advanced)
**What:** Upload 10+ of your best LinkedIn posts. Wrively fine-tunes its understanding of your voice beyond the 4 onboarding questions.
**Why:** For power users who want output that's indistinguishable from their own writing. Premium differentiator.
**How:** Few-shot learning: store exemplar posts, inject into system prompt. Not actual model fine-tuning.
**Complexity:** Medium

### 4.5 Multi-Platform Support
**What:** Generate content for Twitter/X, Threads, and Substack — adapted from the same Voice Layer.
**Why:** Founders who post on LinkedIn often want to cross-post. Same voice, different format.
**How:** Platform-specific output formatting and length constraints. Same AI pipeline, different output rules.
**Complexity:** Medium-High

---

## Phase 5 — Enterprise (H2 2027)
*Theme: Teams and organizations*

### 5.1 Team Plan
- Shared brand voice across team members
- Admin dashboard: usage per member, content approval workflow
- Centralized billing
- SSO (SAML/OIDC)

### 5.2 Content Approval Workflow
- Team member generates → manager approves → copy enabled
- Comment/feedback thread on each draft
- Audit log of all content generated

### 5.3 Brand Voice Guidelines
- Admin sets guardrails: "never mention competitor X", "always include company hashtag", "avoid these words"
- AI respects these constraints in every generation

### 5.4 Analytics Dashboard
- Team-wide posting frequency, engagement trends, voice consistency scores
- Export reports (PDF/CSV)
- Integration with LinkedIn analytics (if API access becomes available)

---

## Prioritization Framework

Every feature is evaluated on 3 axes:

| Axis | Weight | Question |
|---|---|---|
| **Habit impact** | 40% | Does this make users post more consistently? |
| **Revenue impact** | 35% | Does this drive upgrades or reduce churn? |
| **Engineering effort** | 25% | Can we ship it in < 2 weeks? (bonus if yes) |

**The rule:** If a feature doesn't make the 3-minute flow faster or the posting habit stronger, it waits. Wrively is a habit tool, not a feature warehouse.

---

## Tech Debt & Infrastructure (Ongoing)

These are not features but are required to support the roadmap:

| Item | Priority | Phase |
|---|---|---|
| SSR / prerendering for public pages (SEO) | High | Phase 1 |
| Sitemap.xml auto-generation | High | Phase 1 |
| robots.txt (block /dashboard, /onboarding) | High | Phase 1 |
| Rate limiting on Edge Functions | Medium | Phase 2 |
| Error monitoring (Sentry integration) | Medium | Phase 1 |
| Database connection pooling (PgBouncer) | Medium | Phase 3 |
| CDN for generated images/assets | Low | Phase 3 |
| Automated testing (Playwright for critical flows) | Medium | Phase 2 |
| CI/CD pipeline (auto-deploy on merge to main) | Medium | Phase 1 |

---

## Decision Log

| Date | Decision | Rationale |
|---|---|---|
| Mar 2026 | Paddle over Stripe | Merchant of Record = zero tax/compliance overhead |
| Mar 2026 | 3 tiers (Free/Starter/Pro) over 2 | Starter at $9 reduces friction; Pro at $19 captures power users |
| Mar 2026 | No free trial | Free tier IS the trial. Habit products need time, not a clock. |
| Mar 2026 | No auto-posting to LinkedIn | Users stay in control. Compliance risk. Trust signal. |
| Mar 2026 | React Native for mobile | Shared TS skills, single codebase, Expo handles distribution |
| Mar 2026 | Paste-based LinkedIn import | No reliable scraping API exists post-Proxycurl. Paste is free and instant. |

---

*Document owner: PM*
*Contributors: UI/UX Lead, Tech Lead*
*Review cadence: Monthly — first Monday*
*Next review: April 7, 2026*
