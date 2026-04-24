# Feature Shape: Visual Refresh

## Problem

Seven product features have shipped (Auth, Vehicle, Check Types, Check Logging, Dashboard, Expenses,
Budget), each styled with DaisyUI defaults and ad-hoc amber/zinc utilities applied at different
times across a multi-month timeline. The result is functionally correct but visually inconsistent,
the typography is flat, responsive behavior has never been audited at breakpoint granularity, and
nothing in the UI communicates the product's identity — a personal vehicle maintenance tracker. The
app is about to be exposed to external testers, and its current surface treatment would undersell
the work underneath.

A technical handoff (`docs/polish/visual-refresh-handoff/HANDOFF.md`) already formalizes the chosen
V01 "Cluster" direction (tokens, two primitives, recipes for ~8 components). The handoff predates
Features 06 and 07, so the component-level recipes need to be extended across the remaining ~30
surfaces before execution.

## Solution (Broad Strokes)

Apply the **V01 "Cluster"** direction already formalized by the handoff across every shipped screen,
extending the handoff's component-by-component recipes to cover the surfaces that did not exist when
it was written. Keep all markup, semantics, ARIA attributes, stores, hooks, API services, schemas,
types, and routes untouched — change only class names, theme tokens, fonts, and add two new
presentational primitives (`Gauge`, `TelltaleLight`) that become the product's distinctive visual
signature.

**Main deliverables:**

- A new DaisyUI theme (`cartracker`) replacing the current tokens — darker cockpit neutrals, warmer
  amber primary, squarer radii, `Oxanium` display/sans, `JetBrains Mono` for numerics, with contrast
  ratios meeting WCAG AA everywhere and AAA wherever it comes for free
- Fonts self-hosted in the web app (no external CDN call, no outbound network dependency)
- Two new UI primitives: `Gauge` (circular dashboard-style indicator, `role="meter"`) and
  `TelltaleLight` (warning light, `role="status"` or `role="alert"`)
- A component-level restyle of every shipped UI surface, preserving semantics
- An explicit responsive audit across 320 / 375 / 768 / 1024 / 1440 breakpoints per screen
- Two net-new dashboard widgets (Budget, Recent Expenses) that complete MVP Core §5 and showcase the
  new primitives

**No data involved.** Purely frontend. No backend endpoints, no domain entities, no migrations.

## User Flow

This is a cross-cutting visual migration, not a feature with a narrow flow. The end-user outcome:

1. The user logs in — the authentication screen feels like a boot sequence rather than a generic web
   form
2. The user lands on the dashboard — cohesive cockpit aesthetic, Gauge-driven status indicators, and
   the two new Budget and Recent Expenses widgets are in place
3. The user navigates between features — every screen shares the same dark base, the same amber
   accents, the same Oxanium display type for headings, the same monospaced numerics
4. Status information is always conveyed by color **and** label
5. Every screen is usable at mobile widths down to 320px with no horizontal scroll
6. Keyboard and screen-reader navigation behave identically to before the refresh

## Dependencies

**Requires:**

- All shipped features (Vehicle, Check Types, Check Logging, Dashboard, Expenses, Budget) ✅ Done
- Technical handoff `docs/polish/visual-refresh-handoff/HANDOFF.md` ✅ Available
- Multi-direction reference `docs/polish/visual-refresh-handoff/index.html` ✅ Available
- DaisyUI 5, Radix UI, Lucide (already installed)
- `Oxanium` (weights 500 / 600 / 700) and `JetBrains Mono` (weights 400 / 600) self-hosted in the
  web app's static assets as `woff2`

**Enables:**

- Public exposure to external testers without underselling the product
- A common primitive vocabulary (`Gauge`, `TelltaleLight`) that future features can compose against
- The MVP Core "Done" criteria related to mobile-friendliness and dashboard completeness

## What Must Exist (Backend)

**N/A.** Frontend-only refresh. No backend changes are permitted — the handoff explicitly forbids
touching stores, hooks, API services, Zod schemas, and TypeScript types (`HANDOFF.md` §1 "FORBIDDEN"
§5).

## What Must Exist (Frontend)

### Theme & typography

- Replace the existing global stylesheet entirely with the handoff's `globals.css`, carrying over
  every token (oklch neutrals, warmer amber primary, saturated state colors, squarer radii)
