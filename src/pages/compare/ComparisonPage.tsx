import { Link, useParams, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Check, X, ArrowRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { getComparison } from '@/data/comparisons'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function ComparisonPage() {
  const { slug } = useParams<{ slug: string }>()
  const data = slug ? getComparison(slug) : undefined

  if (!data) return <Navigate to="/" replace />

  const pageSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.metaTitle,
    description: data.metaDescription,
    url: `https://wrively.com/compare/${data.slug}`,
    publisher: { '@type': 'Organization', name: 'Wrively', url: 'https://wrively.com' },
  })

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      <Helmet>
        <title>{data.metaTitle}</title>
        <meta name="description" content={data.metaDescription} />
        <link rel="canonical" href={`https://wrively.com/compare/${data.slug}`} />
        <meta property="og:title" content={data.metaTitle} />
        <meta property="og:description" content={data.metaDescription} />
        <meta property="og:url" content={`https://wrively.com/compare/${data.slug}`} />
        <script type="application/ld+json">{pageSchema}</script>
      </Helmet>

      <PublicHeader />

      <main>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-14 text-center">
          <div className="inline-flex items-center gap-2 border border-border bg-surface text-text-muted text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            Wrively vs {data.competitorName}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 leading-tight max-w-3xl mx-auto">
            {data.headline}
          </h1>
          <p className="text-base text-text-muted leading-relaxed max-w-xl mx-auto mb-8">
            {data.subheadline}
          </p>
          <Link to="/signup">
            <Button size="lg" className="px-7">
              Try Wrively free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-xs text-text-subtle mt-3">No credit card. 2-minute setup.</p>
        </section>

        {/* Intro */}
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <p className="text-base text-text-muted leading-relaxed">{data.intro}</p>
          <div className="mt-6 p-4 bg-surface border border-border rounded-card">
            <p className="text-xs font-semibold text-text-subtle uppercase tracking-widest mb-1">Who typically switches</p>
            <p className="text-sm text-text-muted leading-relaxed">{data.whoSwitches}</p>
          </div>
        </section>

        {/* Side-by-side summary */}
        <section className="max-w-4xl mx-auto px-6 pb-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wrively */}
            <div className="bg-surface border border-primary/30 rounded-card overflow-hidden relative">
              <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
              <div className="p-6">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Wrively</p>
                <p className="text-sm font-semibold text-text mb-3">LinkedIn Voice Layer</p>
                <p className="text-sm text-text-muted leading-relaxed">{data.wrivelySummary}</p>
              </div>
            </div>
            {/* Competitor */}
            <div className="bg-surface border border-border rounded-card overflow-hidden">
              <div className="h-1 bg-transparent" />
              <div className="p-6">
                <p className="text-xs font-semibold text-text-subtle uppercase tracking-widest mb-2">{data.competitorName}</p>
                <p className="text-sm font-semibold text-text mb-3">{data.competitorTagline}</p>
                <p className="text-sm text-text-muted leading-relaxed">{data.competitorSummary}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <h2 className="text-xl font-bold text-text text-center mb-8">Feature comparison</h2>
          <div className="overflow-x-auto rounded-card border border-border">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left px-5 py-3.5 text-text-muted font-medium w-1/2">Feature</th>
                  <th className="px-4 py-3.5 text-center font-bold text-primary">Wrively</th>
                  <th className="px-4 py-3.5 text-center font-semibold text-text">{data.competitorName}</th>
                </tr>
              </thead>
              <tbody>
                {data.table.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      'border-b border-border last:border-0',
                      i % 2 === 0 ? 'bg-surface' : 'bg-background'
                    )}
                  >
                    <td className="px-5 py-3.5 text-text-muted">{row.feature}</td>
                    <td className="px-4 py-3.5 text-center">
                      <CellValue value={row.wrively} sub={row.wrivelySub} highlight />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <CellValue value={row.competitor} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Why switch */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <h2 className="text-xl font-bold text-text text-center mb-8">
            Why founders switch from {data.competitorName} to Wrively
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.switchReasons.map(reason => (
              <div key={reason.title} className="bg-surface border border-border rounded-card p-6 hover:border-primary/25 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-text leading-snug">{reason.title}</h3>
                </div>
                <p className="text-sm text-text-muted leading-relaxed pl-8">{reason.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quote (if present) */}
        {data.quote && (
          <section className="max-w-2xl mx-auto px-6 pb-16">
            <blockquote className="bg-surface border border-primary/20 rounded-card p-8 relative overflow-hidden text-center">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <p className="text-base text-text font-medium leading-relaxed mb-4 italic">"{data.quote.text}"</p>
              <p className="text-sm font-semibold text-text">{data.quote.name}</p>
              <p className="text-xs text-text-muted">{data.quote.role}</p>
            </blockquote>
          </section>
        )}

        {/* Mid-page CTA */}
        <section className="max-w-xl mx-auto px-6 pb-16 text-center">
          <div className="bg-surface border border-border rounded-card p-8 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <h2 className="text-xl font-bold text-text mb-2">Try Wrively • it takes 2 minutes</h2>
            <p className="text-sm text-text-muted mb-6 leading-relaxed">
              Free plan, no card required. Answer 4 questions and your Voice Layer is ready.
              Your first post generates before you leave the setup screen.
            </p>
            <Link to="/signup">
              <Button size="lg" className="px-8">
                Build my Voice Layer free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto px-6 pb-24">
          <h2 className="text-xl font-bold text-text text-center mb-8">Common questions</h2>
          <div className="divide-y divide-border border border-border rounded-card overflow-hidden">
            {data.faq.map(item => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  )
}

// ─── Cell renderer ────────────────────────────────────────────────────────────

function CellValue({ value, sub, highlight }: { value: string | boolean; sub?: string; highlight?: boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className={cn('w-4 h-4 mx-auto', highlight ? 'text-primary' : 'text-success')} />
    ) : (
      <X className="w-4 h-4 mx-auto text-text-subtle opacity-40" />
    )
  }
  return (
    <div>
      <span className={cn('text-sm', highlight ? 'text-primary font-medium' : 'text-text-muted')}>
        {value}
      </span>
      {sub && <p className="text-xs text-text-subtle mt-0.5">{sub}</p>}
    </div>
  )
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-surface">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-hover transition-colors"
      >
        <span className="text-sm font-medium text-text">{q}</span>
        <ChevronDown className={cn('w-4 h-4 text-text-muted shrink-0 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-border">
          <p className="text-sm text-text-muted leading-relaxed pt-4">{a}</p>
        </div>
      )}
    </div>
  )
}
