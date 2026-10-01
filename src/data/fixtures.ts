/**
 * Demo fixtures — ALL DATA IS FICTIONAL.
 * These records exist only so the product can be demonstrated without real
 * patient information. A later milestone swaps this module for Netlify Database.
 */
import type { Patient, ProposedMedication } from '@/lib/types'

export const DEMO_CLINICIAN = {
  id: 'clin-demo',
  fullName: 'Dr. Ananya Rao',
  firstName: 'Rao',
  email: 'demo.clinician@medisecond.app',
  role: 'Clinician' as const,
  department: 'Internal Medicine',
}

export const patients: Patient[] = [
  {
    id: 'p-rahul',
    patientCode: 'DEMO-1001',
    fullName: 'Rahul Sharma',
    dateOfBirth: '1981-03-14',
    sex: 'Male',
    weightKg: 78,
    heightCm: 175,
    allergies: [{ substance: 'Penicillin', reaction: 'Urticarial rash (2019)' }],
    conditions: ['Hypertension', 'Type 2 diabetes mellitus'],
    kidney: { status: 'normal', label: 'Normal', egfr: 92 },
    liver: { status: 'normal', label: 'Normal' },
    medications: [
      { name: 'Metformin', dose: '500 mg', frequency: 'Twice daily', startDate: '2022-08-10', status: 'active' },
      { name: 'Amlodipine', dose: '5 mg', frequency: 'Once daily', startDate: '2021-02-01', status: 'active' },
    ],
    isDemo: true,
  },
  {
    id: 'p-priya',
    patientCode: 'DEMO-1002',
    fullName: 'Priya Singh',
    dateOfBirth: '1959-06-02',
    sex: 'Female',
    weightKg: 62,
    heightCm: 158,
    allergies: [],
    conditions: ['Atrial fibrillation', 'Hypertension', 'Chronic kidney disease (stage 3b)', 'Osteoarthritis'],
    kidney: { status: 'moderately_reduced', label: 'Moderately reduced', egfr: 42 },
    liver: { status: 'normal', label: 'Normal' },
    medications: [
      { name: 'Warfarin', dose: '5 mg', frequency: 'Once daily', startDate: '2020-11-03', status: 'active' },
      { name: 'Lisinopril', dose: '10 mg', frequency: 'Once daily', startDate: '2019-05-21', status: 'active' },
      { name: 'Atorvastatin', dose: '20 mg', frequency: 'Once nightly', startDate: '2019-05-21', status: 'active' },
      { name: 'Omeprazole', dose: '20 mg', frequency: 'Once daily', startDate: '2023-01-15', status: 'active' },
      { name: 'Paracetamol', dose: '1 g', frequency: 'Up to four times daily (PRN)', startDate: '2024-04-02', status: 'active' },
    ],
    isDemo: true,
  },
  {
    id: 'p-amit',
    patientCode: 'DEMO-1003',
    fullName: 'Amit Kumar',
    dateOfBirth: '1997-01-20',
    sex: 'Male',
    weightKg: 72,
    heightCm: 180,
    allergies: [],
    conditions: [],
    kidney: { status: 'normal', label: 'Normal', egfr: 110 },
    liver: { status: 'normal', label: 'Normal' },
    medications: [],
    isDemo: true,
  },
]

export function getPatient(id: string) {
  return patients.find((p) => p.id === id)
}

/** Pre-run checks that seed history. minutesAgo keeps timestamps relative to "now". */
export const seedChecks: {
  id: string
  patientId: string
  minutesAgo: number
  medication: ProposedMedication
  reviewed: boolean
}[] = [
  {
    id: 'chk-2048',
    patientId: 'p-priya',
    minutesAgo: 38,
    reviewed: false,
    medication: { name: 'Ciprofloxacin', dose: '500 mg', route: 'Oral', frequency: 'Every 12 hours', duration: '7 days', indication: 'Urinary tract infection' },
  },
  {
    id: 'chk-2047',
    patientId: 'p-amit',
    minutesAgo: 95,
    reviewed: true,
    medication: { name: 'Ibuprofen', dose: '400 mg', route: 'Oral', frequency: 'Every 8 hours', duration: '5 days', indication: 'Ankle sprain' },
  },
  {
    id: 'chk-2046',
    patientId: 'p-rahul',
    minutesAgo: 170,
    reviewed: true,
    medication: { name: 'Co-amoxiclav', dose: '625 mg', route: 'Oral', frequency: 'Every 8 hours', duration: '5 days', indication: 'Cellulitis' },
  },
  {
    id: 'chk-2045',
    patientId: 'p-priya',
    minutesAgo: 265,
    reviewed: false,
    medication: { name: 'Nitrofurantoin', dose: '100 mg', route: 'Oral', frequency: 'Every 12 hours', duration: '5 days', indication: 'Lower urinary tract infection' },
  },
  {
    id: 'chk-2044',
    patientId: 'p-rahul',
    minutesAgo: 60 * 26,
    reviewed: true,
    medication: { name: 'Metformin', dose: '1000 mg', route: 'Oral', frequency: 'Twice daily', duration: 'Ongoing', indication: 'Glycaemic control' },
  },
  {
    id: 'chk-2043',
    patientId: 'p-amit',
    minutesAgo: 60 * 49,
    reviewed: true,
    medication: { name: 'Sertraline', dose: '50 mg', route: 'Oral', frequency: 'Once daily', duration: '6 months', indication: 'Generalised anxiety' },
  },
]

/** One-click example for the hackathon flow. */
export const exampleMedication: ProposedMedication = {
  name: 'Amoxicillin',
  dose: '500 mg',
  route: 'Oral',
  frequency: 'Every 8 hours',
  duration: '7 days',
  indication: 'Community-acquired chest infection',
}

export const ROUTES = ['Oral', 'Intravenous', 'Intramuscular', 'Subcutaneous', 'Topical', 'Inhaled', 'Rectal', 'Sublingual']
export const FREQUENCIES = ['Once daily', 'Twice daily', 'Every 8 hours', 'Every 12 hours', 'Every 6 hours', 'Once nightly', 'As needed (PRN)', 'Once weekly']
