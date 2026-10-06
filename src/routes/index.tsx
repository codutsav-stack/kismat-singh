import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Activity,
  ArrowRight,
  BellRing,
  Brain,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  FlaskConical,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { Logo } from '@/components/app/logo'
import { buttonClass } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Landing,
})

function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-navy-900">

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-navy-100/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">

          {/* Logo */}
          <Link
            to="/"
            aria-label="MediSecond home"
            className="shrink-0"
          >
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#product"
              className="text-sm font-medium text-navy-600 transition hover:text-brand-600"
            >
              Product
            </a>

            <a
              href="#how"
              className="text-sm font-medium text-navy-600 transition hover:text-brand-600"
            >
              How it works
            </a>

            <a
              href="#safety"
              className="text-sm font-medium text-navy-600 transition hover:text-brand-600"
            >
              Safety
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-navy-600 transition hover:text-brand-600"
            >
              Features
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 sm:flex">
            <Link
              to="/login"
              className={buttonClass('ghost', 'sm')}
            >
              Sign In
            </Link>

            <Link
              to="/dashboard"
              className={buttonClass('primary', 'sm')}
            >
              Try Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-navy-200 text-navy-700 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="border-t border-navy-100 bg-white px-5 py-5 md:hidden">
            <nav className="flex flex-col gap-2">

              <a
                href="#product"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-navy-700 hover:bg-navy-50"
              >
                Product
              </a>

              <a
                href="#how"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-navy-700 hover:bg-navy-50"
              >
                How it works
              </a>

              <a
                href="#safety"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-navy-700 hover:bg-navy-50"
              >
                Safety
              </a>

              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-navy-700 hover:bg-navy-50"
              >
                Features
              </a>

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-navy-100 pt-4">
                <Link
                  to="/login"
                  className={buttonClass('outline', 'sm')}
                >
                  Sign In
                </Link>

                <Link
                  to="/dashboard"
                  className={buttonClass('primary', 'sm')}
                >
                  Try Demo
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <main>

        <section
          id="product"
          className="relative overflow-hidden"
        >
          {/* Background decoration */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-[-10rem] top-20 h-80 w-80 rounded-full bg-brand-100/50 blur-3xl" />

            <div className="absolute right-[-8rem] top-[-5rem] h-96 w-96 rounded-full bg-sky-soft/70 blur-3xl" />

            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-50/60 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:pb-28 lg:pt-24">

            {/* Hero copy */}
            <div className="animate-fade-in">

              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-3.5 py-1.5 text-xs font-semibold text-brand-700">
                <Sparkles className="h-3.5 w-3.5" />
                Clinical medication decision support
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-navy-950 sm:text-5xl lg:text-[4.2rem]">

                Medication safety,

                <span className="block text-brand-600">
                  with a second set of eyes.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-navy-600">
                MediSecond helps clinicians organize patient context,
                identify potential medication-related concerns, and
                review them before making a final decision.
              </p>

              {/* CTA */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/dashboard"
                  className={buttonClass('primary', 'xl')}
                >
                  Try Demo
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <a
                  href="#how"
                  className={buttonClass('outline', 'xl')}
                >
                  See how it works
                </a>
              </div>

              {/* Trust points */}
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-navy-500">

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  Explainable alerts
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  Clinician controlled
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  Fictional demo data
                </span>
              </div>
            </div>

            {/* Product preview */}
            <HeroProductPreview />

          </div>
        </section>

        {/* ================= TRUST STRIP ================= */}
        <section className="border-y border-navy-100 bg-navy-50/60">
          <div className="mx-auto grid max-w-7xl gap-4 px-5 py-6 sm:grid-cols-2 lg:grid-cols-4">

            <TrustItem
              icon={<UserRound className="h-5 w-5" />}
              title="Patient context"
              text="Relevant information in one view"
            />

            <TrustItem
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Safety signals"
              text="Prioritised potential concerns"
            />

            <TrustItem
              icon={<Brain className="h-5 w-5" />}
              title="Explainable"
              text="Understand why an alert appeared"
            />

            <TrustItem
              icon={<Stethoscope className="h-5 w-5" />}
              title="Clinician-led"
              text="Final decisions remain human"
            />

          </div>
        </section>

        {/* Sections next */}
        <ProblemSection />
        <HowSection />
        <SafetySection />
        <FeaturesSection />
        <FinalCTA />

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-navy-100 bg-white">

        <div className="mx-auto max-w-7xl px-5 py-12">

          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">

            <div>
              <Logo />

              <p className="mt-4 max-w-md text-sm leading-6 text-navy-500">
                MediSecond is a clinical decision-support prototype
                designed to provide a fast second-check layer for
                medication safety review.
              </p>
            </div>

            <div>
              <p className="font-semibold text-navy-900">
                Product
              </p>

              <div className="mt-4 flex flex-col gap-3 text-sm text-navy-500">

                <a href="#product" className="hover:text-brand-600">
                  Product
                </a>

                <a href="#how" className="hover:text-brand-600">
                  How it works
                </a>

                <a href="#features" className="hover:text-brand-600">
                  Features
                </a>

              </div>
            </div>

            <div>
              <p className="font-semibold text-navy-900">
                Account
              </p>

              <div className="mt-4 flex flex-col gap-3 text-sm text-navy-500">

                <Link
                  to="/login"
                  className="hover:text-brand-600"
                >
                  Sign in
                </Link>

                <Link
                  to="/dashboard"
                  className="hover:text-brand-600"
                >
                  Try demo
                </Link>

              </div>
            </div>

          </div>

          <div className="mt-10 border-t border-navy-100 pt-6">

            <p className="max-w-4xl text-xs leading-5 text-navy-400">
              MediSecond does not replace professional medical
              judgment, prescribing authority, institutional
              protocols, or authoritative drug references.
              Demo data is fictional.
            </p>

            <p className="mt-3 text-xs text-navy-400">
              © 2026 MediSecond. Clinical decision support prototype.
            </p>

          </div>

        </div>
      </footer>
    </div>
  )
}


