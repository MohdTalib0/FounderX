import { useState, useEffect } from 'react'
import { Check, Zap, ArrowRight, ExternalLink, AlertTriangle } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import { openPaddleCheckout, preloadPaddle } from '@/lib/paddle'
import { supabase } from '@/lib/supabase'
import { toast } from '@/store/toast'

const LIMITS = {
  free:    { posts: 12,   comments: 15,  rewrites: 5  },
  starter: { posts: 80,   comments: 100, rewrites: 40 },
  pro:     { posts: null, comments: null, rewrites: null },
}

const PLAN_LABELS: Record<string, string> = {
  free: 'Free', starter: 'Starter', pro: 'Pro',
}

const PLANS: {
  key: 'starter' | 'pro'
  priceId: string
  name: string
  price: string
  period: string
  tagline: string
  badge: string | null
  features: string[]
}[] = [
  {
    key: 'starter',
    priceId: import.meta.env.VITE_PADDLE_PRICE_ID_STARTER ?? '',
    name: 'Starter',
    price: '$9',
    period: '/mo',
    tagline: 'Build the habit.',
    badge: 'Popular',
    features: [
      '80 posts / month',
      '100 comment suggestions',
      '40 draft rewrites',
      'Persona regeneration',
      '90-day content history',
    ],
  },
  {
    key: 'pro',
    priceId: import.meta.env.VITE_PADDLE_PRICE_ID_PRO ?? '',
    name: 'Pro',
    price: '$19',
    period: '/mo',
    tagline: 'Post without limits.',
    badge: null,
    features: [
      'Unlimited posts',
      'Unlimited comments & rewrites',
      'Persona regeneration',
      'Full content history',
      'Priority AI (faster)',
      'Performance insights',
    ],
  },
]

