import { Link, useLocation } from 'react-router-dom'
import { Zap } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/for-individuals', label: 'For individuals' },
  { to: '/pricing', label: 'Pricing' },
]

export default function PublicHeader() {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-primary-gradient rounded-lg flex items-center justify-center">
            <Zap className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="font-bold text-base tracking-tight">FounderX</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => {
            const isActive = to.startsWith('/#')
              ? false
              : pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'text-sm px-3.5 py-1.5 rounded-btn transition-all duration-150',
                  isActive
                    ? 'text-text bg-surface-hover'
                    : 'text-text-muted hover:text-text hover:bg-surface-hover'
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/login"
            className="hidden sm:flex items-center text-sm px-3.5 py-1.5 rounded-btn border border-border text-text-muted hover:border-border-hover hover:text-text transition-all duration-150"
          >
            Sign in
          </Link>
          <Link to="/signup">
            <Button size="sm">Start free</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
