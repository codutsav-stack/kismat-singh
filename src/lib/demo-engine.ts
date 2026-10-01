/**
 * Demo Mode safety engine.
 *
 * A small, deterministic rule set used when no AI provider is configured. It
 * returns the same structured shape the future server-side analysis service
 * will return. It is illustrative only — NOT a validated clinical rules engine —
 * and covers a deliberately narrow set of medications.
 */
import type {
  AlertType,
  Patient,
  ProposedMedication,
  SafetyAlert,
  SafetyAnalysis,
  Severity,
} from './types'
import { ageFromDob } from './utils'

export const SEVERITY_RANK: Record<Severity, number> = { low: 0, moderate: 1, high: 2, critical: 3 }

type DrugClass =
  | 'penicillin'
  | 'cephalosporin'
  | 'nsaid'
  | 'anticoagulant'
  | 'fluoroquinolone'
  | 'macrolide'
  | 'statin'
  | 'ace_inhibitor'
  | 'ssri'
  | 'opioid'
  | 'biguanide'
  | 'ppi'
  | 'analgesic'
  | 'nitrofuran'
  | 'azole'
  | 'potassium_sparing'
  | 'sulfonamide'

const DRUGS: Record<string, DrugClass[]> = {
  amoxicillin: ['penicillin'],
  ampicillin: ['penicillin'],
  penicillin: ['penicillin'],
  'co-amoxiclav': ['penicillin'],
  augmentin: ['penicillin'],
  flucloxacillin: ['penicillin'],
  'piperacillin-tazobactam': ['penicillin'],
  cefalexin: ['cephalosporin'],
  cephalexin: ['cephalosporin'],
  ceftriaxone: ['cephalosporin'],
  cefuroxime: ['cephalosporin'],
  ibuprofen: ['nsaid'],
  naproxen: ['nsaid'],
  diclofenac: ['nsaid'],
  aspirin: ['nsaid'],
  celecoxib: ['nsaid'],
  warfarin: ['anticoagulant'],
  apixaban: ['anticoagulant'],
  rivaroxaban: ['anticoagulant'],
  ciprofloxacin: ['fluoroquinolone'],
  levofloxacin: ['fluoroquinolone'],
  clarithromycin: ['macrolide'],
  erythromycin: ['macrolide'],
  azithromycin: ['macrolide'],
  atorvastatin: ['statin'],
  simvastatin: ['statin'],
  rosuvastatin: ['statin'],
  lisinopril: ['ace_inhibitor'],
  ramipril: ['ace_inhibitor'],
  enalapril: ['ace_inhibitor'],
  sertraline: ['ssri'],
  fluoxetine: ['ssri'],
  citalopram: ['ssri'],
  tramadol: ['opioid'],
  codeine: ['opioid'],
  morphine: ['opioid'],
  metformin: ['biguanide'],
  omeprazole: ['ppi'],
  pantoprazole: ['ppi'],
  lansoprazole: ['ppi'],
  paracetamol: ['analgesic'],
  acetaminophen: ['analgesic'],
  nitrofurantoin: ['nitrofuran'],
  fluconazole: ['azole'],
  spironolactone: ['potassium_sparing'],
  'co-trimoxazole': ['sulfonamide'],
  'sulfamethoxazole-trimethoprim': ['sulfonamide'],
}

const CLASS_LABEL: Record<DrugClass, string> = {
  penicillin: 'penicillin-class antibiotic',
  cephalosporin: 'cephalosporin antibiotic',
  nsaid: 'NSAID',
  anticoagulant: 'anticoagulant',
  fluoroquinolone: 'fluoroquinolone antibiotic',
  macrolide: 'macrolide antibiotic',
  statin: 'statin',
  ace_inhibitor: 'ACE inhibitor',
  ssri: 'SSRI',
  opioid: 'opioid analgesic',
  biguanide: 'biguanide',
  ppi: 'proton pump inhibitor',
  analgesic: 'paracetamol-containing analgesic',
  nitrofuran: 'nitrofuran antibiotic',
  azole: 'azole antifungal',
  potassium_sparing: 'potassium-sparing diuretic',
  sulfonamide: 'sulfonamide antibiotic',
}

