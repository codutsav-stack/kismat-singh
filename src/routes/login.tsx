import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, Loader2, Lock, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/app/logo'
import { Button } from '@/components/ui/button'
import { FieldError, Input, Label } from '@/components/ui/input'

export const Route = createFileRoute('/login')({
  head: () => ({ meta: [{ title: 'Sign in · MediSecond' }] }),
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  function continueAsDemo() {
    setLoading(true)
    setTimeout(() => {
      toast.success('Signed in as Demo Clinician', { description: 'All patient data in Demo Mode is fictional.' })
      navigate({ to: '/dashboard' })
    }, 450)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address.'
    if (password.length < 8) next.password = 'Password must be at least 8 characters.'
    setErrors(next)
    if (Object.keys(next).length) return
    toast.info('Clinician accounts are being enabled', {
      description: 'Use “Continue as Demo Clinician” to explore MediSecond today.',
    })
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link to="/" aria-label="MediSecond home">
          <Logo />
        </Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-3xl font-bold tracking-tight text-navy-950">Welcome back</h1>
          <p className="mt-2 text-navy-500">Sign in to review medication decisions.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@hospital.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
              />
              <FieldError>{errors.email}</FieldError>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="mb-1.5 text-sm font-medium text-brand-700 hover:underline"
                  onClick={() => toast.info('Password reset will be available with clinician accounts.')}
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
              />
              <FieldError>{errors.password}</FieldError>
            </div>
            <Button type="submit" variant="navy" size="lg" className="w-full">
              <Lock className="h-4 w-4" aria-hidden /> Login
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs font-medium text-navy-400">
            <span className="h-px flex-1 bg-navy-200" /> OR <span className="h-px flex-1 bg-navy-200" />
          </div>

          <Button size="lg" className="w-full" onClick={continueAsDemo} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <UserRound className="h-4 w-4" aria-hidden />}
            Continue as Demo Clinician
          </Button>
          <p className="mt-3 text-center text-xs text-navy-400">Demo Mode · fictional patients only</p>

          <p className="mt-10 text-center text-sm text-navy-500">
            New to MediSecond?{' '}
            <button
              type="button"
              className="font-semibold text-brand-700 hover:underline"
              onClick={() => toast.info('Account creation will be available with clinician accounts.')}
            >
              Create account
            </button>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-navy-900 lg:block">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(40rem_30rem_at_80%_10%,rgb(63_173_168/0.35),transparent_65%)]" />
        <div className="relative flex h-full flex-col justify-end p-14">
          <blockquote className="max-w-md text-3xl leading-snug font-semibold tracking-tight text-white">
            “When every clinician has less time, every medication decision needs a second set of eyes.”
          </blockquote>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-3 text-sm">
            {['Interactions', 'Allergies', 'Dose context'].map((l) => (
              <div key={l} className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-navy-200">
                <ArrowRight className="mb-2 h-4 w-4 text-brand-300" aria-hidden />
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
