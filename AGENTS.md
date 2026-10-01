# AGENTS.md

MediSecond — a clinical medication second-check (decision-support) app. **Continue from [PLAN.md](./PLAN.md)**: milestone 1 (UI surface + Demo Mode) is done; start with milestone 2.

## Stack

TanStack Start + React 19 + TanStack Router (file-based), Vite 7, Tailwind CSS v4, TypeScript strict, deployed on Netlify. Icons: lucide-react. Toasts: sonner. `@/` aliases `src/`.

## Layout

```
src/
  routes/
    __root.tsx                    document shell, fonts, <Toaster/>
    index.tsx                     public landing page
    login.tsx                     sign in + "Continue as Demo Clinician"
    _app.tsx                      pathless layout: sidebar, header, patient search, notifications, mobile drawer
    _app.dashboard.tsx            /dashboard
    _app.medication-check.index.tsx   /medication-check  (4-step wizard; ?patient=<id> preselects)
    _app.medication-check.$id.tsx     /medication-check/:id  (result report)
    _app.history.tsx              /history
  components/
    ui/                           shadcn-style primitives (button, card, badge, input/select/label, dialog, skeleton)
    app/                          product components (severity badges, checks table, logo, disclaimer, ClientTime)
  data/fixtures.ts                ALL fictional demo data (patients, seed checks, example order)
  lib/
    types.ts                      domain types; SafetyAnalysis mirrors the future API JSON
    demo-engine.ts                deterministic Demo Mode rule set -> SafetyAnalysis
    demo-store.ts                 session store (useSyncExternalStore) — the swap point for real persistence
```

## Conventions & decisions

- **Stubs live in one place.** `data/fixtures.ts` + `lib/demo-store.ts` are the only data sources. Milestone 2 replaces the store's functions (`runCheck`, `setAlertStatus`, `saveReport`, `useDemoStore`) with server functions backed by Netlify Database; keep signatures similar so routes change minimally.
- **Selectors must return stable references** (`s.checks`, `.find(...)`) — derive filtered arrays with `useMemo`, otherwise `useSyncExternalStore` loops.
- **Times render client-only** via `<ClientTime>` / `useHydrated()` to avoid SSR (UTC) vs browser timezone hydration mismatches. Date-dependent stats also wait for hydration.
- **Clinical wording is advisory**: “Consider clinician review…”, never “Do not prescribe”. No certainty claims, no diagnosis, no auto-blocking. Keep the `ClinicalDisclaimer` footer on clinical screens and label demo data as fictional.
- Severity levels: low / moderate / high / critical; styling in `components/app/severity.tsx` (`SEVERITY_META`). Tailwind classes must be literal strings (no string-built class names).
- Sidebar items not yet built are rendered with a “Soon” tag in `_app.tsx` `NAV`; flip `soon` to a `to` route when a page ships.
- Palette tokens (`navy-*`, `brand-*` teal) and shadows are defined in `src/styles.css` `@theme`. Font: Plus Jakarta Sans.

## Commands

```bash
pnpm dev     # vite dev on :3000
pnpm build   # production build (run by Netlify)
```
