import { Check, Zap, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'

// ─── Plan limits ──────────────────────────────────────────────────────────────

const LIMITS = {
  free:    { posts: 12,  comments: 15,  rewrites: 5  },
  starter: { posts: 80,  comments: 100, rewrites: 40 },
  pro:     { posts: null, comments: null, rewrites: null },
  beta:    { posts: null, comments: null, rewrites: null },
}

const PLAN_LABELS: Record<string, string> = {
  free: 'Free', starter: 'Starter', pro: 'Pro', beta: 'Beta',
}

// ─── Plan cards ───────────────────────────────────────────────────────────────

const PLANS = [
  {
    key: 'starter',
    name: 'Starter',
    price: '$9',
    period: '/month',
    tagline: 'For founders building the habit.',
    badge: 'Most popular',
    features: [
      '80 posts / month',
      '100 comment suggestions',
      '40 draft rewrites',
      'Persona regeneration anytime',
      '90 days content history',
    ],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$19',
    period: '/month',
    tagline: 'For founders posting consistently.',
    badge: null,
    features: [
      'Unlimited posts',
      'Unlimited comments & rewrites',
      'Persona regeneration anytime',
      'Full content history',
      'Priority AI — faster responses',
      'Performance insights',
    ],
  },
]

// ─── Usage bar ────────────────────────────────────────────────────────────────

function UsageBar({ label, used, limit }: { label: string; used: number; limit: number | null }) {
  if (limit === null) {
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">{label}</span>
          <span className="text-success font-medium">Unlimited</span>
        </div>
        <div className="h-1.5 rounded-full bg-success/20" />
      </div>
    )
  }

  const pct = Math.min(100, Math.round((used / limit) * 100))
  const isHigh = pct >= 80
  const isOver = pct >= 100

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-text-muted">{label}</span>
        <span className={cn(
          'font-medium',
          isOver ? 'text-red-400' : isHigh ? 'text-amber-400' : 'text-text-muted'
        )}>
          {used} / {limit}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-hover overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            isOver ? 'bg-red-400' : isHigh ? 'bg-amber-400' : 'bg-primary'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Upgrade() {
  const { profile } = useAuthStore()

  const plan = profile?.plan ?? 'free'
  const limits = LIMITS[plan as keyof typeof LIMITS] ?? LIMITS.free
  const isFullAccess = plan === 'pro' || plan === 'beta'

  const used = {
    posts:    profile?.posts_this_month ?? 0,
    comments: profile?.comments_this_month ?? 0,
    rewrites: profile?.rewrites_this_month ?? 0,
  }

  // Days until month resets
  const now = new Date()
  const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 1).getDate() -
    now.getDate() + 1

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-page text-text">Plans & usage</h1>
        <p className="text-sm text-text-muted mt-1">
          You're on the <span className="font-semibold text-text">{PLAN_LABELS[plan]}</span> plan.
          {!isFullAccess && ` Resets in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}.`}
        </p>
      </div>

      {/* Current usage */}
      <div className="bg-surface border border-border rounded-card p-5 space-y-4">
        <p className="text-sm font-semibold text-text">This month's usage</p>
        <div className="space-y-3">
          <UsageBar label="Posts generated"      used={used.posts}    limit={limits.posts} />
          <UsageBar label="Comment suggestions"  used={used.comments} limit={limits.comments} />
          <UsageBar label="Draft rewrites"       used={used.rewrites} limit={limits.rewrites} />
        </div>
        {isFullAccess && (
          <p className="text-xs text-text-subtle pt-1">
            You're on {PLAN_LABELS[plan]} — no limits apply.
          </p>
        )}
      </div>

      {/* Plan cards */}
      {!isFullAccess && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-text">Upgrade your plan</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLANS.map(p => {
              const isCurrent = plan === p.key
              const isNext = (plan === 'free' && p.key === 'starter') ||
                             (plan === 'starter' && p.key === 'pro')

              return (
                <div
                  key={p.key}
                  className={cn(
                    'relative bg-surface border rounded-card p-5 flex flex-col gap-4',
                    isNext ? 'border-primary/40' : 'border-border',
                    isCurrent && 'opacity-60'
                  )}
                >
                  {isNext && (
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-t-card" />
                  )}

                  {/* Plan header */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-text">{p.name}</span>
                      {p.badge && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-primary/10 text-primary border-primary/20 tracking-wide">
                          {p.badge}
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-surface-hover text-text-muted border-border tracking-wide">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-2xl font-bold text-text">{p.price}</span>
                      <span className="text-sm text-text-muted">{p.period}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">{p.tagline}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-1.5 flex-1">
                    {p.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs text-text-muted">
                        <Check className="w-3.5 h-3.5 text-success shrink-0 mt-px" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {!isCurrent && (
                    <a
                      href={`mailto:hello@founderx.app?subject=Upgrade to ${p.name}&body=Hi, I'd like to upgrade to the ${p.name} plan.`}
                      className={cn(
                        'flex items-center justify-center gap-1.5 px-4 py-2 rounded-input text-sm font-semibold transition-colors',
                        isNext
                          ? 'bg-primary text-white hover:bg-primary-hover'
                          : 'bg-surface-hover text-text hover:bg-surface border border-border'
                      )}
                    >
                      {isNext ? (
                        <><Zap className="w-3.5 h-3.5" /> Get {p.name}</>
                      ) : (
                        <>Get {p.name} <ArrowRight className="w-3.5 h-3.5" /></>
                      )}
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Already on pro */}
      {isFullAccess && (
        <div className="bg-success/[0.05] border border-success/20 rounded-card px-4 py-3">
          <p className="text-sm font-semibold text-success">You're on {PLAN_LABELS[plan]}</p>
          <p className="text-xs text-text-muted mt-0.5">No limits. Keep posting.</p>
        </div>
      )}
    </div>
  )
}
