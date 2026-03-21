import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronDown, ArrowRight, Shield, RefreshCw } from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { cn } from '@/lib/utils'

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    key: 'free',
    name: 'Free',
    price: '$0',
    period: '',
    tagline: 'Try it out.',
    cta: 'Start for free',
    ctaTo: '/signup',
    featured: false,
    features: [
      '12 posts per month',
      '15 comment suggestions',
      '5 draft rewrites',
      'Founder persona',
      '30-day content history',
    ],
  },
  {
    key: 'starter',
    name: 'Starter',
    price: '$9',
    period: '/mo',
    tagline: 'Build the habit.',
    cta: 'Get Starter',
    ctaTo: '/signup',
    featured: true,
    badge: 'Most popular',
    features: [
      '80 posts per month',
      '100 comment suggestions',
      '40 draft rewrites',
      'Persona regeneration',
      '90-day content history',
    ],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$19',
    period: '/mo',
    tagline: 'Post without limits.',
    cta: 'Get Pro',
    ctaTo: '/signup',
    featured: false,
    features: [
      'Unlimited posts',
      'Unlimited comments and rewrites',
      'Persona regeneration',
      'Full content history',
      'Priority AI (faster)',
      'Performance insights',
    ],
  },
] as const

const COMPARISON = [
  { label: 'Posts per month',       free: '12',            starter: '80',             pro: 'Unlimited' },
  { label: 'Comment suggestions',   free: '15',            starter: '100',            pro: 'Unlimited' },
  { label: 'Draft rewrites',        free: '5',             starter: '40',             pro: 'Unlimited' },
  { label: 'Persona regeneration',  free: 'Once',          starter: 'Anytime',        pro: 'Anytime' },
  { label: 'Content history',       free: '30 days',       starter: '90 days',        pro: 'Full' },
  { label: 'Priority AI',           free: false,           starter: false,            pro: true },
  { label: 'Performance insights',  free: false,           starter: false,            pro: true },
]

