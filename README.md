# MediSecond

**A second set of eyes for every medication decision.**

MediSecond is a clinical medication decision-support prototype. A clinician selects a patient, enters a proposed medication order and runs a second check. MediSecond highlights potential drug interactions, allergy concerns, dose/context considerations, contraindications and duplicate therapy — each with an explanation and a suggested next step — so the clinician can make the final decision.

> MediSecond does not replace professional medical judgment, prescribing authority, institutional protocols, or authoritative drug references. All demo data is fictional.

## What you can try today

1. Open the landing page and click **Try Demo**
2. Pick **Rahul Sharma** from the dashboard
3. Click **Use example (Amoxicillin)**, continue through clinical context, and **Run Safety Check**
4. Review the allergy alert and **Why was this flagged?**, then **Acknowledge** and **Save report**
5. See the saved report in **Check History**

## Tech stack

- TanStack Start (React 19, TanStack Router file-based routing) on Vite
- TypeScript (strict)
- Tailwind CSS v4 with shadcn-style components in `src/components/ui`
- lucide-react icons, sonner toasts
- Deployed on Netlify

## Running locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
# or, with Netlify platform emulation:
netlify dev
```

## Roadmap

Milestone 1 (product surface and Demo Mode) is complete. Next up, per [PLAN.md](./PLAN.md):

2. Netlify Database persistence and audit trail
3. Authentication with Clinician/Admin roles
4. Patient management (list, overview, add patient)
5. Server-side AI analysis via Netlify AI Gateway, with Demo Mode fallback
6. Alerts page, analytics, admin tools and settings