- Self-host the two font families as `woff2` in the web app's static assets, declared via
  `@font-face` with a `font-display: swap` fallback to system fonts and local preload hints on the
  page layout — no `fonts.googleapis.com` or any external CDN call

### New UI primitives

Two primitives copied from the handoff and added to the shared UI layer:

- `Gauge` — circular dashboard-style indicator, `role="meter"` with `aria-valuenow / min / max`,
  270° arc (3/4 circle car-gauge feel), color driven by a `status` prop, SVG `aria-hidden`, info
  carried in ARIA + `.sr-only`
- `TelltaleLight` — warning light with a Lucide icon, `role="status"` for non-critical and
  `role="alert"` + `aria-live="assertive"` for critical, text label always present so color is never
  the sole carrier

### Shared UI components refresh

All existing shared components keep their markup, props, tests, and ARIA contract. Only classes
change: `Button` (new variants including `warning`, cluster-style uppercase display class), `Input`,
`Label`, `Textarea`, `Select`, `FormWrapper`, `DialogShell`, `ConfirmDialog`.

### Per-feature refresh

The handoff formalizes recipes for ~8 components. The remaining ~30 need new recipes following the
same discipline (preserve markup, preserve ARIA, change classes only, update test selectors never
drop assertions). Grouped by area:

- **auth** — login, signup, forgot/reset password, email verification, verification pending, session
  list
- **vehicles** — profile, quick mileage update, container, form, delete dialog, empty state
- **check-types** — card, form, list, delete dialog, suggested types, container
- **check-logs** — status badge, log card, log list, check-type filter, log-check dialog, log-check
  form, delete dialog, container
- **dashboard** — container, status overview, action items list and cards, recent activity list,
  vehicle summary card, empty state — **plus the two new widgets below**
- **expenses** — all 9 components (header, filter, list, card, form, form dialog, delete dialog,
  empty state, container)
- **budget** — all 7 components (header, status, form, form dialog, delete dialog, empty state,
  container)
- **profile** — profile view, edit container and form, change password form, delete account section
  and dialog
- **admin** — dashboard, user list, user management, user detail
- **layouts** — the two Astro layouts (main, admin), including the navbar treatment

### New dashboard widgets (close MVP Core §5)

Two widgets that did not exist in Feature 05 because they required Features 06–07 to be in place.
Implemented during this refresh so they ship cluster-native from day one:

- **Budget widget** — current-month spent vs target, progress indicator, link to `/budget`. Absent
  when no budget is defined. Composes the existing `useBudget` hook's monthly status
- **Recent Expenses widget** — total spent this month + three most recent expense cards, link to
  `/expenses`. Composes the existing period-scoped computed atoms from the Expense store

### Execution slicing

Execution is sliced into blocks by feature area so each PR stays reviewable and each merge is a
low-risk visual change. Block definition, ordering, branch names, and phase breakdown belong in the
implementation plan (to be authored separately from this shape). As a directional note, the
foundation block (theme swap + self-hosted fonts + two primitives + `Button`) must ship before any
feature-area block that consumes the primitives.

## UI Reference

### Visual Target

`HANDOFF.md` is the authoritative technical specification for tokens, primitives, and the components
it covers. This shape extends the handoff's recipes to the surfaces shipped after it was written —
it does not replace the handoff and does not revisit the direction choice.

The composed mockup `docs/polish/visual-refresh-handoff/index.html` is the original Claude Web
Design pitch from which V01 was chosen. V02 (Carnet) and V03 (Cockpit + unité) live in the same file
as archived alternatives for historical context only.

### Layout & Structure

- **Global shell** — top navbar (main layout) or admin shell (admin layout), dark `base-100`
  background, single-column content area constrained by a top-level `max-width` container. No nested
  `max-width` wrappers at feature or page level
- **Authenticated home (`/`)** — dashboard with a vertical stack: vehicle summary card, 4-up status
  overview, two-column main content (action items left, recent activity right) that collapses to a
  single column on mobile, new Budget and Recent Expenses widgets at the bottom
- **List pages** (`/check-types`, `/check-logs`, `/expenses`) — header with title + primary action,
  optional filter row, chronological card list, full-width cards on every breakpoint
- **Detail/profile pages** (`/vehicle`, `/profile`, `/budget`) — centered card with inline header
  (title + action buttons), content organized around semantic `<dl>/<dt>/<dd>` or dual status panels
  (budget case), action buttons grouped in a footer row
