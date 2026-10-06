import { createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  Bell,
  Check,
  ChevronDown,
  CircleAlert,
  Clock,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { useDemoStore, setAlertStatus } from '@/lib/demo-store'
import type { AlertStatus, Severity } from '@/lib/types'

export const Route = createFileRoute('/_app/alerts')({
  component: AlertsPage,
})

type Filter = 'all' | Severity

function AlertsPage() {
  const checks = useDemoStore((state) => state.checks)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const alerts = useMemo(() => {
    return checks.flatMap((check) =>
      check.analysis.alerts.map((alert) => ({
        ...alert,
        checkId: check.id,
        patientId: check.patientId,
        patientName: getPatientName(check.patientId),
        medication: check.medication.name,
        createdAt: check.createdAt,
      })),
    )
  }, [checks])

  const filteredAlerts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return alerts.filter((alert) => {
      const matchesFilter =
        filter === 'all' || alert.severity === filter

      const matchesSearch =
        !query ||
        alert.title.toLowerCase().includes(query) ||
        alert.description.toLowerCase().includes(query) ||
        alert.patientName.toLowerCase().includes(query) ||
        alert.medication.toLowerCase().includes(query)

      return matchesFilter && matchesSearch
    })
  }, [alerts, filter, search])

  const unreviewed = alerts.filter(
    (alert) => alert.status === 'unreviewed',
  ).length

  const critical = alerts.filter(
    (alert) => alert.severity === 'critical',
  ).length

  const high = alerts.filter(
    (alert) => alert.severity === 'high',
  ).length

  const moderate = alerts.filter(
    (alert) => alert.severity === 'moderate',
  ).length

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-600">
            <Bell className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy-950">
              Alerts
            </h1>

            <p className="mt-1 text-sm text-navy-500">
              Review medication safety alerts that require clinician attention.
            </p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Unreviewed"
          value={unreviewed}
          icon={<Clock className="h-5 w-5" />}
          description="Need attention"
        />

        <SummaryCard
          label="Critical"
          value={critical}
          icon={<CircleAlert className="h-5 w-5" />}
          description="Highest risk"
        />

        <SummaryCard
          label="High"
          value={high}
          icon={<ShieldAlert className="h-5 w-5" />}
          description="High risk alerts"
        />

        <SummaryCard
          label="Moderate"
          value={moderate}
          icon={<AlertTriangle className="h-5 w-5" />}
          description="Moderate risk"
        />
      </div>

      {/* Search + filter */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400"
            aria-hidden
          />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alerts, patients or medications..."
            className="h-11 w-full rounded-xl border border-navy-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
          />
        </div>

        <div className="relative">
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as Filter)
            }
            className="h-11 w-full appearance-none rounded-xl border border-navy-200 bg-white px-4 pr-10 text-sm font-medium text-navy-700 outline-none focus:border-brand-500 sm:w-44"
          >
            <option value="all">All severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="rounded-2xl border border-navy-200 bg-white px-5 py-14 text-center">
            <Bell className="mx-auto h-9 w-9 text-navy-300" />

            <p className="mt-3 font-semibold text-navy-800">
              No alerts found
            </p>

            <p className="mt-1 text-sm text-navy-500">
              Try changing your search or severity filter.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={`${alert.checkId}-${alert.id}`}
              alert={alert}
              onStatusChange={(status) =>
                setAlertStatus(
                  alert.checkId,
                  alert.id,
                  status,
                )
              }
            />
          ))
        )}
      </div>
    </div>
  )
}

/* ---------------------------------- */
/* Alert Card                          */
/* ---------------------------------- */

