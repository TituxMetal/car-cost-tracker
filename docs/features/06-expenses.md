# Feature Shape: Expenses

## Problem

Owning a vehicle is expensive, and those expenses are scattered: fuel receipts, garage invoices,
parts bought online, insurance premiums, unplanned repairs. Without a single place to log them, the
user has no real visibility on what the car is actually costing — and no way to reconstruct the
financial history of vehicles they've owned in the past. The existing Check Logging feature tracks
**what** was checked; Expenses tracks **what it cost**.

## Solution (Broad Strokes)

The user can log any expense against their vehicle — with a date, a monetary amount, a category
(Service, Parts, Labor, Other), and an optional description. Expenses are fully editable (unlike
check logs which are immutable) because invoice errors are common and "delete + recreate" is an
awkward correction flow for money. The user can view the full chronological history, filter by
category, see a running total of what the vehicle has cost so far, and see a breakdown per category.
Expenses can be backdated freely, enabling reconstruction of historical data for older vehicles.

**Main UI elements:**

- Dedicated page `/expenses` with a navigation link ("Dépenses") in the main menu
- Header section showing the lifetime total and a breakdown per category
- Category filter (dropdown) applied client-side
- Chronological list of expense cards (newest first)
- Modal dialog for creating and editing expenses (reuses the Radix UI Dialog pattern from
  `LogCheckDialog`)
- Confirmation dialog for deletion (reuses existing `ConfirmDialog`)

**Data involved:**

- `Expense` entity tied directly to the vehicle (independent of check logs — fully autonomous)
- Stored in integer cents (`amountCents: Int`) to avoid float rounding errors on monetary
  calculations
- Date-only `occurredAt` field (no time component, backdating unrestricted)

## User Flow

### Adding an Expense

