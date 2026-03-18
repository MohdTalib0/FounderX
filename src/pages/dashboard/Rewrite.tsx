import { useState } from 'react'
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

  const currentPost = getPostWithHook(selectedHook)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-page text-text">Rewrite My Draft</h1>
        <p className="text-sm text-text-muted mt-0.5">Paste rough thoughts, we'll make them postable</p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Textarea
            label="Your rough draft or notes"
            rows={6}
            placeholder='e.g. "so yesterday we had a call with our biggest customer and they said something that changed how we think about the whole product..."'
            value={draft}
            onChange={e => setDraft(e.target.value)}
          />
          <p className="text-xs text-text-muted text-right">
            {draft.split(/\s+/).filter(Boolean).length} words
          </p>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button
          onClick={generate}
          loading={generating}
          disabled={!draft.trim() || generating}
          size="lg"
          className="w-full"
        >
          {generating ? 'Rewriting...' : 'Rewrite →'}
        </Button>
      </div>

      {rewritten && (
        <div className="space-y-4">
          {/* Hook picker */}
          {hooks.length > 0 && (
            <div className="bg-surface border border-border rounded-card p-5 space-y-3">
              <p className="text-sm font-medium text-text">Pick your opening hook</p>
              <div className="space-y-2">
                {hooks.map((hook, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectHook(i)}
                    className={cn(
                      'w-full text-left px-4 py-3 rounded-card border text-sm transition-all',
                      selectedHook === i
                        ? 'border-primary bg-primary/10 text-text'
                        : 'border-border bg-surface-hover text-text-muted hover:border-border-hover hover:text-text'
                    )}
                  >
                    <span className="text-text-muted mr-2">{i + 1}.</span>
                    {hook}
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-muted">Switching hooks updates the post below</p>
            </div>
          )}

          {/* Rewritten post */}
          <div className="bg-surface border border-border rounded-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-text">Rewritten post</p>
              <span className="text-xs text-text-muted">{currentPost.length} chars</span>
            </div>

            <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">
              {currentPost}
            </p>

            <div className="pt-1 border-t border-border flex justify-end">
              <CopyButton text={currentPost} label="Copy post" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
