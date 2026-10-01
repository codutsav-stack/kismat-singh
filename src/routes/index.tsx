import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  Brain,
  ClipboardCheck,
  Copy,
  FileClock,
  FlaskConical,
  History,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  Users,
} from 'lucide-react'
import { Logo } from '@/components/app/logo'
import { buttonClass } from '@/components/ui/button'
import { SeverityBadge } from '@/components/app/severity'

export const Route = createFileRoute('/')({
  component: Landing,
})

const steps = [
  { icon: UserRound, title: 'Select patient', body: 'Pull up allergies, conditions, organ function and active medications in one view.' },
  { icon: Pill, title: 'Enter medication', body: 'Medication, dose, route, frequency, duration and indication.' },
  { icon: FlaskConical, title: 'Run second check', body: 'The proposed order is reviewed against the patient context in seconds.' },
  { icon: ClipboardCheck, title: 'Review potential concerns', body: 'Prioritised, explainable alerts with the patient factor that triggered each one.' },
  { icon: Stethoscope, title: 'Clinician decides', body: 'You acknowledge, dismiss or revise. MediSecond never prescribes or blocks.' },
]

const features = [
  { icon: Pill, title: 'Medication interaction checks', body: 'Flags potential drug–drug interactions with the active medication list.' },
  { icon: ShieldCheck, title: 'Allergy alerts', body: 'Surfaces documented allergies and class-level cross-reactivity considerations.' },
  { icon: FlaskConical, title: 'Dose & context considerations', body: 'Age, weight, kidney and liver function are considered alongside the dose.' },
  { icon: Copy, title: 'Duplicate therapy detection', body: 'Notices when a similar medicine already appears on the active list.' },
  { icon: History, title: 'Patient medication history', body: 'Current and previous medications, with start dates and status.' },
  { icon: Brain, title: 'Explainable alerts', body: 'Every alert says what was detected, why it matters and a suggested next step.' },
  { icon: FileClock, title: 'Audit history', body: 'Acknowledgements and dismissals are recorded with clinician and timestamp.' },
  { icon: Users, title: 'Built for clinical teams', body: 'Clinician and admin roles, with anonymised usage insight for administrators.' },
]

