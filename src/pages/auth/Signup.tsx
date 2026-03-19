import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Zap, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const schema = z.object({
  full_name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type FormData = z.infer<typeof schema>

export default function Signup() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError('')
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      return
    }
    // If session exists immediately, email confirmation is disabled — go straight to onboarding
    if (authData.session) {
      navigate('/onboarding')
    } else {
      // Email confirmation is required — show a message
      setEmailSent(true)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/[0.06] rounded-full blur-3xl" />
        </div>
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-text">Check your email</h1>
          <p className="text-sm text-text-muted leading-relaxed">
            We sent a confirmation link to your inbox. Click it to activate your account and start building your brand.
          </p>
          <p className="text-xs text-text-subtle">
            Already confirmed?{' '}
            <Link to="/login" className="text-primary hover:text-primary-hover transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/[0.06] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 bg-primary-gradient rounded-lg flex items-center justify-center shadow-card">
            <Zap className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="font-bold text-text text-xl">FounderX</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-6 shadow-card-hover">
          <h1 className="text-xl font-bold text-text mb-1">Build your founder brand</h1>
          <p className="text-sm text-text-muted mb-6">Free to start, no credit card required</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Your name"
              placeholder="Alex Johnson"
              error={errors.full_name?.message}
              {...register('full_name')}
            />
            <Input
              label="Work email"
              type="email"
              placeholder="you@startup.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-muted">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  className={`w-full bg-surface border rounded-input px-3 py-2.5 pr-10 text-sm text-text placeholder:text-text-subtle transition-colors duration-100 focus:outline-none focus:shadow-input-focus ${errors.password ? 'border-danger focus:border-danger' : 'border-border hover:border-border-hover focus:border-border-focus'}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-muted transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger mt-0.5">{errors.password.message}</p>}
            </div>

            {error && (
              <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-btn px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              Create my account
            </Button>
          </form>

          <p className="text-xs text-text-subtle mt-4 text-center">
            By signing up you agree to our Terms of Service
          </p>
        </div>

        <p className="text-center text-sm text-text-muted mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-hover transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
