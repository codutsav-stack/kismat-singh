import { AlertOctagon, AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { AlertStatus, AlertType, CheckStatus, Severity } from '@/lib/types'

export const SEVERITY_META: Record<
  Severity,
  { label: string; meaning: string; badge: string; dot: string; bar: string; soft: string; icon: typeof Info }
> = {
  low: {
    label: 'Low',
    meaning: 'Informational consideration',
    badge: 'border-sky-200 bg-sky-50 text-sky-800',
    dot: 'bg-sky-500',
    bar: 'border-l-4 border-sky-500',
    soft: 'bg-sky-50 border-sky-200',
    icon: Info,
  },
  moderate: {
    label: 'Moderate',
    meaning: 'Clinician review recommended',
    badge: 'border-amber-200 bg-amber-50 text-amber-800',
    dot: 'bg-amber-500',
    bar: 'border-l-4 border-amber-500',
    soft: 'bg-amber-50/70 border-amber-200',
    icon: AlertTriangle,
  },
  high: {
    label: 'High',
    meaning: 'Important potential safety issue requiring clinician review',
    badge: 'border-orange-200 bg-orange-50 text-orange-800',
    dot: 'bg-orange-500',
    bar: 'border-l-4 border-orange-500',
    soft: 'bg-orange-50/70 border-orange-200',
    icon: ShieldAlert,
  },
  critical: {
    label: 'Critical',
    meaning: 'Potentially serious safety concern requiring immediate clinician attention',
    badge: 'border-rose-200 bg-rose-50 text-rose-800',
    dot: 'bg-rose-600',
    bar: 'border-l-4 border-rose-600',
    soft: 'bg-rose-50/70 border-rose-200',
    icon: AlertOctagon,
  },
}

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const m = SEVERITY_META[severity]
  return (
    <Badge className={cn(m.badge, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', m.dot)} aria-hidden />
      {m.label}
    </Badge>
  )
}

export const ALERT_TYPE_LABEL: Record<AlertType, string> = {
  drug_interaction: 'Drug–Drug Interaction',
  allergy: 'Allergy Risk',
  dose: 'Dose Consideration',
  contraindication: 'Contraindication',
  duplicate_therapy: 'Duplicate Therapy',
}

export function CheckStatusBadge({ status }: { status: CheckStatus }) {
  return status === 'reviewed' ? (
    <Badge className="border-brand-200 bg-brand-50 text-brand-700">
      <CheckCircle2 className="h-3 w-3" aria-hidden /> Reviewed
    </Badge>
  ) : (
    <Badge className="border-navy-200 bg-navy-50 text-navy-600">Pending review</Badge>
  )
}

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  const map = {
    unreviewed: 'border-navy-200 bg-white text-navy-600',
    acknowledged: 'border-brand-200 bg-brand-50 text-brand-700',
    dismissed: 'border-navy-200 bg-navy-100 text-navy-500',
  }
  const label = { unreviewed: 'Unreviewed', acknowledged: 'Acknowledged', dismissed: 'Dismissed' }
  return <Badge className={map[status]}>{label[status]}</Badge>
}
