# Progress Tracking

---

## Feature 07: Budget

- Feature shape: `docs/features/07-budget.md`
- Implementation plan: `~/.claude/plans/car-cost-tracker-07-budget.md`

### Block 1: Backend (Phases 1-5) — `feature/budget-backend`

#### Phase 1: Shared Amount refactor + Prisma schema & migration ✅

- [x] Relocate `Amount` value object and `AMOUNT_VALIDATION` constants from `expenses/domain/` to
      `shared/domain/value-objects/` and `shared/domain/validation/`; update all Expense imports,
      tests green
- [x] Prisma schema + migration (`Budget` model, `BudgetPeriod` enum, 1:1 Vehicle relation via
      `@unique`, cascade delete)

#### Phase 2: Backend domain layer ✅

- [x] `BudgetId` value object + tests
- [x] `Budget` validation constants (period values + messages)
- [x] `Budget` entity + tests (mutable with focused update methods, shared `Amount` VO)
- [x] Repository interface
- [x] Domain exceptions (`BudgetNotFoundException`, `InvalidBudgetException`)

#### Phase 3: Backend application DTOs & mapper ✅

- [x] `UpsertBudget` DTO + tests (class-validator, references shared `AMOUNT_VALIDATION`)
- [x] `GetBudget` response DTO
- [x] Application mapper + tests

#### Phase 4: Backend application use cases & service ✅

- [x] `GetBudgetByVehicle` use case + tests
- [x] `UpsertBudget` use case + tests (idempotent create-or-update orchestration)
- [x] `DeleteBudget` use case + tests
- [x] Budget service (facade) + tests

#### Phase 5: Backend infrastructure & module ✅

- [x] Infrastructure mapper + tests
- [x] Prisma repository + tests (Prisma `upsert` semantics)
- [x] Budget controller + tests (3 endpoints under `/vehicles/:vehicleId/budget`: `GET`, `PUT`
      upsert, `DELETE`)
- [x] Budgets module (DI wiring)
- [x] App module registration + smoke test

### Block 2: Frontend outside-in (Phases 6-11) — `feature/budget-frontend`

#### Phase 6: Frontend shared utils refactor + page shell + navigation ✅

- [x] Relocate `amount.utils.ts` (and its spec) from `features/expenses/utils/` to `shared/utils/`;
      update Expense imports, tests green
- [x] Astro page `/budget` (auth-gated)
- [x] Navigation link "Budget" in `Main.astro` (desktop + mobile, after "Dépenses")
- [x] Minimal `BudgetContainer` stub + test (visible in browser)

#### Phase 7: Frontend plumbing (types, schema, API, Expense store extension) ✅

- [x] Types (`Budget`, `BudgetPeriod`, `UpsertBudgetInput`, `BudgetStatus`, `BudgetProgressState`)
- [x] Zod schema `upsertBudgetSchema` + tests (transform amount string → cents, period enum)
- [x] API service + tests (`GET`, `PUT`, `DELETE`, `getBudget` handles 404 as `null`)
- [x] Extend Expense store with `$spentThisMonthCents` and `$spentThisYearCents` computed atoms +
      tests (mocked clock, ISO prefix comparison, cross-year boundary cases)

#### Phase 8: Frontend budget utilities (period + status) ✅

- [x] `budgetPeriod.utils.ts` (`PERIOD_LABELS`, `PERIOD_OPTIONS`) + tests
- [x] `budgetStatus.utils.ts` (`deriveMonthlyTargetCents`, `deriveAnnualTargetCents`,
      `computeProgressState`, `computeBudgetStatus`) + tests (threshold boundaries 0.80 / 1.00,
      rounding on annual-to-monthly division, zero-target guard)

#### Phase 9: Budget store + hook + first render (status + empty state) ✅

- [x] Budget store (atoms, computed `$monthlyStatus` / `$annualStatus` integrating Expense store
      spent atoms, actions) + tests
- [x] `useBudget` hook + tests (fetch-on-mount, triggers `useExpenses`)
- [x] `BudgetEmptyState` component + test
- [x] `BudgetStatus` dual-panel component + test (monthly + annual panels, derivation hint,
      state-driven colour, progress bar cap)
- [x] Wire into `BudgetContainer` (empty state vs status rendering, loading/error paths)

#### Phase 10: Form + FormDialog + create flow ✅

- [x] `BudgetForm` (RHF + Zod, amount input + period select) + tests
- [x] `BudgetFormDialog` (Radix Dialog wrapper) + tests
- [x] Wire create flow in `BudgetContainer` (empty-state CTA opens dialog, success feedback, error
      handling) + container spec

#### Phase 11: Edit + delete + header (complete feature) ✅

- [x] `BudgetHeader` component + test (page title + Modifier/Supprimer buttons)
- [x] Wire edit flow in `BudgetContainer` (reuse `BudgetFormDialog` pre-filled)
- [x] `DeleteBudgetDialog` (wraps existing `ConfirmDialog`) + test
- [x] Wire delete flow in `BudgetContainer` (container transitions back to empty state)
- [x] Container full-flow tests (create / edit / delete with feedback)
- [x] Feature barrel exports (`features/budget/index.ts`)

### Block 3: Docs & tracking (Phase 12)

- [ ] PROGRESS.md final pass (mark all Feature 07 phases complete)

---

## Backlog — Future Improvements

### Polish phase — Visual refresh "V1 Cluster"

- Handoff preserved at `docs/polish/visual-refresh-handoff/` (theme tokens, `Gauge` +
  `TelltaleLight` primitives, component-by-component restyling plan)
