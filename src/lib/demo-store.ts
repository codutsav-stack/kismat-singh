/**
 * Client-side demo store. Holds medication checks and the alert audit trail
 * for the current browser session. This is the single module a later milestone
 * replaces with Netlify Database-backed server functions.
 */
import { useSyncExternalStore } from 'react'
import { DEMO_CLINICIAN, getPatient, seedChecks, patients } from '@/data/fixtures'
import { analyseMedication } from './demo-engine'
import type { AlertStatus, AuditEntry, MedicationCheck, ProposedMedication, Patient } from './types'

interface State {
  patients: Patient[]
  checks: MedicationCheck[]
  audit: AuditEntry[]
}

function buildSeed(): State {
  const now = Date.now()
  const checks = seedChecks.map((s) => {
    const patient = getPatient(s.patientId)!
    const createdAt = new Date(now - s.minutesAgo * 60_000)
    const analysis = analyseMedication(patient, s.medication, createdAt)
    if (s.reviewed) {
      analysis.alerts = analysis.alerts.map((a) => ({
        ...a,
        status: 'acknowledged' as AlertStatus,
        actionedAt: new Date(createdAt.getTime() + 3 * 60_000).toISOString(),
      }))
    }
    return {
      id: s.id,
      patientId: s.patientId,
      clinicianName: DEMO_CLINICIAN.fullName,
      medication: s.medication,
      createdAt: createdAt.toISOString(),
      status: s.reviewed ? 'reviewed' : 'pending_review',
      analysis,
      source: 'demo_engine',
    } satisfies MedicationCheck
  })
  return { patients: [...patients], checks, audit: [] }
}

let state: State = buildSeed()
const serverState = state
const listeners = new Set<() => void>()

function set(next: State) {
  state = next
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useDemoStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(serverState),
  )
}

export function createPatient(
  patient: Omit<Patient, 'id' | 'isDemo'>,
): Patient {
  const newPatient: Patient = {
    ...patient,
    id: `patient-${Date.now().toString(36)}`,
    isDemo: true,
  }

  set({
    ...state,
    patients: [newPatient, ...state.patients],
  })

  return newPatient
}

export function deletePatient(patientId: string) {
  set({
    ...state,
    patients: state.patients.filter(
      (patient) => patient.id !== patientId,
    ),
    checks: state.checks.filter(
      (check) => check.patientId !== patientId,
    ),
    audit: state.audit.filter(
      (entry) => entry.patientId !== patientId,
    ),
  })
}

let seq = 2049
export function runCheck(patientId: string, medication: ProposedMedication): MedicationCheck {
  const patient = getPatient(patientId)
  if (!patient) throw new Error('Patient not found')
  const check: MedicationCheck = {
    id: `chk-${seq++}`,
    patientId,
    clinicianName: DEMO_CLINICIAN.fullName,
    medication,
    createdAt: new Date().toISOString(),
    status: 'pending_review',
    analysis: analyseMedication(patient, medication),
    source: 'demo_engine',
  }
  set({ ...state, checks: [check, ...state.checks] })
  return check
}

export function setAlertStatus(checkId: string, alertId: string, status: Exclude<AlertStatus, 'unreviewed'>) {
  const check = state.checks.find((c) => c.id === checkId)
  if (!check) return
  const timestamp = new Date().toISOString()
  const checks = state.checks.map((c) =>
    c.id !== checkId
      ? c
      : {
          ...c,
          analysis: {
            ...c.analysis,
            alerts: c.analysis.alerts.map((a) => (a.id === alertId ? { ...a, status, actionedAt: timestamp } : a)),
          },
        },
  )
  const entry: AuditEntry = {
    id: `aud-${Date.now().toString(36)}`,
    alertId,
    checkId,
    patientId: check.patientId,
    clinicianName: DEMO_CLINICIAN.fullName,
    action: status,
    timestamp,
  }
  set({ patients: state.patients, checks, audit: [entry, ...state.audit] })
}

export function saveReport(checkId: string) {
  const check = state.checks.find((c) => c.id === checkId)
  if (!check) return
  const timestamp = new Date().toISOString()
  set({
    patients: state.patients,
    checks: state.checks.map((c) => (c.id === checkId ? { ...c, status: 'reviewed' } : c)),
    audit: [
      {
        id: `aud-${Date.now().toString(36)}`,
        alertId: '',
        checkId,
        patientId: check.patientId,
        clinicianName: DEMO_CLINICIAN.fullName,
        action: 'report_saved',
        timestamp,
      },
      ...state.audit,
    ],
  })
}
