import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Zap, Sun, Moon, X, Menu, ChevronDown,
  PenLine, RefreshCw, MessageSquare,
  BarChart2, FileText, Mic,
  Users, Briefcase, TrendingUp, Rocket,
  GitCompare, ArrowRight, Layers,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/theme'

// ─── Menu data ────────────────────────────────────────────────────────────────

const PRODUCT_ITEMS = [
  {
    group: 'Features',
    items: [
      { to: '/signup',            icon: PenLine,       label: 'Write a Post',    desc: 'Generate 3 variations in your voice' },
      { to: '/signup',            icon: RefreshCw,     label: 'Rewrite a Draft', desc: 'Turn rough thoughts into a polished post' },
      { to: '/signup',            icon: MessageSquare, label: 'Get Comments',    desc: 'AI comment suggestions that add value' },
    ],
  },
  {
    group: 'Made for',
    items: [
      { to: '/for/founders',     icon: Rocket,         label: 'Founders',        desc: 'Seed to Series A' },
      { to: '/for/consultants',  icon: Briefcase,      label: 'Consultants',     desc: 'Build authority in your niche' },
      { to: '/for/executives',   icon: TrendingUp,     label: 'Executives',      desc: 'Senior leaders and operators' },
      { to: '/for/solopreneurs', icon: Users,          label: 'Solopreneurs',    desc: 'One-person businesses' },
    ],
  },
]

const TOOLS_ITEMS = [
  { to: '/tools/linkedin-headline-analyzer', icon: BarChart2, label: 'Headline Analyzer', desc: 'Grade your LinkedIn headline in seconds' },
  { to: '/tools/linkedin-post-checker',      icon: FileText,  label: 'Post Checker',       desc: 'Score any post before you publish' },
  { to: '/tools/linkedin-voice-analyzer',   icon: Mic,       label: 'Voice Analyzer',     desc: 'Does your writing sound like you?' },
]

const COMPARE_ITEMS = [
  { to: '/compare/taplio-alternative',   label: 'vs Taplio' },
  { to: '/compare/hypefury-alternative', label: 'vs Hypefury' },
  { to: '/compare/chatgpt-for-linkedin', label: 'vs ChatGPT' },
  { to: '/compare/jasper-for-linkedin',  label: 'vs Jasper' },
  { to: '/compare/draftly-alternative',  label: 'vs Draftly' },
  { to: '/compare/lempod-alternative',   label: 'vs Lempod' },
]

type MenuId = 'product' | 'tools' | 'compare'

// ─── Desktop dropdown wrapper ─────────────────────────────────────────────────

function NavDropdown({
  id,
  label,
  navActive,
  isOpen,
  onOpen,
  onClose,
  children,
}: {
  id: MenuId
  label: string
  navActive: boolean
  isOpen: boolean
  onOpen: (id: MenuId) => void
  onClose: () => void
  children: React.ReactNode
}) {
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    onOpen(id)
  }, [id, onOpen])

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(onClose, 180)
  }, [onClose])

  // Escape to close
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger button */}
      <button
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          'relative flex items-center gap-1 text-sm px-3.5 py-2 rounded-lg transition-colors duration-150 select-none outline-none',
          (navActive || isOpen)
            ? 'text-text font-medium bg-surface-hover'
            : 'text-text-muted hover:text-text hover:bg-surface-hover',
        )}
      >
        {label}
        <ChevronDown className={cn(
          'w-3.5 h-3.5 transition-transform duration-200 text-text-subtle',
          isOpen && 'rotate-180',
        )} />
        {/* Active underline */}
        <span className={cn(
          'absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-primary',
          'transition-all duration-200 ease-out',
          (navActive && !isOpen) ? 'opacity-100' : 'opacity-0',
        )} />
      </button>

      {/* Panel - always rendered for exit animation */}
      <div
        className={cn(
          'absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50',
          'transition-all duration-[160ms] ease-out origin-top',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible'
            : 'opacity-0 scale-[0.97] -translate-y-1.5 pointer-events-none invisible',
        )}
      >
        <div className="bg-surface border border-border/70 rounded-2xl shadow-2xl ring-1 ring-black/[0.04] dark:ring-white/[0.06] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Product mega menu ────────────────────────────────────────────────────────