/** Usual maximum single adult dose (mg) — demo reference values only. */
const MAX_SINGLE_DOSE_MG: Record<string, number> = {
  amoxicillin: 1000,
  ibuprofen: 800,
  paracetamol: 1000,
  acetaminophen: 1000,
  metformin: 1000,
  ciprofloxacin: 750,
  sertraline: 200,
  tramadol: 100,
  naproxen: 500,
  nitrofurantoin: 100,
}

function normalise(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, '-')
}

function classesOf(name: string): DrugClass[] {
  const key = normalise(name)
  if (DRUGS[key]) return DRUGS[key]
  const hit = Object.keys(DRUGS).find((k) => key.startsWith(k) || k.startsWith(key))
  return hit && key.length >= 4 ? DRUGS[hit] : []
}

function doseInMg(dose: string): number | null {
  const m = dose.replace(',', '.').match(/([\d.]+)\s*(mg|g|mcg|µg)?/i)
  if (!m) return null
  const value = parseFloat(m[1])
  const unit = (m[2] || 'mg').toLowerCase()
  if (unit === 'g') return value * 1000
  if (unit === 'mcg' || unit === 'µg') return value / 1000
  return value
}

interface InteractionRule {
  a: DrugClass
  b: DrugClass
  severity: Severity
  risk: string
  rationale: string
  recommendation: string
}

const INTERACTIONS: InteractionRule[] = [
  {
    a: 'anticoagulant',
    b: 'nsaid',
    severity: 'high',
    risk: 'bleeding',
    rationale: 'NSAIDs can impair platelet function and irritate the gastric mucosa. Combined with an anticoagulant this may increase the risk of gastrointestinal or other bleeding.',
    recommendation: 'Consider clinician review of whether an alternative analgesic is appropriate, and of bleeding-risk monitoring if the combination is continued.',
  },
  {
    a: 'anticoagulant',
    b: 'fluoroquinolone',
    severity: 'high',
    risk: 'a raised INR and bleeding',
    rationale: 'Fluoroquinolones have been reported to potentiate the anticoagulant effect of warfarin, which may raise the INR during and shortly after the course.',
    recommendation: 'Consider clinician review of the antibiotic choice and whether closer INR monitoring is needed during the course.',
  },
  {
    a: 'anticoagulant',
    b: 'macrolide',
    severity: 'high',
    risk: 'a raised INR and bleeding',
    rationale: 'Some macrolides inhibit warfarin metabolism, which may increase anticoagulant effect.',
    recommendation: 'Consider clinician review of the antibiotic choice and INR monitoring plan.',
  },
  {
    a: 'anticoagulant',
    b: 'azole',
    severity: 'high',
    risk: 'a raised INR and bleeding',
    rationale: 'Azole antifungals can inhibit warfarin metabolism and may substantially increase anticoagulant effect.',
    recommendation: 'Consider clinician review and INR monitoring if the combination is used.',
  },
  {
    a: 'anticoagulant',
    b: 'sulfonamide',
    severity: 'high',
    risk: 'a raised INR and bleeding',
    rationale: 'Co-trimoxazole has been associated with marked potentiation of warfarin effect.',
    recommendation: 'Consider clinician review of alternatives and INR monitoring.',
  },
  {
    a: 'statin',
    b: 'macrolide',
    severity: 'moderate',
    risk: 'statin-associated muscle toxicity',
    rationale: 'Certain macrolides may increase statin exposure, which can raise the risk of myopathy.',
    recommendation: 'Consider clinician review of whether temporary statin adjustment or an alternative antibiotic is appropriate.',
  },
  {
    a: 'ace_inhibitor',
    b: 'nsaid',
    severity: 'moderate',
    risk: 'reduced kidney function and blunted blood-pressure control',
    rationale: 'NSAIDs can reduce renal perfusion. Alongside an ACE inhibitor this may affect kidney function, particularly in older patients or those with existing renal impairment.',
    recommendation: 'Consider clinician review of renal function and blood pressure if the combination is used.',
  },
  {
    a: 'ace_inhibitor',
    b: 'potassium_sparing',
    severity: 'moderate',
    risk: 'hyperkalaemia',
    rationale: 'Both medicines can raise serum potassium.',
    recommendation: 'Consider clinician review of potassium monitoring.',
  },
  {
    a: 'ssri',
    b: 'opioid',
    severity: 'moderate',
    risk: 'serotonin toxicity',
    rationale: 'Some opioids such as tramadol have serotonergic activity; combination with an SSRI may increase the risk of serotonin toxicity.',
    recommendation: 'Consider clinician review of the analgesic choice and counselling on warning signs.',
  },
  {
    a: 'ssri',
    b: 'nsaid',
    severity: 'moderate',
    risk: 'gastrointestinal bleeding',
    rationale: 'SSRIs and NSAIDs may each increase bleeding risk; together the effect may be additive.',
    recommendation: 'Consider clinician review of gastroprotection and the need for both agents.',
  },
]

