import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Pill,
  ShieldAlert,
  TrendingUp,
  Users,
} from 'lucide-react'

import { useDemoStore } from '@/lib/demo-store'

export const Route = createFileRoute('/_app/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  const checks = useDemoStore((state) => state.checks)
  const patients = useDemoStore((state) => state.patients)

  const analytics = useMemo(() => {
    const totalChecks = checks.length

    const reviewedChecks = checks.filter(
      (check) => check.status === 'reviewed',
    ).length

    const pendingChecks = checks.filter(
      (check) => check.status === 'pending_review',
    ).length

    const allAlerts = checks.flatMap(
      (check) => check.analysis.alerts,
    )

    const criticalAlerts = allAlerts.filter(
      (alert) => alert.severity === 'critical',
    ).length

    const highAlerts = allAlerts.filter(
      (alert) => alert.severity === 'high',
    ).length

    const moderateAlerts = allAlerts.filter(
      (alert) => alert.severity === 'moderate',
    ).length

    const lowAlerts = allAlerts.filter(
      (alert) => alert.severity === 'low',
    ).length

    const acknowledgedAlerts = allAlerts.filter(
      (alert) => alert.status === 'acknowledged',
    ).length

    const dismissedAlerts = allAlerts.filter(
      (alert) => alert.status === 'dismissed',
    ).length

    const unreviewedAlerts = allAlerts.filter(
      (alert) => alert.status === 'unreviewed',
    ).length

    return {
      totalChecks,
      reviewedChecks,
      pendingChecks,
      totalAlerts: allAlerts.length,
      criticalAlerts,
      highAlerts,
      moderateAlerts,
      lowAlerts,
      acknowledgedAlerts,
      dismissedAlerts,
      unreviewedAlerts,
    }
  }, [checks])

  const reviewRate =
    analytics.totalChecks > 0
      ? Math.round(
          (analytics.reviewedChecks / analytics.totalChecks) * 100,
        )
      : 0

  const alertResolutionRate =
    analytics.totalAlerts > 0
      ? Math.round(
          ((analytics.acknowledgedAlerts +
            analytics.dismissedAlerts) /
            analytics.totalAlerts) *
            100,
        )
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Activity className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Analytics
            </h1>

            <p className="text-sm text-slate-500">
              Overview of medication safety checks and alerts
            </p>
          </div>
        </div>
      </div>

      {/* Main statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={patients.length}
          subtitle="Patients in demo registry"
          icon={<Users className="h-5 w-5" />}
        />

        <StatCard
          title="Medication Checks"
          value={analytics.totalChecks}
          subtitle="Safety checks performed"
          icon={<Pill className="h-5 w-5" />}
        />

        <StatCard
          title="Total Alerts"
          value={analytics.totalAlerts}
          subtitle="Safety alerts generated"
          icon={<ShieldAlert className="h-5 w-5" />}
        />

        <StatCard
          title="Critical Alerts"
          value={analytics.criticalAlerts}
          subtitle="Require immediate attention"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      {/* Progress cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Review status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Medication Check Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review progress across safety checks
              </p>
            </div>

            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>

          <div className="mb-3 flex items-end justify-between">
            <span className="text-3xl font-bold text-slate-900">
              {reviewRate}%
            </span>

            <span className="text-sm text-slate-500">
              reviewed
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${reviewRate}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <MiniStat
              label="Reviewed"
              value={analytics.reviewedChecks}
            />

            <MiniStat
              label="Pending"
              value={analytics.pendingChecks}
            />
          </div>
        </div>

        {/* Alert resolution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Alert Resolution
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                How many alerts have been actioned
              </p>
            </div>

            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>

          <div className="mb-3 flex items-end justify-between">
            <span className="text-3xl font-bold text-slate-900">
              {alertResolutionRate}%
            </span>

            <span className="text-sm text-slate-500">
              resolved
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${alertResolutionRate}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <MiniStat
              label="Acknowledged"
              value={analytics.acknowledgedAlerts}
            />

            <MiniStat
              label="Dismissed"
              value={analytics.dismissedAlerts}
            />

            <MiniStat
              label="Unreviewed"
              value={analytics.unreviewedAlerts}
            />
          </div>
        </div>
      </div>

      {/* Alert severity */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-slate-900">
            Alert Severity Breakdown
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Distribution of generated medication safety alerts
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SeverityCard
            label="Critical"
            value={analytics.criticalAlerts}
            description="Immediate attention"
            className="border-red-200 bg-red-50"
            textClass="text-red-700"
          />

          <SeverityCard
            label="High"
            value={analytics.highAlerts}
            description="High priority"
            className="border-orange-200 bg-orange-50"
            textClass="text-orange-700"
          />

          <SeverityCard
            label="Moderate"
            value={analytics.moderateAlerts}
            description="Needs review"
            className="border-yellow-200 bg-yellow-50"
            textClass="text-yellow-700"
          />

          <SeverityCard
            label="Low"
            value={analytics.lowAlerts}
            description="Low priority"
            className="border-blue-200 bg-blue-50"
            textClass="text-blue-700"
          />
        </div>
      </div>

      {/* Activity overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <OverviewCard
          icon={<Clock3 className="h-5 w-5" />}
          title="Pending Reviews"
          value={analytics.pendingChecks}
          description="Medication checks waiting for clinician review"
        />

        <OverviewCard
          icon={<AlertTriangle className="h-5 w-5" />}
          title="High Priority"
          value={analytics.criticalAlerts + analytics.highAlerts}
          description="Critical and high severity alerts"
        />

        <OverviewCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          title="Actioned Alerts"
          value={
            analytics.acknowledgedAlerts +
            analytics.dismissedAlerts
          }
          description="Alerts that have been acknowledged or dismissed"
        />
      </div>

      {/* Demo notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
        <div className="flex gap-3">
          <Activity className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

          <div>
            <p className="font-medium text-blue-900">
              Demo analytics
            </p>

            <p className="mt-1 text-sm text-blue-700">
              These metrics are calculated from the current demo
              medication checks and alerts. Data is stored in memory
              and may reset when the application is refreshed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string
  value: number
  subtitle: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {subtitle}
      </p>
    </div>
  )
}

function MiniStat({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 text-lg font-semibold text-slate-900">
        {value}
      </p>
    </div>
  )
}

function SeverityCard({
  label,
  value,
  description,
  className,
  textClass,
}: {
  label: string
  value: number
  description: string
  className: string
  textClass: string
}) {
  return (
    <div className={`rounded-xl border p-4 ${className}`}>
      <p className={`text-sm font-semibold ${textClass}`}>
        {label}
      </p>

      <p className={`mt-2 text-3xl font-bold ${textClass}`}>
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {description}
      </p>
    </div>
  )
}

function OverviewCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode
  title: string
  value: number
  description: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>

        <p className="font-semibold text-slate-900">
          {title}
        </p>
      </div>

      <p className="mt-5 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}
