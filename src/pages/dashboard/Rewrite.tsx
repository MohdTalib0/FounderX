import { useState } from 'react'
import { RefreshCw, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import { rewriteDraft, LimitReachedError } from '@/lib/ai/client'
import Button from '@/components/ui/Button'
import CopyButton from '@/components/ui/CopyButton'
import Textarea from '@/components/ui/Textarea'
import { cn } from '@/lib/utils'

export default function Rewrite() {
  const { company } = useAuthStore()

  const [draft, setDraft] = useState('')
  const [hooks, setHooks] = useState<string[]>([])
  const [selectedHook, setSelectedHook] = useState(0)
  const [rewritten, setRewritten] = useState('')
  const [savedId, setSavedId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  const wordCount = draft.split(/\s+/).filter(Boolean).length

  const generate = async () => {
    if (!company || !draft.trim()) return
    setError('')
    setGenerating(true)
    setHooks([])
    setRewritten('')
    setSavedId(null)

    try {
      const result = await rewriteDraft({ draft, company_id: company.id })
      if (!result.rewritten) throw new Error('No rewrite returned')
      setHooks(result.hooks)
      setSelectedHook(0)
      setRewritten(result.rewritten)
      setSavedId(result.id)
    } catch (err: unknown) {
      console.error('Rewrite error:', err)
      if (err instanceof LimitReachedError) {
        setError('You have reached your monthly rewrite limit. Upgrade to Pro for unlimited rewrites.')
      } else {
        setError('Failed to rewrite. Please try again.')
      }
    } finally {
      setGenerating(false)
    }
  }

  const getPostWithHook = (hookIndex: number): string => {
    if (!rewritten || !hooks[hookIndex]) return rewritten
    const lines = rewritten.split('\n')
    lines[0] = hooks[hookIndex]
    return lines.join('\n')
  }

  const handleSelectHook = async (idx: number) => {
    setSelectedHook(idx)
    if (savedId && hooks[idx]) {
      await supabase
        .from('draft_rewrites')
        .update({ selected_hook: hooks[idx] })
        .eq('id', savedId)
    }
  }

  const handleRestart = () => {
    setHooks([])
    setRewritten('')
    setSavedId(null)
    setError('')
  }

  const currentPost = getPostWithHook(selectedHook)

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-text">Rewrite My Draft</h1>
        <p className="text-sm text-text-muted mt-0.5">Paste rough thoughts. We'll make them postable.</p>
      </div>

      {/* ─── Input ─────────────────────────────────────────────────────── */}
      {!rewritten ? (
        <div className="space-y-3">
          <div className="relative">
            <Textarea
              label="Your rough draft or notes"
              rows={6}
              placeholder='e.g. "so yesterday we had a call with our biggest customer and they said something that changed how we think about the whole product..."'
              value={draft}
              onChange={e => setDraft(e.target.value)}
            />
            {wordCount > 0 && (
              <span className="absolute bottom-3 right-3 text-[11px] text-text-subtle pointer-events-none">
                {wordCount} words
              </span>
            )}
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button
            onClick={generate}
            loading={generating}
            disabled={!draft.trim() || generating}
            size="lg"
            className="w-full"
          >
            {generating ? 'Rewriting...' : 'Rewrite Draft'}
          </Button>
        </div>
      ) : (
        /* Collapsed draft summary */
        <div className="bg-surface border border-border rounded-card px-4 py-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-text-subtle uppercase tracking-wide font-medium mb-0.5">Your draft</p>
            <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">{draft}</p>
          </div>
          <button
            onClick={handleRestart}
            className="text-xs font-medium text-primary hover:text-primary-hover shrink-0 transition-colors mt-0.5"
          >
            New draft
          </button>
        </div>
      )}

      {/* ─── Results ───────────────────────────────────────────────────── */}
      {rewritten && (
        <div className="space-y-4">

          {/* Hook picker */}
          {hooks.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] text-text-subtle uppercase tracking-wide font-medium px-0.5">
                Pick your opening hook
              </p>
              <div className="space-y-2">
                {hooks.map((hook, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectHook(i)}
                    className={cn(
                      'w-full text-left px-4 py-3.5 rounded-card border transition-all flex items-start gap-3',
                      selectedHook === i
                        ? 'border-primary bg-primary/[0.06] text-text'
                        : 'border-border bg-surface text-text-muted hover:border-border-hover hover:text-text hover:bg-surface-hover'
                    )}
                  >
                    {/* Selection indicator */}
                    <div className={cn(
                      'w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors',
                      selectedHook === i
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    )}>
                      {selectedHook === i && (
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <span className="text-sm leading-snug">{hook}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-text-subtle px-0.5">Switching hooks updates the post below</p>
            </div>
          )}

          {/* Rewritten post */}
          <div className="bg-surface border border-border rounded-card overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <p className="text-[11px] text-text-subtle uppercase tracking-wide font-medium">Rewritten post</p>
              <span className="text-[11px] text-text-subtle tabular-nums">{currentPost.length} chars</span>
            </div>

            <div className="px-4 pb-4">
              {/* Hook line prominent */}
              {(() => {
                const lines = currentPost.split('\n')
                const hookLine = lines[0] ?? ''
                const bodyLines = lines.slice(1).join('\n').trim()
                return (
                  <div className="space-y-2">
                    <p className="text-[16px] font-semibold text-text leading-snug">{hookLine}</p>
                    {bodyLines && (
                      <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">{bodyLines}</p>
                    )}
                  </div>
                )
              })()}
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <button
                onClick={generate}
                disabled={generating}
                className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text transition-colors disabled:opacity-40"
              >
                <RefreshCw className={cn('w-3.5 h-3.5', generating && 'animate-spin')} />
                Regenerate
              </button>
              <CopyButton text={currentPost} label="Copy post" />
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
