export type Severity = 'low' | 'moderate' | 'high' | 'critical'

export type AlertType =
  | 'drug_interaction'
  | 'allergy'
  | 'dose'
  | 'contraindication'
  | 'duplicate_therapy'

export type AlertStatus = 'unreviewed' | 'acknowledged' | 'dismissed'

export type CheckStatus = 'pending_review' | 'reviewed'

export interface ActiveMedication {
  name: string
  dose: string
  frequency: string
  startDate: string
  status: 'active' | 'paused' | 'stopped'
}

export interface OrganFunction {
  status: 'normal' | 'mildly_reduced' | 'moderately_reduced' | 'severely_reduced'
  label: string
  /** eGFR in mL/min/1.73m² — kidney only */
  egfr?: number
}

export interface Patient {
  id: string
  patientCode: string
  fullName: string
  dateOfBirth: string
  sex: 'Female' | 'Male' | 'Other'
  weightKg: number
  heightCm: number
  allergies: { substance: string; reaction: string }[]
  conditions: string[]
  kidney: OrganFunction
  liver: OrganFunction
  medications: ActiveMedication[]
  isDemo: boolean
}

export interface ProposedMedication {
  name: string
  dose: string
  route: string
  frequency: string
  duration: string
  indication: string
}

export interface SafetyAlert {
  id: string
  type: AlertType
  severity: Severity
  title: string
  description: string
  rationale: string
  patientFactor: string
  recommendation: string
  status: AlertStatus
  actionedAt?: string
}

/** Mirrors the structured JSON the analysis service returns. */
export interface SafetyAnalysis {
  overallRisk: Severity
  summary: string
  explanation: string
  alerts: SafetyAlert[]
  uncertainties: string[]
  requiresClinicianReview: true
}

export interface MedicationCheck {
  id: string
  patientId: string
  clinicianName: string
  medication: ProposedMedication
  createdAt: string
  status: CheckStatus
  analysis: SafetyAnalysis
  source: 'demo_engine'
}

export interface AuditEntry {
  id: string
  alertId: string
  checkId: string
  patientId: string
  clinicianName: string
  action: 'acknowledged' | 'dismissed' | 'report_saved'
  timestamp: string
}
