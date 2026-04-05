import { Link, useParams, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react'
import { getArticle, getRelatedArticles, type BlogSection } from '@/data/blog'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const CATEGORY_COLORS: Record<string, string> = {
  'AI Writing': 'bg-violet-500/10 border-violet-500/20 text-violet-400',
  'Strategy':   'bg-sky-500/10 border-sky-500/20 text-sky-400',
  'Writing':    'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
}

function categoryClass(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-primary/10 border-primary/20 text-primary'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function renderSection(section: BlogSection, idx: number) {
  switch (section.type) {
    case 'h2':
      return (
        <h2 key={idx} className="text-xl sm:text-2xl font-bold text-text mt-10 mb-3 leading-snug">
          {section.content as string}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={idx} className="text-lg font-semibold text-text mt-7 mb-2">
          {section.content as string}
        </h3>
      )
    case 'p':
      return (
        <p key={idx} className="text-base text-text-muted leading-relaxed mb-4">
          {section.content as string}
        </p>
      )
    case 'ul':
      return (
        <ul key={idx} className="space-y-2.5 mb-5 pl-1">
          {(section.content as string[]).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-base text-text-muted leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={idx} className="space-y-2.5 mb-5 pl-1">
          {(section.content as string[]).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-base text-text-muted leading-relaxed">
              <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary mt-0.5">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      )
    case 'quote':
      return (
        <blockquote key={idx} className="border-l-2 border-primary pl-5 py-1 my-6">
          <p className="text-lg text-text font-medium leading-relaxed italic">
            "{section.content as string}"
          </p>
        </blockquote>
      )
    case 'callout':
      return (
        <div key={idx} className="bg-primary/[0.06] border border-primary/20 rounded-card px-5 py-4 my-6 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <p className="text-sm text-text-muted leading-relaxed">{section.content as string}</p>
        </div>
      )
    case 'divider':
      return <hr key={idx} className="border-border my-8" />
    default:
      return null
  }
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticle(slug) : undefined

  if (!article) return <Navigate to="/blog" replace />

  const related = getRelatedArticles(article.relatedSlugs ?? [])

  const articleSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Organization',
      name: 'Wrively',
      url: 'https://wrively.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Wrively',
      url: 'https://wrively.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://wrively.com/blog/${article.slug}`,
    },
  })

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      <Helmet>
        <title>{article.title} | Wrively Blog</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={`https://wrively.com/blog/${article.slug}`} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:url" content={`https://wrively.com/blog/${article.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://wrively.com/og/blog.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta property="article:published_time" content={article.date} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.description} />
        <meta name="twitter:image" content="https://wrively.com/og/blog.png" />
        <script type="application/ld+json">{articleSchema}</script>
      </Helmet>

      <PublicHeader />

      <main className="max-w-3xl mx-auto px-6 pt-10 pb-20">

        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All articles
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', categoryClass(article.category))}>
              {article.category}
            </span>
            <span className="text-xs text-text-subtle flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />{article.readTime}
            </span>
            <span className="text-xs text-text-subtle">{formatDate(article.date)}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-text leading-tight mb-4">
            {article.title}
          </h1>

          <p className="text-lg text-text-muted leading-relaxed border-b border-border pb-8">
            {article.intro}
          </p>
        </header>

        {/* Body */}
        <article className="prose-custom">
          {article.sections.map((section, idx) => renderSection(section, idx))}
        </article>

        {/* Mid-article CTA */}
        <div className="bg-surface border border-primary/20 rounded-card p-6 my-12 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Wrively</p>
          <h3 className="text-base font-bold text-text mb-2">Stop briefing AI. Build your Voice Layer once.</h3>
          <p className="text-sm text-text-muted mb-4 leading-relaxed">
            Set up in 2 minutes. Every post, rewrite, and comment generates in your voice.
            No prompt engineering. No blank pages.
          </p>
          <Link to="/signup">
            <Button size="sm" className="px-5">
              Start free
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-sm font-semibold text-text-subtle uppercase tracking-widest mb-5">Related articles</h2>
            <div className="space-y-3">
              {related.map(rel => (
                <Link
                  key={rel.slug}
                  to={`/blog/${rel.slug}`}
                  className="group flex items-start justify-between gap-4 bg-surface border border-border rounded-card px-5 py-4 hover:border-primary/25 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-text group-hover:text-primary transition-colors leading-snug mb-1">
                      {rel.title}
                    </p>
                    <p className="text-xs text-text-subtle flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />{rel.readTime}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-subtle group-hover:text-primary shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      <PublicFooter />
    </div>
  )
}
