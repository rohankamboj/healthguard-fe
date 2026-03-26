import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const demoRows = [
  { role: 'Admin', user: 'admin', pass: 'Admin@123!', roleClass: 'text-role-admin' },
  { role: 'Manager', user: 'mgr_us', pass: 'Manager@123!', roleClass: 'text-role-manager' },
  { role: 'User', user: 'user_us_ar', pass: 'User@1234!', roleClass: 'text-role-user' },
] as const

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const isLoading = useAuthStore((s) => s.isLoading)

  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please enter both username and password')
      return
    }
    const result = await login(form.username.trim(), form.password)
    if (result.success) {
      toast.success(`Welcome back!`)
      const routes: Record<string, string> = { admin: '/admin', manager: '/manager', user: '/user' }
      navigate(routes[result.role] ?? '/user')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-surface-base">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-[0.04]"
          aria-hidden
        >
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00d4bf" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute -top-[20%] -right-[10%] size-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,212,191,0.06)_0%,transparent_70%)]" />
        <div className="absolute -bottom-[20%] -left-[10%] size-[500px] rounded-full bg-[radial-gradient(circle,rgba(77,166,255,0.05)_0%,transparent_70%)]" />
      </div>

      <div
        className={cn(
          'hidden min-[900px]:flex min-[900px]:flex-1 min-[900px]:flex-col min-[900px]:justify-center',
          'border-line border-r bg-[linear-gradient(135deg,var(--bg-surface)_0%,var(--bg-base)_100%)]',
          'px-16 py-20',
        )}
      >
        <div className="mb-16">
          <div className="mb-12 flex items-center gap-3.5">
            <div className="rounded-lg-hg border border-line-accent bg-brand-accent-glow p-3">
              <Shield className="size-7 text-brand-accent" aria-hidden />
            </div>
            <span className="font-display text-2xl font-extrabold tracking-tight text-fg-primary">
              HealthGuard
            </span>
          </div>
          <h1 className="mb-6 font-display text-5xl leading-[1.1] font-extrabold tracking-[-0.03em] text-fg-primary">
            Secure
            <br />
            Healthcare
            <br />
            <span className="text-brand-accent">Platform</span>
          </h1>
          <p className="max-w-[380px] text-base leading-relaxed text-fg-secondary">
            Enterprise-grade patient data management with AES-256 encryption, role-based access controls,
            and full HIPAA compliance.
          </p>
        </div>

        {[
          { icon: '🔐', text: 'AES-256-GCM field-level encryption' },
          { icon: '🌍', text: 'Multi-location & team support' },
          { icon: '📋', text: 'Complete audit trail logging' },
          { icon: '⚡', text: 'Real-time data management' },
        ].map((f) => (
          <div key={f.text} className="flex items-center gap-3 border-b border-line py-3">
            <span className="text-lg">{f.icon}</span>
            <span className="text-sm text-fg-secondary">{f.text}</span>
          </div>
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-[480px] flex-col justify-center px-8 py-10">
        <div className="animate-fade-in-hg">
          <div className="mb-12 flex items-center gap-3">
            <div className="rounded-lg-hg border border-line-accent bg-brand-accent-glow p-2.5">
              <Shield className="size-[22px] text-brand-accent" aria-hidden />
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight text-fg-primary">
              HealthGuard
            </span>
          </div>

          <h2 className="mb-2 font-display text-[32px] font-extrabold tracking-tight text-fg-primary">
            Sign in
          </h2>
          <p className="mb-10 text-sm text-fg-secondary">Enter your credentials to access your dashboard</p>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-username">Username or Email</Label>
              <Input
                id="login-username"
                type="text"
                placeholder="e.g. admin or mgr_us"
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-4">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute top-1/2 right-3 flex -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error ? (
              <div className="animate-fade-in-hg flex items-center gap-2 rounded-md border border-semantic-danger/30 bg-semantic-danger-bg px-3.5 py-2.5">
                <AlertCircle className="size-3.5 shrink-0 text-semantic-danger" aria-hidden />
                <span className="text-[13px] text-semantic-danger">{error}</span>
              </div>
            ) : null}

            <Button type="submit" size="lg" loading={isLoading} className="mt-1 w-full">
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-10 rounded-lg-hg border border-line bg-surface-elevated p-5">
            <p className="mb-3 text-xs font-semibold tracking-wide text-fg-muted uppercase">
              Demo Credentials
            </p>
            {demoRows.map((c) => (
              <div
                key={c.role}
                className="mb-1 flex cursor-pointer items-center justify-between rounded-md px-2.5 py-2 transition-colors duration-hg ease-hg last:mb-0 hover:bg-surface-hover"
                onClick={() => setForm({ username: c.user, password: c.pass })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setForm({ username: c.user, password: c.pass })
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <span className={cn('text-xs font-semibold', c.roleClass)}>{c.role}</span>
                <span className="font-mono text-[11px] text-fg-muted">
                  {c.user} / {c.pass}
                </span>
              </div>
            ))}
            <p className="mt-2 text-[11px] text-fg-muted">Click a row to auto-fill credentials</p>
          </div>
        </div>
      </div>
    </div>
  )
}