/* ========================================================= */
/* HERO PRODUCT PREVIEW                                      */
/* ========================================================= */

function HeroProductPreview() {
  const [showAlert, setShowAlert] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setShowAlert((current) => !current)
    }, 4200)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative mx-auto w-full max-w-xl">

      {/* Glow */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-brand-100/80 via-sky-soft/60 to-transparent blur-3xl"
      />

      {/* Floating badge */}
      <div className="absolute -right-2 -top-5 z-10 hidden animate-bounce rounded-2xl border border-brand-200 bg-white px-4 py-3 shadow-lift sm:block">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-brand-600">
            <ShieldCheck className="h-4 w-4" />
          </span>

          <div>
            <p className="text-xs font-semibold text-navy-900">
              Safety review
            </p>

            <p className="text-[11px] text-navy-500">
              Completed
            </p>
          </div>
        </div>
      </div>

      {/* Main product window */}
      <div className="overflow-hidden rounded-[2rem] border border-navy-200/70 bg-white shadow-lift">

        {/* Window header */}
        <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-navy-400">
            <Activity className="h-3.5 w-3.5" />
            Medication Check
          </div>

          <span className="text-xs text-navy-300">
            Demo
          </span>

        </div>

        <div className="p-5 sm:p-6">

          {/* Patient */}
          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white">
                RS
              </div>

              <div>
                <p className="font-semibold text-navy-900">
                  Rahul Sharma
                </p>

                <p className="text-xs text-navy-500">
                  45 years · 72 kg · Demo patient
                </p>
              </div>

            </div>

            <span className="hidden rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-600 sm:inline-flex">
              Patient context
            </span>

          </div>

          {/* Medication */}
          <div className="mt-5 rounded-2xl border border-navy-100 bg-navy-50/70 p-4">

            <div className="flex items-center gap-3">

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-brand-600 shadow-sm">
                <FlaskConical className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-medium text-navy-400">
                  Proposed medication
                </p>

                <p className="mt-0.5 font-semibold text-navy-900">
                  Amoxicillin 500 mg
                </p>

                <p className="text-xs text-navy-500">
                  Oral · Three times daily
                </p>
              </div>

            </div>

          </div>

          {/* Alert */}
          <div
            className={`mt-4 rounded-2xl border p-4 transition-all duration-700 ${
              showAlert
                ? 'border-orange-200 bg-orange-50/80'
                : 'border-brand-200 bg-brand-50/70'
            }`}
          >

            <div className="flex items-start gap-3">

              <div
                className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                  showAlert
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-brand-100 text-brand-700'
                }`}
              >
                {showAlert ? (
                  <BellRing className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </div>

              <div className="min-w-0">

                <div className="flex items-center gap-2">
                  <p
                    className={`text-xs font-bold uppercase tracking-wide ${
                      showAlert
                        ? 'text-orange-700'
                        : 'text-brand-700'
                    }`}
                  >
                    {showAlert ? 'Potential concern' : 'Review status'}
                  </p>

                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-navy-500">
                    Demo
                  </span>
                </div>

                <p className="mt-1 font-semibold text-navy-900">
                  {showAlert
                    ? 'Potential allergy concern'
                    : 'Clinician review recommended'}
                </p>

                <p className="mt-1 text-sm leading-5 text-navy-600">
                  {showAlert
                    ? 'A documented penicillin allergy was found in the patient context.'
                    : 'The alert is advisory and the final medication decision remains with the clinician.'}
                </p>

              </div>

            </div>

          </div>

          {/* Check grid */}
          <div className="mt-4 grid grid-cols-3 gap-2">

            <CheckItem label="Interaction" />
            <CheckItem label="Dose" />
            <CheckItem label="Duplicate" />

          </div>

          {/* Bottom */}
          <div className="mt-5 flex items-center justify-between border-t border-navy-100 pt-4">

            <div>
              <p className="text-xs text-navy-400">
                Analysis
              </p>

              <p className="text-sm font-semibold text-brand-700">
                Requires clinician review
              </p>
            </div>

            <span className="rounded-xl bg-navy-900 px-3.5 py-2 text-xs font-semibold text-white">
              View result
            </span>

          </div>

        </div>
      </div>
    </div>
  )
}


/* ========================================================= */
/* TRUST ITEM                                                */
/* ========================================================= */

function TrustItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-navy-100 bg-white px-4 py-4">

      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-navy-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-navy-500">
          {text}
        </p>
      </div>

    </div>
  )
}


/* ========================================================= */
/* CHECK ITEM                                                */
/* ========================================================= */

function CheckItem({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-navy-100 bg-white px-2 py-2.5 text-center">
      <CheckCircle2 className="mx-auto h-4 w-4 text-brand-500" />

      <p className="mt-1 text-[11px] font-medium text-navy-500">
        {label}
      </p>

      <p className="text-[10px] font-semibold text-brand-700">
        Clear
      </p>
    </div>
  )
}


/* ========================================================= */
/* PROBLEM SECTION                                           */
/* ========================================================= */

function ProblemSection() {
  return (
    <section className="border-b border-navy-100 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24">

        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
              Why MediSecond
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              Important context should not get lost in the workflow.
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-navy-600">
              Medication decisions can involve allergies, existing
              medicines, patient conditions and organ function.
              MediSecond brings those considerations together into
              one second-check workflow.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <ProblemCard
              number="01"
              icon={<Users className="h-5 w-5" />}
              title="Fragmented context"
              text="Relevant patient information can live across multiple records and workflows."
            />

            <ProblemCard
              number="02"
              icon={<BellRing className="h-5 w-5" />}
              title="Time pressure"
              text="Clinicians need useful safety signals without adding unnecessary friction."
            />

            <ProblemCard
              number="03"
              icon={<Brain className="h-5 w-5" />}
              title="Hard-to-explain alerts"
              text="A useful alert should explain what was detected and why it matters."
            />

            <ProblemCard
              number="04"
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Human oversight"
              text="Technology should support clinical judgment, not replace it."
            />

          </div>
        </div>
      </div>
    </section>
  )
}


function ProblemCard({
  number,
  icon,
  title,
  text,
}: {
  number: string
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="group rounded-2xl border border-navy-200/70 bg-navy-50/50 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lift">

      <div className="flex items-center justify-between">

        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-brand-600 shadow-sm">
          {icon}
        </div>

        <span className="font-mono text-xs text-navy-300">
          {number}
        </span>

      </div>

      <h3 className="mt-5 font-semibold text-navy-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-navy-500">
        {text}
      </p>

    </div>
  )
}


/* ========================================================= */
/* HOW IT WORKS                                              */
/* ========================================================= */

function HowSection() {
  const steps = [
    {
      icon: UserRound,
      title: 'Select patient',
      text: 'Bring allergies, conditions, organ function and medications into one context.',
    },
    {
      icon: FlaskConical,
      title: 'Enter medication',
      text: 'Add medication, dose, route, frequency, duration and indication.',
    },
    {
      icon: Activity,
      title: 'Run second check',
      text: 'Review the proposed medication against the available patient context.',
    },
    {
      icon: ClipboardCheck,
      title: 'Review concerns',
      text: 'See prioritised alerts with the patient factor behind each concern.',
    },
    {
      icon: Stethoscope,
      title: 'Clinician decides',
      text: 'Acknowledge, dismiss, revise or continue based on clinical judgment.',
    },
  ]

  return (
    <section
      id="how"
      className="bg-navy-50/50"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24">

        <div className="mx-auto max-w-2xl text-center">

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
            A clear second-check workflow.
          </h2>

          <p className="mt-4 leading-7 text-navy-600">
            From patient context to review, every step is designed
            to keep the clinician in control.
          </p>

        </div>

        <div className="relative mt-14 grid gap-4 md:grid-cols-5">

          {/* Connecting line */}
          <div
            aria-hidden
            className="absolute left-[10%] right-[10%] top-11 hidden h-px bg-navy-200 md:block"
          />

          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <div
                key={step.title}
                className="group relative rounded-2xl border border-navy-200/70 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >

                <div className="relative z-10 grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
                  <Icon className="h-5 w-5" />
                </div>

                <p className="mt-5 text-xs font-bold text-brand-600">
                  STEP {String(index + 1).padStart(2, '0')}
                </p>

                <h3 className="mt-2 font-semibold text-navy-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-navy-500">
                  {step.text}
                </p>

              </div>
            )
          })}

        </div>
      </div>
    </section>
  )
}


/* ========================================================= */
/* SAFETY SECTION                                            */
/* ========================================================= */

function SafetySection() {
  return (
    <section
      id="safety"
      className="bg-navy-950 text-white"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-300">
            Safety by design
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Technology supports the clinician. It does not replace them.
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-navy-200">
            MediSecond is designed as a second-check layer. Alerts
            are advisory, explainable and intended for clinician
            review.
          </p>

          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
          >
            Explore the demo
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <SafetyCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Explainable"
            text="Each alert provides a rationale and the patient factor involved."
          />

          <SafetyCard
            icon={<Stethoscope className="h-5 w-5" />}
            title="Clinician controlled"
            text="The final decision always remains with the qualified clinician."
          />

          <SafetyCard
            icon={<Brain className="h-5 w-5" />}
            title="Context aware"
            text="Potential concerns are considered alongside available patient information."
          />

          <SafetyCard
            icon={<ClipboardCheck className="h-5 w-5" />}
            title="Reviewable"
            text="Actions such as acknowledgement and dismissal can be tracked."
          />

        </div>
      </div>
    </section>
  )
}


function SafetyCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition duration-300 hover:bg-white/10">

      <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-navy-300">
        {text}
      </p>

    </div>
  )
}


/* ========================================================= */
/* FEATURES                                                   */
/* ========================================================= */

function FeaturesSection() {
  const features = [
    {
      icon: BellRing,
      title: 'Medication interactions',
      text: 'Flags potential drug–drug interaction concerns against active medications.',
    },
    {
      icon: ShieldCheck,
      title: 'Allergy alerts',
      text: 'Surfaces documented allergies and relevant class-level considerations.',
    },
    {
      icon: FlaskConical,
      title: 'Dose & context',
      text: 'Considers available age, weight, kidney and liver context.',
    },
    {
      icon: ClipboardCheck,
      title: 'Duplicate therapy',
      text: 'Identifies when a similar medication is already active.',
    },
    {
      icon: Activity,
      title: 'Medication history',
      text: 'Keeps current and previous medication information visible.',
    },
    {
      icon: Brain,
      title: 'Explainable alerts',
      text: 'Shows what was detected, why it matters and what to review.',
    },
    {
      icon: Users,
      title: 'Clinical teams',
      text: 'Designed around clinician workflows and team visibility.',
    },
    {
      icon: CheckCircle2,
      title: 'Audit history',
      text: 'Review actions can be recorded with clinician and timestamp.',
    },
  ]

  return (
    <section
      id="features"
      className="bg-white"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-24">

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div className="max-w-2xl">

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
              Features
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              Built around the medication safety workflow.
            </h2>

          </div>

          <p className="max-w-md text-sm leading-6 text-navy-500">
            Clear signals, relevant patient context and an
            explainable review experience.
          </p>

        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-navy-200/70 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
              >

                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-5 font-semibold text-navy-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-navy-500">
                  {feature.text}
                </p>

              </div>
            )
          })}

        </div>
      </div>
    </section>
  )
}


/* ========================================================= */
/* FINAL CTA                                                  */
/* ========================================================= */

function FinalCTA() {
  return (
    <section className="px-5 py-20 sm:py-24">

      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-brand-600 px-6 py-16 text-center sm:px-12">

        {/* Animated circles */}
        <div
          aria-hidden
          className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-2xl animate-pulse"
        />

        <div
          aria-hidden
          className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-navy-950/20 blur-3xl"
        />

        <div className="relative">

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-100">
            Start with the demo
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Give every medication decision a second set of eyes.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-brand-50">
            Explore the MediSecond workflow using fictional demo
            patients and medication scenarios.
          </p>

          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-50"
          >
            Try MediSecond
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>
      </div>
    </section>
  )
}