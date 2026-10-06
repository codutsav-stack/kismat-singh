import { Link, Outlet, createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell,
  BarChart3,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Pill,
  Search,
  Settings,
  ShieldAlert,
  Users,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/app/logo'
import { DemoBadge } from '@/components/app/disclaimer'
import { SeverityBadge } from '@/components/app/severity'
import { DEMO_CLINICIAN, patients } from '@/data/fixtures'
import { useDemoStore } from '@/lib/demo-store'
import { ageFromDob, cn, initials } from '@/lib/utils'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

type NavItem =
  | {
      label: string
      icon: typeof LayoutDashboard
      to:
        | '/dashboard'
        | '/medication-check'
        | '/history'
        | '/patients'
        | '/alerts'
        | '/analytics'
        | '/settings'
      soon?: boolean
    }

const NAV: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Patients', icon: Users, to: '/patients' },
  { label: 'Medication Check', icon: Pill, to: '/medication-check' },
  { label: 'Check History', icon: History, to: '/history' },
  { label: 'Alerts', icon: ShieldAlert, to: '/alerts' },
  { label: 'Analytics', icon: BarChart3, to: '/analytics' },
  { label: 'Settings', icon: Settings, to: '/settings' },
]

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.to && (pathname === item.to || pathname.startsWith(item.to + '/'))
        const inner = (
          <>
            <item.icon className={cn('h-[18px] w-[18px]', active ? 'text-brand-600' : 'text-navy-400')} aria-hidden />
            <span className="flex-1">{item.label}</span>
            {item.soon && (
              <span className="rounded-md bg-navy-100 px-1.5 py-0.5 text-[10px] font-semibold text-navy-500">Soon</span>
            )}
          </>
        )
        const base = 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors'
        return item.to ? (
          <Link
            key={item.label}
            to={item.to}
            onClick={onNavigate}
            className={cn(base, active ? 'bg-brand-50 text-navy-900' : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900')}
          >
            {inner}
          </Link>
        ) : (
          <span key={item.label} aria-disabled className={cn(base, 'cursor-not-allowed text-navy-400')} title="Coming soon">
            {inner}
          </span>
        )
      })}
    </nav>
  )
}

function SidebarFooter() {
  return (
    <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
      <DemoBadge />
      <p className="mt-2 text-xs leading-relaxed text-navy-600">
        You're exploring with fictional patients. Results come from a deterministic demo rule set.
      </p>
    </div>
  )
}

function PatientSearch() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return patients
    return patients.filter((p) => p.fullName.toLowerCase().includes(t) || p.patientCode.toLowerCase().includes(t))
  }, [q])

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function go(id: string) {
    setOpen(false)
    setQ('')
    navigate({ to: '/medication-check', search: { patient: id } })
  }

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-navy-400" aria-hidden />
      <input
        type="search"
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
          if (e.key === 'Enter' && results[0]) go(results[0].id)
        }}
        placeholder="Search patient by name or ID"
        aria-label="Search patients"
        className="h-10 w-full rounded-xl border border-navy-200 bg-navy-50/70 pr-3 pl-10 text-sm placeholder:text-navy-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
      />
      {open && (
        <div className="absolute top-12 right-0 left-0 z-40 animate-fade-in overflow-hidden rounded-xl border border-navy-200 bg-white shadow-lift">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-navy-500">No patients match “{q}”.</p>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => go(p.id)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-navy-50 focus:bg-navy-50 focus:outline-none"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-navy-100 text-xs font-bold text-navy-700">
                      {initials(p.fullName)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-navy-900">{p.fullName}</span>
                      <span className="block text-xs text-navy-500">
                        {p.patientCode} · {ageFromDob(p.dateOfBirth)} y · {p.sex}
                      </span>
                    </span>
                    <span className="text-xs font-medium text-brand-700">Check →</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function Notifications() {
  const checks = useDemoStore((s) => s.checks)
  const [open, setOpen] = useState(false)
  const pending = useMemo(
    () =>
      checks
        .flatMap((c) => c.analysis.alerts.filter((a) => a.status === 'unreviewed').map((a) => ({ a, c })))
        .slice(0, 5),
    [checks],
  )
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative grid h-10 w-10 place-items-center rounded-xl text-navy-600 hover:bg-navy-100"
        aria-label={`Notifications, ${pending.length} unreviewed`}
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" aria-hidden />
        {pending.length > 0 && (
          <span className="absolute top-1.5 right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
            {pending.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 animate-fade-in rounded-xl border border-navy-200 bg-white shadow-lift">
          <p className="border-b border-navy-100 px-4 py-3 text-sm font-semibold text-navy-900">Unreviewed alerts</p>
          {pending.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-navy-500">You're all caught up.</p>
          ) : (
            <ul className="max-h-80 overflow-auto">
              {pending.map(({ a, c }) => (
                <li key={a.id}>
                  <Link
                    to="/medication-check/$id"
                    params={{ id: c.id }}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 hover:bg-navy-50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-navy-800">{a.title}</span>
                      <SeverityBadge severity={a.severity} />
                    </div>
                    <p className="mt-0.5 text-xs text-navy-500">
                      {patients.find((p) => p.id === c.patientId)?.fullName} · {c.medication.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  function logout() {
    toast.success('Signed out of Demo Mode')
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-navy-200/70 bg-white px-4 py-5 lg:flex">
        <Link to="/dashboard" className="px-2" aria-label="MediSecond dashboard">
          <Logo />
        </Link>
        <div className="mt-8 flex-1">
          <SidebarNav />
        </div>
        <SidebarFooter />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal aria-label="Navigation">
          <button className="absolute inset-0 bg-navy-950/40" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 animate-fade-in flex-col bg-white px-4 py-5 shadow-lift">
            <div className="flex items-center justify-between px-2">
              <Logo />
              <button className="grid h-10 w-10 place-items-center rounded-xl hover:bg-navy-100" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-8 flex-1">
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </div>
            <SidebarFooter />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-navy-200/70 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              className="grid h-10 w-10 place-items-center rounded-xl text-navy-700 hover:bg-navy-100 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <div className="hidden sm:block">
                <PatientSearch />
              </div>
              <Link to="/dashboard" className="sm:hidden" aria-label="Dashboard">
                <Logo />
              </Link>
            </div>
            <DemoBadge className="hidden md:inline-flex" />
            <Notifications />
            <div className="hidden items-center gap-3 border-l border-navy-200 pl-3 sm:flex">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-900 text-xs font-bold text-white">
                {initials(DEMO_CLINICIAN.fullName)}
              </span>
              <div className="hidden leading-tight xl:block">
                <p className="text-sm font-semibold text-navy-900">{DEMO_CLINICIAN.fullName}</p>
                <p className="text-xs text-navy-500">{DEMO_CLINICIAN.role} · {DEMO_CLINICIAN.department}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="grid h-10 w-10 place-items-center rounded-xl text-navy-500 hover:bg-navy-100 hover:text-navy-800"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </div>
          <div className="px-4 pb-3 sm:hidden">
            <PatientSearch />
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