const FAQ = [
  {
    q: 'Do I need a credit card to start?',
    a: 'No. Free is fully free. No card, no trial period, no hidden anything. Sign up and start generating posts immediately.',
  },
  {
    q: 'What happens when I hit my monthly limit?',
    a: "You'll see a notice inline when you're close. You can upgrade any time, or wait for the limit to reset at the start of the next calendar month.",
  },
  {
    q: 'Does the AI actually sound like me?',
    a: 'Yes. The persona system built during your 4-question onboarding shapes every single generation. Safe, Bold, and Controversial are three tones, all grounded in your voice, stage, and audience.',
  },
  {
    q: 'What are Performance insights?',
    a: "Once you've generated 10+ posts, FounderX tracks which variations you copy most and how you rate them. Pro users get prompts that learn from this. Future posts lean toward what's actually working for you.",
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, immediately, no questions asked. Your content history stays accessible until the end of your billing period.',
  },
  {
    q: 'Is there an annual plan?',
    a: 'Not yet. Monthly only for now. Annual billing with a discount is on the roadmap.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      <PublicHeader />

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-5 pt-16 pb-14 text-center">
        <div className="inline-flex items-center gap-2 mb-6 border border-primary/25 bg-primary/[0.06] text-primary text-xs font-medium px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Beta: free for the first 50 founders
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text mb-4 leading-tight">
          Simple pricing,<br className="hidden sm:block" /> no surprises.
        </h1>
        <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-xl mx-auto">
          Start free. Upgrade when you're posting consistently.
          Every plan includes the full product. Limits are the only difference.
        </p>

        <div className="flex items-center justify-center gap-5 mt-8">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Shield className="w-3.5 h-3.5 text-success" />
            No credit card
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <RefreshCw className="w-3.5 h-3.5 text-text-subtle" />
            Cancel anytime
          </div>
        </div>
      </section>

      {/* Plan cards */}
      <section className="max-w-5xl mx-auto px-5 pb-20">
        {/* Mobile: stacked, Starter on top via order */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          {/* Free */}
          <PlanCard plan={PLANS[0]} />

          {/* Starter — featured, elevated on desktop */}
          <div className="sm:-mt-4">
            <PlanCard plan={PLANS[1]} />
          </div>

          {/* Pro */}
          <PlanCard plan={PLANS[2]} />
        </div>

        <p className="text-center text-xs text-text-subtle mt-6">
          Questions? Email{' '}
          <a href="mailto:hello@founderx.app" className="text-primary hover:text-primary-hover transition-colors">
            hello@founderx.app
          </a>
        </p>
      </section>

      {/* Comparison table */}
      <section className="max-w-4xl mx-auto px-5 pb-20">
        <h2 className="text-xl font-bold text-text text-center mb-8">Full comparison</h2>

        <div className="overflow-x-auto rounded-card border border-border">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-5 py-3.5 text-text-muted font-medium w-1/2">Feature</th>
                {(['Free', 'Starter', 'Pro'] as const).map(name => (
                  <th key={name} className={cn(
                    'px-4 py-3.5 font-semibold text-center',
                    name === 'Starter' ? 'text-primary' : 'text-text'
                  )}>
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr
                  key={row.label}
                  className={cn(
                    'border-b border-border last:border-0',
                    i % 2 === 0 ? 'bg-surface' : 'bg-background'
                  )}
                >
                  <td className="px-5 py-3.5 text-text-muted">{row.label}</td>
                  {(['free', 'starter', 'pro'] as const).map(key => {
                    const val = row[key]
                    return (
                      <td key={key} className="px-4 py-3.5 text-center">
                        {typeof val === 'boolean' ? (
                          val ? (
                            <Check className="w-4 h-4 text-success mx-auto" />
                          ) : (
                            <span className="text-text-subtle text-base leading-none">-</span>
                          )
                        ) : (
                          <span className={cn(
                            key === 'starter' ? 'text-primary font-medium' : 'text-text-muted'
                          )}>
                            {val}
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-5 pb-20">
        <h2 className="text-xl font-bold text-text text-center mb-8">Common questions</h2>
        <div className="divide-y divide-border border border-border rounded-card overflow-hidden">
          {FAQ.map(item => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-xl mx-auto px-5 pb-24 text-center">
        <div className="bg-surface border border-border rounded-card p-8 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <h2 className="text-xl font-bold text-text mb-2">Ready to start posting?</h2>
          <p className="text-sm text-text-muted mb-6">
            Free plan, no card needed. Upgrade any time.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-btn transition-colors text-sm"
          >
            Start free in 2 minutes
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="flex items-center justify-center gap-5 mt-5">
            <span className="flex items-center gap-1.5 text-xs text-text-subtle">
              <Shield className="w-3 h-3" /> No credit card
            </span>
            <span className="flex items-center gap-1.5 text-xs text-text-subtle">
              <RefreshCw className="w-3 h-3" /> Cancel anytime
            </span>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({ plan }: { plan: typeof PLANS[number] }) {
  const badge = 'badge' in plan ? plan.badge : undefined

  return (
    <div className={cn(
      'relative flex flex-col rounded-card overflow-hidden border transition-all',
      plan.featured
        ? 'bg-surface border-primary/30 shadow-[0_4px_32px_rgba(99,102,241,0.12)]'
        : 'bg-surface border-border'
    )}>
      {/* Top accent */}
      {plan.featured ? (
        <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      ) : (
        <div className="h-1 bg-transparent" />
      )}

      <div className="p-6 flex flex-col flex-1 gap-5">

        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <p className={cn(
              'text-sm font-semibold',
              plan.featured ? 'text-primary' : 'text-text-muted'
            )}>
              {plan.name}
            </p>
            {badge && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-primary/25 bg-primary/[0.08] text-primary tracking-widest uppercase">
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-text">{plan.price}</span>
            {plan.period && <span className="text-sm text-text-muted">{plan.period}</span>}
          </div>
          <p className="text-xs text-text-muted mt-1.5">{plan.tagline}</p>
        </div>

        {/* Feature list */}
        <ul className="space-y-2.5 flex-1">
          {plan.features.map(f => (
            <li key={f} className="flex items-start gap-2.5">
              <Check className={cn(
                'w-3.5 h-3.5 shrink-0 mt-0.5',
                plan.featured ? 'text-primary' : 'text-success'
              )} />
              <span className="text-sm text-text-muted">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          to={plan.ctaTo}
          className={cn(
            'flex items-center justify-center gap-1.5 w-full py-3 rounded-btn text-sm font-semibold transition-colors',
            plan.featured
              ? 'bg-primary text-white hover:bg-primary-hover'
              : 'bg-surface-hover border border-border text-text hover:bg-surface hover:border-border-hover'
          )}
        >
          {plan.cta}
          {plan.featured && <ArrowRight className="w-3.5 h-3.5" />}
        </Link>
      </div>
    </div>
  )
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-surface">
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
        <div className="px-5 pb-5 border-t border-border">
          <p className="text-sm text-text-muted leading-relaxed pt-4">{a}</p>
        </div>
      )}
    </div>
  )
}
