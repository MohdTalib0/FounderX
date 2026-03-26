import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import LoadingScreen from '@/components/ui/LoadingScreen'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuthStore()

  if (!initialized) return <LoadingScreen />
  if (!user) {
    // Manual logout sets this flag — skip the "session expired" message
    const reason = window.__manualSignOut ? '' : '?reason=session_expired'
    window.__manualSignOut = false
    return <Navigate to={`/login${reason}`} replace />
  }

  return <>{children}</>
}
