import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Brain,
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  FileCheck2,
  FlaskConical,
  HelpCircle,
  Pill,
  RotateCcw,
  ShieldCheck,
  Syringe,
  UserRound,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button, buttonClass } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { ClientTime, useHydrated } from '@/components/app/client-time'
import { ClinicalDisclaimer, DemoBadge, FictionalTag } from '@/components/app/disclaimer'
import { ALERT_TYPE_LABEL, AlertStatusBadge, CheckStatusBadge, SEVERITY_META, SeverityBadge } from '@/components/app/severity'
import { getPatient } from '@/data/fixtures'
import { SEVERITY_RANK } from '@/lib/demo-engine'
import { saveReport, setAlertStatus, useDemoStore } from '@/lib/demo-store'
import type { AlertType, MedicationCheck, Patient, SafetyAlert } from '@/lib/types'
import { ageFromDob, cn, initials } from '@/lib/utils'

export const Route = createFileRoute('/_app/medication-check/$id')({
  head: () => ({ meta: [{ title: 'Second-Check Result · MediSecond' }] }),
  component: ResultPage,
})

const CATEGORY_ORDER: { type: AlertType; icon: typeof Pill }[] = [
  { type: 'drug_interaction', icon: FlaskConical },
  { type: 'allergy', icon: ShieldCheck },
  { type: 'dose', icon: Syringe },
  { type: 'contraindication', icon: ClipboardList },
  { type: 'duplicate_therapy', icon: Copy },
]

function ResultPage() {
  const { id } = Route.useParams()
  const hydrated = useHydrated()
  const check = useDemoStore((s) => s.checks.find((c) => c.id === id))
  const patient = check ? getPatient(check.patientId) : undefined

  if (!hydrated) return <ResultSkeleton />
  if (!check || !patient) return <NotFound />
  return <Result check={check} patient={patient} />
}

