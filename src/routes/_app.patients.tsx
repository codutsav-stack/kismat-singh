import { createFileRoute } from '@tanstack/react-router'
import { Search, UserRound, ShieldAlert, Pill, Plus, X, Trash2, Users } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useDemoStore, createPatient, deletePatient } from '@/lib/demo-store'
import type { Patient } from '@/lib/types'

export const Route = createFileRoute('/_app/patients')({
  component: PatientsPage,
})

function PatientsPage() {
  const patients = useDemoStore((state) => state.patients)

  const [search, setSearch] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return patients

    return patients.filter(
      (patient) =>
        patient.fullName.toLowerCase().includes(query) ||
        patient.patientCode.toLowerCase().includes(query),
    )
  }, [search, patients])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-950">
            Patients
          </h1>

          <p className="mt-1 text-sm text-navy-500">
            Manage patient profiles and medication safety information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          Create New Patient
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400"
          aria-hidden
        />

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or patient ID"
          className="h-11 w-full rounded-xl border border-navy-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
        />
      </div>

      {/* Patient list */}
      <div className="overflow-hidden rounded-2xl border border-navy-200 bg-white">
        <div className="hidden grid-cols-[2fr_1fr_1.5fr_1.5fr] gap-4 border-b border-navy-100 bg-navy-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-navy-500 md:grid">
          <span>Patient</span>
          <span>Age / Sex</span>
          <span>Conditions</span>
          <span>Allergies</span>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <UserRound className="mx-auto h-8 w-8 text-navy-300" />

            <p className="mt-3 text-sm font-medium text-navy-700">
              No patients found
            </p>

            <p className="mt-1 text-xs text-navy-400">
              Try another search or create a new patient.
            </p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <PatientRow key={patient.id} patient={patient} />
          ))
        )}
      </div>

      {/* Statistics */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-navy-200 bg-white p-4">
          <UserRound className="h-5 w-5 text-brand-600" />

          <p className="mt-3 text-2xl font-bold text-navy-950">
            {patients.length}
          </p>

          <p className="text-sm text-navy-500">
            Total patients
          </p>
        </div>

        <div className="rounded-xl border border-navy-200 bg-white p-4">
          <ShieldAlert className="h-5 w-5 text-navy-500" />

          <p className="mt-3 text-2xl font-bold text-navy-950">
            {patients.filter((p) => p.allergies.length > 0).length}
          </p>

          <p className="text-sm text-navy-500">
            Patients with allergies
          </p>
        </div>

        <div className="rounded-xl border border-navy-200 bg-white p-4">
          <Pill className="h-5 w-5 text-navy-500" />

          <p className="mt-3 text-2xl font-bold text-navy-950">
            {patients.reduce(
              (total, p) => total + p.medications.length,
              0,
            )}
          </p>

          <p className="text-sm text-navy-500">
            Active medications
          </p>
        </div>
      </div>

      {/* Create Patient Modal */}
      {showCreateForm && (
        <CreatePatientModal
          onClose={() => setShowCreateForm(false)}
        />
      )}
    </div>
  )
}

/* ---------------------------------- */
/* Patient Row                         */
/* ---------------------------------- */

function PatientRow({ patient }: { patient: Patient }) {
  const age = calculateAge(patient.dateOfBirth)

  return (
    <div className="border-b border-navy-100 px-5 py-5 last:border-b-0">
      <div className="grid gap-4 md:grid-cols-[2fr_1fr_1.5fr_1.5fr_auto] md:items-center">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
            {getInitials(patient.fullName)}
          </div>

          <div>
            <p className="font-semibold text-navy-900">
              {patient.fullName}
            </p>

            <p className="text-xs text-navy-500">
              {patient.patientCode}
            </p>
          </div>
        </div>

        <div className="text-sm text-navy-600">
          {age} years
          <br />
          {patient.sex}
        </div>

        <div className="text-sm text-navy-600">
          {patient.conditions.length > 0
            ? patient.conditions.slice(0, 2).join(', ')
            : 'None recorded'}
        </div>

        <div className="text-sm text-navy-600">
          {patient.allergies.length > 0
            ? patient.allergies
                .slice(0, 2)
                .map((a) => a.substance)
                .join(', ')
            : 'No known allergies'}
        </div>
        <button
  type="button"
  onClick={() => {
    const confirmed = window.confirm(
      `Delete ${patient.fullName}? This will also remove their demo medication checks and alerts.`,
    )

    if (confirmed) {
      deletePatient(patient.id)
    }
  }}
  className="flex h-9 w-9 items-center justify-center rounded-lg text-navy-400 transition hover:bg-red-50 hover:text-red-600"
  title="Delete patient"
>
  <Trash2 className="h-4 w-4" />
</button>
      </div>
    </div>
  )
}

/* ---------------------------------- */
/* Create Patient Modal                */
/* ---------------------------------- */

