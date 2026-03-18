import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile, Company } from '@/types/database'

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  company: Company | null
  loading: boolean
  initialized: boolean

  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setProfile: (profile: Profile | null) => void
  setCompany: (company: Company | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void

  fetchProfile: () => Promise<void>
  fetchCompany: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  company: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setCompany: (company) => set({ company }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),

  fetchProfile: async () => {
    const { user } = get()
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (data) set({ profile: data })
  },

  fetchCompany: async () => {
    const { user } = get()
    if (!user) return

    const { data } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (data) set({ company: data })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null, profile: null, company: null })
  },
}))
