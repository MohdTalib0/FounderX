import { NavLink, useNavigate } from 'react-router-dom'
import { Home, PenLine, FileEdit, MessageSquare, History, Settings, LogOut, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'

const navItems = [
  { section: 'Create', items: [
    { to: '/dashboard', label: 'Home', icon: Home, end: true },
    { to: '/dashboard/write', label: 'Write Post', icon: PenLine },
    { to: '/dashboard/rewrite', label: 'Rewrite Draft', icon: FileEdit },
  ]},
  { section: 'Engage', items: [
    { to: '/dashboard/engage', label: 'Get Comments', icon: MessageSquare },
  ]},
  { section: 'Library', items: [
    { to: '/dashboard/history', label: 'History', icon: History },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]},
]

export default function Sidebar() {
  const { signOut, profile } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const initial = profile?.full_name?.[0]?.toUpperCase() ?? '?'

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
      <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-0.5">
        {navItems.map(({ section, items }, sectionIndex) => (
          <div key={section}>
            {sectionIndex > 0 && <div className="mx-3 my-2 border-t border-border/60" />}
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
                        {/* Left accent bar on active */}
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

      {/* User */}
      <div className="px-2 py-3 border-t border-border shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-0.5 rounded-[6px]">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-text truncate leading-tight">
              {profile?.full_name ?? 'Founder'}
            </p>
            <p className="text-[11px] text-text-muted capitalize">{profile?.plan ?? 'free'}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-hover rounded-[6px] transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
