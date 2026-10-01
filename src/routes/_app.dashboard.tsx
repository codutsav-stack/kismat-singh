import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { Activity, AlertTriangle, ArrowRight, ClipboardCheck, Plus, ShieldAlert, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { buttonClass } from '@/components/ui/button'
import { ChecksTable } from '@/components/app/checks-table'
import { useHydrated } from '@/components/app/client-time'
import { ClinicalDisclaimer, FictionalTag } from '@/components/app/disclaimer'
import { SEVERITY_META, SeverityBadge } from '@/components/app/severity'
import { DEMO_CLINICIAN, patients } from '@/data/fixtures'
import { useDemoStore } from '@/lib/demo-store'
import { SEVERITY_RANK } from '@/lib/demo-engine'
import type { Severity } from '@/lib/types'
import { ageFromDob, initials } from '@/lib/utils'

export const Route = createFileRoute('/_app/dashboard')({
  head: () => ({ meta: [{ title: 'Dashboard · MediSecond' }] }),
  component: Dashboard,
})

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

function Dashboard() {
  const hydrated = useHydrated()
  const checks = useDemoStore((s) => s.checks)

  const stats = useMemo(() => {
    const today = new Date().toDateString()
    const todays = checks.filter((c) => new Date(c.createdAt).toDateString() === today)
    const alerts = todays.flatMap((c) => c.analysis.alerts)
    return {
      checksToday: todays.length,
      risks: alerts.length,
      highPriority: alerts.filter((a) => SEVERITY_RANK[a.severity] >= SEVERITY_RANK.high && a.status === 'unreviewed').length,
      patientsReviewed: new Set(todays.map((c) => c.patientId)).size,
    }
  }, [checks])

  const cards = [
    { label: 'Medication Checks Today', value: stats.checksToday, icon: ClipboardCheck, tone: 'bg-brand-50 text-brand-600' },
    { label: 'Potential Risks Detected', value: stats.risks, icon: AlertTriangle, tone: 'bg-amber-50 text-amber-600' },
    { label: 'High Priority Alerts', value: stats.highPriority, icon: ShieldAlert, tone: 'bg-orange-50 text-orange-600', hint: 'Unreviewed, high or critical' },
    { label: 'Patients Reviewed', value: stats.patientsReviewed, icon: Users, tone: 'bg-sky-50 text-sky-600' },
  ]

  return (
    <div className="animate-fade-in space-y-6">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-7 text-white sm:px-8 sm:py-8">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(36rem_18rem_at_100%_0%,rgb(63_173_168/0.38),transparent_65%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-200">{DEMO_CLINICIAN.department}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {hydrated ? greeting() : 'Good morning'}, Dr. {DEMO_CLINICIAN.firstName}
            </h1>
            <p className="mt-2 text-navy-200">Review medication decisions quickly and confidently.</p>
          </div>
          <Link to="/medication-check" className={buttonClass('primary', 'xl', 'bg-brand-500 hover:bg-brand-400 w-full md:w-auto')}>
            <Plus className="h-5 w-5" aria-hidden /> New Medication Check
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Today's statistics" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-navy-500 sm:text-sm">{c.label}</p>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${c.tone}`}>
                <c.icon className="h-[18px] w-[18px]" aria-hidden />
              </span>
            </div>
            {hydrated ? (
              <p className="mt-2 text-3xl font-bold tracking-tight text-navy-950 tabular-nums">{c.value}</p>
            ) : (
              <Skeleton className="mt-3 h-8 w-12" />
            )}
            {c.hint && <p className="mt-1 text-xs text-navy-400">{c.hint}</p>}
          </Card>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Recent checks */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent Checks</CardTitle>
              <CardDescription>Latest medication second-checks across your patients.</CardDescription>
            </div>
            <Link to="/history" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </CardHeader>
          <div className="mt-4 border-t border-navy-100">
            {checks.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <Activity className="mx-auto h-8 w-8 text-navy-300" aria-hidden />
                <p className="mt-3 font-semibold text-navy-800">No checks yet</p>
                <p className="mt-1 text-sm text-navy-500">Run your first medication second-check to see it here.</p>
              </div>
            ) : (
              <ChecksTable checks={checks.slice(0, 6)} />
            )}
          </div>
        </Card>

        <div className="space-y-6">
          {/* Demo patients quick start */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Demo patients</CardTitle>
                <CardDescription>Start a check in one click.</CardDescription>
              </div>
              <FictionalTag />
            </CardHeader>
            <CardContent className="space-y-2">
              {patients.map((p) => (
                <Link
                  key={p.id}
                  to="/medication-check"
                  search={{ patient: p.id }}
                  className="group flex items-center gap-3 rounded-xl border border-navy-100 px-3 py-3 transition-colors hover:border-brand-200 hover:bg-brand-50/50"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-navy-100 text-sm font-bold text-navy-700 group-hover:bg-white">
                    {initials(p.fullName)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-navy-900">{p.fullName}</span>
                    <span className="block truncate text-xs text-navy-500">
                      {ageFromDob(p.dateOfBirth)} y · {p.allergies.length ? `Allergy: ${p.allergies.map((a) => a.substance).join(', ')}` : 'No allergies documented'}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-navy-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden />
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Priority legend */}
          <Card>
            <CardHeader>
              <CardTitle>Alert priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(Object.keys(SEVERITY_META) as Severity[]).map((s) => (
                <div key={s} className="flex items-start gap-3">
                  <SeverityBadge severity={s} className="w-24 justify-center" />
                  <p className="text-sm text-navy-600">{SEVERITY_META[s].meaning}.</p>
                </div>
              ))}
              <p className="border-t border-navy-100 pt-3 text-xs text-navy-500">
                All alerts are advisory. MediSecond does not block ordering.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <ClinicalDisclaimer />
    </div>
  )
}
