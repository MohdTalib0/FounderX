import { useState } from 'react'
import { toast } from '@/store/toast'
import { useAuthStore } from '@/store/auth'
import { generateComments, LimitReachedError } from '@/lib/ai/client'
import Button from '@/components/ui/Button'
import CopyButton from '@/components/ui/CopyButton'
import Textarea from '@/components/ui/Textarea'
import { isLinkedInPostUrl } from '@/lib/utils'

interface CommentResults {
  insightful: string
  curious: string
  bold: string
}

const COMMENT_META = [
  { key: 'insightful' as const, label: 'Insightful', desc: 'Adds a perspective or data point' },
  { key: 'curious'    as const, label: 'Curious',    desc: 'Asks a thoughtful question' },
  { key: 'bold'       as const, label: 'Bold',        desc: 'Strong take or respectful disagreement' },
]

export default function Engage() {
  const { company } = useAuthStore()

  const [postText, setPostText] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [results, setResults] = useState<CommentResults | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    if (!company || !postText.trim()) return
    setError('')
    setGenerating(true)
    setResults(null)

    try {
      const comments = await generateComments({
        source_post: postText,
        company_id: company.id,
        source_url: linkedinUrl.trim() || undefined,
      })

      setResults(comments)
      toast.success('3 comment suggestions ready')
    } catch (err: unknown) {
      console.error('Comment generation error:', err)
      if (err instanceof LimitReachedError) {
        setError('You have reached your monthly comment limit. Upgrade to Pro for unlimited comments.')
      } else {
        setError('Failed to generate comments. Please try again.')
      }
    } finally {
      setGenerating(false)
    }
  }

  const urlIsLinkedIn = linkedinUrl.trim() && isLinkedInPostUrl(linkedinUrl)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-page text-text">Get Comment Suggestions</h1>
        <p className="text-sm text-text-muted mt-0.5">Paste any post text, get 3 ready-to-use comments</p>
      </div>

      <div className="space-y-3">
        {/* Post text — primary */}
        <Textarea
          label="Paste the post text"
          rows={6}
          placeholder="Paste the post you want to comment on here..."
          value={postText}
          onChange={e => setPostText(e.target.value)}
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button
          onClick={generate}
          loading={generating}
          disabled={!postText.trim() || generating}
          size="lg"
          className="w-full"
        >
          {generating ? 'Generating...' : 'Generate Comments →'}
        </Button>

        {/* LinkedIn URL — truly optional, styled as metadata not a field */}
        <div className="pt-2">
          <input
            type="url"
            placeholder="LinkedIn post URL (optional — for tracking only)"
            value={linkedinUrl}
            onChange={e => setLinkedinUrl(e.target.value)}
            className="w-full bg-transparent text-xs text-text-muted placeholder:text-text-subtle border-0 border-b border-border/50 pb-1 focus:outline-none focus:border-border-focus transition-colors"
          />
          {linkedinUrl.trim() && !urlIsLinkedIn && (
            <p className="text-xs text-text-subtle mt-1">
              We can't read post content from URLs — paste the text above.
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          {COMMENT_META.map(({ key, label, desc }) => {
            const text = results[key]
            if (!text) return null

            return (
              <div key={key} className="bg-surface border border-border rounded-card overflow-hidden">
                {/* Header */}
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-text">{label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{desc}</p>
                  </div>
                  <CopyButton text={text} size="sm" label="Copy to edit" />
                </div>
                {/* Body */}
                <p className="text-sm text-text leading-relaxed px-4 pb-4">{text}</p>
              </div>
            )
          })}

          <p className="text-xs text-text-muted text-center pb-2">
            These are starting points. Edit them to make them feel personal.
          </p>
        </div>
      )}
    </div>
  )
}
