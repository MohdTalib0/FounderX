import { useParams, Navigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { Copy, Check, ArrowRight } from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import Button from '@/components/ui/Button'
import { getPostExamplesTopic } from '@/data/postExamples'
import { cn } from '@/lib/utils'

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all',
        copied
          ? 'border-green-500/50 text-green-500 bg-green-500/5'
          : 'border-border text-text-muted hover:border-primary/50 hover:text-primary',
      )}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

// ─── Tone badge ───────────────────────────────────────────────────────────────

const TONE_STYLES = {
  green: 'bg-green-500/10 text-green-500 border-green-500/20',
  amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PostExamplesPage() {
  const { topic } = useParams<{ topic: string }>()
  const data = topic ? getPostExamplesTopic(topic) : undefined

  if (!data) return <Navigate to="/blog" replace />

  return (
    <>
      <Helmet>
        <title>{data.metaTitle}</title>
        <meta name="description" content={data.metaDescription} />
        <link rel="canonical" href={`https://wrively.com/linkedin-post-examples/${data.slug}`} />
        <meta property="og:title" content={data.metaTitle} />
        <meta property="og:description" content={data.metaDescription} />
        <meta property="og:url" content={`https://wrively.com/linkedin-post-examples/${data.slug}`} />
        <meta property="og:image" content="https://wrively.com/og/home.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.metaTitle} />
        <meta name="twitter:description" content={data.metaDescription} />
        <meta name="twitter:image" content="https://wrively.com/og/home.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: data.metaTitle,
          description: data.metaDescription,
          url: `https://wrively.com/linkedin-post-examples/${data.slug}`,
        })}</script>
      </Helmet>

      <PublicHeader />

      <main className="bg-background min-h-screen">

        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 pt-16 pb-10">
          <div className="mb-4">
            <Link
              to="/blog"
              className="text-xs text-text-subtle hover:text-text-muted transition-colors"
            >
              Blog
            </Link>
            <span className="text-xs text-text-subtle mx-2">/</span>
            <span className="text-xs text-text-subtle">LinkedIn post examples</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">{data.headline}</h1>
          <p className="text-text-muted text-lg leading-relaxed">{data.subheadline}</p>
          <p className="text-text-muted mt-4 leading-relaxed">{data.intro}</p>
        </section>

        {/* Examples */}
        <section className="max-w-3xl mx-auto px-6 pb-12 space-y-8">
          {data.examples.map((ex, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4 border-b border-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'text-xs font-medium px-2.5 py-0.5 rounded-full border',
                      TONE_STYLES[ex.toneColor],
                    )}>
                      {ex.tone}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-text">{ex.title}</h2>
                </div>
                <CopyButton text={ex.body} />
              </div>

              {/* Post body */}
              <div className="px-6 py-5">
                <pre className="whitespace-pre-wrap font-sans text-sm text-text leading-relaxed">
                  {ex.body}
                </pre>
              </div>

              {/* Why it works */}
              <div className="px-6 pb-5">
                <div className="bg-background border border-border rounded-lg px-4 py-3">
                  <p className="text-xs font-medium text-text-muted mb-1">Why this works</p>
                  <p className="text-xs text-text-subtle leading-relaxed">{ex.why}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Tips */}
        <section className="bg-surface border-y border-border py-12">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-xl font-bold text-text mb-5">Tips for writing {data.headline.replace('LinkedIn Post Examples: ', '').toLowerCase()} posts</h2>
            <ul className="space-y-3">
              {data.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-text-muted leading-relaxed">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
            <h2 className="text-xl font-bold text-text mb-2">
              Write posts like these in your own voice
            </h2>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              Wrively builds your founder persona and generates posts in your tone. Not generic examples. Posts that sound like you.
            </p>
            <Link to="/signup">
              <Button className="flex items-center gap-2 mx-auto">
                Start free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Related topics */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <h2 className="text-base font-semibold text-text mb-4">More post examples</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.relatedTopics.map(rel => (
              <Link
                key={rel.slug}
                to={`/linkedin-post-examples/${rel.slug}`}
                className="group bg-surface border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <span className="text-sm text-text-muted group-hover:text-text transition-colors">
                  {rel.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-text-subtle group-hover:text-primary mt-1 transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* Internal links to free tools */}
        <section className="mt-16 pt-10 border-t border-border">
          <h2 className="text-lg font-bold text-text mb-2">Sharpen your LinkedIn writing</h2>
          <p className="text-sm text-text-muted mb-6">Use these free tools to level up every post before you publish.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { to: '/tools/linkedin-headline-analyzer', label: 'Headline Analyzer', desc: 'Score your headline out of 100' },
              { to: '/tools/linkedin-post-checker', label: 'Post Checker', desc: 'Check hook, length, structure, CTA' },
              { to: '/tools/linkedin-voice-analyzer', label: 'Voice Analyzer', desc: 'Does your writing sound like you?' },
            ].map(tool => (
              <Link key={tool.to} to={tool.to} className="group bg-surface border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">{tool.label}</p>
                <p className="text-xs text-text-muted mt-1">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>

      </main>

      <PublicFooter />
    </>
  )
}