- **Dialogs** — Radix UI Dialog primitive with DaisyUI `modal-box` styling, full-screen sheet
  behavior on mobile, centered overlay on desktop
- **Auth pages** — narrow centered card on a dark background, `Oxanium` heading above, `Lucide`
  brand icon, minimal chrome

### UI Components & Patterns

- **Cards** — `card bg-base-200 border border-base-300`, consistent padding, optional top header
  with `border-b` separator
- **Buttons** — `Button` primitive, variants `default` (primary amber), `outline`, `ghost`,
  `destructive` (error), `warning`; cluster-style uppercase display with `Oxanium`
- **Inputs** — DaisyUI `input`/`textarea`/`select` on a `base-200` card, numeric inputs use
  `JetBrains Mono` for the odometer-screen look
- **Badges** — status badges with a small circular telltale dot (`aria-hidden`) before the label,
  semantic fill colors (no outline + opacity pattern); the text label stays mandatory
- **Gauge primitive** — replaces or augments progress bars for stat-overview, budget progress,
  check-status panels; always paired with a `.sr-only` description
- **Telltale primitive** — used sparingly for attention-grabbing status (overdue, overspent,
  verification pending); critical variants announce via `aria-live="assertive"`
- **Stat indicators** — 4-up grid on dashboard status overview, 2-up on mobile; colored number,
  monospace figure, label below
- **Progress bars** — linear variant for budget monthly/annual panels, fills use semantic color
  tokens matching the state (`ON_TRACK` / `NEAR_LIMIT` / `OVERSPENT`)
- **Empty states** — centered Lucide icon, short message, primary CTA button; one variant per
  context (no vehicle, no check types, no expenses, no budget, filtered-to-nothing)
- **Loading states** — DaisyUI `loading loading-spinner` centered in content area, or inline status
  text inside the container header
- **Error states** — DaisyUI `alert alert-error` with retry action when the operation can be retried
- **Success feedback** — inline `alert alert-success`, auto-dismiss after 3 seconds, never a toast
  library
- **Focus ring** — amber outline via `:focus-visible` in `globals.css`, present on every interactive
  element

### Design Tokens

All tokens defined in the handoff's `globals.css`:

- `primary` — cluster amber `oklch(80% 0.16 75)`, content `oklch(17% 0.03 75)`
- `base-100 / 200 / 300` — dark cockpit neutrals (main bg / panels / borders)
- `base-content` — warm-tinted text
- `success / warning / error / info` — saturated state colors, AA on `base-200` minimum, AAA for
  most
- `radius-field: 0.25rem`, `radius-box: 0.375rem` — squarer than defaults
- Fonts — `--font-sans: Oxanium`, `--font-display: Oxanium`, `--font-mono: JetBrains Mono`

No hardcoded hex. No pure `#000` or `#fff`. No inline `style={{…}}`.

### Responsiveness

Every refreshed screen is audited at five breakpoints: 320px (smallest practical phone), 375px
(modern phone portrait), 768px (tablet portrait), 1024px (tablet landscape / small laptop), 1440px
(desktop).

Rules enforced during the audit:

- No nested `max-width` containers (known failure mode flagged in Feature 06 review)
- No horizontal scroll at any breakpoint
- Touch targets ≥ 44×44px on mobile
- Dialogs become full-screen sheets on mobile, centered overlays on desktop
- Stats, action lists, and forms collapse from multi-column to single-column gracefully
- Navigation uses the existing DaisyUI hamburger drawer pattern below the `lg` breakpoint
- Font weights and sizes remain legible (body ≥ 16px, display ≥ 24px on mobile)

### Accessibility (absolute rules, carried from `HANDOFF.md` §1)

- Never replace semantic tags with `<div>`
- Never drop `aria-*` attributes; add more, never fewer
- Never drop `data-testid` or break specs — fix the selector if a class is renamed, never the
  assertion
- Never encode information by color alone (label + icon + aria-label)
- Never go below WCAG AA (4.5:1 body / 3:1 large text ≥ 18px or ≥ 14px bold)
- Never introduce inline `style={{…}}` (Tailwind + DaisyUI only; `@apply` in `globals.css` for
  custom effects)
