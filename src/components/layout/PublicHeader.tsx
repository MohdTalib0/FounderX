import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Zap, Sun, Moon, X, Menu, ChevronDown,
  PenLine, RefreshCw, MessageSquare,
  BarChart2, FileText, Mic,
  Users, Briefcase, TrendingUp, Rocket,
  GitCompare, ArrowRight,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/theme'

// ─── Menu data ────────────────────────────────────────────────────────────────

const PRODUCT_ITEMS = [
  {
    group: 'Features',
    items: [
      { to: '/signup',             icon: PenLine,      label: 'Write a Post',     desc: 'Generate 3 variations in your voice' },
      { to: '/signup',             icon: RefreshCw,    label: 'Rewrite a Draft',  desc: 'Turn rough thoughts into a polished post' },
      { to: '/signup',             icon: MessageSquare,label: 'Get Comments',     desc: 'AI comment suggestions that add value' },
    ],
  },
  {
    group: 'Made for',
    items: [
      { to: '/for/founders',      icon: Rocket,        label: 'Founders',         desc: 'Seed to Series A' },
      { to: '/for/consultants',   icon: Briefcase,     label: 'Consultants',      desc: 'Build authority in your niche' },
      { to: '/for/executives',    icon: TrendingUp,    label: 'Executives',       desc: 'Senior leaders and operators' },
      { to: '/for/solopreneurs',  icon: Users,         label: 'Solopreneurs',     desc: 'One-person businesses' },
    ],
  },
]

const TOOLS_ITEMS = [
  { to: '/tools/linkedin-headline-analyzer', icon: BarChart2,  label: 'Headline Analyzer',  desc: 'Grade your LinkedIn headline' },
  { to: '/tools/linkedin-post-checker',      icon: FileText,   label: 'Post Checker',        desc: 'Score any post before you publish' },
  { to: '/tools/linkedin-voice-analyzer',    icon: Mic,        label: 'Voice Analyzer',      desc: 'Does your writing sound like you?' },
]

const COMPARE_ITEMS = [
  { to: '/compare/taplio-alternative',          label: 'Wrively vs Taplio' },
  { to: '/compare/hypefury-alternative',        label: 'Wrively vs Hypefury' },
  { to: '/compare/chatgpt-for-linkedin',        label: 'Wrively vs ChatGPT' },
  { to: '/compare/jasper-for-linkedin',         label: 'Wrively vs Jasper' },
  { to: '/compare/draftly-alternative',         label: 'Wrively vs Draftly' },
  { to: '/compare/lempod-alternative',          label: 'Wrively vs Lempod' },
]

// ─── Dropdown wrapper ─────────────────────────────────────────────────────────

function NavDropdown({
  label,
  active,
  children,
}: {
  label: string
  active: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  let closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleMouseEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  function handleMouseLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          'flex items-center gap-1 text-sm px-4 py-2 rounded-btn transition-colors duration-150 select-none',
          (active || open)
            ? 'text-text font-medium bg-surface-hover'
            : 'text-text-muted hover:text-text hover:bg-surface-hover',
        )}
      >
        {label}
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
          <div className="bg-surface border border-border rounded-xl shadow-xl overflow-hidden">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Product mega menu ────────────────────────────────────────────────────────