function ProductMenu({ pathname, close }: { pathname: string; close: () => void }) {
  return (
    <div className="w-[520px]">
      {/* Brand strip */}
      <div className="px-5 pt-4 pb-3.5 border-b border-border/60 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center shrink-0 shadow-sm">
          <Layers className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-text leading-none">Voice Layer</p>
          <p className="text-xs text-text-subtle mt-0.5">Build it once. Sound like yourself every time.</p>
        </div>
        <Link
          to="/signup"
          onClick={close}
          className="ml-auto flex items-center gap-1 text-xs font-medium text-primary hover:underline shrink-0"
        >
          Try free <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Two-column grid */}
      <div className="p-3 grid grid-cols-2 gap-x-1">
        {PRODUCT_ITEMS.map(group => (
          <div key={group.group}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-subtle px-2.5 py-2">
              {group.group}
            </p>
            {group.items.map(item => {
              const active = pathname.startsWith(item.to) && item.to !== '/signup'
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={close}
                  className={cn(
                    'flex items-start gap-3 px-2.5 py-2.5 rounded-xl transition-colors duration-100 group',
                    active ? 'bg-primary/[0.07]' : 'hover:bg-surface-hover',
                  )}
                >
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                    active
                      ? 'bg-primary/20'
                      : 'bg-surface-hover group-hover:bg-primary/15',
                  )}>
                    <item.icon className={cn('w-3.5 h-3.5', active ? 'text-primary' : 'text-text-muted group-hover:text-primary transition-colors')} />
                  </div>
                  <div>
                    <p className={cn('text-sm font-medium leading-none mb-1', active ? 'text-primary' : 'text-text')}>
                      {item.label}
                    </p>
                    <p className="text-xs text-text-subtle leading-snug">{item.desc}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border/60 bg-surface-hover/40 flex items-center justify-between">
        <p className="text-xs text-text-subtle">Tailored landing pages per role</p>
        <Link
          to="/for-individuals"
          onClick={close}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          See all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}

// ─── Tools menu ────────────────────────────────────────────────────────────────

function ToolsMenu({ pathname, close }: { pathname: string; close: () => void }) {
  return (
    <div className="w-[310px]">
      <div className="p-3 space-y-0.5">
        {TOOLS_ITEMS.map(item => {
          const active = pathname.startsWith(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={close}
              className={cn(
                'flex items-start gap-3 px-2.5 py-2.5 rounded-xl transition-colors duration-100 group',
                active ? 'bg-primary/[0.07]' : 'hover:bg-surface-hover',
              )}
            >
              <div className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors',
                active ? 'bg-primary/20' : 'bg-surface-hover group-hover:bg-primary/15',
              )}>
                <item.icon className={cn('w-3.5 h-3.5', active ? 'text-primary' : 'text-text-muted group-hover:text-primary transition-colors')} />
              </div>
              <div>
                <p className={cn('text-sm font-medium leading-none mb-1', active ? 'text-primary' : 'text-text')}>
                  {item.label}
                </p>
                <p className="text-xs text-text-subtle leading-snug">{item.desc}</p>
              </div>
            </Link>
          )
        })}
      </div>
      <div className="px-4 py-2.5 border-t border-border/60 bg-surface-hover/40 flex items-center justify-between">
        <span className="text-xs text-text-subtle">All free, no signup required</span>
        <Link
          to="/tools"
          onClick={close}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}

// ─── Compare menu ─────────────────────────────────────────────────────────────

function CompareMenu({ pathname, close }: { pathname: string; close: () => void }) {
  return (
    <div className="w-[260px]">
      <div className="px-4 pt-3.5 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-subtle">
          How Wrively compares
        </p>
      </div>
      <div className="px-3 pb-3 grid grid-cols-2 gap-1">
        {COMPARE_ITEMS.map(item => {
          const active = pathname.startsWith(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={close}
              className={cn(
                'flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors duration-100',
                active
                  ? 'bg-primary/[0.07] text-primary font-medium'
                  : 'text-text-muted hover:bg-surface-hover hover:text-text',
              )}
            >
              <GitCompare className={cn('w-3.5 h-3.5 shrink-0', active ? 'text-primary' : 'opacity-40')} />
              <span className="leading-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ─── Mobile nav item ──────────────────────────────────────────────────────────

function MobileNavItem({
  to, icon: Icon, label, desc, active, onClick,
}: {
  to: string; icon: React.ElementType; label: string; desc: string; active?: boolean; onClick: () => void
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-3 rounded-xl transition-colors group min-h-[56px]',
        active ? 'bg-primary/[0.08]' : 'hover:bg-surface-hover',
      )}
    >
      <div className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
        active ? 'bg-primary/20' : 'bg-primary/10 group-hover:bg-primary/20',
      )}>
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className={cn('text-sm font-medium leading-none mb-1', active ? 'text-primary' : 'text-text')}>
          {label}
        </p>
        <p className="text-xs text-text-subtle leading-snug">{desc}</p>
      </div>
    </Link>
  )
}

// ─── Mobile section label ─────────────────────────────────────────────────────

function MobileSectionLabel({ children, badge }: { children: React.ReactNode; badge?: string }) {
  return (
    <div className="flex items-center justify-between px-3 pt-5 pb-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-text-subtle">{children}</span>
      {badge && (
        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PublicHeader() {
  const { pathname } = useLocation()
  const { theme, toggle } = useThemeStore()
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const openMenu  = useCallback((id: MenuId) => setActiveMenu(id), [])
  const closeMenu = useCallback(() => setActiveMenu(null), [])

  useEffect(() => { setMobileOpen(false); setActiveMenu(null) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  const productActive = ['/for/', '/for-individuals'].some(p => pathname.startsWith(p))
  const toolsActive   = pathname.startsWith('/tools')
  const compareActive = pathname.startsWith('/compare')
  const blogActive    = pathname === '/blog' || pathname.startsWith('/blog/')

  return (
    <>
      {/* ── Desktop backdrop ──────────────────────────────────────────────────── */}
      <div
        className={cn(
          'hidden lg:block fixed top-16 inset-x-0 bottom-0 z-[15]',
          'transition-opacity duration-200',
          activeMenu ? 'opacity-100' : 'opacity-0 pointer-events-none',
          'bg-black/[0.12] dark:bg-black/30',
        )}
        onClick={closeMenu}
      />

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <header className={cn(
        'sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b transition-all duration-200',
        scrolled ? 'border-border shadow-sm' : 'border-transparent',
      )}>
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => { closeMobile(); closeMenu() }}>
            <div className="w-8 h-8 bg-primary-gradient rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="w-[17px] h-[17px] text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-text">Wrively</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">

            <NavDropdown
              id="product"
              label="Product"
              navActive={productActive}
              isOpen={activeMenu === 'product'}
              onOpen={openMenu}
              onClose={closeMenu}
            >
              <ProductMenu pathname={pathname} close={closeMenu} />
            </NavDropdown>

            <NavDropdown
              id="tools"
              label="Free tools"
              navActive={toolsActive}
              isOpen={activeMenu === 'tools'}
              onOpen={openMenu}
              onClose={closeMenu}
            >
              <ToolsMenu pathname={pathname} close={closeMenu} />
            </NavDropdown>

            <NavDropdown
              id="compare"
              label="Compare"
              navActive={compareActive}
              isOpen={activeMenu === 'compare'}
              onOpen={openMenu}
              onClose={closeMenu}
            >
              <CompareMenu pathname={pathname} close={closeMenu} />
            </NavDropdown>

            <Link
              to="/blog"
              className={cn(
                'relative text-sm px-3.5 py-2 rounded-lg transition-colors duration-150',
                blogActive ? 'text-text font-medium bg-surface-hover' : 'text-text-muted hover:text-text hover:bg-surface-hover',
              )}
            >
              Blog
              <span className={cn(
                'absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-primary transition-opacity duration-200',
                blogActive ? 'opacity-100' : 'opacity-0',
              )} />
            </Link>

            <Link
              to="/pricing"
              className={cn(
                'relative text-sm px-3.5 py-2 rounded-lg transition-colors duration-150',
                pathname === '/pricing' ? 'text-text font-medium bg-surface-hover' : 'text-text-muted hover:text-text hover:bg-surface-hover',
              )}
            >
              Pricing
              <span className={cn(
                'absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-primary transition-opacity duration-200',
                pathname === '/pricing' ? 'opacity-100' : 'opacity-0',
              )} />
            </Link>

          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggle}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              className="p-2 text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/login"
              className="hidden lg:flex items-center text-sm px-4 py-2 rounded-lg border border-border text-text-muted hover:border-border-hover hover:text-text transition-all duration-150"
            >
              Sign in
            </Link>

            <Link to="/signup" className="hidden lg:block">
              <Button size="sm">Start free</Button>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden relative w-9 h-9 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <Menu className={cn('w-5 h-5 absolute transition-all duration-200', mobileOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100')} />
              <X className={cn('w-5 h-5 absolute transition-all duration-200', mobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75')} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen menu ─────────────────────────────────────────── */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-10 bg-background flex flex-col pt-16',
          'transition-all duration-200 ease-out',
          mobileOpen
            ? 'opacity-100 translate-y-0 visible pointer-events-auto'
            : 'opacity-0 -translate-y-2 invisible pointer-events-none',
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="flex-1 overflow-y-auto overscroll-contain px-3 pb-4">

          <MobileSectionLabel>Product</MobileSectionLabel>
          <div className="space-y-0.5">
            {PRODUCT_ITEMS[0].items.map(item => (
              <MobileNavItem key={item.label} to={item.to} icon={item.icon} label={item.label} desc={item.desc} onClick={closeMobile} />
            ))}
          </div>

          <MobileSectionLabel>Made For</MobileSectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {PRODUCT_ITEMS[1].items.map(item => (
              <Link
                key={item.label}
                to={item.to}
                onClick={closeMobile}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-3.5 rounded-xl border transition-colors min-h-[56px]',
                  pathname.startsWith(item.to)
                    ? 'bg-primary/[0.08] border-primary/20 text-primary'
                    : 'bg-surface border-border text-text hover:bg-surface-hover',
                )}
              >
                <item.icon className={cn('w-4 h-4 shrink-0', pathname.startsWith(item.to) ? 'text-primary' : 'text-text-muted')} />
                <div>
                  <p className="text-sm font-medium leading-none">{item.label}</p>
                  <p className="text-[11px] text-text-subtle mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="h-px bg-border mx-3 mt-5" />

          <MobileSectionLabel badge="Free">Free Tools</MobileSectionLabel>
          <div className="space-y-0.5">
            {TOOLS_ITEMS.map(item => (
              <MobileNavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                desc={item.desc}
                active={pathname.startsWith(item.to)}
                onClick={closeMobile}
              />
            ))}
          </div>

          <div className="h-px bg-border mx-3 mt-5" />

          <MobileSectionLabel>Compare</MobileSectionLabel>
          <div className="grid grid-cols-2 gap-1.5">
            {COMPARE_ITEMS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeMobile}
                className={cn(
                  'flex items-center gap-2 px-3 py-3 rounded-xl text-sm transition-colors min-h-[44px]',
                  pathname.startsWith(item.to)
                    ? 'bg-primary/[0.08] text-primary font-medium'
                    : 'text-text-muted hover:bg-surface-hover hover:text-text',
                )}
              >
                <GitCompare className="w-3.5 h-3.5 shrink-0 opacity-60" />
                <span className="leading-tight">{item.label.replace('vs ', '')}</span>
              </Link>
            ))}
          </div>

          <div className="h-px bg-border mx-3 mt-5" />

          <div className="mt-2 space-y-0.5">
            <Link
              to="/blog"
              onClick={closeMobile}
              className={cn(
                'flex items-center px-4 min-h-[52px] rounded-xl text-base font-medium transition-colors',
                blogActive ? 'bg-primary/[0.08] text-primary' : 'text-text hover:bg-surface-hover',
              )}
            >
              Blog
            </Link>
            <Link
              to="/pricing"
              onClick={closeMobile}
              className={cn(
                'flex items-center px-4 min-h-[52px] rounded-xl text-base font-medium transition-colors',
                pathname === '/pricing' ? 'bg-primary/[0.08] text-primary' : 'text-text hover:bg-surface-hover',
              )}
            >
              Pricing
            </Link>
          </div>
        </div>

        {/* Sticky footer CTAs */}
        <div className="shrink-0 px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))] border-t border-border bg-background space-y-2.5">
          <Link to="/login" onClick={closeMobile} className="block">
            <Button variant="secondary" className="w-full" size="lg">Sign in</Button>
          </Link>
          <Link to="/signup" onClick={closeMobile} className="block">
            <Button className="w-full" size="lg">Start free</Button>
          </Link>
        </div>
      </div>
    </>
  )
}
