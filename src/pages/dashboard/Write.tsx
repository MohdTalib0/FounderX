import { useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RefreshCw, ChevronDown, ChevronUp, ChevronRight, Sliders, ImageDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import { generatePost, refinePost, regenerateVariation, LimitReachedError } from '@/lib/ai/client'
import { toast } from '@/store/toast'
import Button from '@/components/ui/Button'
import CopyButton from '@/components/ui/CopyButton'
import Badge from '@/components/ui/Badge'
import Textarea from '@/components/ui/Textarea'
import { QuoteCardModal } from '@/components/ui/QuoteCard'
import { cn } from '@/lib/utils'
import type { Company } from '@/types/database'

// ─── Types ────────────────────────────────────────────────────────────────────

type Variation = 'safe' | 'bold' | 'controversial'
type Refinement = 'too_formal' | 'too_generic' | 'too_long'

interface PostResults {
  safe: string
  bold: string
  controversial: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Write() {
  const [searchParams] = useSearchParams()
  const { company, profile } = useAuthStore()

  const [topic, setTopic] = useState(searchParams.get('topic') ?? '')
  const [results, setResults] = useState<PostResults | null>(null)
  const [savedPostId, setSavedPostId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [refining, setRefining] = useState<Variation | null>(null)
  const [inputCollapsed, setInputCollapsed] = useState(false)
  const [error, setError] = useState('')
  const [quoteCard, setQuoteCard] = useState<{ text: string; variation: Variation } | null>(null)

  const [expanded, setExpanded] = useState<Record<Variation, boolean>>({
    safe: false, bold: false, controversial: false,
  })

  const resultsRef = useRef<HTMLDivElement>(null)
  const pillars = company?.content_pillars ?? []

  // ─── Generate ──────────────────────────────────────────────────────────────

  const generate = async (topicOverride?: string) => {
    if (!company) return
    const t = (topicOverride ?? topic).trim()
    if (!t) return

    setError('')
    setGenerating(true)
    setResults(null)
    setSavedPostId(null)
    setInputCollapsed(false)

    try {
      const result = await generatePost({ topic: t, company_id: company.id })

      const posts: PostResults = {
        safe: result.variation_safe,
        bold: result.variation_bold,
        controversial: result.variation_controversial,
      }

      setResults(posts)
      setInputCollapsed(true)
      setSavedPostId(result.id)

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    } catch (err: unknown) {
      console.error('Generate error:', err)
      if (err instanceof LimitReachedError) {
        setError('You have reached your monthly post limit. Upgrade to Pro for unlimited posts.')
      } else {
        setError('Failed to generate posts. Please try again.')
      }
    } finally {
      setGenerating(false)
    }
  }

  // ─── Refine ────────────────────────────────────────────────────────────────

  const refine = async (variation: Variation, refinement: Refinement) => {
    if (!company || !results) return
    setRefining(variation)

    try {
      const refined = await refinePost({
        company_id: company.id,
        post: results[variation],
        refinement,
      })

      setResults(prev => prev ? { ...prev, [variation]: refined } : prev)

      if (savedPostId) {
        await supabase
          .from('generated_posts')
          .update({ [`variation_${variation}`]: refined })
          .eq('id', savedPostId)
      }
    } catch {
      toast.error('Refinement failed. Try again.')
    } finally {
      setRefining(null)
    }
  }

  // ─── Regenerate one ────────────────────────────────────────────────────────

  const regenerateOne = async (variation: Variation) => {
    if (!company || !results) return
    setRefining(variation)

    try {
      const result = await regenerateVariation({
        company_id: company.id,
        topic,
        variation,
      })

      setResults(prev => prev ? { ...prev, [variation]: result } : prev)

      if (savedPostId) {
        await supabase
          .from('generated_posts')
          .update({ [`variation_${variation}`]: result })
          .eq('id', savedPostId)
      }
    } catch {
      toast.error('Regeneration failed. Try again.')
    } finally {
      setRefining(null)
    }
  }

  // ─── Copy tracking ─────────────────────────────────────────────────────────

  const handleCopy = async (variation: Variation) => {
    if (!savedPostId) return
    await supabase
      .from('generated_posts')
      .update({ was_copied: true, selected_variation: variation })
      .eq('id', savedPostId)
  }

  const toggleExpand = (v: Variation) =>
    setExpanded(prev => ({ ...prev, [v]: !prev[v] }))

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-page text-text">Write a Post</h1>
        <p className="text-sm text-text-muted mt-0.5">Get 3 variations ready to post</p>
      </div>

      {/* Input section — collapsible after generation */}
      {inputCollapsed ? (
        <div className="bg-surface border border-border rounded-card px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-text-muted mb-0.5">Topic</p>
            <p className="text-sm text-text truncate">{topic}</p>
          </div>
          <button
            onClick={() => setInputCollapsed(false)}
            className="text-xs text-primary hover:text-primary-hover shrink-0 transition-colors"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <Textarea
            label="What do you want to post about?"
            rows={2}
            autoFocus
            placeholder='e.g. "Why we almost quit last month"'
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && topic.trim()) {
                e.preventDefault()
                generate()
              }
            }}
          />

          {/* Pillar chips — suggest topic from pillar, not replace with pillar name */}
          {pillars.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pillars.map(pillar => (
                <button
                  key={pillar}
                  onClick={() => setTopic(`${pillar}: what I've learned so far`)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-surface text-text-muted hover:border-primary/50 hover:text-primary transition-all"
                >
                  {pillar} →
                </button>
              ))}
            </div>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button
            onClick={() => generate()}
            loading={generating}
            disabled={!topic.trim() || generating}
            size="lg"
            className="w-full"
          >
            {generating ? 'Generating...' : 'Generate 3 Variations'}
            {!generating && <ChevronRight className="w-4 h-4" />}
          </Button>
          <p className="text-xs text-text-muted text-center">↵ Press Enter to generate</p>
        </div>
      )}

      {/* Regenerate button when collapsed */}
      {inputCollapsed && (
        <Button
          onClick={() => generate()}
          loading={generating}
          disabled={generating}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {generating ? 'Generating...' : 'Generate new variations'}
        </Button>
      )}

      {/* Results */}
      {results && (
        <div ref={resultsRef} className="space-y-4 scroll-mt-4">
          {(['safe', 'bold', 'controversial'] as Variation[]).map(variation => (
            <PostCard
              key={variation}
              variation={variation}
              text={results[variation]}
              topic={topic}
              company={company!}
              isExpanded={expanded[variation]}
              isRefining={refining === variation}
              onToggleExpand={() => toggleExpand(variation)}
              onCopy={() => handleCopy(variation)}
              onRefine={(r) => refine(variation, r)}
              onRegenerate={() => regenerateOne(variation)}
              onQuoteCard={() => setQuoteCard({ text: results[variation], variation })}
            />
          ))}
        </div>
      )}

      {/* Quote card modal */}
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

// ─── Post Card ────────────────────────────────────────────────────────────────

const VARIATION_META: Record<Variation, { label: string; emoji: string; desc: string }> = {
  safe:          { label: 'SAFE',          emoji: '🟢', desc: 'Professional · builds authority' },
  bold:          { label: 'BOLD',          emoji: '🟠', desc: 'Opinionated take' },
  controversial: { label: 'CONTROVERSIAL', emoji: '🔴', desc: 'Starts a debate' },
}

const REFINE_OPTIONS: { value: Refinement; label: string }[] = [
  { value: 'too_formal', label: 'Too formal' },
  { value: 'too_generic', label: 'Too generic' },
  { value: 'too_long', label: 'Too long' },
]

function PostCard({
  variation,
  text,
  isExpanded,
  isRefining,
  onToggleExpand,
  onCopy,
  onRefine,
  onRegenerate,
  onQuoteCard,
}: {
  variation: Variation
  text: string
  topic: string
  company: Company
  isExpanded: boolean
  isRefining: boolean
  onToggleExpand: () => void
  onCopy: () => void
  onRefine: (r: Refinement) => void
  onRegenerate: () => void
  onQuoteCard: () => void
}) {
  const [showRefine, setShowRefine] = useState(false)
  const meta = VARIATION_META[variation]
  const lines = text.split('\n')
  const hook = lines[0] ?? ''
  const body = lines.slice(1).join('\n').trim()
  const charCount = text.length
  const isNearLimit = charCount > 2500

  const PREVIEW_CHARS = 220
  const isLong = body.length > PREVIEW_CHARS

  return (
    <div className={cn(
      'bg-surface border border-border rounded-card overflow-hidden transition-all duration-200',
      isRefining && 'opacity-60 pointer-events-none'
    )}>
      {/* Header strip */}
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">{meta.emoji}</span>
          <Badge variant={variation}>{meta.label}</Badge>
          <span className="text-xs text-text-muted hidden sm:block">{meta.desc}</span>
        </div>
        <span className={cn('text-xs tabular-nums', isNearLimit ? 'text-warning' : 'text-text-subtle')}>
          {charCount}/3000
        </span>
      </div>

      {/* Content */}
      <div className="px-4 pb-3 space-y-2">
        {/* Hook line — the scroll-stopper, always prominent */}
        <p className="text-base font-semibold text-text leading-snug">{hook}</p>

        {/* Body */}
        {body && (
          <>
            <p className={cn(
              'text-sm text-text-muted leading-relaxed whitespace-pre-wrap mt-1',
              !isExpanded && isLong ? 'line-clamp-3' : ''
            )}>
              {body}
            </p>
            {isLong && (
              <button
                onClick={onToggleExpand}
                className="flex items-center gap-1 text-xs text-text-muted hover:text-text transition-colors"
              >
                {isExpanded
                  ? <><ChevronUp className="w-3 h-3" /> Less</>
                  : <><ChevronDown className="w-3 h-3" /> Read more</>
                }
              </button>
            )}
          </>
        )}
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-border bg-surface-hover/40">
        <div className="flex items-center gap-1">
          <button
            onClick={onRegenerate}
            disabled={isRefining}
            title="Regenerate this variation"
            className="p-1.5 text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowRefine(v => !v)}
            title="Refine this post"
            className={cn(
              'p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs',
              showRefine
                ? 'text-primary bg-primary/10'
                : 'text-text-muted hover:text-text hover:bg-surface-hover'
            )}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Adjust</span>
          </button>
          <button
            onClick={onQuoteCard}
            title="Get quote card image"
            className="p-1.5 text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors flex items-center gap-1 text-xs"
          >
            <ImageDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Image</span>
          </button>
        </div>
        <CopyButton
          text={text}
          onCopy={() => {
            onCopy()
            toast.success('Copied, ready to paste on LinkedIn')
          }}
          size="sm"
          label="Copy post"
        />
      </div>

      {/* Refine panel — hidden by default, revealed on click */}
      {showRefine && (
        <div className="px-4 py-3 border-t border-border space-y-2">
          <p className="text-xs text-text-muted">This sounds...</p>
          <div className="flex flex-wrap gap-2">
            {REFINE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => {
                  onRefine(opt.value)
                  setShowRefine(false)
                }}
                disabled={isRefining}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-surface hover:border-primary/50 hover:text-primary hover:bg-primary/5 text-text-muted transition-all"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
