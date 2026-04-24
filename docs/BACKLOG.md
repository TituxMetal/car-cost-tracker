# Backlog

Deferred items that are not in active scope. Grouped by theme. Items covered by an existing feature
shape are NOT listed here — they live in the shape.

---

## Cross-cutting API — domain exceptions to HTTP status mapping (medium priority)

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

## From Feature 01 PR review (low priority)

- [ ] `VehicleContainer`: add fallback `return null` at end for defensive rendering
- [ ] `VehicleContainer`: surface fetch errors to the user instead of showing empty state
- [ ] `VehicleContainer`: replace `vehicle!.id` non-null assertions with guard clauses
- [ ] `apiRequest`: handle empty-body responses (204 / 205) explicitly instead of catching JSON
      parse errors

## From Feature 06 PR review (low priority)

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
- [ ] Expenses: single alert source of truth in `ExpensesContainer` — currently store `$error` and
      local `serverError` can both render on mutation failure, producing duplicate alerts
- [ ] Expenses: stricter `occurredAt` calendar validation in schema — `Date.parse` normalises
      impossible dates (e.g. `2026-02-30` → `2026-03-02`), so invalid calendar dates slip through
      when bypassing the native date input

## From Feature 07 Block 1 review (low priority)

- [ ] Budget: revisit controller / use-case ownership split when multi-vehicle lands — current
      design does a double vehicle lookup (controller `verifyVehicleOwnership` + each use case's
      `vehicleService.getVehicleByUser(userId)`). Harmless under the 1:1 user-vehicle constraint,
      but will need to mirror the Expense pattern (verify once in controller, pass `vehicleId`
      through) once users own more than one vehicle.
- [ ] Budget: align period error messages — `BUDGET_VALIDATION.PERIOD.MESSAGE` says "Budget period
      must be MONTHLY or ANNUAL" (used by the DTO) while `InvalidBudgetException` thrown from the
      entity says "Invalid budget period". Unify for grep-ability and consistent user feedback.
- [ ] Budget: add explicit no-op test for `BudgetEntity.updateBoth({})` — currently covered only in
      spirit by the amount-only / period-unchanged paths.

## From Feature 07 Block 2 review (low priority)

- [ ] Budget: `getBudget` swallows any HTTP 500 whose body matches the Nest default
      `{ statusCode: 500, message: 'Internal server error' }` and treats it as "no budget defined".
      The workaround is needed because the backend currently returns 500 for
      `BudgetNotFoundException` (no global `ExceptionFilter` yet — see the cross-cutting item
      above). Remove the 500 branch in `budget.service.ts` once the ExceptionFilter maps
      `BudgetNotFoundException` to HTTP 404.
- [ ] Budget / Expenses: extract a shared `useServerError()` helper to cover the mutation-error
      `catch` branches currently unreached by tests (`BudgetContainer.handleCreate/Update/Delete`
      catches rely on `$error` from the store; `ExpensesContainer` keeps a local `serverError`). The
      test harness (`waitFor` on `role=alert` inside a Radix portal) needs pinning down before the
      spec can settle — the flaky attempt was dropped during Block 2.

## Documentation (optional, future)

- [ ] Consider adding a short "About this document" blurb to `docs/MVP.md` and to each feature shape
      describing their respective roles and authority (optional, UX improvement for future sessions)

---

## Items covered by active feature shapes (not listed above)

Kept here as pointers so nothing disappears:

- **Visual refresh of the whole product (tokens, primitives, per-feature restyle, responsive audit,
  dashboard Budget + Recent Expenses widgets, collapse of nested max-width wrappers)** →
  `docs/features/09-visual-refresh.md`
- **Admin ability to create / verify / reset-password users without email** →
  `docs/features/08-admin-onboarding.md`
