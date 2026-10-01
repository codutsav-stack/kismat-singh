import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FlaskConical,
  HeartPulse,
  Pill,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRound,
  Wand2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FieldError, Input, Label, Select } from '@/components/ui/input'
import { ClinicalDisclaimer, FictionalTag } from '@/components/app/disclaimer'
import { FREQUENCIES, ROUTES, exampleMedication, getPatient, patients } from '@/data/fixtures'
import { runCheck } from '@/lib/demo-store'
import type { Patient, ProposedMedication } from '@/lib/types'
import { ageFromDob, cn, initials } from '@/lib/utils'

type Search = { patient?: string }

export const Route = createFileRoute('/_app/medication-check/')({
  validateSearch: (s: Record<string, unknown>): Search => ({
    patient: typeof s.patient === 'string' ? s.patient : undefined,
  }),
  head: () => ({ meta: [{ title: 'Medication Second Check · MediSecond' }] }),
  component: MedicationCheckPage,
})

const STEPS = [
  { label: 'Patient', icon: UserRound },
  { label: 'Medication', icon: Pill },
  { label: 'Clinical context', icon: HeartPulse },
  { label: 'Run check', icon: FlaskConical },
]

const KNOWN_MEDS = [
  'Amoxicillin', 'Co-amoxiclav', 'Cefalexin', 'Ciprofloxacin', 'Clarithromycin', 'Nitrofurantoin', 'Ibuprofen', 'Naproxen',
  'Paracetamol', 'Tramadol', 'Metformin', 'Sertraline', 'Fluconazole', 'Spironolactone', 'Simvastatin', 'Aspirin',
]

const emptyMed: ProposedMedication = { name: '', dose: '', route: 'Oral', frequency: '', duration: '', indication: '' }

function validate(m: ProposedMedication) {
  const e: Partial<Record<keyof ProposedMedication, string>> = {}
  if (!m.name.trim()) e.name = 'Enter the medication name.'
  if (!m.dose.trim()) e.dose = 'Enter a dose.'
  else if (!/\d/.test(m.dose)) e.dose = 'Include an amount and unit, e.g. 500 mg.'
  if (!m.route) e.route = 'Select a route.'
  if (!m.frequency.trim()) e.frequency = 'Enter a frequency.'
  return e
}