1. User navigates to `/expenses` from the main menu
2. User clicks "Ajouter une dépense" button
3. A modal dialog opens with:
   - Date input (defaults to today, backdating allowed, no future)
   - Amount input in euros (text input, accepts both `89,50` and `89.50`)
   - Category select (Entretien / Pièces / Main-d'œuvre / Autre)
   - Description textarea (optional, max 500 characters)
4. User submits the form
5. System validates input (Zod on frontend, class-validator + domain validation on backend)
6. System converts the amount string to integer cents before persisting
7. Modal closes, the expense appears at the top of the list, the header total updates
8. Success feedback is displayed (inline alert)

### Editing an Expense

1. User clicks "Modifier" on an expense card
2. The same modal dialog opens, pre-filled with the expense's current values
3. User edits any field and submits
4. System validates and persists the update, the card and header totals refresh
5. Success feedback is displayed

### Deleting an Expense

1. User clicks "Supprimer" on an expense card
2. A confirmation dialog appears (reuses existing `ConfirmDialog`)
3. User confirms
4. System deletes the expense, the list and header totals refresh
5. Success feedback is displayed

### Viewing History

1. User sees a chronological list of expense cards (newest first by `occurredAt`)
2. Each card shows: date, amount formatted in euros, category badge, description excerpt,
   edit/delete action buttons
3. User can select a category in the filter dropdown to narrow the list
4. Filtered total and counts update immediately (all computed client-side)

## Dependencies

**Requires:**

- Authentication (Feature 01) — expenses are private per user ✅ Done
- Vehicle Profile (Feature 02) — expenses are tied to the single user's vehicle ✅ Done
- UI Design System (Feature 03b) — DaisyUI 5, Radix UI Dialog, shared components ✅ Done

**Enables:**

- Budget (Feature 07) — will consume the total spent (may add a backend-aggregated endpoint if
  needed)
- Dashboard polish — widgets "Total ce mois" and "Dernières dépenses" to be added during the polish
  phase (see Follow-ups section below)

## What Must Exist (Backend)

### Domain Layer

**Entity:**

- `Expense` entity with behavior:
  - Encapsulates business logic for monetary, date, and description validation
  - Constructor validates invariants (amount > 0, date not in the future, description length, valid
    category)
  - Update methods enforce the same invariants
  - Properties: id, vehicleId, occurredAt, amount, category, description, createdAt, updatedAt

**Value Objects:**

- `ExpenseId` — UUID validation, immutable, equality comparison
- `OccurredAt` — date validation (required, not in the future, backdating unrestricted, date-only
  `YYYY-MM-DD`)
- `Amount` — integer cents, strictly > 0, sanity cap (e.g., 1 000 000 €), exposes conversion helpers
  (`fromEuros`, `toEuros`, `toCents`)

**Enum:**

- `ExpenseCategory = SERVICE | PARTS | LABOR | OTHER`

**Repository Interface (port):**

- Create an expense
- Find expense by ID
- Find all expenses by vehicle (ordered newest first by `occurredAt`)
- Update an expense
- Delete an expense

**Domain Exceptions:**

- `ExpenseNotFoundException`
- `InvalidExpenseException` (validation failures)

**Validation Constants:**

- Description max length (500 characters)
- Amount minimum (> 0) and sanity cap
- Valid category values

### Application Layer

**Use Cases:**

- `CreateExpenseUseCase` — receives vehicle ID + input, creates entity with validated value objects,
  saves via repository
- `UpdateExpenseUseCase` — receives vehicle ID + expense ID + partial input, loads the entity,
  applies update, persists
- `DeleteExpenseUseCase` — receives vehicle ID + expense ID, loads for ownership verification,
  deletes
- `GetExpenseByIdUseCase` — receives vehicle ID + expense ID, loads with ownership verification
- `ListExpensesByVehicleUseCase` — returns all expenses for a vehicle, sorted newest first

**Service Orchestrator:**

- Delegates to use cases, provides a unified API for the controller

**DTOs:**

- `CreateExpenseInputDto` (occurredAt, amountCents, category, description) with class-validator
  decorators referencing domain validation constants
- `UpdateExpenseInputDto` (partial fields, all optional)
- `ExpenseResponseDto` (id, vehicleId, occurredAt, amountCents, category, description, createdAt,
  updatedAt) — exposes `amountCents` as integer (frontend handles formatting)

**Application Mapper:**

- Entity → response DTO conversion (unwraps value objects to primitives)

### Infrastructure Layer

**Controller:**

- Mounted at nested route under vehicles: `/vehicles/:vehicleId/expenses`
- All endpoints verify vehicle ownership before delegating to the service
- Uses `@Session()` decorator for authentication

**Prisma Repository:**

- Implements the domain repository interface
- Handles Prisma error codes → domain exceptions (P2025 for not found)
- Uses infrastructure mapper for Prisma ↔ domain entity conversion

**Infrastructure Mapper:**

- Prisma record → domain entity (reconstructs value objects)
- Domain entity → Prisma record (unwraps value objects to primitives)

**Database Migration:**

- New `Expense` table with:
  - `id` (UUID, primary key)
  - `vehicleId` (foreign key to `Vehicle`, cascade delete when the vehicle is deleted)
  - `occurredAt` (string, date-only `YYYY-MM-DD`, same storage as `CheckLog.completedAt`)
  - `amountCents` (Int, > 0 enforced at domain level)
  - `category` (enum `ExpenseCategory`)
  - `description` (nullable string, max 500 characters)
  - `createdAt`, `updatedAt` timestamps
  - Index on `vehicleId` for efficient lookups
  - Composite index on `(vehicleId, occurredAt)` for chronological queries
- Relation added to `Vehicle` model (`expenses Expense[]`)

**Module:**

- NestJS module with `useFactory` DI pattern (consistent with CheckLogs module)
- Imports: Auth module, Vehicles module
- Exports: Expenses service (for future Budget/Dashboard consumption)

### API Endpoints

- `POST /vehicles/:vehicleId/expenses` — create expense
- `GET /vehicles/:vehicleId/expenses` — list all expenses for the vehicle (newest first)
- `GET /vehicles/:vehicleId/expenses/:id` — get single expense
- `PATCH /vehicles/:vehicleId/expenses/:id` — update expense (partial fields)
- `DELETE /vehicles/:vehicleId/expenses/:id` — delete expense

All endpoints require an authenticated session and verify vehicle ownership. Ownership failures
return 404 (not 403) to avoid leaking resource existence — consistent with the CheckLogs pattern.

### Validations

- Vehicle must exist and belong to the authenticated user
- `occurredAt` is required, must be a valid `YYYY-MM-DD` date, cannot be in the future
- `amountCents` is required, must be a positive integer, must be ≤ sanity cap
- `category` is required, must be one of the four valid values
- `description` is optional, max 500 characters
- `vehicleId` in the URL path is used for ownership check and relation binding

## What Must Exist (Frontend)

### File Naming Conventions (matching the existing `check-logs` feature structure)

The expense feature follows the exact directory and file naming conventions established by the most
recent production feature (`apps/web/src/features/check-logs/`):

```text
features/expenses/
├── api/
│   ├── expense.service.ts
│   ├── expense.service.spec.ts
│   └── index.ts
├── components/
│   ├── ExpensesContainer.tsx          # PascalCase for component files
│   ├── ExpensesContainer.spec.tsx
│   ├── ExpensesHeader.tsx
│   ├── ExpensesHeader.spec.tsx
│   ├── ExpensesFilter.tsx
│   ├── ExpensesFilter.spec.tsx
│   ├── ExpensesList.tsx
│   ├── ExpensesList.spec.tsx
│   ├── ExpenseCard.tsx
│   ├── ExpenseCard.spec.tsx
│   ├── ExpenseForm.tsx
│   ├── ExpenseForm.spec.tsx
│   ├── ExpenseFormDialog.tsx
│   ├── ExpenseFormDialog.spec.tsx
│   ├── DeleteExpenseDialog.tsx
│   ├── DeleteExpenseDialog.spec.tsx
│   ├── ExpensesEmptyState.tsx
│   ├── ExpensesEmptyState.spec.tsx
│   └── index.ts
├── hooks/
│   ├── useExpenses.ts                  # camelCase, no dot suffix
│   ├── useExpenses.spec.ts
│   └── index.ts
├── schemas/
│   ├── expense.schema.ts               # xxx.schema.ts pattern
│   ├── expense.schema.spec.ts
│   └── index.ts
├── store/
│   ├── expense.store.ts                # singular "store", xxx.store.ts pattern
│   ├── expense.store.spec.ts
│   └── index.ts
├── types/
│   ├── expense.types.ts                # xxx.types.ts pattern
│   └── index.ts
├── utils/
│   ├── amount.utils.ts                 # xxx.utils.ts pattern (matches dashboard)
│   ├── amount.utils.spec.ts
│   ├── expenseCategory.utils.ts
│   ├── expenseCategory.utils.spec.ts
│   └── index.ts
└── index.ts                            # barrel export re-exporting public surface
```

All directories follow **singular** names (`store`, `api`) as in `check-logs`. Component files are
**PascalCase**. Everything else is **camelCase** with the appropriate dotted suffix (`.service.ts`,
`.store.ts`, `.schema.ts`, `.types.ts`, `.utils.ts`).

### Types (`types/expense.types.ts`)

- `Expense` interface (id, vehicleId, occurredAt, amountCents, category, description, createdAt,
  updatedAt)
- `ExpenseCategory` union: `'SERVICE' | 'PARTS' | 'LABOR' | 'OTHER'`
- `CreateExpenseInput` interface (occurredAt, amountCents, category, description)
- `UpdateExpenseInput` interface (all fields optional)

### Validation Schemas (`schemas/expense.schema.ts`)

- Create schema:
  - `occurredAt`: string matching `YYYY-MM-DD`, refined not-in-future
  - `amountInput`: user-entered string (accepts `89,50` or `89.50`), transformed to `amountCents`
    via `parseEurosToCents`, refined > 0 and ≤ sanity cap
  - `category`: Zod enum matching the four values
  - `description`: optional string, max 500 characters
- Update schema: all fields optional (partial)
- French error messages consistent with existing schemas
- Type inference from schemas for form typing

### Utilities (`utils/`)

- `amount.utils.ts` — `formatEuros(cents: number): string` using `Intl.NumberFormat('fr-FR')` with
  currency EUR; `parseEurosToCents(input: string): number` accepting both comma and dot decimal
  separators, uses `Math.round` (not `Math.floor`) to avoid cent-loss
- `expenseCategory.utils.ts` — `CATEGORY_LABELS` (FR labels: Entretien, Pièces, Main-d'œuvre,
  Autre), `CATEGORY_OPTIONS` for the select component

Both files have companion `*.spec.ts` files covering edge cases (0, large amounts, invalid input,
rounding cases, locale variations).

### API Service (`api/expense.service.ts`)

- Typed methods: `createExpense`, `listExpenses`, `getExpense`, `updateExpense`, `deleteExpense`
- Uses existing `apiRequest` client and `handleApiResponse` helper
- Endpoints prefixed with `/api/vehicles/:vehicleId/` (Astro proxy)

### State Management (`store/expense.store.ts`, Nanostores)

- Atoms: `$expenses`, `$isLoading`, `$error`, `$categoryFilter`
- Computed:
  - `$hasExpenses`
  - `$filteredExpenses` (applies `$categoryFilter`)
  - `$totalCents` (on all expenses, ignores filter)
  - `$filteredTotalCents` (on filtered expenses)
  - `$totalsByCategory` (breakdown record `{ SERVICE: number, PARTS: number, ... }`)
- Actions: `fetchExpenses`, `createExpense`, `updateExpense`, `deleteExpense`, `setCategoryFilter`,
  `clearError`

### Custom Hook (`hooks/useExpenses.ts`)

- `useExpenses` — connects store to components
- Provides: expenses, filtered expenses, totals, loading, error, actions
- Handles fetch-on-mount and refresh-after-mutation patterns

### Pages / Routes

- `apps/web/src/pages/expenses.astro` — auth-gated Astro page (redirects to `/login` when no
  session), mounts `<ExpensesContainer client:only="react" />`
- Link "Dépenses" added to `Main.astro` navigation

### Components

**Container (smart):**

- `ExpensesContainer` — manages modes (list / create-dialog / edit-dialog / delete-confirm),
  orchestrates data fetching, handles form submission, error handling

**Presentational (dumb):**

- `ExpensesHeader` — displays the lifetime total and breakdown per category
- `ExpensesFilter` — category dropdown (uses existing `Select` component)
- `ExpensesList` — renders an array of `ExpenseCard`
- `ExpenseCard` — displays a single expense: date, formatted amount, category badge, description
  excerpt, edit/delete action buttons
- `ExpenseFormDialog` — modal Radix UI Dialog wrapping `ExpenseForm` for both create and edit modes
- `ExpenseForm` — React Hook Form + Zod resolver, fields (date, amount string, category,
  description), submit/cancel callbacks
- `DeleteExpenseDialog` — wraps existing `ConfirmDialog` for delete confirmation
- `ExpensesEmptyState` — "Aucune dépense enregistrée — ajoutez votre première dépense !" with Lucide
  icon and CTA

**Reused shared components:**

- `ConfirmDialog` (from `components/ui/`) — for delete confirmation
- `Button`, `Input`, `Label`, `Textarea`, `Select`, `FormWrapper` (from `components/ui/`)

### State & Interactions

- The create dialog is triggered by the "Ajouter une dépense" button in `ExpensesHeader` or the
  empty state
- The edit dialog is triggered by the "Modifier" button on each `ExpenseCard`, pre-filling the form
- The delete confirmation is triggered by the "Supprimer" button on each `ExpenseCard`
- After any successful mutation, the list refreshes, totals update, and inline feedback is shown
- The category filter updates the store; `$filteredExpenses` and `$filteredTotalCents` recompute
  reactively

## UI Reference

### Visual Target

The Spark prototype (`https://github.com/TituxMetal/car-repair-cost-trac`) is the design reference.
The feature uses the existing design tokens (see Design System section in `MVP.md`) and follows the
visual language already established by the Vehicle Profile, Check Types, Check Logs, and Dashboard
features.

### Layout & Structure (intent)

- **Dedicated page** `/expenses` with the standard page container width used across the app
- **Header area** at the top: page title, lifetime total, breakdown per category (visually secondary
  to the main total), and the "Ajouter une dépense" call-to-action
- **Filter bar** below the header: category dropdown, optionally with a result count
- **Expenses list**: chronological, newest first, one card per expense, full-width
- **Empty state**: centered in the main content area when no expenses exist or when the filter
  yields no results (two distinct messages)
- **Form dialog**: modal centered on desktop, full-width sheet on mobile (same behavior as existing
  dialogs)

### Content & Labels (French)

- Page title: "Mes dépenses"
- Button: "Ajouter une dépense"
- Filter label: "Filtrer par catégorie"
- Filter "all" option: "Toutes les catégories"
- Category labels: "Entretien" (SERVICE), "Pièces" (PARTS), "Main-d'œuvre" (LABOR), "Autre" (OTHER)
- Total label: "Total des dépenses"
- Empty state (no expenses): "Aucune dépense enregistrée — ajoutez votre première dépense !"
- Empty state (filter yields nothing): "Aucune dépense dans cette catégorie"
- Feedback messages: "Dépense enregistrée", "Dépense modifiée", "Dépense supprimée"
- Form field labels: "Date", "Montant", "Catégorie", "Description"
- Submit button: "Enregistrer" (create) / "Mettre à jour" (edit)
- Cancel button: "Annuler"
- Delete confirmation: "Supprimer cette dépense ? Cette action est irréversible."

### Design Tokens (semantic, from `MVP.md`)

- **primary (amber)** — primary action button ("Ajouter une dépense"), active filter state, submit
  button in the form
- **neutral (zinc)** — card backgrounds, borders, secondary text (description excerpts, metadata)
- **success (emerald)** — success feedback after create/update/delete
- **error (red)** — delete button, delete confirmation, error states
- **Category badges** — use semantic color differentiation between the four categories. The exact
  color assignment is a design decision to be made during implementation (respect the accessibility
  rule: no outline+opacity, use semantic color fills)

### Accessibility (ABSOLUTE RULES from memory)

- Form fields use `aria-describedby` pointing at their associated error message
- The dialog uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the dialog
  title (reuse the `LogCheckDialog` pattern)
- No nested max-width containers
- Category badges use semantic color fills, NOT `outline + opacity` variants
- Delete buttons clearly distinguishable from edit buttons (color + label)

### Responsiveness

- **Header**: total and breakdown stack vertically on mobile, side-by-side on desktop
- **Filter bar**: full-width select on mobile, inline on desktop
- **Expense cards**: single-column, full-width on all breakpoints
- **Card content**: date and amount on the same row, category badge adjacent to amount, description
  below, action buttons at the bottom
- **Form dialog**: full-screen sheet on mobile, centered overlay on desktop
- **Action buttons**: stack vertically on mobile, inline on desktop
- **Spacing**: reduced padding on mobile, standard on desktop (use existing utility scale)

## Follow-ups (Polish phase)

These items are explicitly deferred to the final polish phase and are NOT part of this feature. They
are documented here at the time of writing so they do not get lost.

1. **Dashboard widget: "Dépenses récentes"** — add a widget to the Dashboard page showing the total
   spent this month plus the three most recent expenses, with a link to `/expenses`. This touches
   Feature 05 code that has already been shipped — the update happens during the dashboard polish
   pass, not now.
2. **Dashboard widget: "Budget"** — will be added at the same time, driven by Feature 07 (Budget).
   Mentioned here for coherence.
3. **Backend-aggregated endpoint** — if Feature 07 (Budget) requires period-based totals (this
   month, this year), consider adding a dedicated endpoint then. Not needed for this feature.

Tracking of these follow-ups lives in `docs/PROGRESS.md` (backlog section) as the authoritative
living source. The completed Feature 05 shape is NOT modified retroactively.

## Open Questions

1. **Category badge colors** — the four categories need distinct, semantic colors. The exact
   assignment (e.g., blue for Service, orange for Parts, ...) is a visual design decision to be made
   during implementation, respecting the no-outline+opacity accessibility rule. → **Recommendation:
   decide when the header and category badges are first wired into the container** so the visual
   impact can be evaluated directly in the browser.
2. **Amount sanity cap value** — 1 000 000 € (100 000 000 cents) is a reasonable upper bound for a
   personal vehicle expense tracker. Override if it feels too low. → **Recommendation: ship with 1
   000 000 €, revisit only if a legitimate use case emerges.**
3. **Minimum amount** — strictly > 0 cents, or allow 0 (e.g., free warranty work logged for
   tracking)? → **Recommendation: strictly > 0 for MVP** (free entries can still be tracked via
   Check Logs if needed).

## Out of Scope

- Photo/file upload for receipts (deferred)
- OCR / automatic parsing of invoices
- Multi-currency support (EUR only, per `MVP.md`)
- Recurring expenses (e.g., monthly insurance premium auto-generated)
- CSV / PDF export
- Pagination (all expenses loaded in memory — acceptable for the MVP volume)
- Backend-aggregated totals per period (deferred to Feature 07 Budget if needed)
- Dashboard widget integration (deferred to polish — see Follow-ups section)
- Linking expenses to specific check logs (expenses are fully independent — if a genuine use case
  emerges later, an optional `checkLogId?` can be added without schema pain)

## Risks / Gotchas

- **Float rounding errors on money** — the whole system stores and computes in integer cents. The
  conversion functions `parseEurosToCents` and `formatEuros` must use `Math.round` (not `Math.floor`
  or `Math.trunc`) and must have exhaustive tests on rounding edge cases (0.1 + 0.2, 2.995, large
  amounts, negative inputs). This is the most error-prone area of the feature.
- **Locale parsing** — users will enter amounts with commas (`89,50`) or dots (`89.50`). The parser
  must accept both. Tests must cover both formats, plus edge cases: empty string, only separator,
  multiple separators, leading/trailing whitespace, negative sign, thousand separators (reject or
  accept?).
- **Backdating reconstruction** — the user has explicitly stated they want to reconstruct historical
  data for previously owned vehicles (potentially years in the past). There is NO lower bound on
  `occurredAt`. The only date constraint is "not in the future".
- **Date-only storage consistency** — `occurredAt` is stored as a string `YYYY-MM-DD`, consistent
  with `CheckLog.completedAt` and `nextDueAt`. This avoids timezone confusion. All comparisons and
  sorts operate on the string (which sorts correctly as ISO).
- **Cascade delete** — deleting the vehicle cascades to all expenses (Prisma `onDelete: Cascade`).
  This is consistent with `CheckType` and `CheckLog` behavior.
- **Ownership check pattern** — all endpoints verify vehicle ownership via the authenticated
  session. Failures return 404 (not 403) to avoid leaking resource existence — consistent with the
  CheckLogs module.
- **Amount sanity cap** — the 1 000 000 € cap is a sanity check, not a business rule. It prevents
  catastrophic mis-entries (e.g., accidentally typing 8 950 000 instead of 89,50).
- **Description nullability** — always handled as `string | undefined` in TypeScript, never
  `string | null`, for consistency with the rest of the project.
- **Editability and audit trail** — expenses are fully editable (unlike check logs). There is no
  audit trail of changes for the MVP. If tracking invoice amendment history becomes important later,
  a separate audit log can be added without schema changes.
- **Frontend-only filtering performance** — all expenses are loaded in memory and filtered / totaled
  client-side via nanostores computed atoms. This is fine for dozens or even hundreds of expenses.
  If a user ever accumulates thousands, pagination or backend filtering becomes necessary — but this
  is explicitly out of scope for the MVP.
- **Multi-vehicle readiness** — `Vehicle` is currently 1:1 with `User`, but the query
  `listExpensesByVehicle` and the nested controller route `/vehicles/:vehicleId/expenses` are
  already multi-vehicle ready. No refactoring will be needed when multi-vehicle support is added.