function CreatePatientModal({
  onClose,
}: {
  onClose: () => void
}) {
  const [fullName, setFullName] = useState('')
  const [patientCode, setPatientCode] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [sex, setSex] = useState<Patient['sex']>('Male')
  const [weightKg, setWeightKg] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [conditions, setConditions] = useState('')
  const [allergies, setAllergies] = useState('')
  const [medications, setMedications] = useState('')
  const [kidneyStatus, setKidneyStatus] =
    useState<Patient['kidney']['status']>('normal')
  const [liverStatus, setLiverStatus] =
    useState<Patient['liver']['status']>('normal')

  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!fullName.trim()) {
      setError('Please enter the patient name.')
      return
    }

    if (!patientCode.trim()) {
      setError('Please enter a patient ID.')
      return
    }

    if (!dateOfBirth) {
      setError('Please enter the date of birth.')
      return
    }

    if (!weightKg || Number(weightKg) <= 0) {
      setError('Please enter a valid weight.')
      return
    }

    if (!heightCm || Number(heightCm) <= 0) {
      setError('Please enter a valid height.')
      return
    }

    const newPatient: Omit<Patient, 'id' | 'isDemo'> = {
      patientCode: patientCode.trim(),
      fullName: fullName.trim(),
      dateOfBirth,
      sex,
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),

      allergies: allergies
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((substance) => ({
          substance,
          reaction: 'Not specified',
        })),

      conditions: conditions
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),

      kidney: {
        status: kidneyStatus,
        label: getOrganLabel(kidneyStatus),
      },

      liver: {
        status: liverStatus,
        label: getOrganLabel(liverStatus),
      },

      medications: medications
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((name) => ({
          name,
          dose: 'Not specified',
          frequency: 'Not specified',
          startDate: new Date().toISOString().slice(0, 10),
          status: 'active',
        })),
    }

    createPatient(newPatient)

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Modal header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-navy-100 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-navy-950">
              Create New Patient
            </h2>

            <p className="mt-1 text-xs text-navy-500">
              Add patient information for medication safety checks.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-navy-400 hover:bg-navy-50 hover:text-navy-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full Name" required>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className={inputClass}
              />
            </FormField>

            <FormField label="Patient ID" required>
              <input
                value={patientCode}
                onChange={(e) => setPatientCode(e.target.value)}
                placeholder="e.g. P-1005"
                className={inputClass}
              />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Date of Birth" required>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className={inputClass}
              />
            </FormField>

            <FormField label="Sex" required>
              <select
                value={sex}
                onChange={(e) =>
                  setSex(e.target.value as Patient['sex'])
                }
                className={inputClass}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Weight (kg)" required>
              <input
                type="number"
                min="1"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g. 68"
                className={inputClass}
              />
            </FormField>

            <FormField label="Height (cm)" required>
              <input
                type="number"
                min="1"
                step="0.1"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="e.g. 172"
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField
            label="Medical Conditions"
            hint="Separate multiple conditions with commas."
          >
            <textarea
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              placeholder="e.g. Diabetes, Hypertension"
              rows={3}
              className={textareaClass}
            />
          </FormField>

          <FormField
            label="Allergies"
            hint="Separate multiple allergies with commas."
          >
            <textarea
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin, Aspirin"
              rows={3}
              className={textareaClass}
            />
          </FormField>

          <FormField
            label="Current Medications"
            hint="Separate medication names with commas."
          >
            <textarea
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              placeholder="e.g. Metformin, Lisinopril"
              rows={3}
              className={textareaClass}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Kidney Function">
              <select
                value={kidneyStatus}
                onChange={(e) =>
                  setKidneyStatus(
                    e.target.value as Patient['kidney']['status'],
                  )
                }
                className={inputClass}
              >
                <option value="normal">Normal</option>
                <option value="mildly_reduced">Mildly reduced</option>
                <option value="moderately_reduced">
                  Moderately reduced
                </option>
                <option value="severely_reduced">
                  Severely reduced
                </option>
              </select>
            </FormField>

            <FormField label="Liver Function">
              <select
                value={liverStatus}
                onChange={(e) =>
                  setLiverStatus(
                    e.target.value as Patient['liver']['status'],
                  )
                }
                className={inputClass}
              >
                <option value="normal">Normal</option>
                <option value="mildly_reduced">Mildly reduced</option>
                <option value="moderately_reduced">
                  Moderately reduced
                </option>
                <option value="severely_reduced">
                  Severely reduced
                </option>
              </select>
            </FormField>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-navy-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-700 hover:bg-navy-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Create Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ---------------------------------- */
/* Small helper components             */
/* ---------------------------------- */

function FormField({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-navy-800">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}

      {hint && (
        <p className="mt-1 text-xs text-navy-400">
          {hint}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'h-11 w-full rounded-xl border border-navy-200 bg-white px-3 text-sm text-navy-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'

const textareaClass =
  'w-full rounded-xl border border-navy-200 bg-white px-3 py-3 text-sm text-navy-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function calculateAge(dateOfBirth: string) {
  const birth = new Date(dateOfBirth)
  const today = new Date()

  let age = today.getFullYear() - birth.getFullYear()

  const monthDifference =
    today.getMonth() - birth.getMonth()

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birth.getDate())
  ) {
    age--
  }

  return Math.max(age, 0)
}

function getOrganLabel(
  status: Patient['kidney']['status'],
) {
  switch (status) {
    case 'mildly_reduced':
      return 'Mildly reduced'

    case 'moderately_reduced':
      return 'Moderately reduced'

    case 'severely_reduced':
      return 'Severely reduced'

    default:
      return 'Normal'
  }
}