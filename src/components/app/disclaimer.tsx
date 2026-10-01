import { ShieldCheck } from 'lucide-react'

export function ClinicalDisclaimer() {
  return (
    <footer className="mt-12 border-t border-navy-200/70 pt-5 pb-2 text-xs leading-relaxed text-navy-500">
      <p className="flex items-start gap-2">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden />
        <span>
          MediSecond is a clinical decision-support prototype. It does not replace professional medical judgment,
          prescribing authority, institutional protocols, or authoritative drug references.{' '}
          <strong className="font-semibold text-navy-600">Always verify medication decisions using appropriate clinical references.</strong>
        </span>
      </p>
    </footer>
  )
}

export function DemoBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-violet-700 uppercase ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-violet-500" aria-hidden />
      Demo Mode
    </span>
  )
}

export function FictionalTag() {
  return (
    <span className="rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-violet-700 uppercase">
      Fictional
    </span>
  )
}