function AlertCard({
  alert,
  onStatusChange,
}: {
  alert: {
    id: string
    checkId: string
    patientId: string
    patientName: string
    medication: string
    title: string
    description: string
    rationale: string
    patientFactor: string
    recommendation: string
    severity: Severity
    status: AlertStatus
    createdAt: string
  }
  onStatusChange: (
    status: Exclude<AlertStatus, 'unreviewed'>,
  ) => void
}) {
  const [expanded, setExpanded] = useState(false)

  const isReviewed = alert.status !== 'unreviewed'

  return (
    <div className="overflow-hidden rounded-2xl border border-navy-200 bg-white">
      <div className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <div
              className={`mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl ${severityBg(
                alert.severity,
              )}`}
            >
              <AlertTriangle
                className={`h-5 w-5 ${severityText(
                  alert.severity,
                )}`}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${severityBadge(
                    alert.severity,
                  )}`}
                >
                  {alert.severity}
                </span>

                {isReviewed && (
                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    {alert.status === 'acknowledged'
                      ? 'Acknowledged'
                      : 'Dismissed'}
                  </span>
                )}
              </div>

              <h2 className="mt-2 text-base font-bold text-navy-950">
                {alert.title}
              </h2>

              <p className="mt-1 text-sm leading-6 text-navy-600">
                {alert.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-navy-500">
                <span>
                  <strong className="text-navy-700">
                    Patient:
                  </strong>{' '}
                  {alert.patientName}
                </span>

                <span>
                  <strong className="text-navy-700">
                    Medication:
                  </strong>{' '}
                  {alert.medication}
                </span>

                <span>
                  <strong className="text-navy-700">
                    Type:
                  </strong>{' '}
                  {formatAlertType(alert.id)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        {expanded && (
          <div className="mt-5 grid gap-4 border-t border-navy-100 pt-5 md:grid-cols-3">
            <Detail
              title="Why this matters"
              text={alert.rationale}
            />

            <Detail
              title="Patient factor"
              text={alert.patientFactor}
            />

            <Detail
              title="Recommendation"
              text={alert.recommendation}
            />
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-3 border-t border-navy-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="text-left text-sm font-semibold text-brand-700 hover:underline"
          >
            {expanded ? 'Hide details' : 'View details'}
          </button>

          {!isReviewed ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => onStatusChange('dismissed')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-50"
              >
                <X className="h-4 w-4" />
                Dismiss
              </button>

              <button
                type="button"
                onClick={() => onStatusChange('acknowledged')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                <Check className="h-4 w-4" />
                Acknowledge
              </button>
            </div>
          ) : (
            <span className="text-xs font-medium text-navy-400">
              This alert has been reviewed.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------- */
/* Summary Card                        */
/* ---------------------------------- */

function SummaryCard({
  label,
  value,
  icon,
  description,
}: {
  label: string
  value: number
  icon: React.ReactNode
  description: string
}) {
  return (
    <div className="rounded-2xl border border-navy-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-navy-500">
          {label}
        </span>

        <span className="text-navy-400">{icon}</span>
      </div>

      <p className="mt-3 text-2xl font-bold text-navy-950">
        {value}
      </p>

      <p className="mt-1 text-xs text-navy-400">
        {description}
      </p>
    </div>
  )
}

function Detail({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-xl bg-navy-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-navy-500">
        {title}
      </p>

      <p className="mt-2 text-sm leading-6 text-navy-700">
        {text}
      </p>
    </div>
  )
}

/* ---------------------------------- */
/* Helpers                             */
/* ---------------------------------- */

function getPatientName(patientId: string) {
  const knownNames: Record<string, string> = {
    'pt-001': 'Aarav Sharma',
    'pt-002': 'Priya Verma',
    'pt-003': 'Rohan Singh',
    'pt-004': 'Ananya Gupta',
  }

  return knownNames[patientId] ?? patientId
}

function severityBg(severity: Severity) {
  switch (severity) {
    case 'critical':
      return 'bg-red-100'
    case 'high':
      return 'bg-orange-100'
    case 'moderate':
      return 'bg-amber-100'
    default:
      return 'bg-blue-100'
  }
}

function severityText(severity: Severity) {
  switch (severity) {
    case 'critical':
      return 'text-red-700'
    case 'high':
      return 'text-orange-700'
    case 'moderate':
      return 'text-amber-700'
    default:
      return 'text-blue-700'
  }
}

function severityBadge(severity: Severity) {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-700'
    case 'high':
      return 'bg-orange-100 text-orange-700'
    case 'moderate':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-blue-100 text-blue-700'
  }
}

function formatAlertType(id: string) {
  if (id.includes('interaction')) return 'Drug interaction'
  if (id.includes('allergy')) return 'Allergy'
  if (id.includes('dose')) return 'Dose'
  if (id.includes('contra')) return 'Contraindication'

  return 'Safety alert'
}