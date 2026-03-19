import { Link } from 'react-router-dom'
import { ArrowRight, Copy, Check, PenLine, RefreshCw, MessageSquare, Sparkles, Zap } from 'lucide-react'
import Button from '@/components/ui/Button'
import PublicHeader from '@/components/layout/PublicHeader'
import { cn } from '@/lib/utils'

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">

      <PublicHeader />

      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-12">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] bg-primary/[0.05] rounded-full blur-3xl" />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
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

            <p className="text-base text-text-muted leading-relaxed mb-3 max-w-md mx-auto lg:mx-0">
              You tried posting before. It didn't land. Not because you had nothing to say,
              but because the posts didn't sound like you.
            </p>
            <p className="text-base text-text-muted leading-relaxed mb-2 max-w-md mx-auto lg:mx-0">
              FounderX builds your voice first, then writes every post from it.
              Works for founders, consultants, executives, and creators.
              Blank page to published in under 3 minutes.
            </p>
            <p className="text-sm mb-8 max-w-md mx-auto lg:mx-0">
              <Link to="/for-individuals" className="text-primary hover:text-primary-hover transition-colors">
                Not a startup? Personal brand mode →
              </Link>
            </p>

            <div className="flex flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-4 flex-wrap">
              <Link to="/signup">
                <Button size="lg" className="px-7">
                  Start free in 2 minutes
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login" className="text-sm text-text-muted hover:text-text transition-colors">
                Already have an account →
              </Link>
            </div>

            <p className="text-xs text-text-subtle">
              No credit card · 2-minute setup · Cancel anytime
            </p>
          </div>

          <div className="flex-1 w-full max-w-sm lg:max-w-none">
            <ProductDemoCard />
          </div>
        </div>
      </section>

      {/* ── 2. Stats bar ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="border-y border-border py-7">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: '< 3 min', label: 'From open to first post copied' },
              { value: '3x/week', label: 'Posting habit the product is built around' },
              { value: '40+', label: 'Founders and creators already in the beta' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-xl font-bold text-text">{value}</p>
                <p className="text-xs text-text-muted mt-1 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Problem ───────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-3">Sound familiar?</p>
          <h2 className="text-2xl font-bold tracking-tight">Three things kill it every time.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              emoji: '💭',
              color: 'from-violet-500/[0.06] to-transparent border-violet-500/20 hover:border-violet-500/40',
              iconBg: 'bg-violet-500/10 text-violet-400',
              title: '"What do I even write about?"',
              body: 'You open a blank box. Nothing comes. You close it. Tell yourself you\'ll do it tomorrow.',
            },
            {
              emoji: '🤦',
              color: 'from-amber-500/[0.06] to-transparent border-amber-500/20 hover:border-amber-500/40',
              iconBg: 'bg-amber-500/10 text-amber-400',
              title: '"This sounds generic. Not me."',
              body: 'The post you write could apply to any founder on earth. You delete it and feel worse than before.',
            },
            {
              emoji: '😤',
              color: 'from-red-500/[0.06] to-transparent border-red-500/20 hover:border-red-500/40',
              iconBg: 'bg-red-500/10 text-red-400',
              title: 'You quit. Again.',
              body: 'Three posts, no traction, no system. You decide LinkedIn isn\'t worth it and stop trying.',
            },
          ].map(({ emoji, color, iconBg, title, body }) => (
            <div
              key={title}
              className={cn(
                'rounded-card border p-6 bg-gradient-to-b transition-all duration-200 space-y-4',
                color
              )}
            >
              <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center text-2xl', iconBg)}>
                {emoji}
              </div>
              <div>
                <h3 className="font-semibold text-text leading-snug mb-2">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-text-muted max-w-lg mx-auto">
            FounderX fixes all three. Topic suggestions from your pillars, posts written in your voice,
            fast enough to actually stick.
          </p>
        </div>
      </section>

      {/* ── 4. How it works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-xl font-semibold text-center mb-10">How it works</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
          {/* Connector line — desktop only */}
          <div className="hidden sm:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-border via-primary/30 to-border" />

          {[
            {
              step: 1,
              title: 'Build your voice',
              body: '4 questions, 2 minutes. FounderX creates your founder persona and content pillars used in every post forever.',
              icon: Sparkles,
            },
            {
              step: 2,
              title: 'Get 3 variations',
              body: 'Type a topic or pick from your pillars. Safe, Bold, Controversial posts, all in your voice. Pick one.',
              icon: PenLine,
            },
            {
              step: 3,
              title: 'Copy and post',
              body: 'One click to copy. Paste into LinkedIn. No scheduling, no editing marathons, no second-guessing.',
              icon: Copy,
            },
          ].map(({ step, title, body, icon: Icon }) => (
            <div key={step} className="relative bg-surface border border-border rounded-card p-5 hover:border-primary/30 transition-colors group">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-9 h-9 rounded-full bg-surface border-2 border-border group-hover:border-primary/40 flex items-center justify-center transition-colors shrink-0 z-10">
                  <span className="text-xs font-bold text-text-muted group-hover:text-primary transition-colors">{step}</span>
                </div>
                <Icon className="w-4 h-4 text-text-subtle group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-text mb-1.5">{title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Features bento ────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h2 className="text-xl font-semibold">Everything you need to show up.</h2>
          <p className="text-sm text-text-muted mt-2">Four tools. One habit.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Write Post — featured, spans 2 cols, has inline demo */}
          <div className="lg:col-span-2 relative bg-surface border border-primary/25 rounded-card p-6 overflow-hidden group hover:border-primary/40 transition-colors">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                  <PenLine className="w-5 h-5 text-primary" />
                </div>
                <p className="text-[10px] font-bold tracking-widest text-text-subtle uppercase mb-1">Write Post</p>
                <h3 className="text-lg font-bold text-text">3 variations, in your voice.</h3>
                <p className="text-sm text-text-muted mt-1 max-w-xs">
                  Every post comes from your persona. Pick Safe, Bold, or Controversial. One click to copy.
                </p>
              </div>
            </div>

            {/* Mini demo */}
            <div className="space-y-2">
              {[
                { label: 'SAFE', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.06]', text: 'Nobody told me launching an MVP would mean watching users ignore everything you built.' },
                { label: 'BOLD', color: 'text-amber-400 border-amber-500/20 bg-amber-500/[0.08]', text: 'Most founders lie about their launch. I won\'t. We shipped to 200 users and got 3 replies.', active: true },
                { label: 'HOT TAKE', color: 'text-red-400 border-red-500/20 bg-red-500/[0.06]', text: 'The advice to "launch fast" is ruining early-stage startups. Here\'s the uncomfortable truth.' },
              ].map(({ label, color, text, active }) => (
                <div key={label} className={cn(
                  'rounded-lg border px-3 py-2 flex items-start gap-2.5',
                  active ? 'border-primary/30 bg-primary/[0.05]' : 'border-border bg-background'
                )}>
                  <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 mt-0.5', color)}>{label}</span>
                  <p className="text-[11px] text-text-muted leading-relaxed line-clamp-1">{text}</p>
                  {active && <Copy className="w-3 h-3 text-primary shrink-0 mt-0.5 ml-auto" />}
                </div>
              ))}
            </div>
          </div>

          {/* Founder Persona */}
          <div className="relative bg-surface border border-border rounded-card p-6 overflow-hidden hover:border-primary/25 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <p className="text-[10px] font-bold tracking-widest text-text-subtle uppercase mb-1">Your Persona</p>
            <h3 className="font-bold text-text mb-2">Your voice, built once.</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              Set up in 2 minutes. Used in every post, comment, and rewrite forever.
            </p>
            {/* Content pillar chips */}
            <div className="flex flex-wrap gap-1.5">
              {['Build in public', 'Lessons learned', 'Contrarian takes'].map(p => (
                <span key={p} className="text-[10px] font-medium px-2 py-1 rounded-full border border-primary/20 bg-primary/[0.06] text-primary">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Rewrite Draft */}
          <div className="relative bg-surface border border-border rounded-card p-6 overflow-hidden hover:border-amber-500/25 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
              <RefreshCw className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-[10px] font-bold tracking-widest text-text-subtle uppercase mb-1">Rewrite Draft</p>
            <h3 className="font-bold text-text mb-2">Rough notes to real post.</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              Paste a brain dump. FounderX turns your messy ideas into a structured post that still sounds like you.
            </p>
            {/* Before/after snippet */}
            <div className="space-y-2">
              <div className="rounded-lg border border-border bg-background px-3 py-2">
                <p className="text-[10px] text-text-subtle mb-1">ROUGH</p>
                <p className="text-[11px] text-text-muted italic">"so yesterday customer call and they basically said the whole product is wrong..."</p>
              </div>
              <div className="text-center text-text-subtle text-xs">↓</div>
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.04] px-3 py-2">
                <p className="text-[10px] text-amber-400 mb-1">POLISHED</p>
                <p className="text-[11px] text-text-muted">"A customer call yesterday made me rethink our entire product direction."</p>
              </div>
            </div>
          </div>

          {/* Comment Suggestions */}
          <div className="relative bg-surface border border-border rounded-card p-6 overflow-hidden hover:border-sky-500/25 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-sky-400" />
            </div>
            <p className="text-[10px] font-bold tracking-widest text-text-subtle uppercase mb-1">Comment Suggestions</p>
            <h3 className="font-bold text-text mb-2">Engage without the cringe.</h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              3 smart comments on any post. Never "Great insight!" spam.
            </p>
            {/* Comment type badges */}
            <div className="space-y-2">
              {[
                { label: 'Insightful', color: 'border-sky-500/20 bg-sky-500/[0.06] text-sky-400' },
                { label: 'Curious', color: 'border-violet-500/20 bg-violet-500/[0.06] text-violet-400' },
                { label: 'Bold take', color: 'border-red-500/20 bg-red-500/[0.06] text-red-400' },
              ].map(({ label, color }) => (
                <div key={label} className={cn('rounded-lg border px-3 py-1.5 text-[11px] font-medium', color)}>
                  {label}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── 6. Testimonial ───────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="relative bg-surface border border-border rounded-card p-8 text-center overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="text-5xl text-primary/20 font-serif leading-none mb-4 select-none">"</div>
          <div className="flex justify-center gap-0.5 mb-5">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-base text-text leading-relaxed max-w-xl mx-auto">
            I posted twice in 2023, got 8 likes each time, and quit. I've now posted every week
            for 6 weeks. Two investors reached out from my posts. I didn't change. My process did.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">A</div>
            <div className="text-left">
              <p className="text-sm font-semibold text-text">Alex R.</p>
              <p className="text-xs text-text-muted">Seed-stage SaaS founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Pricing ───────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-xl font-semibold">Start free. Upgrade when you're posting.</h2>
          <p className="text-sm text-text-muted mt-2">
            No credit card required.{' '}
            <Link to="/pricing" className="text-primary hover:text-primary-hover transition-colors">
              See full comparison →
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          {/* Free */}
          <div className="bg-surface border border-border rounded-card p-6 space-y-5">
            <div>
              <p className="font-semibold text-text">Free</p>
              <div className="flex items-baseline gap-0.5 mt-1">
                <p className="text-3xl font-bold text-text">$0</p>
              </div>
              <p className="text-xs text-text-muted mt-2">For founders just starting out.</p>
            </div>
            <ul className="space-y-2.5">
              {[
                { text: '12 posts / month', sub: 'Enough for 3×/week your first month' },
                { text: '15 comment suggestions', sub: null },
                { text: '5 draft rewrites', sub: null },
                { text: 'Founder persona', sub: '1 generation' },
                { text: 'Content history', sub: 'Last 30 days' },
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

          {/* Starter — featured */}
          <div className="relative bg-surface border border-primary/30 rounded-card p-6 space-y-5 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-primary">Starter</p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-pill border border-primary/30 bg-primary/[0.08] text-primary">
                  Most popular
                </span>
              </div>
              <div className="flex items-baseline gap-0.5 mt-1">
                <p className="text-3xl font-bold text-text">$9</p>
                <p className="text-sm text-text-muted">/month</p>
              </div>
              <p className="text-xs text-text-muted mt-2">For founders building the habit.</p>
            </div>
            <ul className="space-y-2.5">
              {[
                { text: '80 posts / month', sub: 'Daily posting, with plenty to spare' },
                { text: '100 comment suggestions', sub: null },
                { text: '40 draft rewrites', sub: null },
                { text: 'Founder persona', sub: 'Regenerate anytime' },
                { text: 'Content history', sub: 'Last 90 days' },
              ].map(({ text, sub }) => (
                <li key={text} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-text-muted">{text}</p>
                    {sub && <p className="text-xs text-text-subtle mt-0.5">{sub}</p>}
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/signup" className="block">
              <Button className="w-full">Get Starter</Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-surface border border-border rounded-card p-6 space-y-5">
            <div>
              <p className="font-semibold text-text">Pro</p>
              <div className="flex items-baseline gap-0.5 mt-1">
                <p className="text-3xl font-bold text-text">$19</p>
                <p className="text-sm text-text-muted">/month</p>
              </div>
              <p className="text-xs text-text-muted mt-2">For founders posting consistently.</p>
            </div>
            <ul className="space-y-2.5">
              {[
                { text: 'Unlimited posts', sub: null },
                { text: 'Unlimited comments', sub: null },
                { text: 'Unlimited rewrites', sub: null },
                { text: 'Founder persona', sub: 'Regenerate anytime' },
                { text: 'Full content history', sub: null },
                { text: 'Priority AI', sub: 'Faster responses' },
                { text: 'Performance insights', sub: 'AI learns what works for you' },
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
              <Button variant="secondary" className="w-full">Get Pro</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. Final CTA ─────────────────────────────────────────────────────── */}
      <section className="max-w-xl mx-auto px-6 pb-28 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-3">One habit. Your voice. Starting today.</h2>
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

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-gradient rounded-md flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-text-muted">FounderX</span>
          </div>
          <p className="text-xs text-text-subtle">2025 FounderX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

// ── Product Demo Card ─────────────────────────────────────────────────────────

function ProductDemoCard() {
  return (
    <div className="bg-surface border border-border rounded-card shadow-card-hover overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-elevated">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
          <div className="w-2.5 h-2.5 rounded-full bg-border" />
        </div>
        <p className="text-xs text-text-subtle ml-1">Write Post · FounderX</p>
      </div>

      <div className="p-4 space-y-3">
        <div className="bg-background border border-border rounded-input px-3 py-2 text-xs text-text-subtle">
          Why we almost quit last month...
        </div>
        <DemoVariation badge="SAFE"         badgeColor="text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20" text="Nobody told me that launching an MVP would mean watching users ignore features you spent 3 months building. Here's what changed everything." active={false} />
        <DemoVariation badge="BOLD"         badgeColor="text-amber-400 bg-amber-500/[0.08] border-amber-500/20"   text="Most founders lie about their launch. I won't. We shipped to 200 users and got 3 replies. This is what we learned the hard way." active />
        <DemoVariation badge="CONTROVERSIAL" badgeColor="text-red-400 bg-red-500/[0.08] border-red-500/20"        text="The advice to 'launch fast and learn' is ruining early-stage startups. Here's the uncomfortable truth nobody talks about." active={false} />
      </div>
    </div>
  )
}

function DemoVariation({ badge, badgeColor, text, active }: {
  badge: string; badgeColor: string; text: string; active: boolean
}) {
  return (
    <div className={`rounded-[8px] border p-3 space-y-2 ${active ? 'border-primary/40 bg-primary/[0.06]' : 'border-border bg-background'}`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badgeColor}`}>{badge}</span>
        {active && <div className="flex items-center gap-1 text-[10px] text-primary"><Copy className="w-3 h-3" />Copy</div>}
      </div>
      <p className="text-[11px] text-text-muted leading-relaxed line-clamp-3">{text}</p>
    </div>
  )
}
