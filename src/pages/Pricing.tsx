import { Link } from 'react-router-dom'
import { Check, X, ArrowRight, ChevronDown, Zap } from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// ─── Plan definitions ─────────────────────────────────────────────────────────

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    tagline: 'For founders just starting out.',
    cta: 'Start free',
    ctaTo: '/signup',
    featured: false,
    features: [
      { text: '12 posts / month', note: 'Enough for 3×/week your first month' },
      { text: '15 comment suggestions', note: null },
      { text: '5 draft rewrites', note: null },
      { text: 'Founder persona', note: '1 generation' },
      { text: 'Content history', note: 'Last 30 days' },
    ],
    missing: ['Persona regeneration', 'Priority AI', 'Performance insights'],
  },
  {
    name: 'Starter',
    price: '$9',
    period: '/month',
    tagline: 'For founders building the habit.',
    cta: 'Get Starter',
    ctaTo: '/signup',
    featured: true,
    badge: 'Most popular',
    features: [
      { text: '80 posts / month', note: 'Daily posting, with plenty to spare' },
      { text: '100 comment suggestions', note: null },
      { text: '40 draft rewrites', note: null },
      { text: 'Founder persona', note: 'Regenerate anytime' },
      { text: 'Content history', note: 'Last 90 days' },
    ],
    missing: ['Priority AI', 'Performance insights'],
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    tagline: 'For founders posting consistently.',
    cta: 'Get Pro',
    ctaTo: '/signup',
    featured: false,
    features: [
      { text: 'Unlimited posts', note: null },
      { text: 'Unlimited comments', note: null },
      { text: 'Unlimited rewrites', note: null },
      { text: 'Founder persona', note: 'Regenerate anytime' },
      { text: 'Full content history', note: null },
      { text: 'Priority AI', note: 'Faster responses' },
      { text: 'Performance insights', note: 'AI learns what works for you' },
    ],
    missing: [],
  },
] as const

// ─── Comparison rows ──────────────────────────────────────────────────────────

