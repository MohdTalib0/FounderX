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

// ─── Weekly plan templates ─────────────────────────────────────────────────────

const WEEKLY_TEMPLATES = [
  (p: string) => `${p}: what's actually working right now`,
  (p: string) => `The thing nobody warned me about ${p.toLowerCase()}`,
  (p: string) => `What I got wrong about ${p.toLowerCase()}`,
  (p: string) => `A recent ${p.toLowerCase()} lesson worth sharing`,
  (p: string) => `${p}: the uncomfortable truth`,
  (p: string) => `How my thinking on ${p.toLowerCase()} has changed`,
]

function getWeekOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  return Math.floor((now.getTime() - start.getTime()) / (7 * 86_400_000))
}

function getWeeklyTopics(pillars: string[]): [string, string, string] {
  if (!pillars.length) return [
    'What you learned building your product this week',
    'The biggest challenge you navigated recently',
    'What surprised you about your users this week',
  ]
  const w = getWeekOfYear()
  return [0, 1, 2].map(i => {
    const pillar = pillars[(w * 3 + i) % pillars.length]
    const template = WEEKLY_TEMPLATES[(w * 3 + i) % WEEKLY_TEMPLATES.length]
    return template(pillar)
  }) as [string, string, string]
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
  const [dismissPersonaPrompt, setDismissPersonaPrompt] = useState(false)

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const pillars = company?.content_pillars ?? []

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
        .limit(40)

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

  // Last week count — for continuity below the tracker
  const { mon: thisWeekMon } = getWeekDots()
  const lastWeekStart = new Date(thisWeekMon); lastWeekStart.setDate(thisWeekMon.getDate() - 7)
  const lastWeekCount = Math.min(
    new Set(
      allPosts
        .filter(p => { const d = new Date(p.created_at); return d >= lastWeekStart && d < thisWeekMon })
        .map(p => new Date(p.created_at).toDateString())
    ).size,
    3
  )

  // Best variation insight — only show after 5+ copied posts
  const copiedPosts = allPosts.filter(p => p.was_copied && p.selected_variation)
  const variationCounts = copiedPosts.reduce<Record<string, number>>((acc, p) => {
    const v = p.selected_variation!
    acc[v] = (acc[v] ?? 0) + 1
    return acc
  }, {})
  const bestVariation = Object.entries(variationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
  const showInsight = copiedPosts.length >= 5 && bestVariation !== null

  // Persona refresh — show at 10/20/30/40 post milestones
  const showPersonaPrompt = !dismissPersonaPrompt && allPosts.length > 0 && allPosts.length % 10 === 0

  // ─── Today's Next Step ────────────────────────────────────────────────────
  const todayStr = new Date().toDateString()
  const todayIsPostingDay = [1, 3, 5].includes(new Date().getDay())

  const pendingRatingPost = !loading
    ? allPosts.find(p => {
        if (!p.is_published || p.performance_rating != null || !p.published_at) return false
        const hours = (Date.now() - new Date(p.published_at).getTime()) / 3_600_000
        return hours >= 20 && hours <= 96
      }) ?? null
    : null

  const generatedTodayNotCopied = !loading
    ? allPosts.find(p => new Date(p.created_at).toDateString() === todayStr && !p.was_copied) ?? null
    : null

  const hasPostToday = postedDays.some(d => d.toDateString() === todayStr)
  const shouldPostToday = !loading && todayIsPostingDay && !hasPostToday && weekCount < 3

  type NextStepType = { type: 'rate' } | { type: 'copy'; postId: string } | { type: 'generate' }
  const nextStep: NextStepType | null = isFirstVisit ? null : (
    pendingRatingPost != null ? { type: 'rate' } :
    generatedTodayNotCopied != null ? { type: 'copy', postId: generatedTodayNotCopied.id } :
    shouldPostToday ? { type: 'generate' } :
    null
  )

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

      {/* Today's Next Step — persistent action strip */}
      {nextStep && (
        <div className="flex items-center justify-between gap-3 bg-primary/[0.05] border border-primary/20 rounded-card px-4 py-3">
          <p className="text-sm text-text">
            {nextStep.type === 'rate' && 'How did that post land? A quick rating improves your next one.'}
            {nextStep.type === 'copy' && 'Your post is ready — copy it and paste on LinkedIn.'}
            {nextStep.type === 'generate' && "Today's your posting day — keep the streak going."}
          </p>
          <Link
            to={
              nextStep.type === 'rate' ? '/dashboard/history' :
              nextStep.type === 'copy' ? `/dashboard/write?postId=${nextStep.postId}` :
              '/dashboard/write'
            }
            className="text-xs font-semibold text-primary hover:text-primary-hover shrink-0 transition-colors whitespace-nowrap"
          >
            {nextStep.type === 'rate' ? 'Rate now →' : nextStep.type === 'copy' ? 'Copy post →' : 'Generate →'}
          </Link>
        </div>
      )}

      {/* First-visit: surface the actual generated post + clear next step */}
      {isFirstVisit && !loading && recentPosts.length > 0 && (() => {
        const firstPost = recentPosts[0]
        const posted = firstPost.is_published
        const postText = firstPost.variation_bold

        const handleMarkPosted = async () => {
          const now = new Date().toISOString()
          await supabase
            .from('generated_posts')
            .update({ is_published: true, published_at: now })
            .eq('id', firstPost.id)
          setRecentPosts(prev => prev.map((p, i) => i === 0 ? { ...p, is_published: true, published_at: now } : p))
        }

        return (
          <div className="relative overflow-hidden rounded-card border border-primary/20 bg-surface space-y-0">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {/* Steps */}
            <div className="px-5 pt-5 pb-4 space-y-2.5">
              {[
                { n: 1, label: 'Founder brand created', done: true },
                { n: 2, label: 'First post generated', done: true },
                { n: 3, label: posted ? 'Posted on LinkedIn ✓' : 'Copy → paste on LinkedIn → mark as posted', done: posted },
              ].map(({ n, label, done }) => (
                <div key={n} className="flex items-center gap-3">
                  <div className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold',
                    done ? 'bg-success text-white' : 'bg-primary/10 text-primary border border-primary/30'
                  )}>
                    {done ? <Check className="w-3 h-3" strokeWidth={3} /> : n}
                  </div>
                  <span className={cn('text-sm', done && n < 3 ? 'text-text-muted line-through' : done ? 'text-success font-medium' : 'text-text font-medium')}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Post preview */}
            <div className="mx-5 rounded-lg border border-border bg-surface-hover/40 px-4 py-3">
              <p className="text-sm text-text leading-relaxed line-clamp-4 whitespace-pre-wrap">{postText}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 px-5 py-4">
              <CopyButton
                text={postText}
                label="Copy post"
                className="flex-1 justify-center"
              />
              {!posted && (
                <button
                  onClick={handleMarkPosted}
                  className="text-xs text-text-subtle hover:text-success transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark as posted
                </button>
              )}
            </div>
          </div>
        )
      })()}

      {/* Weekly plan card (hidden on first visit) */}
      {!isFirstVisit && (() => {
        const weeklyTopics = getWeeklyTopics(pillars)
        const todayDay = new Date().getDay()
        const todaySlot =
          todayDay === 1 || todayDay === 2 ? 0 :
          todayDay === 3 || todayDay === 4 ? 1 : 2

        const { mon } = getWeekDots()
        const weekLabel = mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

        const recentHookTypes = [...new Set(
          allPosts.slice(0, 6).map(p => p.hook_type).filter(Boolean)
        )].slice(0, 3) as string[]

        const slotDays = ['Mon', 'Wed', 'Fri'] as const

        return (
          <div>
            <div className="relative overflow-hidden rounded-card border border-primary/20 bg-surface">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    This week's plan
                  </div>
                  <span className="text-[11px] text-text-subtle">week of {weekLabel}</span>
                </div>

                {weeklyTopics.map((topic, i) => {
                  const done = weekCount >= i + 1
                  const isToday = todaySlot === i && !done
                  const dayLabel = slotDays[i]

                  return (
                    <div
                      key={i}
                      className={cn(
                        'rounded-lg border px-3 py-2.5',
                        done ? 'border-border bg-surface-hover/30' :
                        isToday ? 'border-primary/40 bg-primary/[0.04] shadow-sm' :
                        'border-border/60 bg-surface'
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0 text-base leading-none">
                          {done ? '✅' : isToday ? '' : '○'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {isToday && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 tracking-wide">
                                → TODAY
                              </span>
                            )}
                            {done && !isToday && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-success/10 text-success border border-success/20 tracking-wide">
                                Completed
                              </span>
                            )}
                            {!done && !isToday && (
                              <span className="text-[11px] text-text-subtle">
                                {dayLabel} · Suggested
                              </span>
                            )}
                          </div>
                          <p className={cn(
                            'text-sm leading-snug',
                            done ? 'text-text-muted' : isToday ? 'text-text font-medium' : 'text-text-muted'
                          )}>
                            "{topic}"
                          </p>
                          <div className="mt-2">
                            {done ? (
                              <Link
                                to={`/dashboard/write?topic=${encodeURIComponent(topic)}`}
                                className="text-[11px] text-text-subtle hover:text-text-muted border border-border/60 rounded-btn px-2 py-0.5 transition-colors inline-block"
                              >
                                Copy topic
                              </Link>
                            ) : isToday ? (
                              <Button
                                onClick={() => navigate(`/dashboard/write?topic=${encodeURIComponent(topic)}`)}
                                size="sm"
                              >
                                Generate →
                              </Button>
                            ) : (
                              <Link
                                to={`/dashboard/write?topic=${encodeURIComponent(topic)}`}
                                className="text-xs text-text-muted hover:text-text border border-border rounded-btn px-3 py-1 transition-colors inline-block"
                              >
                                Generate →
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {recentHookTypes.length > 0 && (
              <p className="text-[11px] text-text-subtle italic px-1 mt-1.5">
                AI varied from recent styles: {recentHookTypes.join(' · ')}
              </p>
            )}
          </div>
        )
      })()}

      {/* Founder Scoreboard — outcome stats, shown after 3+ posts */}
      {!loading && allPosts.length >= 3 && (() => {
        const totalPosts = allPosts.length
        const publishedCount = allPosts.filter(p => p.is_published).length
        const copiedCount = allPosts.filter(p => p.was_copied).length
        const copyRate = Math.round((copiedCount / totalPosts) * 100)
        const ratedPosts = allPosts.filter(p => p.performance_rating != null)
        const avgRating = ratedPosts.length > 0
          ? (ratedPosts.reduce((sum, p) => sum + (p.performance_rating ?? 0), 0) / ratedPosts.length).toFixed(1)
          : null

        // Never show all-zero state
        if (publishedCount === 0 && copiedCount === 0 && ratedPosts.length === 0) return null

        const stats = [
          {
            label: 'Published',
            value: publishedCount > 0 ? String(publishedCount) : '—',
            sub: publishedCount > 0 ? `of ${totalPosts} generated` : 'mark posts as published',
          },
          {
            label: 'Copy rate',
            value: copiedCount > 0 ? `${copyRate}%` : '—',
            sub: copiedCount > 0 ? `${copiedCount} post${copiedCount !== 1 ? 's' : ''} copied` : 'copy posts to track',
          },
          {
            label: 'Avg rating',
            value: avgRating ?? '—',
            sub: avgRating ? `from ${ratedPosts.length} rated` : 'rate posts to track',
          },
        ]

        return (
          <div>
            <p className="section-label mb-3">Your record</p>
            <div className="grid grid-cols-3 gap-3">
              {stats.map(({ label, value, sub }) => (
                <div key={label} className="bg-surface border border-border rounded-card px-3 py-3 text-center">
                  <p className="text-[22px] font-bold text-text leading-none">{value}</p>
                  <p className="text-[11px] font-medium text-text-muted mt-1">{label}</p>
                  <p className="text-[10px] text-text-subtle mt-0.5 leading-snug">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        )
      })()}

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

      {/* Persona refresh prompt — shown at 10/20/30... post milestones */}
      {showPersonaPrompt && (
        <div className="relative bg-surface border border-primary/20 rounded-card px-4 py-3 flex items-start justify-between gap-3">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text">Your brand is evolving</p>
            <p className="text-xs text-text-muted mt-0.5">
              You've generated {allPosts.length} posts. Refresh your persona so every new post keeps sounding like you.
            </p>
            <button
              onClick={() => navigate('/dashboard/settings')}
              className="mt-2 text-xs text-primary hover:text-primary-hover transition-colors font-medium"
            >
              Refresh persona →
            </button>
          </div>
          <button
            onClick={() => setDismissPersonaPrompt(true)}
            className="text-text-subtle hover:text-text-muted transition-colors shrink-0 mt-0.5"
            aria-label="Dismiss"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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

          {/* Last week continuity */}
          {lastWeekCount > 0 && (
            <p className="text-[11px] text-text-subtle mt-3 pt-3 border-t border-border/60">
              Last week: <span className={cn('font-medium', lastWeekCount === 3 ? 'text-success' : 'text-text-muted')}>{lastWeekCount}/3</span>
              {lastWeekCount === 3 && <span className="text-success"> ✓</span>}
            </p>
          )}
        </div>

        {/* Quick actions — stacked */}
        <div className="space-y-2">
          {[
            { to: '/dashboard/write', icon: PenLine, label: 'Write Post', sub: '3 variations in your voice' },
            { to: '/dashboard/rewrite', icon: RefreshCw, label: 'Had a rough idea?', sub: 'Turn messy thoughts into a post' },
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
