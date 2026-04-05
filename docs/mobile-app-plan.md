# Wrively Mobile App — Planning Document
### PM + UI/UX Lead + Tech Lead Alignment
**Date:** March 2026
**Status:** Planning phase

---

## 1. Why Mobile

Wrively's core promise is "3-minute posting habit." That habit lives in dead time — waiting for coffee, between meetings, on the commute. The browser works, but founders reach for their phone first.

| Signal | Data |
|---|---|
| Primary ICP behavior | Founders check LinkedIn on mobile 70%+ of the time |
| Core flow is short | Topic → 3 variations → copy → paste = fits mobile perfectly |
| Competitor gap | Taplio and AuthoredUp are desktop-only; no mobile-first Voice Layer exists |
| Habit formation | Mobile push notifications are the #1 driver for daily/weekly habits |
| Distribution | App Store presence = discoverability + brand credibility signal for investors/hires |

**Decision: build mobile.** But not as a full port — as a focused, habit-optimized companion.

---

## 2. What Platform

### Recommendation: React Native (Expo)

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **React Native (Expo)** | Shared JS/TS skills with web, one codebase for iOS+Android, fast iteration, Expo handles builds/OTA updates | Not fully native feel, large bundle | **Best fit** — team is already React + TypeScript |
| Flutter | Great performance, beautiful UI | New language (Dart), no code sharing with web | Rejected — learning curve, no reuse |
| Native (Swift + Kotlin) | Best performance, native feel | 2x engineering cost, 2x maintenance | Rejected — premature at this stage |
| PWA | Zero new code, works today | No push notifications (iOS), no App Store, feels second-class | Rejected — misses the core habit trigger (push) |

**Why not PWA:** iOS still blocks PWA push notifications in a reliable way. Push is the entire reason for mobile — without it, mobile adds no value over the responsive web.

---

## 3. What Ships in V1 (MVP)

The mobile app is NOT a full port of the web dashboard. It's a **habit tool** — fast generation, fast copy, fast post.

### Core Screens (5 total)

**Screen 1: Home (Today)**
- Today's posting prompt / suggestion
- Weekly tracker (Mon / Wed / Fri dots)
- One-tap "Write about this" CTA
- Recent post preview (last generated)

**Screen 2: Generate Post**
- Topic input (single field)
- Loading state → 3 variations (Safe / Bold / Spicy)
- Swipe between variations
- Copy button (one tap, haptic feedback)
- "Open LinkedIn" deep link button (after copy)

**Screen 3: Quick Actions**
- Rewrite Draft — paste rough text, get polished post
- Get Comments — paste post text, get 3 comment suggestions
- Remix a Post — paste someone else's post, get your version

**Screen 4: History**
- Scrollable list of past generations
- Filter by type (posts / comments / rewrites / remixes)
- Tap to expand → copy again

**Screen 5: Profile**
- Current plan + usage this month
- Voice Layer summary (persona preview)
- Settings (notifications, theme)
- Manage billing (opens Paddle portal)
- Sign out