function UsageRow({ label, used, limit }: { label: string; used: number; limit: number | null }) {
  if (limit === null) {
    return (
      <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
        <span className="text-sm text-text-muted">{label}</span>
        <span className="text-xs font-semibold text-success">Unlimited</span>
      </div>
    )
  }

  const pct    = Math.min(100, Math.round((used / limit) * 100))
  const isHigh = pct >= 80
  const isOver = pct >= 100

  return (
    <div className="py-2.5 border-b border-border last:border-0 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted">{label}</span>
        <span className={cn(
          'text-xs font-semibold tabular-nums',
          isOver ? 'text-danger' : isHigh ? 'text-warning' : 'text-text-muted'
        )}>
          {used} / {limit}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-hover overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            isOver ? 'bg-danger' : isHigh ? 'bg-warning' : 'bg-primary'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function Upgrade() {
  const { profile, user, fetchProfile } = useAuthStore()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  const plan         = profile?.plan ?? 'free'
  const limits       = LIMITS[plan as keyof typeof LIMITS] ?? LIMITS.free
  const isFullAccess = plan === 'pro'
  const isPaying     = plan === 'starter' || plan === 'pro'
  const isPastDue    = profile?.subscription_status === 'past_due'

  const used = {
    posts:    profile?.posts_this_month    ?? 0,
    comments: profile?.comments_this_month ?? 0,
    rewrites: profile?.rewrites_this_month ?? 0,
  }

  const now       = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const daysLeft  = Math.ceil((nextMonth.getTime() - now.getTime()) / 86_400_000)

  // Pre-warm Paddle SDK so checkout opens instantly
  useEffect(() => { preloadPaddle() }, [])

  const handleCheckout = async (priceId: string) => {
    if (!user?.id || !profile?.email) {
      toast.error('Sign in again to continue checkout.')
      return
    }
    if (!priceId.trim()) {
      toast.error('Billing is not configured yet. Email hello@wrively.com.')
      return
    }
    setCheckoutLoading(true)
    try {
      await openPaddleCheckout({
        priceId: priceId.trim(),
        email: profile.email,
        supabaseUserId: user.id,
        onSuccess: () => {
          toast.success('Welcome aboard! Your plan is being activated.')
          // Give the webhook a moment to process, then refresh profile
          setTimeout(() => fetchProfile(), 3000)
          setTimeout(() => fetchProfile(), 8000)
        },
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Checkout failed'
      toast.error(msg)
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-text">Plans & usage</h1>
        <p className="text-sm text-text-muted mt-0.5">
          You're on <span className="font-semibold text-text">{PLAN_LABELS[plan] ?? plan}</span>.
          {!isFullAccess && ` Resets in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}.`}
        </p>
      </div>

      {/* Past-due warning */}
      {isPastDue && (
        <div className="bg-warning/[0.08] border border-warning/25 rounded-card px-4 py-3.5 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-text">Payment issue</p>
            <p className="text-xs text-text-muted mt-0.5">
              Your last payment didn't go through. Please update your payment method to keep your plan active.
            </p>
          </div>
        </div>
      )}

      {/* Usage */}
      <div className="bg-surface border border-border rounded-card overflow-hidden">
        <div className="px-4 pt-4 pb-1">
          <p className="section-label mb-0.5">This month</p>
        </div>
        <div className="px-4 pb-2">
          <UsageRow label="Posts generated"     used={used.posts}    limit={limits.posts} />
          <UsageRow label="Comment suggestions" used={used.comments} limit={limits.comments} />
          <UsageRow label="Draft rewrites"      used={used.rewrites} limit={limits.rewrites} />
        </div>
      </div>

      {/* Already on full access */}
      {isFullAccess && (
        <div className="bg-success/[0.05] border border-success/20 rounded-card px-4 py-3.5">
          <p className="text-sm font-semibold text-success">You're on Pro. No limits.</p>
          <p className="text-xs text-text-muted mt-0.5">Keep posting. The habit compounds.</p>
        </div>
      )}

      {/* Manage billing for paying subscribers */}
      {isPaying && profile?.paddle_subscription_id && (
        <div className="bg-surface border border-border rounded-card px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text">Billing</p>
              <p className="text-xs text-text-muted mt-0.5">Update payment method, view invoices, or cancel</p>
            </div>
            <button
              type="button"
              disabled={portalLoading}
              onClick={async () => {
                setPortalLoading(true)
                try {
                  const { data, error } = await supabase.functions.invoke('paddle-portal')
                  if (error || !data?.url) throw new Error(error?.message || 'Could not open billing portal')
                  window.open(data.url, '_blank', 'noopener')
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : 'Could not open billing portal')
                } finally {
                  setPortalLoading(false)
                }
              }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors disabled:opacity-60"
            >
              {portalLoading ? (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Manage <ExternalLink className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Plan cards */}
      {!isFullAccess && (
        <div className="space-y-3">
          <p className="section-label px-0.5">Upgrade</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PLANS.map(p => {
              const isCurrent = plan === p.key
              const isNext    = (plan === 'free' && p.key === 'starter') ||
                                (plan === 'starter' && p.key === 'pro')

              return (
                <div
                  key={p.key}
                  className={cn(
                    'relative bg-surface border rounded-card overflow-hidden flex flex-col',
                    isNext ? 'border-primary/40' : 'border-border',
                    isCurrent && 'opacity-55'
                  )}
                >
                  {isNext && (
                    <div className="h-0.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
                  )}

                  <div className="p-5 flex flex-col gap-4 flex-1">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-text">{p.name}</span>
                        {p.badge && isNext && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 tracking-widest uppercase">
                            {p.badge}
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface-hover text-text-muted border border-border tracking-wide">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[28px] font-bold text-text leading-none">{p.price}</span>
                        <span className="text-sm text-text-muted">{p.period}</span>
                      </div>
                      <p className="text-xs text-text-muted mt-1">{p.tagline}</p>
                    </div>

                    <ul className="space-y-2 flex-1">
                      {p.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-xs text-text-muted">
                          <Check className="w-3.5 h-3.5 text-success shrink-0 mt-px" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {!isCurrent && (
                      <button
                        type="button"
                        disabled={checkoutLoading}
                        onClick={() => handleCheckout(p.priceId)}
                        className={cn(
                          'flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-btn text-sm font-semibold transition-colors disabled:opacity-60',
                          isNext
                            ? 'bg-primary text-white hover:bg-primary-hover'
                            : 'bg-surface-hover border border-border text-text hover:bg-surface hover:border-border-hover'
                        )}
                      >
                        {checkoutLoading ? (
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : isNext ? (
                          <><Zap className="w-3.5 h-3.5" /> Subscribe to {p.name}</>
                        ) : (
                          <>Subscribe to {p.name} <ArrowRight className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <p className="text-[11px] text-text-subtle text-center pt-1">
            Secure checkout with Paddle. Questions?{' '}
            <a href="mailto:hello@wrively.com" className="text-primary hover:text-primary-hover transition-colors">hello@wrively.com</a>
          </p>
        </div>
      )}
    </div>
  )
}
