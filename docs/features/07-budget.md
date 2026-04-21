# Feature Shape: Budget

## Problem

Owning a vehicle is an ongoing financial commitment, and without a planned ceiling, expenses
silently drift: unexpected repairs, parts bought on impulse, overlapping services. The existing
Expenses feature tells the user **how much** they are already spending, but gives no anchor to
compare against their own intent. Budget is the planning counterpart of Expenses: the user sets a
personal spending ceiling and sees, at a glance, whether actual spending is on track or drifting —
on both a monthly and an annual horizon.

## Solution (Broad Strokes)

Each vehicle carries a single budget: an amount in euros and a period unit chosen by the user
(monthly or annual). From this single source of truth, the application derives **both** views: the
monthly target and the annual target (a trivial division or multiplication by 12). The user never
needs to re-enter the same information in two places, and the two figures never drift apart.

On a dedicated `/budget` page, the user sees their status for the current calendar month and the
current calendar year simultaneously:

- Amount spent so far on the period (sum of all expense categories)
- Target derived from the configured budget
- Remaining amount (or amount overspent)
- A visual progress indicator with three states: on track, near the limit, overspent

The budget is editable and deletable. There is a single current budget at any time — no history of
past budgets, no audit trail of changes. Changing the budget immediately recomputes the comparison
against already-logged expenses.

**Main UI elements:**

- Dedicated page `/budget` with a navigation link ("Budget") in the main menu
- Two status panels (monthly + annual) displayed side-by-side on desktop, stacked on mobile
- Modal dialog for creating and editing the budget (reuses the Radix UI Dialog pattern)
- Confirmation dialog for deletion (reuses existing `ConfirmDialog`)
- Empty state when no budget is defined, with a call-to-action to define one

**Data involved:**

- `Budget` entity tied 1:1 with a vehicle (one budget per vehicle, enforced at the database level)
- Stored in integer cents (`amountCents: Int`), consistent with the `Expense` money storage
  convention
- `BudgetPeriod` enum: `MONTHLY` or `ANNUAL`
- The "spent" figures are derived client-side from the existing `Expense` data for the vehicle

## User Flow

### Defining an Initial Budget

1. User navigates to `/budget` from the main menu
2. With no budget set, user sees the empty state: "Aucun budget défini" + CTA
3. User clicks "Définir un budget"
4. A modal dialog opens with:
   - Amount input in euros (text input, accepts both `89,50` and `89.50`)
   - Period selector: "Mensuel" or "Annuel"
5. User submits the form
6. System validates input (Zod on frontend, class-validator + domain validation on backend)
7. System converts the amount string to integer cents before persisting
8. Modal closes, the page transitions from empty state to the status view
9. Success feedback is displayed (inline alert)

### Viewing the Status

1. User sees two status panels side-by-side (or stacked on mobile):
   - **Monthly panel**: "Ce mois", spent vs monthly target, progress bar, remaining or overspend,
     state message
   - **Annual panel**: "Cette année", spent vs annual target, progress bar, remaining or overspend,
     state message
2. Both panels derive their targets from the single stored budget:
   - If the budget is stored as `MONTHLY`, the annual target = `amount × 12`
   - If the budget is stored as `ANNUAL`, the monthly target = `amount / 12` (rounded to cents)
