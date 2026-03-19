import { useState } from 'react'
import { Shuffle, ChevronRight, Copy } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { remixPost } from '@/lib/ai/client'
import { toast } from '@/store/toast'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import CopyButton from '@/components/ui/CopyButton'
import { cn } from '@/lib/utils'

interface RemixResult {
  structure: string
  hook_type: string
  tone: string
  why_it_works: string
  adapted_version: string
}

export default function Remix() {
  const { company } = useAuthStore()
  const [sourcePost, setSourcePost] = useState('')
  const [result, setResult] = useState<RemixResult | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!company || !sourcePost.trim()) return
    setError('')
    setGenerating(true)
    setResult(null)

    try {
      const data = await remixPost({ source_post: sourcePost, company_id: company.id })
      setResult(data)
    } catch (err: unknown) {
      console.error('Remix error:', err)
      setError('Failed to remix. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-page text-text">Remix a Post</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Paste a post that caught your attention. We'll decode what makes it work and rewrite it in your voice.
        </p>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <Textarea
          label="Paste the post"
          rows={6}
          placeholder="Paste the LinkedIn post you want to remix here..."
          value={sourcePost}
          onChange={e => setSourcePost(e.target.value)}
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button
          onClick={handleGenerate}
          loading={generating}
          disabled={!sourcePost.trim() || generating}
          size="lg"
          className="w-full"
        >
          {generating ? 'Analysing & remixing...' : 'Remix this post'}
          {!generating && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">

          {/* Structure breakdown */}
          <div className="bg-surface border border-border rounded-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-text">Why this post works</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AnalysisChip label="Structure" value={result.structure} color="violet" />
              <AnalysisChip label="Hook type" value={result.hook_type} color="amber" />
              <AnalysisChip label="Tone" value={result.tone} color="sky" />
              <div className="sm:col-span-2">
                <AnalysisChip label="Why it works" value={result.why_it_works} color="emerald" />
              </div>
            </div>
          </div>

          {/* Adapted version */}
          <div className="relative bg-surface border border-primary/25 rounded-card overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5 text-primary" />
                <p className="text-sm font-semibold text-text">Your version</p>
              </div>
              <span className="text-xs text-text-subtle">{result.adapted_version.length}/3000</span>
            </div>

            <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap px-5 py-4">
              {result.adapted_version}
            </p>

            <div className="px-5 pb-5">
              <CopyButton
                text={result.adapted_version}
                onCopy={() => toast.success('Copied — paste on LinkedIn')}
                label="Copy your version"
                className="w-full justify-center"
                size="sm"
              />
            </div>
          </div>

          {/* Regenerate */}
          <Button
            onClick={handleGenerate}
            loading={generating}
            disabled={generating}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            <Shuffle className="w-3.5 h-3.5" />
            {generating ? 'Remixing...' : 'Remix again'}
          </Button>
        </div>
      )}
    </div>
  )
}

// ─── Analysis chip ─────────────────────────────────────────────────────────────

const colorMap = {
  violet: 'border-violet-500/20 bg-violet-500/[0.06] text-violet-400',
  amber:  'border-amber-500/20 bg-amber-500/[0.06] text-amber-400',
  sky:    'border-sky-500/20 bg-sky-500/[0.06] text-sky-400',
  emerald:'border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400',
}

function AnalysisChip({ label, value, color }: { label: string; value: string; color: keyof typeof colorMap }) {
  return (
    <div className={cn('rounded-lg border px-3 py-2.5', colorMap[color])}>
      <p className="text-[10px] font-bold uppercase tracking-wide opacity-70 mb-1">{label}</p>
      <p className="text-xs leading-relaxed">{value}</p>
    </div>
  )
}
