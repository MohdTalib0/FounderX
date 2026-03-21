import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Zap, Sun, Moon, X, Menu } from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/theme'

const NAV_LINKS = [
  { to: '/pricing',         label: 'Pricing' },
  { to: '/for-individuals', label: 'For individuals' },
  { to: '/contact',         label: 'Contact' },
]

export default function PublicHeader() {
  const { pathname } = useLocation()
  const { theme, toggle } = useThemeStore()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Close drawer on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={cn(
        'sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b transition-all duration-200',
        scrolled ? 'border-border shadow-sm' : 'border-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-primary-gradient rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="w-[17px] h-[17px] text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-text">FounderX</span>
          </Link>

          {/* Desktop nav — center */}
          <nav className="hidden sm:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'text-sm px-4 py-2 rounded-btn transition-colors duration-150',
                  pathname === to
                    ? 'text-text font-medium bg-surface-hover'
                    : 'text-text-muted hover:text-text hover:bg-surface-hover'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggle}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              className="p-2 text-text-muted hover:text-text hover:bg-surface-hover rounded-btn transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/login"
              className="hidden sm:flex items-center text-sm px-4 py-2 rounded-btn border border-border text-text-muted hover:border-border-hover hover:text-text transition-all duration-150"
            >
              Sign in
            </Link>

            <Link to="/signup" className="hidden sm:block">
              <Button size="sm">Start free</Button>
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(v => !v)}
              className="sm:hidden p-2 text-text-muted hover:text-text hover:bg-surface-hover rounded-btn transition-colors"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      {open && (
        <div className="sm:hidden fixed inset-0 z-10 bg-background/95 backdrop-blur-sm flex flex-col pt-16">
          <nav className="px-5 pt-6 pb-4 space-y-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center text-base px-4 py-3.5 rounded-xl transition-colors',
                  pathname === to
                    ? 'bg-primary/[0.08] text-primary font-medium'
                    : 'text-text hover:bg-surface-hover'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="px-5 pt-2 pb-6 mt-auto space-y-3 border-t border-border">
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button variant="secondary" className="w-full" size="lg">Sign in</Button>
            </Link>
            <Link to="/signup" onClick={() => setOpen(false)}>
              <Button className="w-full" size="lg">Start free</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