function MedicationCheckPage() {
  const search = Route.useSearch()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [patientId, setPatientId] = useState<string | undefined>(undefined)
  const [med, setMed] = useState<ProposedMedication>(emptyMed)
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({})
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (search.patient && getPatient(search.patient)) {
      setPatientId(search.patient)
      setStep(1)
    }
  }, [search.patient])

  const patient = patientId ? getPatient(patientId) : undefined

  function next() {
    if (step === 0 && !patient) {
      toast.error('Select a patient to continue.')
      return
    }
    if (step === 1) {
      const e = validate(med)
      setErrors(e)
      if (Object.keys(e).length) return
    }
    setStep((s) => Math.min(s + 1, 3))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goTo(i: number) {
    if (i <= step) setStep(i)
  }

  function run() {
    if (!patient) return
    setRunning(true)
    setTimeout(() => {
      try {
        const check = runCheck(patient.id, med)
        navigate({ to: '/medication-check/$id', params: { id: check.id } })
      } catch {
        setRunning(false)
        toast.error('The safety check could not be completed. Please try again.')
      }
    }, 2400)
  }

  const update = (k: keyof ProposedMedication) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setMed((m) => ({ ...m, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  if (running && patient) return <Analyzing patient={patient} med={med} />

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">Medication Second Check</h1>
        <p className="text-navy-500">Review a medication decision for potential safety concerns before finalizing.</p>
      </div>

      {/* Stepper */}
      <ol className="mt-6 grid grid-cols-4 gap-2" aria-label="Progress">
        {STEPS.map((s, i) => {
          const done = i < step
          const current = i === step
          return (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => goTo(i)}
                disabled={i > step}
                aria-current={current ? 'step' : undefined}
                className="group w-full text-left disabled:cursor-default"
              >
                <span className={cn('block h-1.5 rounded-full transition-colors', done || current ? 'bg-brand-500' : 'bg-navy-200')} />
                <span className="mt-2.5 flex items-center gap-2">
                  <span
                    className={cn(
                      'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold',
                      done ? 'bg-brand-600 text-white' : current ? 'bg-navy-900 text-white' : 'bg-navy-100 text-navy-500',
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}
                  </span>
                  <span className={cn('hidden text-sm font-semibold sm:inline', current ? 'text-navy-900' : 'text-navy-500')}>
                    {s.label}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-sm font-semibold text-navy-800 sm:hidden">
        Step {step + 1} of 4 · {STEPS[step].label}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-5 sm:p-7">
          {step === 0 && <PatientStep selected={patientId} onSelect={setPatientId} />}
          {step === 1 && patient && (
            <section aria-labelledby="med-heading">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 id="med-heading" className="text-lg font-semibold text-navy-900">Proposed medication</h2>
                  <p className="mt-1 text-sm text-navy-500">Enter the order as you intend to finalize it.</p>
                </div>
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => {
                    setMed(exampleMedication)
                    setErrors({})
                  }}
                >
                  <Wand2 className="h-4 w-4" aria-hidden /> Use example (Amoxicillin)
                </Button>
              </div>
              <form
                className="mt-6 grid gap-5 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  next()
                }}
                noValidate
              >
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Medication name *</Label>
                  <Input id="name" list="known-meds" placeholder="e.g. Amoxicillin" value={med.name} onChange={update('name')} aria-invalid={!!errors.name} autoComplete="off" />
                  <datalist id="known-meds">
                    {KNOWN_MEDS.map((m) => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                  <FieldError>{errors.name}</FieldError>
                </div>
                <div>
                  <Label htmlFor="dose">Dose *</Label>
                  <Input id="dose" placeholder="e.g. 500 mg" value={med.dose} onChange={update('dose')} aria-invalid={!!errors.dose} inputMode="text" />
                  <FieldError>{errors.dose}</FieldError>
                </div>
                <div>
                  <Label htmlFor="route">Route *</Label>
                  <Select id="route" value={med.route} onChange={update('route')} aria-invalid={!!errors.route}>
                    {ROUTES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </Select>
                  <FieldError>{errors.route}</FieldError>
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency *</Label>
                  <Input id="frequency" list="freqs" placeholder="e.g. Every 8 hours" value={med.frequency} onChange={update('frequency')} aria-invalid={!!errors.frequency} autoComplete="off" />
                  <datalist id="freqs">
                    {FREQUENCIES.map((f) => (
                      <option key={f} value={f} />
                    ))}
                  </datalist>
                  <FieldError>{errors.frequency}</FieldError>
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" placeholder="e.g. 7 days" value={med.duration} onChange={update('duration')} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="indication">Indication</Label>
                  <Input id="indication" placeholder="e.g. Community-acquired chest infection" value={med.indication} onChange={update('indication')} />
                </div>
                <button type="submit" className="hidden" aria-hidden tabIndex={-1} />
              </form>
            </section>
          )}
          {step === 2 && patient && <ContextStep patient={patient} />}
          {step === 3 && patient && <RunStep patient={patient} med={med} onRun={run} />}

          {step < 3 && (
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-navy-100 pt-6 sm:flex-row sm:justify-between">
              <Button variant="ghost" size="lg" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back
              </Button>
              <Button size="lg" onClick={next} disabled={step === 0 && !patient}>
                {step === 2 ? 'Continue to safety check' : 'Continue'} <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          )}
          {step === 3 && (
            <div className="mt-6 flex justify-start">
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back to clinical context
              </Button>
            </div>
          )}
        </Card>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            {patient ? <PatientSnapshot patient={patient} /> : <EmptySnapshot />}
            {step >= 2 && med.name && (
              <Card className="p-5">
                <p className="text-xs font-semibold tracking-wide text-navy-400 uppercase">Proposed order</p>
                <p className="mt-2 font-semibold text-navy-900">
                  {med.name} {med.dose}
                </p>
                <p className="text-sm text-navy-500">
                  {med.route} · {med.frequency}
                  {med.duration && ` · ${med.duration}`}
                </p>
              </Card>
            )}
          </div>
        </aside>
      </div>

      <ClinicalDisclaimer />
    </div>
  )
}

function PatientStep({ selected, onSelect }: { selected?: string; onSelect: (id: string) => void }) {
  return (
    <section aria-labelledby="pt-heading">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id="pt-heading" className="text-lg font-semibold text-navy-900">Select patient</h2>
          <p className="mt-1 text-sm text-navy-500">Choose an existing patient or create a new record.</p>
        </div>
        <FictionalTag />
      </div>
      <div role="radiogroup" aria-label="Patients" className="mt-6 grid gap-3">
        {patients.map((p) => {
          const active = selected === p.id
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(p.id)}
              className={cn(
                'flex items-center gap-4 rounded-2xl border p-4 text-left transition-all',
                active ? 'border-brand-500 bg-brand-50/60 ring-4 ring-brand-500/10' : 'border-navy-200 hover:border-navy-300 hover:bg-navy-50/60',
              )}
            >
              <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-bold', active ? 'bg-brand-600 text-white' : 'bg-navy-100 text-navy-700')}>
                {initials(p.fullName)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2">
                  <span className="font-semibold text-navy-900">{p.fullName}</span>
                  <span className="font-mono text-xs text-navy-400">{p.patientCode}</span>
                </span>
                <span className="mt-0.5 block text-sm text-navy-500">
                  {ageFromDob(p.dateOfBirth)} y · {p.sex} · {p.medications.length ? `${p.medications.length} active medication${p.medications.length > 1 ? 's' : ''}` : 'No active medications'}
                </span>
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {p.allergies.length ? (
                    p.allergies.map((a) => (
                      <span key={a.substance} className="rounded-md border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-800">
                        Allergy: {a.substance}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-md bg-navy-100 px-2 py-0.5 text-xs text-navy-600">No allergies documented</span>
                  )}
                </span>
              </span>
              <span className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full border-2', active ? 'border-brand-600 bg-brand-600 text-white' : 'border-navy-300')}>
                {active && <Check className="h-3.5 w-3.5" aria-hidden />}
              </span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => toast.info('Patient creation arrives with patient management.', { description: 'Use a demo patient for now.' })}
          className="flex items-center gap-4 rounded-2xl border border-dashed border-navy-300 p-4 text-left text-navy-500 hover:bg-navy-50/60"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-navy-50">
            <UserPlus className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="block font-semibold text-navy-700">Create new patient</span>
            <span className="text-sm">Add a patient record before running a check</span>
          </span>
        </button>
      </div>
    </section>
  )
}

function ContextRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3.5 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-sm font-medium text-navy-500">{label}</dt>
      <dd className="text-sm text-navy-900">{children}</dd>
    </div>
  )
}

function ContextStep({ patient }: { patient: Patient }) {
  return (
    <section aria-labelledby="ctx-heading">
      <h2 id="ctx-heading" className="text-lg font-semibold text-navy-900">Clinical context</h2>
      <p className="mt-1 text-sm text-navy-500">Confirm the information the second check will consider.</p>
      <dl className="mt-4 divide-y divide-navy-100">
        <ContextRow label="Allergies">
          {patient.allergies.length ? (
            <ul className="space-y-1">
              {patient.allergies.map((a) => (
                <li key={a.substance}>
                  <span className="font-semibold text-orange-800">{a.substance}</span> <span className="text-navy-500">— {a.reaction}</span>
                </li>
              ))}
            </ul>
          ) : (
            'None documented'
          )}
        </ContextRow>
        <ContextRow label="Existing medications">
          {patient.medications.length ? (
            <ul className="space-y-1">
              {patient.medications.map((m) => (
                <li key={m.name}>
                  <span className="font-medium">{m.name}</span> {m.dose} · <span className="text-navy-500">{m.frequency}</span>
                </li>
              ))}
            </ul>
          ) : (
            'None recorded'
          )}
        </ContextRow>
        <ContextRow label="Medical conditions">{patient.conditions.length ? patient.conditions.join(', ') : 'None recorded'}</ContextRow>
        <ContextRow label="Kidney function">
          {patient.kidney.label}
          {patient.kidney.egfr !== undefined && <span className="text-navy-500"> · eGFR {patient.kidney.egfr} mL/min/1.73m²</span>}
        </ContextRow>
        <ContextRow label="Liver function">{patient.liver.label}</ContextRow>
        <ContextRow label="Age">{ageFromDob(patient.dateOfBirth)} years</ContextRow>
        <ContextRow label="Weight">{patient.weightKg} kg</ContextRow>
      </dl>
    </section>
  )
}

function RunStep({ patient, med, onRun }: { patient: Patient; med: ProposedMedication; onRun: () => void }) {
  return (
    <section aria-labelledby="run-heading" className="text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <ShieldCheck className="h-7 w-7" aria-hidden />
      </span>
      <h2 id="run-heading" className="mt-4 text-xl font-bold text-navy-900">Ready for second check</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-navy-500">
        <span className="font-semibold text-navy-800">
          {med.name} {med.dose} {med.route.toLowerCase()}, {med.frequency.toLowerCase()}
        </span>{' '}
        for <span className="font-semibold text-navy-800">{patient.fullName}</span> will be reviewed for interactions, allergies,
        dose context, contraindications and duplicate therapy.
      </p>
      <Button size="xl" className="mt-7 w-full sm:w-auto sm:min-w-72" onClick={onRun} autoFocus>
        <FlaskConical className="h-5 w-5" aria-hidden /> Run Safety Check
      </Button>
      <p className="mt-4 text-xs text-navy-400">Alerts are advisory. The final decision remains with the clinician.</p>
    </section>
  )
}

function PatientSnapshot({ patient }: { patient: Patient }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white">{initials(patient.fullName)}</span>
        <div>
          <p className="font-semibold text-navy-900">{patient.fullName}</p>
          <p className="text-xs text-navy-500">
            {patient.patientCode} · {ageFromDob(patient.dateOfBirth)} y · {patient.sex}
          </p>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-navy-50 px-3 py-2">
          <dt className="text-xs text-navy-500">Weight</dt>
          <dd className="font-semibold text-navy-900">{patient.weightKg} kg</dd>
        </div>
        <div className="rounded-xl bg-navy-50 px-3 py-2">
          <dt className="text-xs text-navy-500">eGFR</dt>
          <dd className="font-semibold text-navy-900">{patient.kidney.egfr ?? '—'}</dd>
        </div>
      </dl>
      <div className="mt-4">
        <p className="text-xs font-semibold tracking-wide text-navy-400 uppercase">Allergies</p>
        <p className="mt-1 text-sm text-navy-800">{patient.allergies.map((a) => a.substance).join(', ') || 'None documented'}</p>
      </div>
      <div className="mt-3">
        <p className="text-xs font-semibold tracking-wide text-navy-400 uppercase">Active medications</p>
        <p className="mt-1 text-sm text-navy-800">{patient.medications.map((m) => m.name).join(', ') || 'None'}</p>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-[11px] text-violet-700">
        <Sparkles className="h-3 w-3" aria-hidden /> Fictional demo patient
      </p>
    </Card>
  )
}

function EmptySnapshot() {
  return (
    <Card className="border-dashed p-6 text-center">
      <UserRound className="mx-auto h-8 w-8 text-navy-300" aria-hidden />
      <p className="mt-3 text-sm font-medium text-navy-700">No patient selected</p>
      <p className="mt-1 text-xs text-navy-500">The patient's clinical snapshot appears here.</p>
      <Link to="/dashboard" className="mt-3 inline-block text-xs font-semibold text-brand-700 hover:underline">
        Back to dashboard
      </Link>
    </Card>
  )
}

const STAGES = ['Analyzing medication context…', 'Checking documented allergies…', 'Reviewing active medications for interactions…', 'Considering dose, age and organ function…']

function Analyzing({ patient, med }: { patient: Patient; med: ProposedMedication }) {
  const [stage, setStage] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 600)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="grid min-h-[70vh] place-items-center" role="status" aria-live="polite">
      <div className="w-full max-w-md text-center">
        <div className="relative mx-auto h-20 w-20">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-200/60" />
          <span className="relative grid h-20 w-20 place-items-center rounded-full bg-white shadow-lift ring-1 ring-brand-100">
            <FlaskConical className="h-8 w-8 text-brand-600" aria-hidden />
          </span>
        </div>
        <h2 className="mt-8 text-xl font-bold text-navy-900">Analyzing medication context…</h2>
        <p className="mt-2 text-sm text-navy-500">
          {med.name} {med.dose} for {patient.fullName}
        </p>
        <div className="relative mx-auto mt-6 h-1.5 w-64 overflow-hidden rounded-full bg-navy-100">
          <span className="absolute inset-y-0 w-1/3 animate-scan rounded-full bg-brand-500" />
        </div>
        <ul className="mx-auto mt-8 max-w-xs space-y-2.5 text-left text-sm">
          {STAGES.map((s, i) => (
            <li key={s} className={cn('flex items-center gap-2.5 transition-opacity', i <= stage ? 'opacity-100' : 'opacity-30')}>
              <span className={cn('grid h-5 w-5 place-items-center rounded-full', i < stage ? 'bg-brand-600 text-white' : 'bg-navy-100')}>
                {i < stage && <Check className="h-3 w-3" aria-hidden />}
              </span>
              <span className="text-navy-700">{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
