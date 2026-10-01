# MediSecond — Product Roadmap

> “A second set of eyes for every medication decision.”

MediSecond is a clinical medication decision-support platform. Clinicians run a fast second-check of a proposed medication order; the system highlights potential concerns for a qualified clinician to review. It never diagnoses, prescribes, or blocks ordering — every alert is advisory.

Each milestone below is self-contained and shippable on its own.

## ✅ Milestone 1 — Product surface & Demo Mode (done)

- Public landing page (hero, problem/solution, how it works, features, CTA)
- Sign-in screen with **Continue as Demo Clinician**
- App shell: sidebar, patient search, notifications, profile, logout, mobile hamburger menu
- Dashboard: welcome card, today's stats, **+ New Medication Check**, recent checks, demo patients, alert-priority legend
- **Medication Second Check** 4-step flow (patient → medication → clinical context → run) with analysis loading state
- **Second-Check Result**: overall review, five risk categories, detailed alerts (what / why / patient factor / next step), “Why was this flagged?” explanation with uncertainties, Acknowledge / Dismiss (with confirmation) / Review Again / Medication History / Save report
- **Check History** with date, patient, medication, risk and status filters
- Deterministic Demo Mode engine (`src/lib/demo-engine.ts`) returning the final structured JSON shape
- Three fictional demo patients and six seeded checks (no issue, interaction, allergy, dose/context, duplicate)

State currently lives in a browser-session store (`src/lib/demo-store.ts`).

## Milestone 2 — Data model & persistence

- Netlify Database (Postgres + Drizzle) schema in `db/schema.ts`: `profiles`, `patients`, `medications`, `medication_checks`, `alerts`, `alert_actions`
- Seed script for the fictional demo patients and checks (flagged `is_demo`)
- Server functions replacing `demo-store.ts`: list/get checks, run check, set alert status, save report
- Audit trail persisted: alert ID, clinician ID, patient ID, timestamp, action

## Milestone 3 — Authentication & roles

- Clinician and Admin roles; login, signup (full name, email, password, role), forgot password
- Protected `_app` routes; “Continue as Demo Clinician” signs into a sandboxed demo account
- Authorisation rules so clinicians only access records they are permitted to see (row-level checks in server functions)

## Milestone 4 — Patient management

- `/patients` list with search and responsive cards
- `/patients/:id` overview: demographics, clinical info, medication history, **Run Medication Check**
- `/patients/new` form with validation and a confirmation step; “Create new patient” inside the check flow

## Milestone 5 — AI analysis service

- Server-side analysis function (Netlify AI Gateway) taking patient context + proposed order, returning the structured JSON (`overallRisk`, `summary`, `alerts[]`, `uncertainties[]`, `requiresClinicianReview`)
- Strict schema validation, hedged-language guardrails, and merge with deterministic rules
- Automatic fallback to the Demo Mode engine when no provider is configured

## Milestone 6 — Alerts, analytics & settings

- `/alerts` page with All / Unreviewed / Acknowledged / Dismissed / High priority filters
- `/analytics`: totals, checks this week, risks detected, alerts acknowledged, average review time; charts for checks over time, alerts by severity and by category (descriptive only — no outcome claims)
- Admin view: anonymised usage statistics and user management
- `/settings`: profile, notification & alert preferences, change password, sign out