function Result({ check, patient }: { check: MedicationCheck; patient: Patient }) {
  const { analysis, medication: med } = check
  const navigate = useNavigate()
  const [dismissTarget, setDismissTarget] = useState<SafetyAlert | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const closeDismiss = useCallback(() => setDismissTarget(null), [])
  const closeHistory = useCallback(() => setHistoryOpen(false), [])

  const hasConcern = analysis.alerts.length > 0
  const unreviewed = analysis.alerts.filter((a) => a.status === 'unreviewed')
  const byType = useMemo(() => {
    const m = new Map<AlertType, SafetyAlert[]>()
    analysis.alerts.forEach((a) => m.set(a.type, [...(m.get(a.type) ?? []), a]))
    return m
  }, [analysis.alerts])

  function acknowledge(a: SafetyAlert) {
    setAlertStatus(check.id, a.id, 'acknowledged')
    toast.success('Alert acknowledged', { description: 'Recorded with your clinician ID and timestamp.' })
  }

  function acknowledgeAll() {
    unreviewed.forEach((a) => setAlertStatus(check.id, a.id, 'acknowledged'))
    toast.success(`${unreviewed.length} alert${unreviewed.length > 1 ? 's' : ''} acknowledged`)
  }

  function confirmDismiss() {
    if (!dismissTarget) return
    setAlertStatus(check.id, dismissTarget.id, 'dismissed')
    toast('Alert dismissed', { description: 'The dismissal was recorded in the audit trail.' })
    setDismissTarget(null)
  }

  function save() {
    saveReport(check.id)
    toast.success('Report saved to Check History', {
      action: { label: 'View', onClick: () => navigate({ to: '/history' }) },
    })
  }

  const overallMeta = SEVERITY_META[analysis.overallRisk]

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-800">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">Medication Second-Check Result</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-navy-500">
            <span className="font-mono">{check.id.toUpperCase()}</span>
            <span aria-hidden>·</span>
            <ClientTime iso={check.createdAt} mode="datetime" />
            <span aria-hidden>·</span>
            <CheckStatusBadge status={check.status} />
          </p>
        </div>
        <DemoBadge className="self-start sm:self-auto" />
      </div>

      {/* Overview */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="overflow-hidden">
          <div
            className={cn(
              'flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:p-6',
              hasConcern ? overallMeta.soft : 'border-brand-200 bg-brand-50/70',
            )}
          >
            <span
              className={cn(
                'grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white shadow-card',
                hasConcern ? 'text-orange-600' : 'text-brand-600',
              )}
            >
              {hasConcern ? <overallMeta.icon className="h-6 w-6" aria-hidden /> : <CheckCircle2 className="h-6 w-6" aria-hidden />}
            </span>
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-wide text-navy-500 uppercase">Overall review</p>
              <p className="mt-0.5 text-xl font-bold text-navy-950">
                {hasConcern ? 'Potential concern identified' : 'No obvious issue detected'}
              </p>
              <p className="mt-1 text-sm text-navy-600">{analysis.summary}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs font-medium text-navy-500">Overall risk</p>
              <SeverityBadge severity={analysis.overallRisk} className="mt-1 px-3 py-1 text-sm" />
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 p-5 sm:grid-cols-3 sm:p-6">
            {[
              ['Medication', med.name],
              ['Dose', med.dose],
              ['Route', med.route],
              ['Frequency', med.frequency],
              ['Duration', med.duration || '—'],
              ['Indication', med.indication || '—'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-medium text-navy-500">{k}</dt>
                <dd className="mt-0.5 font-semibold text-navy-900">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wide text-navy-400 uppercase">Patient</p>
            <FictionalTag />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white">{initials(patient.fullName)}</span>
            <div>
              <p className="font-semibold text-navy-900">{patient.fullName}</p>
              <p className="text-xs text-navy-500">
                {patient.patientCode} · {ageFromDob(patient.dateOfBirth)} y · {patient.sex} · {patient.weightKg} kg
              </p>
            </div>
          </div>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-navy-500">Allergies</dt>
              <dd className="text-right font-medium text-navy-900">{patient.allergies.map((a) => a.substance).join(', ') || 'None documented'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-navy-500">Kidney</dt>
              <dd className="text-right font-medium text-navy-900">
                {patient.kidney.label}
                {patient.kidney.egfr !== undefined && ` (eGFR ${patient.kidney.egfr})`}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-navy-500">Liver</dt>
              <dd className="text-right font-medium text-navy-900">{patient.liver.label}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-navy-500">Active meds</dt>
              <dd className="text-right font-medium text-navy-900">{patient.medications.length}</dd>
            </div>
          </dl>
        </Card>
      </div>

      {/* Categories */}
      <section aria-labelledby="cat-heading">
        <h2 id="cat-heading" className="sr-only">Risk categories</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {CATEGORY_ORDER.map(({ type, icon: Icon }) => {
            const found = byType.get(type) ?? []
            const top = found.reduce<SafetyAlert | undefined>(
              (acc, a) => (!acc || SEVERITY_RANK[a.severity] > SEVERITY_RANK[acc.severity] ? a : acc),
              undefined,
            )
            return (
              <Card key={type} className={cn('p-4', top && SEVERITY_META[top.severity].soft)}>
                <div className="flex items-center justify-between">
                  <Icon className={cn('h-5 w-5', top ? 'text-navy-700' : 'text-brand-500')} aria-hidden />
                  {top ? <SeverityBadge severity={top.severity} /> : <Check className="h-4 w-4 text-brand-500" aria-label="Clear" />}
                </div>
                <p className="mt-3 text-sm font-semibold text-navy-900">{ALERT_TYPE_LABEL[type]}</p>
                <p className="mt-0.5 text-xs text-navy-500">
                  {top ? `${found.length} potential concern${found.length > 1 ? 's' : ''}` : 'No concern identified'}
                </p>
              </Card>
            )
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Alerts */}
        <section aria-labelledby="alerts-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="alerts-heading" className="text-lg font-semibold text-navy-900">
              Alerts <span className="text-navy-400">({analysis.alerts.length})</span>
            </h2>
            {unreviewed.length > 1 && (
              <Button variant="outline" size="sm" onClick={acknowledgeAll}>
                <Check className="h-4 w-4" aria-hidden /> Acknowledge all
              </Button>
            )}
          </div>
          {analysis.alerts.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-brand-500" aria-hidden />
              <p className="mt-3 font-semibold text-navy-900">No alerts for this order</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-navy-500">
                No obvious issue was detected from the information available. This is not confirmation that the order is
                appropriate — clinician judgement still applies.
              </p>
            </Card>
          ) : (
            analysis.alerts.map((a) => (
              <AlertCard key={a.id} alert={a} onAcknowledge={() => acknowledge(a)} onDismiss={() => setDismissTarget(a)} />
            ))
          )}
        </section>

        {/* AI explanation */}
        <aside className="space-y-4">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-navy-100 bg-gradient-to-r from-sky-soft to-white px-5 py-4">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-brand-600 shadow-card">
                <Brain className="h-4 w-4" aria-hidden />
              </span>
              <h2 className="font-semibold text-navy-900">{hasConcern ? 'Why was this flagged?' : 'How this was assessed'}</h2>
            </div>
            <CardContent className="space-y-4">
              <p className="text-[15px] leading-relaxed text-navy-800">{analysis.explanation}</p>
              {analysis.uncertainties.length > 0 && (
                <div className="rounded-xl bg-navy-50 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-navy-500 uppercase">
                    <HelpCircle className="h-3.5 w-3.5" aria-hidden /> Limitations &amp; uncertainty
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-navy-600">
                    {analysis.uncertainties.map((u) => (
                      <li key={u} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-navy-400" aria-hidden />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="border-t border-navy-100 pt-4 text-xs leading-relaxed text-navy-500">
                <strong className="font-semibold text-navy-700">AI-generated decision support</strong> — verify against
                authoritative clinical references and institutional protocols. MediSecond does not diagnose, prescribe, or
                change medication.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clinician actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button size="lg" onClick={acknowledgeAll} disabled={unreviewed.length === 0}>
                <Check className="h-4 w-4" aria-hidden />
                {unreviewed.length === 0 ? 'All alerts reviewed' : 'Acknowledge'}
              </Button>
              <Button variant="navy" size="lg" onClick={save} disabled={check.status === 'reviewed'}>
                <FileCheck2 className="h-4 w-4" aria-hidden />
                {check.status === 'reviewed' ? 'Saved to Check History' : 'Save report'}
              </Button>
              <Link to="/medication-check" search={{ patient: patient.id }} className={buttonClass('outline', 'lg')}>
                <RotateCcw className="h-4 w-4" aria-hidden /> Review Again
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => toast.info('Full patient overview arrives with patient management.')}>
                  <UserRound className="h-4 w-4" aria-hidden /> View Patient
                </Button>
                <Button variant="outline" onClick={() => setHistoryOpen(true)}>
                  <Pill className="h-4 w-4" aria-hidden /> Medication History
                </Button>
              </div>
              {check.status === 'reviewed' && (
                <Link to="/history" className="mt-1 text-center text-sm font-semibold text-brand-700 hover:underline">
                  Open Check History →
                </Link>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>

      <Dialog
        open={!!dismissTarget}
        onClose={closeDismiss}
        title="Dismiss this alert?"
        description="The dismissal is recorded with your clinician ID and a timestamp. You can still review the full report later."
        footer={
          <>
            <Button variant="outline" onClick={closeDismiss}>
              Cancel
            </Button>
            <Button variant="navy" onClick={confirmDismiss}>
              Dismiss alert
            </Button>
          </>
        }
      >
        {dismissTarget && (
          <div className="rounded-xl border border-navy-200 bg-navy-50 p-4">
            <SeverityBadge severity={dismissTarget.severity} />
            <p className="mt-2 text-sm font-semibold text-navy-900">{dismissTarget.title}</p>
          </div>
        )}
      </Dialog>

      <Dialog open={historyOpen} onClose={closeHistory} title="Medication history" description={`${patient.fullName} · fictional demo record`} className="sm:max-w-2xl">
        {patient.medications.length === 0 ? (
          <p className="rounded-xl bg-navy-50 p-6 text-center text-sm text-navy-500">No medications recorded for this patient.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-navy-100 text-xs tracking-wide text-navy-500 uppercase">
                  <th className="py-2 pr-3 font-semibold">Medication</th>
                  <th className="py-2 pr-3 font-semibold">Dose</th>
                  <th className="py-2 pr-3 font-semibold">Frequency</th>
                  <th className="py-2 pr-3 font-semibold">Start date</th>
                  <th className="py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {patient.medications.map((m) => (
                  <tr key={m.name}>
                    <td className="py-2.5 pr-3 font-medium text-navy-900">{m.name}</td>
                    <td className="py-2.5 pr-3 text-navy-700">{m.dose}</td>
                    <td className="py-2.5 pr-3 text-navy-700">{m.frequency}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap text-navy-700">{m.startDate}</td>
                    <td className="py-2.5 capitalize">
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">{m.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Dialog>

      <ClinicalDisclaimer />
    </div>
  )
}

function AlertCard({ alert, onAcknowledge, onDismiss }: { alert: SafetyAlert; onAcknowledge: () => void; onDismiss: () => void }) {
  const meta = SEVERITY_META[alert.severity]
  const done = alert.status !== 'unreviewed'
  return (
    <Card className={cn('overflow-hidden transition-opacity', alert.status === 'dismissed' && 'opacity-60')}>
      <div className={cn('flex', !done && meta.bar)}>
        <div className="flex-1 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={alert.severity} />
            <span className="text-xs font-semibold tracking-wide text-navy-500 uppercase">{ALERT_TYPE_LABEL[alert.type]}</span>
            <span className="ml-auto">
              <AlertStatusBadge status={alert.status} />
            </span>
          </div>
          <h3 className="mt-3 text-base font-semibold text-navy-950">{alert.title}</h3>
          <p className="mt-0.5 text-xs text-navy-500">{meta.meaning}.</p>

          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold text-navy-500">What was detected</dt>
              <dd className="mt-1 text-sm leading-relaxed text-navy-800">{alert.description}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-navy-500">Why it matters</dt>
              <dd className="mt-1 text-sm leading-relaxed text-navy-800">{alert.rationale}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-navy-500">Relevant patient factor</dt>
              <dd className="mt-1 inline-block rounded-lg bg-navy-50 px-2.5 py-1 text-sm font-medium text-navy-800">{alert.patientFactor}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-navy-500">Suggested next step</dt>
              <dd className="mt-1 text-sm leading-relaxed font-medium text-brand-800">{alert.recommendation}</dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-col gap-2 border-t border-navy-100 pt-4 sm:flex-row sm:items-center">
            {done ? (
              <p className="text-sm text-navy-500">
                {alert.status === 'acknowledged' ? 'Acknowledged' : 'Dismissed'}
                {alert.actionedAt && (
                  <>
                    {' '}
                    · <ClientTime iso={alert.actionedAt} mode="time" />
                  </>
                )}
              </p>
            ) : (
              <>
                <Button onClick={onAcknowledge} className="sm:w-auto">
                  <Check className="h-4 w-4" aria-hidden /> Acknowledge
                </Button>
                <Button variant="ghost" onClick={onDismiss}>
                  <XCircle className="h-4 w-4" aria-hidden /> Dismiss Alert
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

function ResultSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <Skeleton className="h-9 w-80" />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  )
}

function NotFound() {
  return (
    <Card className="mx-auto mt-10 max-w-lg p-10 text-center">
      <ClipboardList className="mx-auto h-10 w-10 text-navy-300" aria-hidden />
      <h1 className="mt-4 text-lg font-semibold text-navy-900">Check not found</h1>
      <p className="mt-1 text-sm text-navy-500">
        This report isn't available in the current session. Demo Mode keeps new checks for the current browser session only.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <Link to="/history" className={buttonClass('outline')}>
          Check History
        </Link>
        <Link to="/medication-check" className={buttonClass('primary')}>
          New Medication Check
        </Link>
      </div>
    </Card>
  )
}
