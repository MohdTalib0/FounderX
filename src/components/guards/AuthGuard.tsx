import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import LoadingScreen from '@/components/ui/LoadingScreen'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuthStore()

  if (!initialized) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}
