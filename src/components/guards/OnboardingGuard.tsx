import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import LoadingScreen from '@/components/ui/LoadingScreen'

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { profile, initialized } = useAuthStore()

  if (!initialized) return <LoadingScreen />
  if (profile && !profile.onboarded) return <Navigate to="/onboarding" replace />

  return <>{children}</>
}
