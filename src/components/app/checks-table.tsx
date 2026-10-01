import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { getPatient } from '@/data/fixtures'
import type { MedicationCheck } from '@/lib/types'
import { CheckStatusBadge, SeverityBadge } from './severity'
import { ClientTime } from './client-time'

export function ChecksTable({
  checks,
  showClinician = false,
  timeMode = 'relative',
}: {
  checks: MedicationCheck[]
  showClinician?: boolean
  timeMode?: 'relative' | 'datetime'
}) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-navy-100 text-xs font-semibold tracking-wide text-navy-500 uppercase">
              <th className="px-6 py-3 font-semibold">{timeMode === 'datetime' ? 'Date' : 'Patient'}</th>
              <th className="px-4 py-3 font-semibold">{timeMode === 'datetime' ? 'Patient' : 'Medication'}</th>
              <th className="px-4 py-3 font-semibold">{timeMode === 'datetime' ? 'Medication' : 'Status'}</th>
              <th className="px-4 py-3 font-semibold">{timeMode === 'datetime' ? 'Risk' : 'Risk level'}</th>
              <th className="px-4 py-3 font-semibold">{timeMode === 'datetime' ? 'Status' : 'Time'}</th>
              {showClinician && <th className="px-4 py-3 font-semibold">Clinician</th>}
              <th className="px-6 py-3 text-right font-semibold">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {checks.map((c) => {
              const p = getPatient(c.patientId)
              const patientCell = (
                <td className="px-4 py-3.5 first:px-6">
                  <p className="font-semibold text-navy-900">{p?.fullName}</p>
                  <p className="text-xs text-navy-500">{p?.patientCode}</p>
                </td>
              )
              const medCell = (
                <td className="px-4 py-3.5">
                  <p className="font-medium text-navy-800">{c.medication.name}</p>
                  <p className="text-xs text-navy-500">
                    {c.medication.dose} · {c.medication.frequency}
                  </p>
                </td>
              )
              const risk = (
                <td className="px-4 py-3.5">
                  <SeverityBadge severity={c.analysis.overallRisk} />
                </td>
              )
              const status = (
                <td className="px-4 py-3.5">
                  <CheckStatusBadge status={c.status} />
                </td>
              )
              const time = (
                <td className="px-4 py-3.5 whitespace-nowrap text-navy-500 first:px-6">
                  <ClientTime iso={c.createdAt} mode={timeMode} />
                </td>
              )
              return (
                <tr key={c.id} className="group transition-colors hover:bg-navy-50/60">
                  {timeMode === 'datetime' ? (
                    <>
                      {time}
                      {patientCell}
                      {medCell}
                      {risk}
                      {status}
                    </>
                  ) : (
                    <>
                      {patientCell}
                      {medCell}
                      {status}
                      {risk}
                      {time}
                    </>
                  )}
                  {showClinician && <td className="px-4 py-3.5 text-navy-600">{c.clinicianName}</td>}
                  <td className="px-6 py-3.5 text-right">
                    <Link
                      to="/medication-check/$id"
                      params={{ id: c.id }}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                    >
                      View <ChevronRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-navy-100 md:hidden">
        {checks.map((c) => {
          const p = getPatient(c.patientId)
          return (
            <li key={c.id}>
              <Link to="/medication-check/$id" params={{ id: c.id }} className="flex items-center gap-3 px-5 py-4 active:bg-navy-50">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-semibold text-navy-900">{p?.fullName}</p>
                    <SeverityBadge severity={c.analysis.overallRisk} />
                  </div>
                  <p className="mt-0.5 truncate text-sm text-navy-600">
                    {c.medication.name} {c.medication.dose} · {c.medication.frequency}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2 text-xs text-navy-500">
                    <CheckStatusBadge status={c.status} />
                    <ClientTime iso={c.createdAt} mode={timeMode} />
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-navy-300" aria-hidden />
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}