const COMPARISON = [
  { label: 'Posts / month',          free: '12',         starter: '80',        pro: 'Unlimited' },
  { label: 'Comment suggestions',    free: '15',         starter: '100',       pro: 'Unlimited' },
  { label: 'Draft rewrites',         free: '5',          starter: '40',        pro: 'Unlimited' },
  { label: 'Founder persona',        free: '1 gen',      starter: 'Regen anytime', pro: 'Regen anytime' },
  { label: 'Content history',        free: '30 days',    starter: '90 days',   pro: 'Full' },
  { label: 'Persona regeneration',   free: false,        starter: true,        pro: true },
  { label: 'Priority AI',            free: false,        starter: false,       pro: true },
  { label: 'Performance insights',   free: false,        starter: false,       pro: true },
]

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQ = [
  {
    q: 'Do I need a credit card to start?',
    a: 'No. Free is fully free — no card, no trial period, no hidden anything. Sign up and start generating posts immediately.',
  },
  {
    q: 'What happens when I hit my monthly limit?',
    a: "You'll see a notice inline when you're close. You can upgrade any time, or wait for the limit to reset at the start of the next calendar month.",
  },
  {
    q: 'Does the AI actually sound like me?',
    a: 'Yes — the persona system built during your 4-question onboarding shapes every single generation. Safe, Bold, and Controversial are three tones, all grounded in your voice, stage, and audience.',
  },
  {
    q: 'What are Performance insights?',
    a: 'Once you\'ve generated 10+ posts, FounderX tracks which variations you copy most and how you rate them. Pro users get prompts that learn from this — future posts lean toward what\'s actually working for you.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, immediately, no questions asked. Your content history stays accessible until the end of your billing period.',
  },
  {
    q: 'Is there an annual plan?',
    a: "Not yet — monthly only for now. Annual billing with a discount is on the roadmap.",
  },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">

      <PublicHeader />

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Simple pricing,<br />no surprises.
        </h1>
        <p className="text-base text-text-muted leading-relaxed">
          Start free. Upgrade when you're posting. Every plan includes the full
          product — limits are the only difference.
        </p>

        {/* Beta banner */}
        <div className="inline-flex items-center gap-2 mt-6 border border-primary/25 bg-primary/[0.06] text-primary text-xs font-medium px-3 py-1.5 rounded-pill">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Beta: currently free for all first 50 founders
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-lg font-semibold text-center mb-8">Compare plans</h2>
        <div className="border border-border rounded-card overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-4 border-b border-border bg-surface-elevated">
            <div className="px-5 py-3" />
            {(['Free', 'Starter', 'Pro'] as const).map((name) => (
              <div key={name} className={cn(
                'px-5 py-3 text-center text-sm font-semibold',
                name === 'Starter' ? 'text-primary' : 'text-text'
              )}>
                {name}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {COMPARISON.map((row, i) => (
            <div
              key={row.label}
              className={cn(
                'grid grid-cols-4 border-b border-border last:border-0',
                i % 2 === 0 ? 'bg-surface' : 'bg-background'
              )}
            >
              <div className="px-5 py-3 text-sm text-text-muted">{row.label}</div>
              {(['free', 'starter', 'pro'] as const).map((key) => {
                const val = row[key]
                return (
                  <div key={key} className="px-5 py-3 text-center">
                    {typeof val === 'boolean' ? (
                      val
                        ? <Check className="w-4 h-4 text-success mx-auto" />
                        : <X className="w-4 h-4 text-text-subtle mx-auto" />
                    ) : (
                      <span className={cn(
                        'text-sm',
                        key === 'starter' ? 'text-primary font-medium' : 'text-text-muted'
                      )}>
                        {val}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <h2 className="text-lg font-semibold text-center mb-8">Common questions</h2>
        <div className="space-y-1">
          {FAQ.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* Final nudge */}
      <section className="max-w-xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-lg font-semibold mb-3">Ready to start posting?</h2>
        <p className="text-sm text-text-muted mb-7">
          Free plan, no card. Upgrade any time when you want more.
        </p>
        <Link to="/signup">
          <Button size="lg" className="px-8">
            Start free in 2 minutes
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
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

// ─── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({ plan }: { plan: typeof PLANS[number] }) {
  const { name, price, period, tagline, cta, ctaTo, featured, features, missing } = plan
  const badge = 'badge' in plan ? plan.badge : undefined

  return (
    <div className={cn(
      'relative rounded-card overflow-hidden flex flex-col',
      featured
        ? 'bg-surface border border-primary/30'
        : 'bg-surface border border-border'
    )}>
      {/* Gradient line — only on featured */}
      {featured && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      )}

      <div className="p-6 flex flex-col flex-1 space-y-5">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className={cn('font-semibold', featured ? 'text-primary' : 'text-text')}>{name}</p>
            {badge && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-pill border border-primary/30 bg-primary/[0.08] text-primary">
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-3xl font-bold text-text">{price}</span>
            {period && <span className="text-sm text-text-muted">{period}</span>}
          </div>
          <p className="text-xs text-text-muted mt-2">{tagline}</p>
        </div>

        {/* Features */}
        <ul className="space-y-2.5 flex-1">
          {features.map(({ text, note }) => (
            <li key={text} className="flex items-start gap-2.5">
              <Check className={cn(
                'w-3.5 h-3.5 shrink-0 mt-0.5',
                featured ? 'text-primary' : 'text-success'
              )} />
              <div>
                <p className="text-sm text-text-muted">{text}</p>
                {note && <p className="text-xs text-text-subtle mt-0.5">{note}</p>}
              </div>
            </li>
          ))}
          {missing.map((m) => (
            <li key={m} className="flex items-start gap-2.5">
              <X className="w-3.5 h-3.5 text-text-subtle shrink-0 mt-0.5" />
              <p className="text-sm text-text-subtle">{m}</p>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link to={ctaTo} className="block mt-auto">
          <Button
            variant={featured ? 'primary' : 'secondary'}
            className="w-full"
          >
            {cta}
          </Button>
        </Link>
      </div>
    </div>
  )
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-border rounded-card overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-hover transition-colors"
      >
        <span className="text-sm font-medium text-text">{q}</span>
        <ChevronDown className={cn(
          'w-4 h-4 text-text-muted shrink-0 transition-transform duration-200',
          open && 'rotate-180'
        )} />
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-border">
          <p className="text-sm text-text-muted leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  )
}