function ProductMenu({ close }: { close: () => void }) {
  return (
    <div className="w-[480px] p-3 grid grid-cols-2 gap-1">
      {PRODUCT_ITEMS.map(group => (
        <div key={group.group}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-subtle px-2 py-1.5">
            {group.group}
          </p>
          {group.items.map(item => (
            <Link
              key={item.label}
              to={item.to}
              onClick={close}
              className="flex items-start gap-3 px-2 py-2 rounded-lg hover:bg-surface-hover transition-colors group"
            >
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text leading-none mb-0.5">{item.label}</p>
                <p className="text-xs text-text-subtle leading-snug">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      ))}
      <div className="col-span-2 mt-1 pt-2 border-t border-border flex items-center justify-between px-2 py-1">
        <p className="text-xs text-text-subtle">Or see all personas</p>
        <Link to="/for-individuals" onClick={close} className="flex items-center gap-1 text-xs text-primary hover:underline">
          For individuals <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}

// ─── Tools menu ───────────────────────────────────────────────────────────────

function ToolsMenu({ close }: { close: () => void }) {
  return (
    <div className="w-[300px] p-3 space-y-0.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-text-subtle px-2 py-1.5">
        All free, no signup
      </p>
      {TOOLS_ITEMS.map(item => (
        <Link
          key={item.to}
          to={item.to}
          onClick={close}
          className="flex items-start gap-3 px-2 py-2 rounded-lg hover:bg-surface-hover transition-colors group"
        >
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
            <item.icon className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-text leading-none mb-0.5">{item.label}</p>
            <p className="text-xs text-text-subtle">{item.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

// ─── Compare menu ─────────────────────────────────────────────────────────────

function CompareMenu({ close }: { close: () => void }) {
  return (
    <div className="w-[220px] p-3 space-y-0.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-text-subtle px-2 py-1.5">
        Alternatives
      </p>
      {COMPARE_ITEMS.map(item => (
        <Link
          key={item.to}
          to={item.to}
          onClick={close}
          className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-surface-hover transition-colors group"
        >
          <GitCompare className="w-3.5 h-3.5 text-text-subtle group-hover:text-primary transition-colors shrink-0" />
          <span className="text-sm text-text-muted group-hover:text-text transition-colors">{item.label}</span>
        </Link>
      ))}
    </div>
  )
}

// ─── Mobile accordion item ────────────────────────────────────────────────────

function MobileAccordion({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-base text-text hover:bg-surface-hover transition-colors"
      >
        {label}
        <ChevronDown className={cn('w-4 h-4 text-text-muted transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="ml-4 mb-1 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PublicHeader() {
  const { pathname } = useLocation()
  const { theme, toggle } = useThemeStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  const productActive = ['/for/', '/for-individuals', '/signup'].some(p => pathname.startsWith(p))
  const toolsActive = pathname.startsWith('/tools')
  const compareActive = pathname.startsWith('/compare')

  return (
    <>
      <header className={cn(
        'sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b transition-all duration-200',
        scrolled ? 'border-border shadow-sm' : 'border-transparent',
      )}>
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-primary-gradient rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="w-[17px] h-[17px] text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-text">Wrively</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">

            <NavDropdown label="Product" active={productActive}>
              <ProductMenu close={() => {}} />
            </NavDropdown>

            <NavDropdown label="Free tools" active={toolsActive}>
              <ToolsMenu close={() => {}} />
            </NavDropdown>

            <NavDropdown label="Compare" active={compareActive}>
              <CompareMenu close={() => {}} />
            </NavDropdown>

            <Link
              to="/blog"
              className={cn(
                'text-sm px-4 py-2 rounded-btn transition-colors duration-150',
                pathname === '/blog' || pathname.startsWith('/blog/')
                  ? 'text-text font-medium bg-surface-hover'
                  : 'text-text-muted hover:text-text hover:bg-surface-hover',
              )}
            >
              Blog
            </Link>

            <Link
              to="/pricing"
              className={cn(
                'text-sm px-4 py-2 rounded-btn transition-colors duration-150',
                pathname === '/pricing'
                  ? 'text-text font-medium bg-surface-hover'
                  : 'text-text-muted hover:text-text hover:bg-surface-hover',
              )}
            >
              Pricing
            </Link>

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
              className="hidden lg:flex items-center text-sm px-4 py-2 rounded-btn border border-border text-text-muted hover:border-border-hover hover:text-text transition-all duration-150"
            >
              Sign in
            </Link>

            <Link to="/signup" className="hidden lg:block">
              <Button size="sm">Start free</Button>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden p-2 text-text-muted hover:text-text hover:bg-surface-hover rounded-btn transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-10 bg-background/97 backdrop-blur-sm flex flex-col pt-16 overflow-y-auto">
          <nav className="px-4 pt-4 pb-4 space-y-0.5">

            <MobileAccordion label="Product">
              {PRODUCT_ITEMS.flatMap(g => g.items).map(item => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={closeMobile}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </MobileAccordion>

            <MobileAccordion label="Free tools">
              {TOOLS_ITEMS.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMobile}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </MobileAccordion>

            <MobileAccordion label="Compare">
              {COMPARE_ITEMS.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMobile}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                >
                  <GitCompare className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </MobileAccordion>

            <Link
              to="/blog"
              onClick={closeMobile}
              className={cn(
                'flex items-center px-4 py-3.5 rounded-xl text-base transition-colors',
                pathname.startsWith('/blog') ? 'bg-primary/[0.08] text-primary font-medium' : 'text-text hover:bg-surface-hover',
              )}
            >
              Blog
            </Link>

            <Link
              to="/pricing"
              onClick={closeMobile}
              className={cn(
                'flex items-center px-4 py-3.5 rounded-xl text-base transition-colors',
                pathname === '/pricing' ? 'bg-primary/[0.08] text-primary font-medium' : 'text-text hover:bg-surface-hover',
              )}
            >
              Pricing
            </Link>

          </nav>

          <div className="px-5 pt-2 pb-8 mt-auto space-y-3 border-t border-border">
            <Link to="/login" onClick={closeMobile}>
              <Button variant="secondary" className="w-full" size="lg">Sign in</Button>
            </Link>
            <Link to="/signup" onClick={closeMobile}>
              <Button className="w-full" size="lg">Start free</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
