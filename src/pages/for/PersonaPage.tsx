import { Link, useParams, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { getPersona } from '@/data/personas'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function PersonaPage() {
  const { slug } = useParams<{ slug: string }>()
  const data = slug ? getPersona(slug) : undefined

  if (!data) return <Navigate to="/" replace />

  const pageSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.metaTitle,
    description: data.metaDescription,
    url: `https://wrively.com/for/${data.slug}`,
    publisher: { '@type': 'Organization', name: 'Wrively', url: 'https://wrively.com' },
  })

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      <Helmet>
        <title>{data.metaTitle}</title>
        <meta name="description" content={data.metaDescription} />
        <link rel="canonical" href={`https://wrively.com/for/${data.slug}`} />
        <meta property="og:title" content={data.metaTitle} />
        <meta property="og:description" content={data.metaDescription} />
        <meta property="og:url" content={`https://wrively.com/for/${data.slug}`} />
        <meta property="og:image" content="https://wrively.com/og/home.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.metaTitle} />
        <meta name="twitter:description" content={data.metaDescription} />
        <meta name="twitter:image" content="https://wrively.com/og/home.png" />
        <script type="application/ld+json">{pageSchema}</script>
      </Helmet>

      <PublicHeader />

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] bg-primary/[0.05] rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 border border-primary/25 bg-primary/[0.06] text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          {data.badge}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight mb-5 max-w-3xl mx-auto">
          {data.headline}
        </h1>

        <p className="text-base text-text-muted leading-relaxed mb-3 max-w-xl mx-auto">
          {data.subheadline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 mb-4">
          <Link to="/signup">
            <Button size="lg" className="px-7">
              {data.cta}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/login" className="text-sm text-text-muted hover:text-text transition-colors">
            Already have an account →
          </Link>
        </div>
        <p className="text-xs text-text-subtle">{data.ctaSub}</p>
      </section>

      {/* Intro + pain points */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 items-start">
          <div>
            <p className="text-base text-text-muted leading-relaxed">{data.intro}</p>
          </div>
          <div className="bg-surface border border-border rounded-card p-5 space-y-3">
            <p className="text-xs font-semibold text-text-subtle uppercase tracking-widest">Sound familiar?</p>
            {data.painPoints.map((p, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-text-subtle shrink-0" />
                <p className="text-sm text-text-muted leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-xl font-semibold text-center mb-10">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
          <div className="hidden sm:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-border via-primary/30 to-border" />
          {data.howItWorks.map(({ step, title, body }) => (
            <div key={step} className="relative bg-surface border border-border rounded-card p-5 hover:border-primary/30 transition-colors group">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-9 h-9 rounded-full bg-surface border-2 border-border group-hover:border-primary/40 flex items-center justify-center transition-colors shrink-0 z-10">
                  <span className="text-xs font-bold text-text-muted group-hover:text-primary transition-colors">{step}</span>
                </div>
              </div>
              <h3 className="font-semibold text-text mb-1.5">{title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold text-center mb-10">
          Everything built around your voice.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.features.map(f => (
            <div key={f.title} className="bg-surface border border-border rounded-card p-6 flex gap-4 hover:border-primary/25 transition-colors">
              <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-text mb-1">{f.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Voice Layer callout */}
      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-surface border border-primary/20 rounded-card p-8 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center sm:text-left">
            {[
              { label: 'You', sub: 'Your context, built once' },
              { label: '→', sub: '' },
              { label: 'LinkedIn', sub: 'In your voice, every time' },
            ].map(({ label, sub }, i) => (
              <div key={i} className={cn('', label === '→' && 'text-2xl font-bold text-primary sm:text-center')}>
                {label !== '→' ? (
                  <>
                    <p className="text-lg font-bold text-text mb-1">{label}</p>
                    <p className="text-xs text-text-muted">{sub}</p>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-primary/40">→</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm font-semibold text-text mb-1">ChatGPT is a blank page. Wrively is a memory.</p>
            <p className="text-sm text-text-muted leading-relaxed">
              Every other AI starts from zero when you open it. You explain yourself, it forgets, you explain again.
              Wrively builds your Voice Layer once and writes from it forever.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-xl mx-auto px-6 pb-28 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-3">Start posting. This week.</h2>
        <p className="text-sm text-text-muted mb-8 max-w-sm mx-auto">
          {data.ctaSub}
        </p>
        <Link to="/signup">
          <Button size="lg" className="px-8">
            {data.cta}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>

      <PublicFooter />
    </div>
  )
}
