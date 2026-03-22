import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Home, FileText, BarChart2 } from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import Button from '@/components/ui/Button'

const POPULAR = [
  { to: '/blog', icon: FileText, label: 'Blog', desc: 'LinkedIn tips for founders' },
  { to: '/tools/linkedin-headline-analyzer', icon: BarChart2, label: 'Headline Analyzer', desc: 'Free tool • grade your LinkedIn headline' },
  { to: '/pricing', icon: Home, label: 'Pricing', desc: 'Free, Starter, and Pro plans' },
]

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Wrively</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <PublicHeader />

      <main className="bg-background min-h-[80vh] flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
          <p className="text-6xl font-bold text-primary/30 mb-4 tabular-nums">404</p>
          <h1 className="text-2xl font-bold text-text mb-3">This page does not exist</h1>
          <p className="text-text-muted text-base mb-8 max-w-sm">
            It may have moved or been removed. Here are some pages that do exist.
          </p>

          <Link to="/">
            <Button className="flex items-center gap-2 mb-10">
              <Home className="w-4 h-4" />
              Back to homepage
            </Button>
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl w-full text-left">
            {POPULAR.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="group bg-surface border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <item.icon className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                </div>
                <p className="text-xs text-text-subtle">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  )
}