3. A subtle indication below the panels clarifies the derivation for transparency (e.g., "Budget de
   83,33 €/mois dérivé de votre budget annuel de 1 000 €")
4. Each panel's visual state reflects the spend ratio (spent / target):
   - `ratio < 0.80` → **on track** (neutral or primary color)
   - `0.80 ≤ ratio < 1.00` → **near the limit** (warning color)
   - `ratio ≥ 1.00` → **overspent** (error color)

   The 0.80 boundary is inclusive on the `NEAR_LIMIT` side; the 1.00 boundary is inclusive on the
   `OVERSPENT` side.

### Editing the Budget

1. User clicks "Modifier le budget" in the page header
2. The same modal dialog opens, pre-filled with the current amount and period
3. User edits amount, period, or both, and submits
4. System validates and persists the update via the same upsert endpoint
5. Both status panels refresh instantly (computed atoms react to the new budget)
6. Success feedback is displayed

### Deleting the Budget

1. User clicks "Supprimer le budget"
2. A confirmation dialog appears: "Supprimer votre budget ? Vous pourrez en définir un nouveau à
   tout moment."
3. User confirms
4. System deletes the budget via DELETE endpoint
5. Page transitions back to the empty state
6. Success feedback is displayed

## Dependencies

**Requires:**

- Authentication (Feature 01) — budgets are private per user ✅ Done
- Vehicle Profile (Feature 02) — budgets are tied to a vehicle ✅ Done
- UI Design System (Feature 03b) — DaisyUI 5, Radix UI Dialog, shared components ✅ Done
- Expenses (Feature 06) — the "spent" figures read from the existing `Expense` data ✅ Done

**Enables:**

- Dashboard widget "Budget" (deferred to the Polish phase, already tracked in `docs/PROGRESS.md`
  backlog): will consume `BudgetService.findByVehicleId` and the period-scoped expense totals
  exposed by this feature
- Future multi-vehicle aggregated budget (when Multi-Car support lands): the `Budget` model can
  evolve to a nullable `userId` discriminator without a destructive migration

## What Must Exist (Backend)

### Domain Layer

**Entity:**

- `Budget` entity with behavior:
  - Encapsulates validation invariants (amount > 0, amount ≤ sanity cap, valid period)
  - Constructor validates invariants
  - Update methods enforce the same invariants
  - Mutable (editable), consistent with `Expense`
  - Properties: `id`, `vehicleId`, `amount`, `period`, `createdAt`, `updatedAt`

**Value Objects:**

- `BudgetId` — UUID validation, immutable, equality comparison (same pattern as `ExpenseId`,
  `CheckLogId`)
- `Amount` — **shared from a new `shared/domain/value-objects/` location**. Currently lives in
  `expenses/domain/value-objects/amount.vo.ts` and must be moved to `shared/domain/value-objects/`
  so both `Expense` and `Budget` consume the same value object. The Expense feature is updated to
  import from the new location.

**Enum:**

- `BudgetPeriod = MONTHLY | ANNUAL`, re-exported from Prisma (same pattern as `ExpenseCategory`,
  `FuelType`)

**Repository Interface (port):**

- Find the budget for a vehicle (returns `Budget | null`)
- Save the budget (idempotent upsert keyed by `vehicleId`)
- Delete the budget for a vehicle

**Domain Exceptions:**

- `BudgetNotFoundException`
- `InvalidBudgetException` (validation failures)

**Validation Constants:**

- Amount minimum (> 0) and sanity cap (1 000 000 €, shared with Expense via the `Amount` VO)
- Valid period values

### Application Layer

**Use Cases:**

- `GetBudgetByVehicleUseCase` — receives vehicle ID, returns the budget or throws not-found
- `UpsertBudgetUseCase` — receives vehicle ID + input, creates the budget if none exists, replaces
  it if one does; always idempotent
- `DeleteBudgetUseCase` — receives vehicle ID, deletes the budget; 404 if none existed

**Service Orchestrator:**

- Delegates to use cases, provides a unified API for the controller

**DTOs:**

- `UpsertBudgetInputDto` (`amountCents`, `period`) with class-validator decorators referencing
  domain validation constants
- `BudgetResponseDto` (`id`, `vehicleId`, `amountCents`, `period`, `createdAt`, `updatedAt`) —
  exposes `amountCents` as integer (frontend handles formatting)

**Application Mapper:**

- Entity → response DTO conversion (unwraps value objects to primitives)

### Infrastructure Layer

**Controller:**

- Mounted at nested singleton route under vehicles: `/vehicles/:vehicleId/budget`
- Three endpoints: `GET`, `PUT` (upsert), `DELETE`
- All endpoints verify vehicle ownership before delegating to the service
- Uses `@Session()` decorator for authentication

**Prisma Repository:**

- Implements the domain repository interface
- `save` uses Prisma `upsert` semantics, keyed by `vehicleId` unique constraint
- Handles Prisma error codes → domain exceptions (P2025 for not found)
- Uses infrastructure mapper for Prisma ↔ domain entity conversion

**Infrastructure Mapper:**

- Prisma record → domain entity (reconstructs value objects)
- Domain entity → Prisma record (unwraps value objects to primitives)

**Database Migration:**

- New `Budget` table with:
  - `id` (UUID, primary key)
  - `vehicleId` (foreign key to `Vehicle`, `@unique` — enforces the 1:1 relation, cascade delete
    when the vehicle is deleted)
  - `amountCents` (Int, > 0 enforced at domain level)
  - `period` (enum `BudgetPeriod`)
  - `createdAt`, `updatedAt` timestamps
- New enum `BudgetPeriod { MONTHLY, ANNUAL }` added to the schema
- Relation added to `Vehicle` model (`budget Budget?`)

**Module:**

- NestJS module with `useFactory` DI pattern (consistent with Expenses module)
- Imports: Auth module, Vehicles module, Shared domain module (for `Amount` VO)
- Exports: Budget service (for future Dashboard widget consumption)

### API Endpoints

- `GET /vehicles/:vehicleId/budget` — returns the budget (`200`) or `404` if none set
- `PUT /vehicles/:vehicleId/budget` — upsert the budget (idempotent); returns `200` with the budget
- `DELETE /vehicles/:vehicleId/budget` — returns `204` on success, `404` if no budget existed

All endpoints require an authenticated session and verify vehicle ownership. Ownership failures
return `404` (not `403`) to avoid leaking resource existence — consistent with the Expenses and
CheckLogs pattern.

**Note on PUT upsert:** this is a deliberate departure from the project's POST+PATCH convention used
by plural resources (`Expense`, `CheckType`, `CheckLog`). Budget is a **singleton** resource under a
vehicle (cardinality 1:1), for which PUT upsert is the idiomatic REST shape. Documented in the
controller and covered by tests for both create-when-absent and replace-when-present cases.

### Validations

- Vehicle must exist and belong to the authenticated user
- `amountCents` is required, must be a positive integer, must be ≤ sanity cap (100 000 000 cents = 1
  000 000 €)
- `period` is required, must be one of the two valid values (`MONTHLY`, `ANNUAL`)
- `vehicleId` in the URL path is used for ownership check and relation binding

## What Must Exist (Frontend)

### Shared Refactor (Cross-Feature)

Before the Budget feature is wired, two **targeted improvements** are performed:

- **Backend**: move `apps/api/src/expenses/domain/value-objects/amount.vo.ts` to
  `apps/api/src/shared/domain/value-objects/amount.vo.ts`. Update all Expense imports. Tests must
  stay green.
- **Frontend**: move `apps/web/src/features/expenses/utils/amount.utils.ts` (and its test) to
  `apps/web/src/shared/utils/amount.utils.ts`. Update all Expense imports. Tests must stay green.

Both relocations happen in a dedicated preparatory commit, before any Budget-specific code is added.

### File Naming Conventions (matching `features/expenses/` structure)

```text
features/budget/
├── api/
│   ├── budget.service.ts
│   ├── budget.service.spec.ts
│   └── index.ts
├── components/
│   ├── BudgetContainer.tsx
│   ├── BudgetContainer.spec.tsx
│   ├── BudgetHeader.tsx
│   ├── BudgetHeader.spec.tsx
│   ├── BudgetStatus.tsx
│   ├── BudgetStatus.spec.tsx
│   ├── BudgetForm.tsx
│   ├── BudgetForm.spec.tsx
│   ├── BudgetFormDialog.tsx
│   ├── BudgetFormDialog.spec.tsx
│   ├── DeleteBudgetDialog.tsx
│   ├── DeleteBudgetDialog.spec.tsx
│   ├── BudgetEmptyState.tsx
│   ├── BudgetEmptyState.spec.tsx
│   └── index.ts
├── hooks/
│   ├── useBudget.ts
│   ├── useBudget.spec.ts
│   └── index.ts
├── schemas/
│   ├── budget.schema.ts
│   ├── budget.schema.spec.ts
│   └── index.ts
├── store/
│   ├── budget.store.ts
│   ├── budget.store.spec.ts
│   └── index.ts
├── types/
│   ├── budget.types.ts
│   └── index.ts
├── utils/
│   ├── budgetPeriod.utils.ts
│   ├── budgetPeriod.utils.spec.ts
│   ├── budgetStatus.utils.ts
│   ├── budgetStatus.utils.spec.ts
│   └── index.ts
└── index.ts
```

All directories use **singular** names. Component files are **PascalCase**. Everything else is
**camelCase** with the appropriate dotted suffix (`.service.ts`, `.store.ts`, `.schema.ts`,
`.types.ts`, `.utils.ts`).

### Types (`types/budget.types.ts`)

- `Budget` interface (`id`, `vehicleId`, `amountCents`, `period`, `createdAt`, `updatedAt`)
- `BudgetPeriod` union: `'MONTHLY' | 'ANNUAL'`
- `UpsertBudgetInput` interface (`amountCents`, `period`)
- `BudgetStatus` interface (`spentCents`, `targetCents`, `remainingCents`, `progressRatio`,
  `state: 'ON_TRACK' | 'NEAR_LIMIT' | 'OVERSPENT'`)

### Validation Schemas (`schemas/budget.schema.ts`)

- Upsert schema:
  - `amountInput`: user-entered string (accepts `89,50` or `89.50`), transformed to `amountCents`
    via the shared `parseEurosToCents`, refined > 0 and ≤ sanity cap
  - `period`: Zod enum matching the two values (`MONTHLY`, `ANNUAL`)
- French error messages consistent with existing schemas
- Type inference from the schema for form typing

### Utilities (`utils/`)

- `budgetPeriod.utils.ts` — `PERIOD_LABELS` (FR: "Mensuel" for `MONTHLY`, "Annuel" for `ANNUAL`),
  `PERIOD_OPTIONS` for the select component
- `budgetStatus.utils.ts` — pure functions:
  - `deriveMonthlyTargetCents(budget: Budget): number` (handles both unit cases)
  - `deriveAnnualTargetCents(budget: Budget): number`
  - `computeProgressState(spentCents: number, targetCents: number): 'ON_TRACK' | 'NEAR_LIMIT' | 'OVERSPENT'`
    returning `ON_TRACK` when `ratio < 0.80`, `NEAR_LIMIT` when `0.80 ≤ ratio < 1.00`, and
    `OVERSPENT` when `ratio ≥ 1.00`
  - `computeBudgetStatus(spentCents: number, targetCents: number): BudgetStatus` — returns the full
    status object used by the UI

Both files have companion `*.spec.ts` files covering edge cases: zero budget (guard), non-integer
divisions (1000 € / 12), threshold boundaries (exactly 80%, exactly 100%), large amounts, overspend
cases.

### API Service (`api/budget.service.ts`)

- Typed methods: `getBudget(vehicleId)`, `upsertBudget(vehicleId, input)`, `deleteBudget(vehicleId)`
- Uses existing `apiRequest` client and `handleApiResponse` helper
- Endpoints prefixed with `/api/vehicles/:vehicleId/budget` (Astro proxy)

### State Management (`store/budget.store.ts`, Nanostores)

- Atoms: `$budget`, `$isLoading`, `$error`
- Computed (depend on `$budget` + on the **Expenses store's** computed atoms):
  - `$hasBudget`
  - `$monthlyTargetCents`, `$annualTargetCents` (derived from `$budget.period` and
    `$budget.amountCents`)
  - `$monthlyStatus`, `$annualStatus` (full `BudgetStatus`, combine targets with
    `$spentThisMonthCents` / `$spentThisYearCents` from the Expense store)
- Actions: `fetchBudget`, `upsertBudget`, `deleteBudget`, `clearError`

### Extension to the Expenses Store (`features/expenses/store/expense.store.ts`)

Two new computed atoms are added to the existing Expenses store (not to the Budget feature), because
they are general-purpose period-scoped aggregates reusable by the future Dashboard widgets:

- `$spentThisMonthCents` — sum of `amountCents` over `$expenses` whose `occurredAt` falls in the
  current calendar month (browser local timezone, ISO string comparison)
- `$spentThisYearCents` — same for the current calendar year

This is documented in the implementation plan as a targeted, non-breaking extension to a shipped
feature.

### Custom Hook (`hooks/useBudget.ts`)

- `useBudget` — connects store to components
- Provides: budget, hasBudget, monthlyStatus, annualStatus, loading, error, actions
- Handles fetch-on-mount and refresh-after-mutation patterns
- **Internally also calls** `useExpenses` (or equivalent) to ensure expense data is loaded when the
  user lands directly on `/budget` without passing through `/expenses`

### Pages / Routes

- `apps/web/src/pages/budget.astro` — auth-gated Astro page (redirects to `/login` when no session),
  mounts `<BudgetContainer client:only="react" />`
- Link "Budget" added to `Main.astro` navigation (desktop + mobile), positioned after "Dépenses"

### Components

**Container (smart):**

- `BudgetContainer` — manages modes (view / edit-dialog / delete-confirm), orchestrates data
  fetching (both budget and expenses), handles form submission, error handling

**Presentational (dumb):**

- `BudgetHeader` — page title + "Modifier le budget" button + "Supprimer" button (both visible only
  when a budget exists)
- `BudgetStatus` — renders two status panels (monthly + annual): period label, spent figure, target
  figure, remaining or overspend figure, progress bar, state message; also renders the derivation
  hint ("Budget de X €/mois dérivé de votre budget annuel de Y €" or symmetric)
- `BudgetFormDialog` — modal Radix UI Dialog wrapping `BudgetForm` for both create and edit modes
- `BudgetForm` — React Hook Form + Zod resolver, fields (amount string, period toggle),
  submit/cancel callbacks
- `DeleteBudgetDialog` — wraps existing `ConfirmDialog` for delete confirmation
- `BudgetEmptyState` — "Aucun budget défini — définissez un budget pour suivre vos dépenses." with
  Lucide icon and CTA button

**Reused shared components:**

- `ConfirmDialog` (from `components/ui/`) — for delete confirmation
- `Button`, `Input`, `Label`, `Select`, `FormWrapper` (from `components/ui/`)

### State & Interactions

- The empty state's "Définir un budget" CTA opens `BudgetFormDialog` in create mode
- The header's "Modifier le budget" opens `BudgetFormDialog` in edit mode (pre-filled)
- The header's "Supprimer" opens `DeleteBudgetDialog`
- After any successful mutation, the status panels refresh, inline feedback is shown
- The progress-state computation reacts to changes in either `$budget` or the Expense store's
  period-scoped totals

## UI Reference

### Visual Target

The Spark prototype (`https://github.com/TituxMetal/car-repair-cost-trac`) is the design reference.
The feature uses the existing design tokens (see Design System section in `MVP.md`) and follows the
visual language already established by the Vehicle Profile, Check Types, Check Logs, Dashboard, and
Expenses features.

### Layout & Structure (intent)

- **Dedicated page** `/budget` with the standard page container width used across the app
- **Header area** at the top: page title, "Modifier le budget" and "Supprimer" buttons (visible only
  when a budget exists)
- **Main content** (when a budget exists): two status panels (monthly + annual), side-by-side on
  desktop, stacked vertically on mobile — each panel self-contained with its own progress bar,
  figures, and state message
- **Derivation hint**: a subtle one-line note below the panels, explaining that the two targets are
  derived from the single stored budget
- **Empty state** (when no budget is defined): centered in the main content area, with an icon, a
  short message, and a "Définir un budget" call-to-action
- **Form dialog**: modal centered on desktop, full-width sheet on mobile (same behavior as existing
  dialogs)

### Content & Labels (French, runtime-facing)

- Page title: "Mon budget"
- Button: "Définir un budget" (when none) / "Modifier le budget" (when one exists)
- Button: "Supprimer"
- Period labels: "Mensuel" (`MONTHLY`), "Annuel" (`ANNUAL`)
- Panel labels: "Ce mois", "Cette année"
- Figures: "Dépensé", "Cible", "Reste" (or "Dépassement" when overspent)
- State messages: "Dans les clous", "Proche de la limite", "Budget dépassé"
- Derivation hint (example): "Budget de 83,33 €/mois dérivé de votre budget annuel de 1 000 €"
- Empty state: "Aucun budget défini — définissez un budget pour suivre vos dépenses."
- Feedback messages: "Budget enregistré", "Budget modifié", "Budget supprimé"
- Form field labels: "Montant", "Période"
- Submit button: "Enregistrer" (create) / "Mettre à jour" (edit)
- Cancel button: "Annuler"
- Delete confirmation: "Supprimer votre budget ? Vous pourrez en définir un nouveau à tout moment."

### Design Tokens (semantic, from `MVP.md`)

- **primary (amber)** — primary action buttons ("Définir un budget", "Modifier le budget", submit)
- **neutral (zinc)** — panel backgrounds, borders, secondary text (derivation hint, labels)
- **success (emerald)** — success feedback after create/update/delete
- **warning (amber/orange)** — progress bar and state message in the `NEAR_LIMIT` state
- **error (red)** — progress bar and state message in the `OVERSPENT` state, delete button, delete
  confirmation
- Exact colors/shades for the progress bar states are a design decision to be made during
  implementation, respecting the accessibility rule: no outline+opacity, use semantic color fills

### Accessibility (ABSOLUTE RULES from memory)

- Form fields use `aria-describedby` pointing at their associated error message
- The dialog uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the dialog
  title (reuse the `LogCheckDialog` / `ExpenseFormDialog` pattern)
- No nested max-width containers
- Progress bars use semantic color fills, NOT `outline + opacity` variants
- Delete buttons clearly distinguishable from edit buttons (color + label)

### Responsiveness

- **Header**: title stacks above buttons on mobile, inline on desktop
- **Status panels**: stacked (one on top of the other) on mobile, side-by-side (two columns) on
  desktop
- **Progress bars**: full-width within each panel on all breakpoints
- **Form dialog**: full-screen sheet on mobile, centered overlay on desktop
- **Action buttons inside the header**: stack vertically on mobile, inline on desktop
- **Spacing**: reduced padding on mobile, standard on desktop (use existing utility scale)

## Follow-ups (Polish phase)

These items are explicitly deferred to the final polish phase and are NOT part of this feature. They
are documented here so they do not get lost; tracking lives in `docs/PROGRESS.md` (backlog section).

1. **Dashboard widget: "Budget"** — compact summary on the Dashboard page showing the current
   month's spent vs monthly target with a visual state indicator, and a link to `/budget`. Already
   tracked in the backlog.
2. **Future multi-vehicle aggregated budget** — when Multi-Car support is added, the `Budget` model
   can evolve to support a user-level scope (nullable `userId` discriminator), enabling "total
   budget across all vehicles". Not applicable for the current 1:1 user-vehicle constraint.

## Open Questions

1. **Exact threshold for `NEAR_LIMIT`** — set to `0.80` (80%) as an industry-standard warning point
   that gives the user breathing room before overspending. → **Recommendation: ship with 0.80,
   revisit only if feedback suggests it is too aggressive or too conservative.**
2. **Precise color shades and progress bar styling** — the semantic states (on track / near limit /
   overspent) have agreed semantic tokens (primary / warning / error) but the exact visual rendering
   (bar height, label position, background contrast) will be decided during the frontend-design pass
   in the browser, consistent with prior features.
3. **Layout of the two status panels** — side-by-side on desktop is the recommended default; a
   vertical stack on desktop (or a toggle between the two views) can be evaluated live if side-by-
   side feels crowded with the derivation hint.
4. **Empty state wording** — confirm "Aucun budget défini — définissez un budget pour suivre vos
   dépenses." reads well in context, or tune during implementation.

## Out of Scope

- **Budget history / audit trail** — a single current budget at any time; no log of past budgets. If
  tracking budget changes becomes important later, a separate `BudgetChangeLog` entity would be
  added as a distinct feature
- **Per-category budgets** — a semantically different feature (budgeting by `ExpenseCategory`); not
  an evolution of this one
- **Email / push notifications** when thresholds are crossed — visual indicators only
- **Multi-vehicle aggregated budget** — requires Multi-Car support first
- **Backend-aggregated endpoints for period totals** — client-side computation from the Expense
  store is sufficient for the expected volume; deferred as long as the `/expenses` page can also
  afford client-side totals
- **Dashboard widget** — tracked in the Polish backlog, not part of this feature
- **CSV / PDF export** of budget status
- **Multi-currency support** — EUR only, per `MVP.md`
- **Custom periods** (weekly, quarterly) — fixed to `MONTHLY` and `ANNUAL`
- **Historical period views** — the status shows the **current** calendar month and year only; no
  "budget status for February 2026" screen
- **Pagination / filtering** — not applicable (one budget per vehicle)

## Risks / Gotchas

- **Division rounding on derived targets** — `annualAmountCents / 12` is not always a whole number
  (e.g., 100 001 cents / 12 = 8333.41…). The derivation functions use `Math.round` to stay in
  integer cents, introducing a rounding error of at most 1 cent. Exhaustive tests on boundary cases
  (exact multiples of 12, primes like 100 001, large values) are required.
- **Mid-period budget edits** — changing the budget mid-month immediately recomputes the comparison
  against already-logged expenses. There is **no historical retroactivity**: the system does not
  remember "the budget that was active when this expense was logged". Documented behavior; if it
  becomes confusing in practice, a `BudgetChangeLog` feature can be added later.
- **Current-period detection uses the browser timezone** — the computed atoms
  (`$spentThisMonthCents`, `$spentThisYearCents`) derive "current month/year" from the user's local
  clock. Since `occurredAt` is stored as `YYYY-MM-DD` without timezone, comparison is purely lexical
  on ISO strings. No timezone ambiguity, but correctness depends on the user's clock.
- **Cross-feature coupling: Budget → Expenses (frontend)** — the Budget feature's store imports
  period-scoped computed atoms from the Expense store. This is a deliberate, legitimate coupling
  (Budget depends on Expense data to compute "spent"). Documented as an assumed architectural
  dependency. If more features eventually need the same aggregates, extracting a shared aggregates
  module becomes reasonable.
- **Targeted refactors before Budget is wired** — the shared `Amount` VO (backend) and shared
  `amount.utils` (frontend) relocations touch the already-shipped Expense feature. The
  implementation plan sequences these refactors in preparatory commits with Expense tests passing
  before any Budget-specific code is introduced.
- **PUT upsert as a departure from POST+PATCH convention** — justified by the singleton cardinality
  of Budget. Documented in the controller; tests cover both create-when-absent and
  replace-when-present cases explicitly.
- **Cascade delete on Vehicle removal** — deleting the vehicle cascades to the Budget (Prisma
  `onDelete: Cascade`). Consistent with `CheckType`, `CheckLog`, `Expense`.
- **Sanity cap at 1 000 000 €** — shared with Expense via the relocated `Amount` VO. A monthly
  budget at the cap is absurd (= 12 M€/year), but the cap is a mis-entry guard, not a business rule.
- **Zero-guard on targets** — `computeProgressState` must guard against a zero target (should never
  happen given the > 0 invariant, but defensive programming for display safety). Tests cover this.
- **Editability and audit trail** — the budget is fully editable, no change history for the MVP
  scope. Consistent with `Expense` editability.
- **Multi-vehicle readiness** — the `/vehicles/:vehicleId/budget` route and the `vehicleId`-scoped
  repository are already multi-vehicle ready. No refactoring needed when Multi-Car lands.
