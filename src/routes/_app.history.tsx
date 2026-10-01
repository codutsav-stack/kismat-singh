import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { FilterX, History, Plus } from 'lucide-react'
import { Button, buttonClass } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Label, Select } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ChecksTable } from '@/components/app/checks-table'
import { useHydrated } from '@/components/app/client-time'
import { ClinicalDisclaimer } from '@/components/app/disclaimer'
import { patients } from '@/data/fixtures'
import { useDemoStore } from '@/lib/demo-store'
import type { CheckStatus, Severity } from '@/lib/types'

export const Route = createFileRoute('/_app/history')({
  head: () => ({ meta: [{ title: 'Check History · MediSecond' }] }),
  component: HistoryPage,
})

const initial = { date: 'all', patient: 'all', medication: '', risk: 'all', status: 'all' }

function HistoryPage() {
  const hydrated = useHydrated()
  const checks = useDemoStore((s) => s.checks)
  const [f, setF] = useState(initial)
  const set = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }))

  const filtered = useMemo(() => {
    const now = Date.now()
    const today = new Date().toDateString()
    return checks.filter((c) => {
      const t = new Date(c.createdAt)
      if (f.date === 'today' && t.toDateString() !== today) return false
      if (f.date === '7d' && now - t.getTime() > 7 * 86400_000) return false
      if (f.patient !== 'all' && c.patientId !== f.patient) return false
      if (f.medication && !c.medication.name.toLowerCase().includes(f.medication.toLowerCase())) return false
      if (f.risk !== 'all' && c.analysis.overallRisk !== (f.risk as Severity)) return false
      if (f.status !== 'all' && c.status !== (f.status as CheckStatus)) return false
      return true
    })
  }, [checks, f])

  const active = JSON.stringify(f) !== JSON.stringify(initial)

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">Check History</h1>
          <p className="mt-1 text-navy-500">Every second-check report, with its review status and clinician.</p>
        </div>
        <Link to="/medication-check" className={buttonClass('primary', 'lg')}>
          <Plus className="h-4 w-4" aria-hidden /> New Medication Check
        </Link>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Label htmlFor="f-date">Date</Label>
            <Select id="f-date" value={f.date} onChange={set('date')}>
              <option value="all">All dates</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="f-patient">Patient</Label>
            <Select id="f-patient" value={f.patient} onChange={set('patient')}>
              <option value="all">All patients</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="f-med">Medication</Label>
            <Input id="f-med" type="search" placeholder="Any medication" value={f.medication} onChange={set('medication')} />
          </div>
          <div>
            <Label htmlFor="f-risk">Risk level</Label>
            <Select id="f-risk" value={f.risk} onChange={set('risk')}>
              <option value="all">All levels</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="f-status">Status</Label>
            <Select id="f-status" value={f.status} onChange={set('status')}>
              <option value="all">All statuses</option>
              <option value="pending_review">Pending review</option>
              <option value="reviewed">Reviewed</option>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-navy-100 px-5 py-3.5 sm:px-6">
          <div className="text-sm text-navy-500">
            {hydrated ? (
              <>
                <span className="font-semibold text-navy-900">{filtered.length}</span> of {checks.length} checks
              </>
            ) : (
              <Skeleton className="h-4 w-24" />
            )}
          </div>
          {active && (
            <Button variant="ghost" size="sm" onClick={() => setF(initial)}>
              <FilterX className="h-4 w-4" aria-hidden /> Clear filters
            </Button>
          )}
        </div>
        {!hydrated ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <History className="mx-auto h-9 w-9 text-navy-300" aria-hidden />
            <p className="mt-3 font-semibold text-navy-800">No checks match these filters</p>
            <p className="mt-1 text-sm text-navy-500">Try widening the date range or clearing filters.</p>
          </div>
        ) : (
          <ChecksTable checks={filtered} timeMode="datetime" showClinician />
        )}
      </Card>

      <ClinicalDisclaimer />
    </div>
  )
}
