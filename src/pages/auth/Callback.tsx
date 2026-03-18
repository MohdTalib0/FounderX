import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import LoadingScreen from '@/components/ui/LoadingScreen'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate('/login')
        return
      }
      // Check onboarding status to route correctly
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarded')
        .eq('id', session.user.id)
        .maybeSingle()

      navigate(profile?.onboarded ? '/dashboard' : '/onboarding')
    })
  }, [navigate])

  return <LoadingScreen />
}