- Integration intentionally deferred to the MVP Polish phase so Expenses (Feature 06) and Budget
  (Feature 07) components are built once against the new theme, not re-skinned twice
- [ ] Extend the handoff to cover Expenses/Budget components before integration

### Dashboard — Polish phase (deferred from Feature 06 Expenses)

- [ ] Dashboard widget "Dépenses récentes": total dépensé ce mois + 3 dernières dépenses + lien vers
      `/expenses`
- [ ] Dashboard widget "Budget" (driven by Feature 07): spent vs budget with visual indicator

### Documentation (optional, future)

- [ ] Consider adding a short "About this document" blurb to `docs/MVP.md` and to each feature shape
      describing their respective roles and authority (optional, UX improvement for future sessions)

### From Feature 01 PR review (low priority)

- [ ] VehicleContainer: add fallback `return null` at end for defensive rendering
- [ ] VehicleContainer: surface fetch errors to user instead of showing empty state
- [ ] VehicleContainer: replace `vehicle!.id` non-null assertions with guard clauses
- [ ] apiRequest: handle empty-body responses (204/205) explicitly instead of catching JSON parse
      errors

### From Feature 06 PR review (low priority)

- [ ] Expenses: centralize `AMOUNT_MAX_CENTS` in an `EXPENSE_VALIDATION` constant object mirroring
      backend convention (currently hardcoded in `expense.schema.ts`)
- [ ] Expenses: single source of truth for category values — the literal list
      `['SERVICE', 'PARTS', 'LABOR', 'OTHER']` is duplicated between `expense.schema.ts` and
      `expenseCategory.utils.ts`
- [ ] Expenses: format dates in French locale on `ExpenseCard` (currently raw ISO `2026-03-15`)
- [ ] Expenses: decide barrel policy for `utils/index.ts` — currently `amount.utils` is imported via
      deep paths while `expenseCategory.utils` goes through the barrel
- [ ] Expenses: move `normalizeDescription` from `ExpensesContainer` to a utility + add unit test
- [ ] Expenses: add a test for the `serverError` local state display path (mutation failure)
- [ ] Page-level layout: collapse nested max-width wrappers (`Main` + page `container` + feature
      container) across all pages — part of V1 Cluster visual refresh, not a per-feature fix
- [ ] Expenses: single alert source of truth in `ExpensesContainer` — currently store `$error` and
      local `serverError` can both render on mutation failure, producing duplicate alerts
- [ ] Expenses: stricter `occurredAt` calendar validation in schema — `Date.parse` normalises
      impossible dates (e.g. `2026-02-30` → `2026-03-02`), so invalid calendar dates slip through
      when bypassing the native date input

### From Feature 07 Block 2 review (low priority)

- [ ] Budget: `getBudget` swallows any HTTP 500 whose body matches the Nest default
      `{ statusCode:     500, message: 'Internal server error' }` and treats it as "no budget
      defined". The workaround is needed because the backend currently returns 500 for
      `BudgetNotFoundException` (no global `ExceptionFilter` yet — see the cross-cutting item
      below). Remove the 500 branch in `budget.service.ts` once the ExceptionFilter maps
      `BudgetNotFoundException` to HTTP 404.
- [ ] Budget / Expenses: extract a shared `useServerError()` helper to cover the mutation-error
      `catch` branches currently unreached by tests (`BudgetContainer.handleCreate/Update/Delete`
      catches rely on `$error` from the store; `ExpensesContainer` keeps a local `serverError`). The
      test harness (waitFor on role=alert inside a Radix portal) needs pinning down before the spec
      can settle — the flaky attempt was dropped during Block 2.

### From Feature 07 Block 1 review (low priority)

- [ ] Budget: revisit controller/use-case ownership split when multi-vehicle lands — current design
      does a double vehicle lookup (controller `verifyVehicleOwnership` + each use case's
      `vehicleService.getVehicleByUser(userId)`). Harmless under the 1:1 user-vehicle constraint,
      but will need to mirror the Expense pattern (verify once in controller, pass `vehicleId`
      through) once users own more than one vehicle.
- [ ] Budget: align period error messages — `BUDGET_VALIDATION.PERIOD.MESSAGE` says "Budget period
      must be MONTHLY or ANNUAL" (used by the DTO) while `InvalidBudgetException` thrown from the
      entity says "Invalid budget period". Unify for grep-ability and consistent user feedback.
- [ ] Budget: add explicit no-op test for `BudgetEntity.updateBoth({})` — currently covered only in
      spirit by the amount-only / period-unchanged paths.

### Cross-cutting API — domain exceptions to HTTP status mapping (medium priority)

- [ ] Add a global `ExceptionFilter` in `apps/api/src/main.ts` (or a dedicated shared filter) to map
      domain exceptions to HTTP responses. Currently every module's domain exception
      (`VehicleNotFoundException`, `ExpenseNotFoundException`, `BudgetNotFoundException`,
      `CheckTypeNotFoundException`, `CheckLogNotFoundException`, `UserNotFoundException`,
      `Invalid*Exception`, etc.) extends plain `Error`, and there is no `useGlobalFilters` nor
      `@Catch` anywhere. NestJS therefore serialises these as HTTP 500 instead of the intended 404 /
      400 / 422. The filter should match on exception name (or via a shared `DomainException` base
      class that carries an intended HTTP status) so that the domain layer remains decoupled from
      Nest. Scope: API-wide refactor — blocks proper REST semantics once any feature relies on
      specific error codes. Flagged by Copilot on PR #49 (Budget backend).
