import { NavLink, useNavigate, Link } from 'react-router-dom'
import { Home, PenLine, FileEdit, Shuffle, MessageSquare, History, Settings, LogOut, Zap, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { useThemeStore } from '@/store/theme'

const navItems = [
  { section: 'Create', items: [
    { to: '/dashboard',         label: 'Home',          icon: Home,         end: true },
    { to: '/dashboard/write',   label: 'Write Post',    icon: PenLine },
    { to: '/dashboard/rewrite', label: 'Rewrite Draft', icon: FileEdit },
    { to: '/dashboard/remix',   label: 'Remix a Post',  icon: Shuffle },
  ]},
  { section: 'Engage', items: [
    { to: '/dashboard/engage',  label: 'Get Comments',  icon: MessageSquare },
  ]},
  { section: 'Library', items: [
    { to: '/dashboard/history',  label: 'History',  icon: History },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]},
]

export default function Sidebar() {
  const { signOut, profile } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const initial = profile?.full_name?.[0]?.toUpperCase() ?? '?'

  const postsUsed = profile?.posts_this_month ?? 0
  const limit     = profile?.plan === 'starter' ? 80 : profile?.plan === 'free' ? 12 : null
  const pct       = limit !== null ? (postsUsed / limit) * 100 : 0
  const showUsage = profile?.plan === 'free' || profile?.plan === 'starter'
  const remaining = limit !== null ? Math.max(0, limit - postsUsed) : null

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-[220px] bg-surface border-r border-border flex-col z-10">

      {/* Logo */}
      <div className="px-4 h-16 flex items-center border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-gradient rounded-lg flex items-center justify-center shadow-card">
            <Zap className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="font-bold text-text text-base tracking-tight">FounderX</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {navItems.map(({ section, items }, sectionIndex) => (
          <div key={section} className={cn(sectionIndex > 0 && 'mt-1')}>
            {sectionIndex > 0 && (
              <p className="px-3 pt-3 pb-1 text-[10px] font-semibold text-text-subtle uppercase tracking-widest">
                {section}
              </p>
            )}
            <ul className="space-y-px">
              {items.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      cn(
                        'relative flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm transition-colors duration-100',
                        isActive
                          ? 'bg-primary/[0.08] text-text font-medium'
                          : 'text-text-muted hover:text-text hover:bg-surface-hover'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                        )}
                        <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-primary' : '')} />
                        {label}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Usage + upgrade nudge */}
      {showUsage && limit !== null && (
        <div className="mx-2 mb-2 rounded-[8px] border border-border overflow-hidden">
          <div className="px-3 pt-3 pb-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-text-muted">
                {remaining === 0 ? 'Limit reached' : `${postsUsed} / ${limit} posts`}
              </p>
              <span className={cn(
                'text-[10px] font-semibold',
                remaining === 0 ? 'text-danger' : pct >= 80 ? 'text-warning' : 'text-text-subtle'
              )}>
                {remaining === 0 ? '0 left' : `${remaining} left`}
              </span>
            </div>
            <div className="h-1 w-full bg-border rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  pct >= 100 ? 'bg-danger' : pct >= 80 ? 'bg-warning' : 'bg-primary'
                )}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>
          <div className="px-3 py-2 border-t border-border">
            <Link
              to="/dashboard/upgrade"
              className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              Upgrade plan →
            </Link>
          </div>
        </div>
      )}

      {/* User row */}
      <div className="px-2 py-3 border-t border-border shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-0.5 rounded-[6px]">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-text truncate leading-tight">
              {profile?.full_name ?? 'Founder'}
            </p>
            <p className="text-[11px] text-text-subtle capitalize">{profile?.plan ?? 'free'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 flex-1 px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-hover rounded-[6px] transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign out
          </button>
          <button
            onClick={toggle}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-text-muted hover:text-text hover:bg-surface-hover rounded-[6px] transition-colors shrink-0"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  )
}
