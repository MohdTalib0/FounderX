import { useCallback, useEffect, useState } from 'react'
import { FileText, MessageSquare, RefreshCw, Shuffle, Star, ChevronDown, ChevronUp, CheckCircle2, ImageDown, TrendingUp, Minus, TrendingDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import { toast } from '@/store/toast'
import CopyButton from '@/components/ui/CopyButton'
import { QuoteCardModal } from '@/components/ui/QuoteCard'
import { cn, truncate } from '@/lib/utils'
import type { GeneratedPost, CommentSuggestion, DraftRewrite, RemixedPost } from '@/types/database'

type Filter = 'all' | 'posts' | 'comments' | 'rewrites' | 'remixes'

type HistoryItem =
  | { type: 'post';    data: GeneratedPost;     created_at: string }
  | { type: 'comment'; data: CommentSuggestion; created_at: string }
  | { type: 'rewrite'; data: DraftRewrite;       created_at: string }
  | { type: 'remix';   data: RemixedPost;        created_at: string }

const VARIATION_ACCENT: Record<string, string> = {
  safe:          'border-l-emerald-500/50',
  bold:          'border-l-amber-500/50',
  controversial: 'border-l-red-500/50',
}

const VARIATION_BADGE: Record<string, string> = {
  safe:          'text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20',
  bold:          'text-amber-400 bg-amber-500/[0.08] border-amber-500/20',
  controversial: 'text-red-400 bg-red-500/[0.08] border-red-500/20',
}

export default function History() {
  const { user, profile, company } = useAuthStore()
  const [filter, setFilter] = useState<Filter>('all')
  const [quoteCard, setQuoteCard] = useState<{ text: string; variation: 'safe' | 'bold' | 'controversial' } | null>(null)
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const [postsRes, commentsRes, rewritesRes, remixesRes] = await Promise.all([
      supabase.from('generated_posts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('comment_suggestions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('draft_rewrites').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('remixed_posts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
    ])

    if (postsRes.error || commentsRes.error || rewritesRes.error || remixesRes.error) {
      toast.error('Some content failed to load. Try refreshing.')
    }

    const all: HistoryItem[] = [
      ...(postsRes.data ?? []).map(d => ({ type: 'post' as const, data: d, created_at: d.created_at })),
      ...(commentsRes.data ?? []).map(d => ({ type: 'comment' as const, data: d, created_at: d.created_at })),
      ...(rewritesRes.data ?? []).map(d => ({ type: 'rewrite' as const, data: d, created_at: d.created_at })),
      ...(remixesRes.data ?? []).map(d => ({ type: 'remix' as const, data: d, created_at: d.created_at })),
    ]

    all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    setItems(all)
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (!user) return
    load()
  }, [user, load])

  const filtered = items.filter(item => {
    if (filter === 'all') return true
    if (filter === 'posts') return item.type === 'post'
    if (filter === 'comments') return item.type === 'comment'
    if (filter === 'rewrites') return item.type === 'rewrite'
    if (filter === 'remixes') return item.type === 'remix'
    return true
  })

  const FILTERS: { value: Filter; label: string }[] = [
    { value: 'all',      label: 'All' },
    { value: 'posts',    label: 'Posts' },
    { value: 'comments', label: 'Comments' },
    { value: 'rewrites', label: 'Rewrites' },
    { value: 'remixes',  label: 'Remixes' },
  ]

  // Aggregate stats (posts only, after 5+)
  const posts = items.filter(i => i.type === 'post') as { type: 'post'; data: GeneratedPost; created_at: string }[]
  const totalPosts = posts.length
  const copiedPosts = posts.filter(p => p.data.was_copied).length
  const copyRate = totalPosts > 0 ? Math.round((copiedPosts / totalPosts) * 100) : 0
  const varCounts = posts.reduce<Record<string, number>>((acc, p) => {
    const v = p.data.selected_variation
    if (v) acc[v] = (acc[v] ?? 0) + 1
    return acc
  }, {})
  const topVariation = Object.entries(varCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
  const showStats = totalPosts >= 1

  // 48h rating nudge
  const now = Date.now()
  const awaitingRating = items
    .filter((i): i is { type: 'post'; data: GeneratedPost; created_at: string } => i.type === 'post')
    .filter(i => {
      if (!i.data.is_published || !i.data.published_at || i.data.performance_rating) return false
      const hoursAgo = (now - new Date(i.data.published_at).getTime()) / 3_600_000
      return hoursAgo >= 20 && hoursAgo <= 96
    })
    .slice(0, 1)[0] ?? null

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Heading */}
      <div>
        <h1 className="text-xl font-bold text-text">History</h1>
        <p className="text-sm text-text-muted mt-0.5">All your generated content</p>
      </div>

      {/* Rating nudge */}
      {!loading && awaitingRating && (
        <div className="bg-surface border border-l-4 border-l-amber-500/50 border-amber-500/20 rounded-card px-4 py-3.5 space-y-2.5">
          <div>
            <p className="text-sm font-semibold text-text">How did your post land?</p>
            <p className="text-xs text-text-muted mt-0.5 line-clamp-1">"{awaitingRating.data.topic}"</p>
          </div>
          <div className="flex items-center gap-2">
            {([
              { rating: 3 as const, icon: <TrendingUp className="w-3.5 h-3.5" />,  label: 'Great' },
              { rating: 2 as const, icon: <Minus className="w-3.5 h-3.5" />,        label: 'Ok' },
              { rating: 1 as const, icon: <TrendingDown className="w-3.5 h-3.5" />, label: 'Quiet' },
            ]).map(({ rating, icon, label }) => (
              <button
                key={rating}
                onClick={() => handleRate(awaitingRating.data.id, rating)}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-btn border border-border hover:border-amber-500/40 hover:text-amber-400 text-text-muted transition-all"
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      {!loading && showStats && (
        totalPosts < 3 ? (
          <div className="bg-surface border border-border rounded-card px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-text">{totalPosts} of 3 posts to unlock insights</p>
              <span className="text-xs text-text-muted">{totalPosts}/3</span>
            </div>
            <div className="h-2 bg-surface-hover rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.round((totalPosts / 3) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-text-muted mt-2">Generate {3 - totalPosts} more post{3 - totalPosts !== 1 ? 's' : ''} to see your copy rate, top variation, and posting patterns.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Posts generated', value: String(totalPosts) },
              { label: 'Copy rate',       value: `${copyRate}%` },
              { label: 'Top variation',   value: topVariation ? topVariation.charAt(0).toUpperCase() + topVariation.slice(1) : '-' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface border border-border rounded-card px-3 py-3.5 text-center">
                <p className="text-lg font-bold text-text tabular-nums">{value}</p>
                <p className="text-[11px] text-text-muted mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )
      )}

      {/* Filter chips — scrollable on mobile */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'text-xs px-3 py-1.5 rounded-full border whitespace-nowrap shrink-0 transition-all',
              filter === f.value
                ? 'bg-primary border-primary text-white font-medium'
                : 'border-border text-text-muted hover:border-border-hover hover:text-text bg-surface'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Items */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton h-20 rounded-card" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-border rounded-card p-10 text-center space-y-2">
          <p className="text-sm font-medium text-text">Your content library is empty — for now.</p>
          <p className="text-xs text-text-muted leading-relaxed max-w-sm mx-auto">
            {filter === 'all'
              ? 'Every post you generate lives here. You\'ll see your copy rate, top-performing variations, and posting patterns over time.'
              : `Your ${filter}s will appear here once you generate some.`}
          </p>
          {filter === 'all' && (
            <a href="/dashboard/write" className="inline-block text-xs font-medium text-primary hover:text-primary-hover transition-colors mt-2">
              Write your first post →
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <HistoryCard
              key={item.type + '-' + item.data.id}
              item={item}
              onRate={(id, rating) => handleRate(id, rating)}
              onCopied={(id, variation) => handleCopied(id, variation)}
              onMarkPosted={(id) => handleMarkPosted(id)}
              onQuoteCard={(text, variation) => setQuoteCard({ text, variation })}
            />
          ))}
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

  async function handleRate(postId: string, rating: 1 | 2 | 3) {
    await supabase.from('generated_posts').update({ performance_rating: rating }).eq('id', postId)
    setItems(prev => prev.map(item =>
      item.type === 'post' && item.data.id === postId
        ? { ...item, data: { ...item.data, performance_rating: rating } }
        : item
    ))
  }

  async function handleCopied(postId: string, variation: 'safe' | 'bold' | 'controversial') {
    await supabase.from('generated_posts').update({ was_copied: true, selected_variation: variation }).eq('id', postId)
    setItems(prev => prev.map(item =>
      item.type === 'post' && item.data.id === postId
        ? { ...item, data: { ...item.data, was_copied: true, selected_variation: variation } }
        : item
    ))
  }

  async function handleMarkPosted(postId: string) {
    const now = new Date().toISOString()
    await supabase.from('generated_posts').update({ is_published: true, published_at: now }).eq('id', postId)
    setItems(prev => prev.map(item =>
      item.type === 'post' && item.data.id === postId
        ? { ...item, data: { ...item.data, is_published: true, published_at: now } }
        : item
    ))
  }
}

// ─── History Card ─────────────────────────────────────────────────────────────

function HistoryCard({
  item,
  onRate,
  onCopied,
  onMarkPosted,
  onQuoteCard,
}: {
  item: HistoryItem
  onRate: (id: string, rating: 1 | 2 | 3) => void
  onCopied: (id: string, variation: 'safe' | 'bold' | 'controversial') => void
  onMarkPosted: (id: string) => void
  onQuoteCard: (text: string, variation: 'safe' | 'bold' | 'controversial') => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [showRating, setShowRating] = useState(false)
  const [activeVariation, setActiveVariation] = useState<'safe' | 'bold' | 'controversial'>('safe')

  // ── Post ────────────────────────────────────────────────────────────────────
  if (item.type === 'post') {
    const post = item.data
    const defaultVariation = (post.selected_variation ?? 'safe') as 'safe' | 'bold' | 'controversial'

    const collapsedText = defaultVariation === 'bold'
      ? post.variation_bold
      : defaultVariation === 'controversial'
      ? post.variation_controversial
      : post.variation_safe

    const expandedText = activeVariation === 'bold'
      ? post.variation_bold
      : activeVariation === 'controversial'
      ? post.variation_controversial
      : post.variation_safe

    const activeText = expanded ? expandedText : collapsedText
    const activeVar  = expanded ? activeVariation : defaultVariation

    const handleExpand = () => {
      if (!expanded) setActiveVariation(defaultVariation)
      setExpanded(v => !v)
    }

    const ratingIcon = post.performance_rating === 3
      ? <TrendingUp className="w-3.5 h-3.5 text-success" />
      : post.performance_rating === 2
      ? <Minus className="w-3.5 h-3.5 text-text-muted" />
      : post.performance_rating === 1
      ? <TrendingDown className="w-3.5 h-3.5 text-text-subtle" />
      : null

    return (
      <div className={cn(
        'bg-surface border border-border border-l-4 rounded-card overflow-hidden',
        VARIATION_ACCENT[defaultVariation] ?? 'border-l-border'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-3.5 h-3.5 text-text-subtle shrink-0" />
            <span className={cn(
              'text-[11px] font-bold px-1.5 py-0.5 rounded border tracking-widest uppercase shrink-0',
              VARIATION_BADGE[defaultVariation] ?? ''
            )}>
              {defaultVariation === 'controversial' ? 'Debate' : defaultVariation}
            </span>
            <span className="text-xs text-text-subtle shrink-0">{relativeDate(post.created_at)}</span>
            {post.is_published && (
              <span className="hidden sm:flex items-center gap-1 text-[11px] text-success shrink-0">
                <CheckCircle2 className="w-3 h-3" /> Posted
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onQuoteCard(activeText, activeVar)}
              title="Quote card"
              className="p-1.5 text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
            >
              <ImageDown className="w-3.5 h-3.5" />
            </button>
            <CopyButton text={activeText} size="sm" onCopy={() => onCopied(post.id, activeVar)} />
          </div>
        </div>

        {/* Preview / Expanded */}
        {expanded ? (
          <div className="px-4 pb-3 space-y-3">
            <div className="flex gap-1.5">
              {(['safe', 'bold', 'controversial'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setActiveVariation(v)}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded border transition-all capitalize',
                    activeVariation === v
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-text-muted hover:border-border-hover hover:text-text'
                  )}
                >
                  {v === 'controversial' ? 'Debate' : v}
                </button>
              ))}
            </div>
            <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{expandedText}</p>
          </div>
        ) : (
          <p className="text-sm text-text-muted leading-relaxed px-4 pb-3">{truncate(collapsedText, 140)}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-t border-border flex-wrap gap-y-1.5">
          <div className="flex items-center gap-3">
            {/* Rating */}
            {post.performance_rating && !showRating ? (
              <div className="flex items-center gap-1.5">
                {ratingIcon}
                <span className="text-xs text-text-muted">
                  {post.performance_rating === 3 ? 'Great' : post.performance_rating === 2 ? 'Ok' : 'Poor'}
                </span>
                <button onClick={() => setShowRating(true)} className="text-[11px] text-text-subtle hover:text-text-muted transition-colors">
                  Change
                </button>
              </div>
            ) : showRating ? (
              <div className="flex items-center gap-1.5">
                {([
                  { rating: 3 as const, icon: <TrendingUp className="w-3.5 h-3.5" />,  label: 'Great' },
                  { rating: 2 as const, icon: <Minus className="w-3.5 h-3.5" />,        label: 'Ok' },
                  { rating: 1 as const, icon: <TrendingDown className="w-3.5 h-3.5" />, label: 'Poor' },
                ]).map(({ rating, icon, label }) => (
                  <button
                    key={rating}
                    onClick={() => { onRate(post.id, rating); setShowRating(false) }}
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-border text-text-muted hover:border-primary/50 hover:text-primary transition-all"
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => setShowRating(true)}
                className="flex items-center gap-1 text-xs text-text-subtle hover:text-text-muted transition-colors"
              >
                <Star className="w-3 h-3" /> Rate
              </button>
            )}

            {!post.is_published && (
              <button
                onClick={() => onMarkPosted(post.id)}
                className="text-xs text-text-subtle hover:text-success transition-colors flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" /> Mark posted
              </button>
            )}
          </div>

          <button
            onClick={handleExpand}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors shrink-0"
          >
            {expanded
              ? <><ChevronUp className="w-3.5 h-3.5" /> Collapse</>
              : <><ChevronDown className="w-3.5 h-3.5" /> Show full</>
            }
          </button>
        </div>
      </div>
    )
  }

  // ── Comment ─────────────────────────────────────────────────────────────────
  if (item.type === 'comment') {
    const c = item.data
    const comments = [
      { label: 'Insightful', text: c.comment_insightful, badge: 'text-sky-400 bg-sky-500/[0.08] border-sky-500/20' },
      { label: 'Curious',    text: c.comment_curious,    badge: 'text-violet-400 bg-violet-500/[0.08] border-violet-500/20' },
      { label: 'Bold',       text: c.comment_bold,       badge: 'text-amber-400 bg-amber-500/[0.08] border-amber-500/20' },
    ]
    const preview = c.comment_insightful

    return (
      <div className="bg-surface border border-border border-l-4 border-l-sky-500/50 rounded-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-text-subtle shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-sky-400 bg-sky-500/[0.08] border border-sky-500/20 px-1.5 py-0.5 rounded">
              Comment
            </span>
            <span className="text-xs text-text-subtle">{relativeDate(c.created_at)}</span>
          </div>
          <CopyButton text={preview} size="sm" />
        </div>

        <p className="text-[11px] text-text-subtle px-4 pb-2">On: "{truncate(c.source_post, 70)}"</p>

        {expanded ? (
          <div className="px-4 pb-3 space-y-3">
            {comments.map(({ label, text, badge }) => text && (
              <div key={label} className="space-y-1.5">
                <span className={cn('text-[11px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border', badge)}>
                  {label}
                </span>
                <p className="text-sm text-text leading-relaxed">{text}</p>
                <CopyButton text={text} size="sm" label="Copy" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted leading-relaxed px-4 pb-3">{truncate(preview, 140)}</p>
        )}

        <div className="px-4 py-2.5 border-t border-border flex justify-end">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors"
          >
            {expanded
              ? <><ChevronUp className="w-3.5 h-3.5" /> Collapse</>
              : <><ChevronDown className="w-3.5 h-3.5" /> All 3 comments</>
            }
          </button>
        </div>
      </div>
    )
  }

  // ── Rewrite ─────────────────────────────────────────────────────────────────
  if (item.type === 'rewrite') {
    const r = item.data

    return (
      <div className="bg-surface border border-border border-l-4 border-l-violet-500/50 rounded-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-text-subtle shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-violet-400 bg-violet-500/[0.08] border border-violet-500/20 px-1.5 py-0.5 rounded">
              Rewrite
            </span>
            <span className="text-xs text-text-subtle">{relativeDate(r.created_at)}</span>
          </div>
          <CopyButton text={r.rewritten} size="sm" />
        </div>

        <p className="text-[11px] text-text-subtle px-4 pb-2">Draft: "{truncate(r.original_draft, 70)}"</p>

        {expanded
          ? <p className="text-sm text-text leading-relaxed whitespace-pre-wrap px-4 pb-3">{r.rewritten}</p>
          : <p className="text-sm text-text-muted leading-relaxed px-4 pb-3">{truncate(r.rewritten, 140)}</p>
        }

        <div className="px-4 py-2.5 border-t border-border flex justify-end">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors"
          >
            {expanded
              ? <><ChevronUp className="w-3.5 h-3.5" /> Collapse</>
              : <><ChevronDown className="w-3.5 h-3.5" /> Show full</>
            }
          </button>
        </div>
      </div>
    )
  }

  // ── Remix ───────────────────────────────────────────────────────────────────
  if (item.type === 'remix') {
    const r = item.data

    return (
      <div className="bg-surface border border-border border-l-4 border-l-primary/50 rounded-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <Shuffle className="w-3.5 h-3.5 text-text-subtle shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/[0.08] border border-primary/20 px-1.5 py-0.5 rounded shrink-0">
              Remix
            </span>
            {r.structure && (
              <span className="text-[11px] text-text-subtle truncate hidden sm:block">{r.structure}</span>
            )}
            <span className="text-xs text-text-subtle shrink-0">{relativeDate(r.created_at)}</span>
          </div>
          <CopyButton text={r.adapted_version} size="sm" />
        </div>

        <p className="text-[11px] text-text-subtle px-4 pb-2">Source: "{truncate(r.source_post, 70)}"</p>

        {expanded
          ? <p className="text-sm text-text leading-relaxed whitespace-pre-wrap px-4 pb-3">{r.adapted_version}</p>
          : <p className="text-sm text-text-muted leading-relaxed px-4 pb-3">{truncate(r.adapted_version, 140)}</p>
        }

        <div className="px-4 py-2.5 border-t border-border flex justify-end">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors"
          >
            {expanded
              ? <><ChevronUp className="w-3.5 h-3.5" /> Collapse</>
              : <><ChevronDown className="w-3.5 h-3.5" /> Show full</>
            }
          </button>
        </div>
      </div>
    )
  }

  return null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
