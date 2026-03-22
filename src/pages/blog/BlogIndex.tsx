import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Clock, BookOpen } from 'lucide-react'
import { articles } from '@/data/blog'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
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

export default function BlogIndex() {
  const [featured, ...rest] = articles

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      <Helmet>
        <title>Wrively Blog • LinkedIn Strategy and Voice for Founders</title>
        <meta name="description" content="Practical guides on LinkedIn content, founder voice, and AI writing. Learn how to post consistently, sound like yourself, and build an audience that converts." />
        <link rel="canonical" href="https://wrively.com/blog" />
        <meta property="og:title" content="Wrively Blog • LinkedIn Strategy and Voice for Founders" />
        <meta property="og:description" content="Practical guides on LinkedIn content, founder voice, and AI writing for founders." />
        <meta property="og:url" content="https://wrively.com/blog" />
      </Helmet>

      <PublicHeader />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary tracking-widest uppercase">The Wrively Blog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Build your founder voice on LinkedIn.
        </h1>
        <p className="text-base text-text-muted max-w-xl leading-relaxed">
          Practical guides on posting consistently, writing in your voice, and building an audience that actually converts.
        </p>
      </section>

      {/* Featured article */}
      <section className="max-w-5xl mx-auto px-6 pb-10">
        <Link
          to={`/blog/${featured.slug}`}
          className="group block bg-surface border border-border rounded-card overflow-hidden hover:border-primary/30 transition-colors"
        >
          <div className="p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', categoryClass(featured.category))}>
                {featured.category}
              </span>
              <span className="text-xs text-text-subtle flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />{featured.readTime}
              </span>
              <span className="text-xs text-text-subtle">{formatDate(featured.date)}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-text mb-3 group-hover:text-primary transition-colors leading-tight">
              {featured.title}
            </h2>
            <p className="text-base text-text-muted leading-relaxed max-w-2xl mb-5">
              {featured.description}
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
              Read article <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </section>

      {/* Article grid */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-sm font-semibold text-text-subtle uppercase tracking-widest mb-6">All articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

function ArticleCard({ article }: { article: typeof articles[number] }) {
  return (
    <Link
      to={`/blog/${article.slug}`}
      className="group flex flex-col bg-surface border border-border rounded-card p-6 hover:border-primary/25 transition-colors"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border', categoryClass(article.category))}>
          {article.category}
        </span>
        <span className="text-xs text-text-subtle flex items-center gap-1">
          <Clock className="w-3 h-3" />{article.readTime}
        </span>
      </div>

      <h3 className="text-base font-semibold text-text mb-2 leading-snug group-hover:text-primary transition-colors flex-1">
        {article.title}
      </h3>
      <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-3">
        {article.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-text-subtle">{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        <ArrowRight className="w-4 h-4 text-text-subtle group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  )
}
