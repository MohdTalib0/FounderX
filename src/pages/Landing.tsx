import { Link } from 'react-router-dom'
import { Zap, ArrowRight, Copy, Check } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-primary-gradient rounded-lg flex items-center justify-center">
              <Zap className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">FounderX</span>
          </Link>

          {/* Centre nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {[
              { to: '/#how-it-works', label: 'How it works' },
              { to: '/pricing', label: 'Pricing' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm px-3.5 py-1.5 text-text-muted hover:text-text rounded-btn hover:bg-surface-hover transition-all duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/login"
              className="hidden sm:flex items-center text-sm px-3.5 py-1.5 rounded-btn border border-border text-text-muted hover:border-border-hover hover:text-text transition-all duration-150"
            >
              Sign in
            </Link>
            <Link to="/signup">
              <Button size="sm">Start free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-12">
        {/* Reduced glow — hero only, 30% softer than before */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] bg-primary/[0.04] rounded-full blur-3xl" />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 border border-primary/25 bg-primary/[0.06] text-primary text-xs font-medium px-3 py-1.5 rounded-pill mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Free beta · first 50 founders
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight mb-5">
              LinkedIn posts that<br />
              actually sound<br />
              <span className="text-primary">like you.</span>
            </h1>

            <p className="text-base text-text-muted leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              Go from blank page to a post you'd actually publish, in under 3 minutes.
              FounderX builds your founder voice first, then writes every post from it.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-4">
              <Link to="/signup">
                <Button size="lg" className="px-7">
                  Start free in 2 minutes
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link
                to="/login"
                className="text-sm text-text-muted hover:text-text transition-colors"
              >
                Already have an account →
              </Link>
            </div>

            {/* Trust row */}
            <p className="text-xs text-text-subtle">
              No credit card · 2-minute setup · Cancel anytime
            </p>
          </div>

          {/* Right: product demo card — only elevated surface in this section */}
          <div className="flex-1 w-full max-w-sm lg:max-w-none">
            <ProductDemoCard />
          </div>
        </div>
      </section>

      {/* ── 2. Proof — stats + testimonial ───────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        {/* Stats — border-y only, no card */}
        <div className="border-y border-border py-7">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: '< 3 min', label: 'From open to first post copied' },
              { value: '3×/week', label: 'Habit the product is built around' },
              { value: '40+', label: 'Founders in the beta' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-xl font-bold text-text">{value}</p>
                <p className="text-xs text-text-muted mt-1 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial — no card, just text */}
        <div className="max-w-xl mx-auto text-center pt-9">
          <p className="text-sm text-text leading-relaxed">
            "I posted twice in 2023, got 8 likes each time, and quit. I've now posted every week for 6 weeks.
            Two investors reached out from my posts. I didn't change. My process did."
          </p>
          <p className="text-xs text-text-muted mt-3">— Alex R., Seed-stage SaaS founder</p>
        </div>
      </section>

      {/* ── 3. How it works ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-xl font-semibold text-center mb-10">How it works</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              title: 'Build your voice',
              body: '4 questions, 2 minutes. FounderX creates your founder persona and content pillars — used in every post, forever.',
            },
            {
              step: '02',
              title: 'Get 3 variations',
              body: 'Type a topic or pick from your pillars. Get Safe, Bold, and Controversial posts — all in your voice. Pick the one that feels right.',
            },
            {
              step: '03',
              title: 'Copy and post',
              body: 'One click to copy. Paste into LinkedIn. No scheduling, no editing marathons, no second-guessing.',
            },
          ].map(({ step, title, body }) => (
            <div key={step} className="bg-surface border border-border rounded-card p-5">
              <div className="w-7 h-7 rounded-btn bg-primary/[0.08] border border-primary/20 flex items-center justify-center mb-4">
                <span className="text-xs font-bold text-primary">{step}</span>
              </div>
              <h3 className="font-semibold text-text mb-1.5">{title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Pricing ───────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-xl font-semibold">Start free. Upgrade when you're posting.</h2>
          <p className="text-sm text-text-muted mt-2">
            No credit card required to start.{' '}
            <Link to="/pricing" className="text-primary hover:text-primary-hover transition-colors">
              See all plans →
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Free — flat tier */}
          <div className="bg-surface border border-border rounded-card p-6 space-y-5">
            <div>
              <p className="font-semibold text-text">Free</p>
              <p className="text-3xl font-bold text-text mt-1">$0</p>
              <p className="text-xs text-text-muted mt-2">For founders just starting out.</p>
            </div>
            <ul className="space-y-2.5">
              {[
                { text: '12 posts / month', sub: 'Enough for 3 posts/week your first month' },
                { text: '15 comment suggestions', sub: null },
                { text: '5 draft rewrites', sub: null },
                { text: 'Founder persona (1 generation)', sub: null },
              ].map(({ text, sub }) => (
                <li key={text} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-text-muted">{text}</p>
                    {sub && <p className="text-xs text-text-subtle mt-0.5">{sub}</p>}
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/signup" className="block">
              <Button variant="secondary" className="w-full">Start free</Button>
            </Link>
          </div>

          {/* Pro — only elevated surface in this section */}
          <div className="relative bg-surface border border-primary/30 rounded-card p-6 space-y-5 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div>
              <p className="font-semibold text-text">Pro</p>
              <div className="flex items-baseline gap-1 mt-1">
                <p className="text-3xl font-bold text-text">$19</p>
                <p className="text-sm text-text-muted">/month</p>
              </div>
              <p className="text-xs text-text-muted mt-2">For founders posting consistently.</p>
            </div>
            <ul className="space-y-2.5">
              {[
                'Unlimited posts, comments & rewrites',
                'Regenerate persona anytime',
                'Full content history',
                'Priority AI — faster responses',
                'AI learns what works for you over time',
              ].map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-text-muted">
                  <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="block">
              <Button className="w-full">Start free, upgrade anytime</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Final nudge — pure typography, no card ────────────────────── */}
      <section className="max-w-xl mx-auto px-6 pb-28 text-center">
        <h2 className="text-xl font-semibold mb-3">One habit. Your voice. Starting today.</h2>
        <p className="text-sm text-text-muted mb-8">
          3 minutes a day. No blank pages. No sounding like everyone else.
        </p>
        <Link to="/signup">
          <Button size="lg" className="px-8">
            Start free in 2 minutes
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-gradient rounded-md flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-text-muted">FounderX</span>
          </div>
          <p className="text-xs text-text-subtle">© 2025 FounderX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

// ─── Product Demo Card ────────────────────────────────────────────────────────

function ProductDemoCard() {
  return (
    <div className="bg-surface border border-border rounded-card shadow-card-hover overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-elevated">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
        </div>
        <p className="text-xs text-text-subtle ml-1">Write Post · FounderX</p>
      </div>

      <div className="p-4 space-y-3">
        {/* Input preview */}
        <div className="bg-background border border-border rounded-input px-3 py-2 text-xs text-text-subtle">
          Why we almost quit last month...
        </div>

        {/* Variations */}
        <DemoVariation
          badge="SAFE"
          badgeColor="text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20"
          text="Nobody told me that launching an MVP would mean watching users ignore features you spent 3 months building. Here's what changed everything for us."
          active={false}
        />
        <DemoVariation
          badge="BOLD"
          badgeColor="text-amber-400 bg-amber-500/[0.08] border-amber-500/20"
          text="Most founders lie about their launch. I won't. We shipped to 200 users and got 3 replies. This is what we learned the hard way."
          active
        />
        <DemoVariation
          badge="CONTROVERSIAL"
          badgeColor="text-red-400 bg-red-500/[0.08] border-red-500/20"
          text="The advice to 'launch fast and learn' is ruining early-stage startups. Here's the uncomfortable truth nobody talks about."
          active={false}
        />
      </div>
    </div>
  )
}

function DemoVariation({ badge, badgeColor, text, active }: {
  badge: string
  badgeColor: string
  text: string
  active: boolean
}) {
  return (
    <div className={`rounded-[8px] border p-3 space-y-2 ${
      active ? 'border-primary/40 bg-primary/[0.06]' : 'border-border bg-background'
    }`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badgeColor}`}>
          {badge}
        </span>
        {active && (
          <div className="flex items-center gap-1 text-[10px] text-primary">
            <Copy className="w-3 h-3" />
            Copy
          </div>
        )}
      </div>
      <p className="text-[11px] text-text-muted leading-relaxed line-clamp-3">{text}</p>
    </div>
  )
}