### What's NOT in V1
- Onboarding wizard — users must complete onboarding on web first (too complex for mobile V1)
- Settings / brand editing — edit company, persona, tone on web
- Blog / tools / landing pages — web only
- Performance insights — web only
- Upgrade flow — deep link to web checkout (Paddle overlay doesn't work natively)

---

## 4. Technical Architecture

```
Mobile App (React Native / Expo)
    │
    ├── Auth: Supabase Auth (same instance as web)
    │         Session shared via same JWT
    │
    ├── API: Same Supabase Edge Functions
    │         generate-post, generate-comments,
    │         rewrite-draft, remix-post
    │
    ├── State: Zustand (same patterns as web)
    │
    ├── Push: Expo Notifications → Supabase
    │         Edge Function to schedule/send
    │
    └── Deep Links: wrively.com/app → App Store / Play Store
                    wrively://write?topic=...
```

### Key Decisions

**Shared backend:** Zero new API work. The mobile app calls the same Supabase Edge Functions as the web. Auth tokens are interchangeable.

**Offline support:** Not in V1. All generation requires an API call. Offline would only be useful for viewing history — not worth the complexity yet.

**Push notifications:** The single most important mobile feature.
- "Good morning — here's your topic for today" (configurable time, default 8am local)
- "You haven't posted this week yet" (Wed evening if no post generated Mon-Wed)
- Implementation: Expo push tokens stored in profiles, Edge Function cron sends notifications

**Deep linking:** After copying a post, show "Open LinkedIn" button that launches the LinkedIn app with a compose intent (Android) or URL scheme (iOS).

---

## 5. UI/UX Principles (from UI/UX Lead)

### Design System
- Same brand: #6366F1 indigo, Inter font, dark/light mode
- Mobile-specific: larger touch targets (48px min), bottom navigation, haptic feedback on copy
- No horizontal scrolling — single column everything
- Variation selector: horizontal swipe (card stack) not tabs

### Navigation
- Bottom tab bar: Home, Write, History, Profile (4 tabs)
- Quick Actions accessible from Home screen cards
- No hamburger menus, no drawers — everything is max 2 taps away

### Interactions
- Pull-to-refresh on Home and History
- Swipe left/right between variations (with dot indicators)
- Long-press on any post to copy
- Skeleton loading states (not spinners)
- Haptic feedback: light tap on copy, success on generation complete

### Typography
- Body: 16px minimum (iOS HIG and Material 3 both require this)
- Post preview: 15px, 1.6 line height (matches LinkedIn's native rendering)
- Labels/captions: 12-13px

---

## 6. Push Notification Strategy

Push is the habit engine. Get it right and retention doubles.

| Notification | When | Copy | Frequency |
|---|---|---|---|
| Morning prompt | User's chosen time (default 8am) | "Your topic for today: {AI-suggested topic}" | Daily on posting days (Mon/Wed/Fri) |
| Midweek nudge | Wednesday 6pm if no post this week | "You haven't posted this week. 3 minutes?" | Max 1x/week |
| Weekly recap | Sunday 10am | "This week: {n} posts generated. Keep the streak." | Weekly |
| Post copied but not posted | 2 hours after copy if no new copy event | "You copied a post earlier. Ready to publish?" | Max 1x/day |

**Rules:**
- Users can disable each category independently
- Never send more than 1 push per day
- No notifications in first 24 hours after install (let them settle in)
- Notification tap deep-links to the relevant screen (e.g., morning prompt → Generate with pre-filled topic)

---

## 7. Development Phases

### Phase 1 — Foundation (Weeks 1-3)
- Expo project setup, navigation, auth integration
- Supabase client configuration (shared with web)
- Home screen with weekly tracker
- Profile screen with plan/usage display

### Phase 2 — Core Generation (Weeks 4-6)
- Generate Post screen (topic → 3 variations → copy)
- Rewrite Draft screen
- Get Comments screen
- Remix screen
- Loading states, error handling, offline detection

### Phase 3 — History + Polish (Weeks 7-8)
- History screen with filters
- Pull-to-refresh, skeleton loading
- Haptic feedback, animations
- Dark/light mode

### Phase 4 — Push + Launch (Weeks 9-10)
- Push notification infrastructure (Expo + Edge Function cron)
- Notification preferences in Profile
- Deep linking (LinkedIn compose, universal links)
- App Store / Play Store submission
- Beta TestFlight / Internal Testing track

**Total estimate: 10 weeks to App Store submission**

---

## 8. Success Metrics

| Metric | Target (Month 3) | Why it matters |
|---|---|---|
| Mobile DAU / Total DAU | 40%+ | Proves mobile is where the habit lives |
| Posts generated via mobile | 30%+ of total | Core flow works on mobile |
| Push notification opt-in | 70%+ | Habit engine is active |
| Copy → LinkedIn open rate | 50%+ | Full funnel completes on mobile |
| App Store rating | 4.5+ | Social proof + ASO |
| Mobile retention (Week 4) | 35%+ | Habit is forming |

---

## 9. Risks + Mitigations

| Risk | Mitigation |
|---|---|
| App Store rejection (AI-generated content policies) | Clearly label as "AI-assisted writing tool," user reviews all content before posting |
| Push fatigue → uninstalls | Conservative defaults, per-category controls, frequency caps |
| Paddle checkout doesn't work in-app | Deep link to web checkout, handle plan sync via webhook (already built) |
| Onboarding gap (must use web first) | Show clear "Complete setup on web" screen with QR code / magic link for new users |
| React Native performance on low-end devices | Keep screens simple, lazy-load History, no heavy animations |

---

## 10. What We Explicitly Defer to V2

- In-app onboarding wizard
- In-app brand/persona editing
- Performance insights dashboard
- In-app upgrade flow (native IAP or embedded Paddle)
- Offline mode (cached history)
- Widget (iOS/Android home screen widget showing today's prompt)
- Apple Watch / Wear OS companion
- iPad-optimized layout

---

*Signed off by: PM, UI/UX Lead, Tech Lead*
*Next step: Expo project scaffold + auth integration (Phase 1, Week 1)*
