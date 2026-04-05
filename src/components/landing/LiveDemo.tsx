import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Loader2, RotateCcw } from 'lucide-react'
import Button from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface DemoResult {
  hook: string
  post: string
  tone: string
}

export default function LiveDemo() {
  const [context, setContext] = useState('')
  const [idea, setIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DemoResult | null>(null)
  const [error, setError] = useState('')

  const canSubmit = context.trim().length > 5 && idea.trim().length > 5 && !loading

  const handleTransform = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const content = `${context.trim()}\n---\n${idea.trim()}`
      const { data, error: fnError } = await supabase.functions.invoke('analyze-tool', {
        body: { tool: 'draft-transform', content },
      })

      if (fnError) {
        // Parse the error context for specific error messages
        const ctx = (fnError as { context?: Response }).context
        if (ctx instanceof Response) {
          const json = await ctx.json().catch(() => ({}))
          if (json.error === 'rate_limited') {
            setError('Demo limit reached for today. Sign up free to generate unlimited posts.')
            return
          }
          if (json.error === 'free_models_busy') {
            setError('AI is warming up. Try again in a moment.')
            return
          }
        }
        throw fnError
      }

      if (data?.post) {
        setResult({ hook: data.hook, post: data.post, tone: data.tone })
      } else {
        setError('Something went wrong. Try again.')
      }
    } catch {
      setError('Something went wrong. Try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && canSubmit) {
      e.preventDefault()
      handleTransform()
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-5 py-10 sm:py-14">
      <div className="rounded-2xl border border-primary/20 bg-primary/[0.02] p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {!result ? (
          <>
            {/* Input state */}
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-primary">Try it now — no signup needed</p>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-text mb-1.5">
              Two sentences. One LinkedIn post.
            </h3>
            <p className="text-sm text-text-muted mb-6">
              See what Wrively does with your rough idea.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-medium text-text-muted mb-1.5 block">
                  What do you do?
                </label>
                <input
                  type="text"
                  placeholder="I'm building a DevOps tool for small teams"
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-surface border border-border rounded-input px-4 py-3 text-text placeholder:text-text-subtle text-sm focus:outline-none focus:border-primary/50 focus:shadow-input-focus transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted mb-1.5 block">
                  What's on your mind?
                </label>
                <input
                  type="text"
                  placeholder="Talking to users early saves you from building the wrong thing"
                  value={idea}
                  onChange={e => setIdea(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-surface border border-border rounded-input px-4 py-3 text-text placeholder:text-text-subtle text-sm focus:outline-none focus:border-primary/50 focus:shadow-input-focus transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-danger mb-4">{error}</p>
            )}

            <Button
              onClick={handleTransform}
              disabled={!canSubmit}
              className="w-full sm:w-auto gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Transforming...
                </>
              ) : (
                <>
                  See your post
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Result state */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-primary">Your post, ready to go</p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Try another
              </button>
            </div>

            {/* Before / After */}
            <div className="space-y-3 mb-6">
              {/* Before: the rough idea */}
              <div className="rounded-xl border border-border bg-surface/50 px-4 py-3">
                <p className="text-[10px] font-bold text-text-subtle uppercase tracking-wider mb-1.5">Your rough idea</p>
                <p className="text-sm text-text-muted italic">{idea}</p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="text-[10px] text-primary font-semibold px-3 py-1 border border-primary/20 rounded-full bg-primary/[0.06]">
                  transformed by Wrively
                </div>
              </div>

              {/* After: the polished post */}
              <div className="rounded-xl border border-primary/25 bg-primary/[0.03] px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">LinkedIn post</p>
                  {result.tone && (
                    <span className="text-[10px] text-text-muted px-2 py-0.5 rounded-full border border-border bg-surface">
                      {result.tone}
                    </span>
                  )}
                </div>
                <div className="text-sm text-text leading-relaxed whitespace-pre-line">
                  {result.post}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className={cn(
              'rounded-xl border border-border bg-surface p-5 text-center'
            )}>
              <p className="text-sm font-semibold text-text mb-1">
                That was one variation, no voice training.
              </p>
              <p className="text-xs text-text-muted mb-4">
                Sign up to get 3 variations per topic, tuned to your voice, in under 10 seconds.
              </p>
              <Link to="/signup">
                <Button size="md" className="gap-2">
                  Start free in 2 minutes
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