- `:focus-visible` outline amber, via `globals.css`
- `prefers-reduced-motion` honored globally via `globals.css`
- Manual keyboard + screen-reader sweep on the three top flows (login, view vehicle, log a check) in
  the QA block
- Lighthouse a11y score ≥ 95 per page after execution

## Open Questions

1. **Dashboard widgets merge or split?** The Budget widget and the Recent Expenses widget are
   required by MVP Core §5 and were planned as a separate short chantier before this shape existed.
   They can either ship first in the current visual style (faster to testers, rework inside the
   dashboard block) or ship directly in cluster style inside the dashboard block (zero rework, but
   testers wait for the foundation block to land first). → **Recommendation: ship cluster-native
   inside the dashboard block** unless the deadline pressure for testers overrides.

2. **Execution granularity.** Nine fine-grained blocks (foundation, 7 feature areas, QA) keep each
   PR small and reviewable but multiply coordination cost. A 3-block grouping (Foundation / All
   Features / QA) collapses coordination but makes review harder. → **Recommendation: keep the
   fine-grained slicing** — pure visual changes with many test assertions benefit from tight scope
   per PR.

3. **Scope creep guardrail.** Email verification from admin, admin user onboarding, multi-car, the
   global `ExceptionFilter` fix, the review backlog from Features 01 / 06 / 07 — none belong in this
   refresh. Flagged only so they do not slip in during implementation under the "while we're in
   there" pretext.

## Out of Scope

- Any backend change — no new endpoints, no DTO changes, no schema changes
- New features or new screens (the refresh touches only what already exists, plus the two
  missing-from-MVP dashboard widgets explicitly scoped in)
- Functional behavior changes (same user flows, same validation, same data)
- Light mode or theme switching — dark-only per the code-style rules
- Animation library integration (Framer Motion etc.) — CSS-only transitions,
  `prefers-reduced- motion` respected
- Component documentation system (Storybook, etc.) — deferred
- Bundle-size optimization or code-splitting — separate polish concern
- Email delivery, admin user verification, admin user creation — separate feature (Admin Onboarding
  shape to be written)
- Multi-car support and vehicle switcher — MVP Full territory, separate feature
- Global `ExceptionFilter` refactor — separate tech-debt plan, not part of this shape
- Review-backlog items inherited from previous PRs — addressed opportunistically per area when they
  happen to overlap with a refreshed screen, never by widening scope

## Risks / Gotchas

- **Handoff is partial.** Recipes exist for ~8 of ~40 components. The ~30 new recipes must be
  authored with the same discipline as the handoff (markup preserved, ARIA preserved, tests updated
  not dropped). Most creative work sits in the per-feature blocks, not in the foundation.
- **Test suite impact.** Every component spec asserts on class strings or computed structure. Each
  block will surface test adjustments — budget generous test-update time per block; never circumvent
  an assertion.
- **Primitive order.** `Gauge` and `TelltaleLight` must land in the foundation block because later
  blocks will consume them (dashboard widgets, budget status panels).
- **Responsive is manual.** No automated responsive audit tool on this stack. The audit pass is a
  human checklist across the five breakpoints and cannot be shortcut.
- **No nested `max-width`.** Prior features shipped with nested wrappers (main layout + page
  container + feature container). The refresh is the right moment to collapse them globally.
- **Cross-feature component usage.** `LogCheckDialog` lives in `check-logs` but is consumed by the
  dashboard. Restyling the dialog in its owner block propagates visually into any consumer block —
  account for the order.
- **Font loading FOUC.** Self-hosted `woff2` files must be referenced by a `@font-face` with
  `font-display: swap` and sensible system-font fallbacks. On the root HTML, preload the primary
  weight (`Oxanium 600`) and the mono 400 weight to avoid a flash.
- **Font licensing.** Both Oxanium (SIL Open Font License 1.1) and JetBrains Mono (SIL Open Font
  License 1.1) allow redistribution with the license text. Ship the license files alongside the
  fonts in the static assets.
- **Token swap is all-or-nothing.** `globals.css` is replaced entirely in the foundation block. Any
  screen not yet refreshed will inherit the new tokens but keep its old class vocabulary — expect a
  short period where intermediate states look slightly off. Mitigated by tight block cadence.
- **Lighthouse threshold.** The handoff targets Lighthouse a11y ≥ 95 per page. Some existing screens
  may already be below — the QA block must budget time to fix underlying issues, not merely
  acknowledge them.
