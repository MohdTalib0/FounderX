import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { Zap, Settings, LogOut, Sun, Moon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth'
import { useThemeStore } from '@/store/theme'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import { cn } from '@/lib/utils'

function UserMenu() {
  const { profile, setProfile, setCompany } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (profile?.email?.[0] ?? '?').toUpperCase()

  const firstName = profile?.full_name?.split(' ')[0] ?? profile?.email ?? ''

  const plan         = profile?.plan ?? 'free'
  const postsUsed    = profile?.posts_this_month ?? 0
  const limit        = plan === 'starter' ? 80 : plan === 'free' ? 12 : null
  const pct          = limit !== null ? Math.min(100, (postsUsed / limit) * 100) : 0
  const remaining    = limit !== null ? Math.max(0, limit - postsUsed) : null
  const showUpgrade  = plan === 'free' || plan === 'starter'
  const planLabel    = plan === 'pro' ? 'Pro' : plan === 'beta' ? 'Beta' : plan === 'starter' ? 'Starter' : 'Free'

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const t = e.target as Node
      if (
        ref.current && !ref.current.contains(t) &&
        sheetRef.current && !sheetRef.current.contains(t)
      ) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setCompany(null)
    navigate('/')
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 h-8 px-2 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
          {initials}
        </div>
        <span className="text-sm font-semibold text-text">{firstName}</span>
      </button>

      {/* Desktop dropdown (no portal needed) */}
      {open && (
        <div className="hidden md:block absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden border border-border shadow-card-hover z-50 bg-surface">
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text truncate">{profile?.full_name ?? firstName}</p>
                <p className="text-xs text-text-muted truncate mt-0.5">{profile?.email}</p>
              </div>
              <span className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded border tracking-widest uppercase shrink-0 ml-2',
                plan === 'pro' || plan === 'beta' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-hover text-text-muted border-border'
              )}>{planLabel}</span>
            </div>
          </div>
          {showUpgrade && limit !== null && (
            <div className="px-4 py-3 border-b border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Posts this month</span>
                <span className={cn('font-semibold tabular-nums', pct >= 100 ? 'text-danger' : pct >= 80 ? 'text-warning' : 'text-text-muted')}>{postsUsed} / {limit}</span>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div className={cn('h-full rounded-full', pct >= 100 ? 'bg-danger' : pct >= 80 ? 'bg-warning' : 'bg-primary')} style={{ width: `${pct}%` }} />
              </div>
              <Link to="/dashboard/upgrade" onClick={() => setOpen(false)} className="flex items-center justify-center gap-1.5 w-full py-2 rounded-btn bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors">
                <Zap className="w-3.5 h-3.5" /> Upgrade plan
              </Link>
            </div>
          )}
          <div className="p-2 space-y-0.5">
            <button onClick={() => { navigate('/dashboard/settings'); setOpen(false) }} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-text-muted hover:bg-surface-hover hover:text-text transition-colors text-left">
              <Settings className="w-4 h-4 shrink-0" /> Settings
            </button>
            <button onClick={() => { toggle(); setOpen(false) }} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-text-muted hover:bg-surface-hover hover:text-text transition-colors text-left">
              {theme === 'dark' ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <button onClick={handleSignOut} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-danger hover:bg-danger/10 transition-colors text-left">
              <LogOut className="w-4 h-4 shrink-0" /> Sign out
            </button>
          </div>
        </div>
      )}

      {/* Mobile bottom sheet — portalled to body to escape backdrop-filter stacking context */}
      {open && createPortal(
        <>
          <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
          <div ref={sheetRef} className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border rounded-t-2xl max-h-[80vh] overflow-y-auto shadow-[0_-4px_24px_rgba(0,0,0,0.25)]">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            <div className="px-4 pt-2 pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text truncate">{profile?.full_name ?? firstName}</p>
                  <p className="text-xs text-text-muted truncate mt-0.5">{profile?.email}</p>
                </div>
                <span className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded border tracking-widest uppercase shrink-0 ml-2',
                  plan === 'pro' || plan === 'beta' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface-hover text-text-muted border-border'
                )}>{planLabel}</span>
              </div>
            </div>

            {showUpgrade && limit !== null && (
              <div className="px-4 py-3 border-b border-border space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Posts this month</span>
                  <span className={cn('font-semibold tabular-nums', pct >= 100 ? 'text-danger' : pct >= 80 ? 'text-warning' : 'text-text-muted')}>{postsUsed} / {limit}</span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', pct >= 100 ? 'bg-danger' : pct >= 80 ? 'bg-warning' : 'bg-primary')} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[11px] text-text-subtle">
                  {remaining === 0 ? 'Limit reached' : `${remaining} posts remaining`}
                </p>
                <Link
                  to="/dashboard/upgrade"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full py-3 rounded-btn bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" /> Upgrade plan
                </Link>
              </div>
            )}

            <div className="p-2 space-y-0.5">
              <button onClick={() => { navigate('/dashboard/settings'); setOpen(false) }} className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-sm text-text-muted hover:bg-surface-hover hover:text-text transition-colors text-left">
                <Settings className="w-4 h-4 shrink-0" /> Settings
              </button>
              <button onClick={() => { toggle(); setOpen(false) }} className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-sm text-text-muted hover:bg-surface-hover hover:text-text transition-colors text-left">
                {theme === 'dark' ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-sm text-danger hover:bg-danger/10 transition-colors text-left">
                <LogOut className="w-4 h-4 shrink-0" /> Sign out
              </button>
            </div>

            <div className="h-[env(safe-area-inset-bottom)]" />
          </div>
        </>,
        document.body
      )}
    </div>
  )
}

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 min-w-0 md:ml-[220px]">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-10 h-14 bg-background/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary-gradient rounded-lg flex items-center justify-center shadow-card">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-text">Wrively</span>
          </div>

          <UserMenu />
        </header>

        <div className="max-w-4xl mx-auto px-4 py-6 pb-28 md:px-8 md:py-8 md:pb-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  )
}