let counter = 0
function alertId() {
  counter += 1
  return `alt-${counter}`
}

function make(
  type: AlertType,
  severity: Severity,
  title: string,
  description: string,
  rationale: string,
  patientFactor: string,
  recommendation: string,
): SafetyAlert {
  return { id: alertId(), type, severity, title, description, rationale, patientFactor, recommendation, status: 'unreviewed' }
}

export function analyseMedication(patient: Patient, med: ProposedMedication, now = new Date()): SafetyAnalysis {
  const alerts: SafetyAlert[] = []
  const uncertainties: string[] = []
  const age = ageFromDob(patient.dateOfBirth, now)
  const proposedKey = normalise(med.name)
  const proposedClasses = classesOf(med.name)
  const activeMeds = patient.medications.filter((m) => m.status === 'active')
  const egfr = patient.kidney.egfr

  // Allergy
  for (const allergy of patient.allergies) {
    const allergyClasses = classesOf(allergy.substance)
    const allergyKey = normalise(allergy.substance)
    if (proposedClasses.includes('penicillin') && (allergyKey.includes('penicillin') || allergyClasses.includes('penicillin'))) {
      alerts.push(
        make(
          'allergy',
          'high',
          `Potential allergy concern: ${med.name}`,
          `${med.name} is a penicillin-class antibiotic. The patient has a documented penicillin allergy.`,
          'Patients with a penicillin allergy may react to other penicillin-class medicines. Reaction severity can vary, and the documented history may not fully describe risk.',
          `Allergy: ${allergy.substance} — ${allergy.reaction}`,
          'Consider clinician review of the allergy history and whether a non-penicillin alternative is appropriate, in line with local antimicrobial guidance.',
        ),
      )
    } else if (proposedClasses.includes('cephalosporin') && allergyKey.includes('penicillin')) {
      alerts.push(
        make(
          'allergy',
          'moderate',
          'Possible cross-reactivity consideration',
          `${med.name} is a cephalosporin. The patient has a documented penicillin allergy.`,
          'Cross-reactivity between penicillins and cephalosporins is uncommon but has been described, and depends on the specific agent and the nature of the original reaction.',
          `Allergy: ${allergy.substance} — ${allergy.reaction}`,
          'Consider clinician review of the reaction type and local guidance on beta-lactam cross-reactivity.',
        ),
      )
    } else if (allergyKey === proposedKey || proposedClasses.some((c) => allergyClasses.includes(c))) {
      alerts.push(
        make(
          'allergy',
          'high',
          `Potential allergy concern: ${med.name}`,
          `${med.name} matches a documented allergy (${allergy.substance}).`,
          'A documented allergy to the same medicine or class may indicate risk of a hypersensitivity reaction.',
          `Allergy: ${allergy.substance} — ${allergy.reaction}`,
          'Consider clinician review of the allergy record before finalising.',
        ),
      )
    }
  }

  // Duplicate therapy
  for (const current of activeMeds) {
    const currentKey = normalise(current.name)
    const currentClasses = classesOf(current.name)
    if (currentKey === proposedKey) {
      alerts.push(
        make(
          'duplicate_therapy',
          'moderate',
          `${med.name} already on active medication list`,
          `${current.name} ${current.dose} ${current.frequency.toLowerCase()} is already recorded as active.`,
          'Ordering the same medicine again may be an intended dose change, but it can also lead to unintended duplicate dosing if the existing order is not updated.',
          `Active medication: ${current.name} ${current.dose}, ${current.frequency}`,
          'Consider clinician review of whether this replaces the existing order, and update the active list accordingly.',
        ),
      )
    } else {
      const shared = proposedClasses.find((c) => currentClasses.includes(c))
      if (shared) {
        alerts.push(
          make(
            'duplicate_therapy',
            'moderate',
            `Similar medication already active (${CLASS_LABEL[shared]})`,
            `${current.name} is in the same therapeutic class as ${med.name}.`,
            'Two medicines from the same class may increase the chance of additive adverse effects without additional benefit.',
            `Active medication: ${current.name} ${current.dose}, ${current.frequency}`,
            'Consider clinician review of whether both medicines are intended.',
          ),
        )
      }
    }
  }

  // Drug–drug interactions
  for (const current of activeMeds) {
    const currentClasses = classesOf(current.name)
    for (const rule of INTERACTIONS) {
      const match =
        (proposedClasses.includes(rule.a) && currentClasses.includes(rule.b)) ||
        (proposedClasses.includes(rule.b) && currentClasses.includes(rule.a))
      if (match) {
        alerts.push(
          make(
            'drug_interaction',
            rule.severity,
            `Potential interaction: ${med.name} + ${current.name}`,
            `A potential interaction was identified between ${med.name} and the patient's existing ${current.name}.`,
            `${rule.rationale} This combination may increase the risk of ${rule.risk}.`,
            `Active medication: ${current.name} ${current.dose}, ${current.frequency}`,
            rule.recommendation,
          ),
        )
        if (currentClasses.includes('anticoagulant')) uncertainties.push('Most recent INR / coagulation results are not available to this check.')
      }
    }
  }

  // Renal / contraindication / dose context
  if (egfr !== undefined) {
    if (proposedClasses.includes('nsaid') && egfr < 60) {
      alerts.push(
        make(
          'contraindication',
          egfr < 30 ? 'high' : 'moderate',
          'Medication may require additional review given renal function',
          `${med.name} is an NSAID and the patient's recorded eGFR is ${egfr} mL/min/1.73m².`,
          'NSAIDs can reduce renal blood flow and may worsen existing kidney impairment.',
          `Kidney function: ${patient.kidney.label} (eGFR ${egfr})`,
          'Consider clinician review of renal function and whether an alternative is more appropriate.',
        ),
      )
    }
    if (proposedClasses.includes('nitrofuran') && egfr < 45) {
      alerts.push(
        make(
          'dose',
          'moderate',
          'Dose/choice consideration based on renal function',
          `Nitrofurantoin is proposed and the patient's recorded eGFR is ${egfr} mL/min/1.73m².`,
          'Reduced renal function may lower urinary concentrations of nitrofurantoin (reducing effectiveness) and increase the risk of adverse effects. Many references advise caution or avoidance below an eGFR of 45.',
          `Kidney function: ${patient.kidney.label} (eGFR ${egfr})`,
          'Consider clinician review of the antibiotic choice against local urinary tract infection guidance.',
        ),
      )
    }
    if (proposedClasses.includes('fluoroquinolone') && egfr < 50) {
      alerts.push(
        make(
          'dose',
          'moderate',
          'Dose may require review based on renal function',
          `${med.name} is renally cleared and the patient's recorded eGFR is ${egfr} mL/min/1.73m².`,
          'Reduced clearance may increase drug exposure; some references suggest dose or interval adjustment at lower levels of renal function.',
          `Kidney function: ${patient.kidney.label} (eGFR ${egfr})`,
          'Consider clinician review of the dose and interval against a renal dosing reference.',
        ),
      )
    }
    if (proposedClasses.includes('biguanide') && egfr < 30) {
      alerts.push(
        make(
          'contraindication',
          'critical',
          'Metformin with severely reduced renal function',
          `Metformin is proposed and the patient's recorded eGFR is ${egfr} mL/min/1.73m².`,
          'Metformin accumulation in severe renal impairment has been associated with lactic acidosis.',
          `Kidney function: ${patient.kidney.label} (eGFR ${egfr})`,
          'Requires prompt clinician review of renal function and glycaemic management before finalising.',
        ),
      )
    }
  } else {
    uncertainties.push('No eGFR is recorded, so renal dosing could not be assessed.')
  }

  if (age >= 65 && proposedClasses.includes('nsaid')) {
    alerts.push(
      make(
        'dose',
        'moderate',
        'Age-related dose consideration',
        `The patient is ${age} years old and ${med.name} is an NSAID.`,
        'Older adults may be more susceptible to gastrointestinal, renal and cardiovascular adverse effects of NSAIDs.',
        `Age: ${age} years`,
        'Consider clinician review of the lowest effective dose and shortest duration, and of gastroprotection.',
      ),
    )
  }

  // Single-dose ceiling
  const mg = doseInMg(med.dose)
  const ceiling = MAX_SINGLE_DOSE_MG[proposedKey]
  if (mg !== null && ceiling && mg > ceiling) {
    alerts.push(
      make(
        'dose',
        mg > ceiling * 2 ? 'high' : 'moderate',
        'Dose above usual single adult dose',
        `The entered dose (${med.dose}) is above the usual single adult dose of ${ceiling} mg referenced in the demo rule set.`,
        'Higher doses may increase the risk of adverse effects. The dose may still be intended for a specific indication.',
        `Weight: ${patient.weightKg} kg · Age: ${age} years`,
        'Consider clinician review of the dose against an authoritative dosing reference.',
      ),
    )
  }

  if (proposedClasses.length === 0) {
    uncertainties.push(`"${med.name}" is not in the Demo Mode reference set, so interaction and class checks are limited.`)
  }
  if (!med.indication.trim()) uncertainties.push('No indication was entered; appropriateness for indication was not assessed.')
  uncertainties.push('Demo Mode uses a limited, illustrative rule set and is not a validated clinical reference.')

  alerts.sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity])
  const overallRisk: Severity = alerts.reduce<Severity>(
    (acc, a) => (SEVERITY_RANK[a.severity] > SEVERITY_RANK[acc] ? a.severity : acc),
    'low',
  )

  const summary =
    alerts.length === 0
      ? `No obvious issue detected for ${med.name} ${med.dose} based on the information available.`
      : `${alerts.length} potential concern${alerts.length > 1 ? 's' : ''} identified for ${med.name} ${med.dose}. Clinician review is recommended before finalising.`

  return {
    overallRisk,
    summary,
    explanation: buildExplanation(med, alerts),
    alerts,
    uncertainties: Array.from(new Set(uncertainties)),
    requiresClinicianReview: true,
  }
}

function buildExplanation(med: ProposedMedication, alerts: SafetyAlert[]) {
  if (alerts.length === 0) {
    return `Based on the recorded allergies, active medications, conditions and organ function, the demo rule set did not identify an obvious concern with ${med.name} ${med.dose} ${med.frequency.toLowerCase()}. This does not confirm the order is safe — the check only considers information entered into MediSecond. Review the full clinical picture and relevant references before finalising.`
  }
  const top = alerts[0]
  const parts = [top.rationale]
  if (alerts.length > 1) {
    parts.push(
      `${alerts.length - 1} further consideration${alerts.length > 2 ? 's were' : ' was'} also noted (${alerts
        .slice(1)
        .map((a) => a.title.toLowerCase())
        .join('; ')}).`,
    )
  }
  parts.push("Review the patient's medications, allergy history and relevant clinical guidance before finalising the order.")
  return parts.join(' ')
}