function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-navy-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" aria-label="MediSecond home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-navy-600 md:flex">
            <a href="#problem" className="hover:text-navy-900">Why MediSecond</a>
            <a href="#how" className="hover:text-navy-900">How it works</a>
            <a href="#features" className="hover:text-navy-900">Features</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className={buttonClass('ghost', 'sm', 'hidden sm:inline-flex')}>
              Sign In
            </Link>
            <Link to="/dashboard" className={buttonClass('primary', 'sm')}>
              Try Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_30rem_at_85%_-10%,var(--color-brand-100),transparent_60%),radial-gradient(40rem_24rem_at_-10%_20%,var(--color-sky-soft),transparent_60%)]"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pt-16 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-24 lg:pb-28">
          <div className="animate-fade-in">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-700">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Clinical medication decision support
            </p>
            <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-navy-950 sm:text-5xl lg:text-[3.5rem]">
              Every medication decision deserves a{' '}
              <span className="relative whitespace-nowrap text-brand-600">
                second set of eyes.
                <svg aria-hidden viewBox="0 0 300 12" className="absolute -bottom-2 left-0 h-3 w-full text-brand-200" preserveAspectRatio="none">
                  <path d="M2 9c60-6 180-8 296-3" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-600">
              MediSecond helps clinicians quickly identify potential medication-related risks before finalizing a
              medication decision.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/dashboard" className={buttonClass('primary', 'xl')}>
                Try Demo <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
              <Link to="/login" className={buttonClass('outline', 'xl')}>
                Sign In
              </Link>
            </div>
            <p className="mt-5 text-sm text-navy-500">
              No setup needed — Demo Mode uses clearly fictional patients.
            </p>
          </div>

          <HeroPreview />
        </div>
      </section>

      {/* Problem / Solution */}
      <section id="problem" className="border-y border-navy-100 bg-navy-50/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-20 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-navy-200/60 sm:p-10">
            <p className="text-xs font-bold tracking-[0.14em] text-navy-400 uppercase">The problem</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-navy-900">Less time, more fragmented information</h2>
            <p className="mt-4 leading-relaxed text-navy-600">
              Clinicians make medication decisions under time pressure. Important medication-related considerations can be
              difficult to catch when information is fragmented.
            </p>
          </div>
          <div className="rounded-3xl bg-navy-900 p-8 text-white shadow-lift sm:p-10">
            <p className="text-xs font-bold tracking-[0.14em] text-brand-300 uppercase">The solution</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">A fast second-check layer</h2>
            <p className="mt-4 leading-relaxed text-navy-200">
              MediSecond provides a fast second-check layer that organizes relevant patient and medication information and
              highlights potential concerns.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.14em] text-brand-600 uppercase">How it works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">Five steps. The clinician always decides.</h2>
        </div>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-navy-200/70 bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <s.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="font-mono text-xs text-navy-300">0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-semibold text-navy-900">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-navy-500">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section id="features" className="bg-navy-50/60">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.14em] text-brand-600 uppercase">Features</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              Clear, prioritised and explainable
            </h2>
            <p className="mt-4 text-navy-600">
              Alerts are advisory. Wording is deliberate: “consider clinician review”, never “do not prescribe”.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white p-6 ring-1 ring-navy-200/60 transition-shadow hover:shadow-lift">
                <f.icon className="h-5 w-5 text-brand-600" aria-hidden />
                <h3 className="mt-4 font-semibold text-navy-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-500">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-navy-900 px-8 py-14 text-center sm:px-16">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(40rem_20rem_at_50%_120%,rgb(63_173_168/0.35),transparent_70%)]" />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Give every medication decision a second set of eyes.
          </h2>
          <Link to="/dashboard" className={buttonClass('primary', 'xl', 'relative mt-8 bg-brand-500 hover:bg-brand-400')}>
            Try MediSecond <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>

      <footer className="border-t border-navy-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-navy-500 md:flex-row md:items-center md:justify-between">
          <Logo />
          <p className="max-w-2xl text-xs leading-relaxed">
            MediSecond is a clinical decision-support prototype. It does not replace professional medical judgment,
            prescribing authority, institutional protocols, or authoritative drug references. Demo data is fictional.
          </p>
        </div>
      </footer>
    </div>
  )
}

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden>
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-100/70 to-sky-soft blur-2xl" />
      <div className="rounded-3xl border border-navy-200/70 bg-white p-5 shadow-lift sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-navy-400">Medication Second-Check Result</p>
            <p className="mt-0.5 text-lg font-bold text-navy-900">Amoxicillin 500 mg · Oral</p>
          </div>
          <SeverityBadge severity="high" />
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-navy-50 px-3.5 py-2.5 text-sm">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-navy-900 text-xs font-bold text-white">RS</span>
          <div className="min-w-0">
            <p className="font-semibold text-navy-800">Rahul Sharma · 45 y</p>
            <p className="truncate text-xs text-navy-500">Allergy: Penicillin · Metformin, Amlodipine</p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50/60 p-4">
          <p className="text-xs font-bold tracking-wide text-orange-700 uppercase">Allergy Risk</p>
          <p className="mt-1 font-semibold text-navy-900">Potential allergy concern</p>
          <p className="mt-1 text-sm text-navy-600">
            Amoxicillin is a penicillin-class antibiotic. The patient has a documented penicillin allergy.
          </p>
          <p className="mt-3 text-sm font-medium text-brand-700">→ Consider clinician review of the allergy history.</p>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-medium">
          {['Interaction', 'Duplicate', 'Dose'].map((l) => (
            <div key={l} className="rounded-lg border border-navy-100 py-2 text-navy-500">
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-brand-500 align-middle" />
              {l}: clear
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <span className="flex-1 rounded-lg bg-brand-600 py-2 text-center text-sm font-semibold text-white">Acknowledge</span>
          <span className="flex-1 rounded-lg border border-navy-200 py-2 text-center text-sm font-semibold text-navy-700">Review again</span>
        </div>
      </div>
    </div>
  )
}
