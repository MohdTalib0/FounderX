import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import LoadingScreen from '@/components/ui/LoadingScreen'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // onAuthStateChange reliably fires once Supabase has exchanged the token
    // from the email confirmation link (hash fragment) for a session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          subscription.unsubscribe()
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarded')
            .eq('id', session.user.id)
            .maybeSingle()
          navigate(profile?.onboarded ? '/dashboard' : '/onboarding')
        } else if (event === 'INITIAL_SESSION' && !session) {
          // No token in URL and no existing session - bad link or already used
          subscription.unsubscribe()
          navigate('/login?error=invalid_link')
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [navigate])

  return <LoadingScreen />
}
