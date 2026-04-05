import { useParams, Navigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { Copy, Check, ArrowRight, Zap } from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import Button from '@/components/ui/Button'
import { getHookTypePage } from '@/data/hookExamples'
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
        'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all shrink-0',
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

// ─── Main component ───────────────────────────────────────────────────────────

export default function HookExamplesPage() {
  const { type } = useParams<{ type: string }>()
  const data = type ? getHookTypePage(type) : undefined

  if (!data) return <Navigate to="/blog" replace />

  return (
    <>
      <Helmet>
        <title>{data.metaTitle}</title>
        <meta name="description" content={data.metaDescription} />
        <link rel="canonical" href={`https://wrively.com/hooks/${data.slug}`} />
        <meta property="og:title" content={data.metaTitle} />
        <meta property="og:description" content={data.metaDescription} />
        <meta property="og:url" content={`https://wrively.com/hooks/${data.slug}`} />
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
          url: `https://wrively.com/hooks/${data.slug}`,
        })}</script>
      </Helmet>

      <PublicHeader />

      <main className="bg-background min-h-screen">

        {/* Hero */}
        <section className="max-w-3xl mx-auto px-6 pt-16 pb-10">
          <div className="mb-4 flex items-center gap-1.5 text-xs text-text-subtle">
            <Link to="/blog" className="hover:text-text-muted transition-colors">Blog</Link>
            <span>/</span>
            <span>LinkedIn hook examples</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">{data.headline}</h1>
          <p className="text-text-muted text-lg leading-relaxed">{data.subheadline}</p>
          <p className="text-text-muted mt-4 leading-relaxed">{data.intro}</p>
        </section>

        {/* Formula */}
        <section className="max-w-3xl mx-auto px-6 pb-10">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <p className="text-xs font-bold uppercase tracking-widest text-primary">The formula</p>
            </div>
            <p className="text-sm font-mono text-text mb-4">{data.formula}</p>
            <div className="border-t border-primary/10 pt-4">
              <p className="text-xs text-text-subtle mb-1">Example:</p>
              <p className="text-sm text-text-muted italic">"{data.formulaExample}"</p>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="max-w-3xl mx-auto px-6 pb-12 space-y-5">
          <h2 className="text-xl font-bold text-text">Examples</h2>
          {data.examples.map((ex, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <p className="text-base font-medium text-text leading-snug flex-1">"{ex.hook}"</p>
                <CopyButton text={ex.hook} />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-text-subtle bg-background border border-border rounded-lg px-3 py-2 leading-relaxed">
                  <span className="font-medium text-text-muted">Why it works: </span>{ex.why}
                </p>
                <p className="text-xs text-text-subtle">
                  <span className="font-medium text-text-muted">Best for: </span>{ex.bestFor}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* What to avoid */}
        <section className="bg-surface border-y border-border py-12">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-xl font-bold text-text mb-5">What to avoid</h2>
            <ul className="space-y-3">
              {data.avoid.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mt-0.5">
                    <span className="w-1.5 h-px bg-red-400 block" />
                  </span>
                  <p className="text-sm text-text-muted leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
            <h2 className="text-xl font-bold text-text mb-2">
              Generate hooks in your own voice
            </h2>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              Wrively builds your founder persona and generates posts with hooks calibrated to your tone and style. Not templates. Your voice.
            </p>
            <Link to="/signup">
              <Button className="flex items-center gap-2 mx-auto">
                Start free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Related types */}
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <h2 className="text-base font-semibold text-text mb-4">More hook types</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.relatedTypes.map(rel => (
              <Link
                key={rel.slug}
                to={`/hooks/${rel.slug}`}
                className="group bg-surface border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <span className="text-sm text-text-muted group-hover:text-text transition-colors block mb-1">
                  {rel.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-text-subtle group-hover:text-primary transition-colors" />
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
