import { useEffect, useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { PenLine, RefreshCw, MessageSquare, Clock, ArrowRight, Check, ImageDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import Button from '@/components/ui/Button'
import CopyButton from '@/components/ui/CopyButton'
import { QuoteCardModal } from '@/components/ui/QuoteCard'
import { truncate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { GeneratedPost } from '@/types/database'

// ─── Topic pool (rotates daily) ───────────────────────────────────────────────

const TOPIC_TEMPLATES = [
  (p: string) => `${p}: the thing nobody warned me about`,
  (p: string) => `An honest look at ${p.toLowerCase()} - what's actually working`,
  (p: string) => `What I wish I knew about ${p.toLowerCase()} 6 months ago`,
  (p: string) => `The hardest part of ${p.toLowerCase()} right now`,
  (p: string) => `A recent ${p.toLowerCase()} lesson that changed how I think`,
  (p: string) => `${p}: what the advice gets wrong`,
  (p: string) => `The counterintuitive truth about ${p.toLowerCase()}`,
]

function getDailyTopic(pillars: string[]): string {
  if (!pillars.length) return 'What you learned this week'
  const now = new Date()
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000
  )
  const pillar = pillars[dayOfYear % pillars.length]
  const template = TOPIC_TEMPLATES[dayOfYear % TOPIC_TEMPLATES.length]
  return template(pillar)
}

// ─── Weekly tracker ───────────────────────────────────────────────────────────

function getWeekDots() {
  const today = new Date()
  const day = today.getDay()
  const mon = new Date(today)
  mon.setDate(today.getDate() - (day === 0 ? 6 : day - 1))
  mon.setHours(0, 0, 0, 0)
  const wed = new Date(mon); wed.setDate(mon.getDate() + 2)
  const fri = new Date(mon); fri.setDate(mon.getDate() + 4)
  return { mon, wed, fri }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, profile, company } = useAuthStore()

  const isFirstVisit = searchParams.get('onboarded') === '1'

  const [allPosts, setAllPosts] = useState<GeneratedPost[]>([])
  const [recentPosts, setRecentPosts] = useState<GeneratedPost[]>([])
  const [postedDays, setPostedDays] = useState<Date[]>([])
  const [loading, setLoading] = useState(true)
  const [quoteCard, setQuoteCard] = useState<{ text: string; variation: 'safe' | 'bold' | 'controversial' } | null>(null)

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const pillars = company?.content_pillars ?? []
  const todayTopic = getDailyTopic(pillars)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    if (!user) return
    async function load() {
      setLoading(true)
      const weekStart = getWeekDots().mon
      const { data } = await supabase
        .from('generated_posts')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (data) {
        setAllPosts(data)
        setRecentPosts(data.slice(0, 3))
        const days = data
          .filter(p => new Date(p.created_at) >= weekStart)
          .map(p => new Date(p.created_at))
        setPostedDays(days)
      }
      setLoading(false)
    }
    load()
  }, [user])

  // Count distinct days with posts this week — dots light up Mon→Wed→Fri in order
  // regardless of which actual days the user generated on
  const distinctDaysThisWeek = new Set(
    postedDays.map(d => d.toDateString())
  ).size
  const weekCount = Math.min(distinctDaysThisWeek, 3)

  const weekMessage =
    weekCount === 0 ? 'Start your first post' :
    weekCount === 1 ? '1 of 3 this week' :
    weekCount === 2 ? '2 of 3, almost there' :
    '3 of 3 · week complete ✓'

  // Best variation insight — only show after 5+ copied posts
  const copiedPosts = allPosts.filter(p => p.was_copied && p.selected_variation)
  const variationCounts = copiedPosts.reduce<Record<string, number>>((acc, p) => {
    const v = p.selected_variation!
    acc[v] = (acc[v] ?? 0) + 1
    return acc
  }, {})
  const bestVariation = Object.entries(variationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
  const showInsight = copiedPosts.length >= 5 && bestVariation !== null

  return (
    <div className="space-y-8">

      {/* Greeting */}
      <div>
        <h1 className="text-page text-text">
          {isFirstVisit
            ? `Great start, ${firstName} — now post this today.`
            : `${greeting}, ${firstName}.`}
        </h1>
        {company && !isFirstVisit && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-text-muted">{company.name}</span>
            <StageBadge stage={company.stage} />
          </div>
        )}
      </div>

      {/* First-visit checklist */}
      {isFirstVisit && (
        <div className="bg-surface border border-border rounded-card px-4 py-3 space-y-2">
          {[
            { label: 'Profile created', done: true },
            { label: 'First post generated', done: true },
            { label: 'First post copied & posted', done: false },
          ].map(({ label, done }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className={cn(
                'w-4 h-4 rounded-full border flex items-center justify-center shrink-0',
                done ? 'bg-success border-success' : 'border-border'
              )}>
                {done && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
              </div>
              <span className={cn(
                'text-sm',
                done ? 'text-text-muted line-through' : 'text-text font-medium'
              )}>
                {label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Today's post — hero card: primary border + gradient line are the emphasis */}
      <div className="relative overflow-hidden rounded-card border border-primary/20 bg-surface">
        {/* Subtle top gradient accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Today's post suggestion
          </div>

          <p className="text-base font-medium text-text leading-snug">
            "{todayTopic}"
          </p>

          <Button
            onClick={() => navigate(`/dashboard/write?topic=${encodeURIComponent(todayTopic)}`)}
            className="w-full sm:w-auto"
          >
            Generate post
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Persona pill strip */}
      {company?.persona_statement && (
        <div className="bg-surface border border-border rounded-card px-4 py-3 space-y-2">
          <p className="text-xs text-text-muted font-medium uppercase tracking-wide">Your founder brand</p>
          <p className="text-sm text-text leading-snug">{company.persona_statement}</p>
          {company.content_pillars && company.content_pillars.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {company.content_pillars.map(pillar => (
                <span key={pillar} className="text-xs px-2 py-0.5 rounded-full bg-primary/[0.08] border border-primary/20 text-primary font-medium">
                  {pillar}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Weekly tracker + Quick actions — side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Weekly tracker */}
        <div className={cn('bg-surface border border-border rounded-card p-5', weekCount === 3 && 'ring-1 ring-success/20 bg-success/[0.03]')}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-text">
              {weekCount === 3 ? <>🎉 <span className="text-success">Week complete!</span></> : 'This week'}
            </p>
            <p className={cn('text-xs', weekCount === 3 ? 'text-success' : 'text-text-muted')}>{weekMessage}</p>
          </div>

          <div className="flex items-center gap-4">
            {([
              { index: 1, label: 'Mon' },
              { index: 2, label: 'Wed' },
              { index: 3, label: 'Fri' },
            ] as const).map(({ index, label }) => {
              const done = weekCount >= index

              return (
                <div key={label} className="flex flex-col items-center gap-2 flex-1">
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center transition-all',
                    done
                      ? 'bg-success shadow-[0_0_0_4px_rgba(34,197,94,0.1)]'
                      : 'border-2 border-border'
                  )}>
                    {done && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={cn(
                    'text-[11px] font-medium',
                    done ? 'text-success' : 'text-text-subtle'
                  )}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick actions — stacked */}
        <div className="space-y-2">
          {[
            { to: '/dashboard/write', icon: PenLine, label: 'Write Post', sub: '3 variations' },
            { to: '/dashboard/rewrite', icon: RefreshCw, label: 'Rewrite Draft', sub: 'Polish rough ideas' },
            { to: '/dashboard/engage', icon: MessageSquare, label: 'Get Comments', sub: 'Engage smarter' },
          ].map(({ to, icon: Icon, label, sub }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 bg-surface border border-border rounded-card px-4 py-3 hover:border-border-hover hover:bg-surface-hover transition-all duration-100 group"
            >
              <Icon className="w-4 h-4 text-text-muted group-hover:text-primary shrink-0 transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text">{label}</p>
                <p className="text-xs text-text-muted">{sub}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-text-subtle group-hover:text-text-muted transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent posts */}
      {!loading && recentPosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">Recent</p>
            <Link to="/dashboard/history" className="text-xs text-primary hover:text-primary-hover transition-colors">
              View all →
            </Link>
          </div>

          {showInsight && (
            <p className="text-xs text-text-muted mb-3">
              Your <span className={cn(
                'font-semibold',
                bestVariation === 'bold' ? 'text-amber-400' :
                bestVariation === 'controversial' ? 'text-red-400' : 'text-emerald-400'
              )}>{bestVariation}</span> posts get copied most — keep going.
            </p>
          )}

          <div className="space-y-2">
            {recentPosts.map(post => {
              const variation = post.selected_variation ?? 'safe'
              const text = variation === 'bold'
                ? post.variation_bold
                : variation === 'controversial'
                ? post.variation_controversial
                : post.variation_safe

              return (
                <div key={post.id} className="bg-surface border border-border rounded-card px-4 py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <VariationBadge variation={variation} />
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {relativeTime(post.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted leading-snug">
                      {truncate(text, 90)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setQuoteCard({ text, variation: variation as 'safe' | 'bold' | 'controversial' })}
                      title="Get quote card"
                      className="p-1.5 text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
                    >
                      <ImageDown className="w-3.5 h-3.5" />
                    </button>
                    <CopyButton text={text} size="sm" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton h-16 rounded-card" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && recentPosts.length === 0 && (
        <div className="border border-dashed border-border rounded-card p-10 text-center space-y-1.5">
          <p className="text-sm font-medium text-text-muted">Your first post is one click away.</p>
          <p className="text-xs text-text-subtle">Use the suggestion above, it takes under 3 minutes.</p>
        </div>
      )}

      {quoteCard && company && (
        <QuoteCardModal
          text={quoteCard.text}
          variation={quoteCard.variation}
          founderName={profile?.full_name ?? profile?.email ?? 'Founder'}
          companyName={company.name}
          onClose={() => setQuoteCard(null)}
        />
      )}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StageBadge({ stage }: { stage: string }) {
  const map: Record<string, { label: string; emoji: string; className: string }> = {
    idea:  { label: 'Idea',  emoji: '💡', className: 'text-violet-400 bg-violet-500/[0.08] border-violet-500/20' },
    mvp:   { label: 'MVP',   emoji: '🔨', className: 'text-amber-400 bg-amber-500/[0.08] border-amber-500/20' },
    live:  { label: 'Live',  emoji: '🚀', className: 'text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20' },
    scale: { label: 'Scale', emoji: '📈', className: 'text-sky-400 bg-sky-500/[0.08] border-sky-500/20' },
  }
  const { label, emoji, className } = map[stage] ?? map.idea
  return (
    <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded border', className)}>
      {emoji} {label}
    </span>
  )
}

function VariationBadge({ variation }: { variation: string }) {
  const map: Record<string, { label: string; className: string }> = {
    safe:          { label: 'Safe',    className: 'text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20' },
    bold:          { label: 'Bold',    className: 'text-amber-400 bg-amber-500/[0.08] border-amber-500/20' },
    controversial: { label: 'Bold take', className: 'text-red-400 bg-red-500/[0.08] border-red-500/20' },
  }
  const { label, className } = map[variation] ?? map.safe
  return (
    <span className={cn('text-xs font-semibold px-1.5 py-0.5 rounded border tracking-wide', className)}>
      {label.toUpperCase()}
    </span>
  )
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
