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

## Cross-cutting frontend — date-only `YYYY-MM-DD` timezone safety (low priority)

- [ ] Unify date-only handling on the web app. JS parses `'YYYY-MM-DD'` strings as **UTC midnight**,
      but most call sites read them back with local getters (`getDate`, `getMonth`, `getFullYear`,
      `setHours(0,0,0,0)`), causing an off-by-one display in negative-offset timezones (Americas).
      Invisible in `Europe/Paris` (UTC+1/+2) — observable for any user west of UTC. A correct helper
      already exists at `apps/web/src/features/dashboard/utils/date.utils.ts::daysFromNow`
      (UTC-based) but is not shared. Plan: create `apps/web/src/lib/date.ts` with `parseDateOnly` /
      `formatDateOnly` / `formatDayMonth` / `addDays` (all UTC-safe), then migrate the affected
      sites: `check-logs/CheckLogCard` (`formatDate`, `deriveStatus`), `check-types/CheckTypeCard`
      (`formatDayMonth`, `computeProchain`), `check-logs/LogCheckForm` (`formatPanelDate`,
      `computeNextDue`), plus `vehicles/utils/formatDate.ts`, `expenses/utils/date.utils.ts`,
      `auth/SessionList`, `admin/UserManagement`. Flagged by Copilot on PR #55 (Visual Refresh —
      Block 4 / Checks).

## Cross-cutting frontend — date display format harmonisation (medium priority)

- [ ] **Pick one canonical date format per context and migrate every surface to it.** The product
      currently ships at least 5 distinct date renderings across 5 components, with no shared
      decision behind any of them:
  - `LastEntryCard.formatLogDate` → `YYYY.MM.DD` (dots, ISO order)
  - `VehicleActivePanel.formatRecordedAt` → `DD.MM.YYYY` (dots, French order)
  - `RecentExpensesPanel` → raw `YYYY-MM-DD` (dashes, ISO order)
  - `SystemStatusPanel` / `SessionList` → `DD/MM/YYYY` via `toLocaleDateString('fr-FR')` (slashes,
    French order)
  - `UserManagement` → `toLocaleDateString()` default (browser-locale dependent — different format
    per visitor)

  Plan: decide on **two** formats only — one machine-readable ISO `YYYY-MM-DD` for technical
  surfaces (logs, debug, sort keys), one human-readable `DD MMM YYYY` (e.g. `18 avr. 2026`) for
  every UX surface; expose them from the planned `apps/web/src/lib/date.ts` (already scheduled in
  the timezone-safety entry above) so the migration unifies correctness _and_ presentation in one
  pass. Side-benefit: the human-readable format saves 4-5 characters vs ISO, which would give
  `RecentExpensesPanel` rows breathing room on narrow viewports.

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

## Vehicle / mileage history (post Visual Refresh)

- [ ] **Mileage Log feature** — backend entity
      `MileageLog (id, vehicleId, mileage, recordedAt,     source: 'MANUAL_UPDATE' | 'CHECK_LOG')` +
      Prisma migration. Write a row on every `vehicle.updateMileage` call AND on every
      `check-log.create` call (capturing the vehicle's current mileage at the time of the check).
      Frontend reads via a real `useMileageHistory` hook backed by a service call, replacing the
      Block 3 frontend-only `localStorage` stub on `MileageHistoryCard`. Survives across devices and
      browsers; complements check logs as the primary source of mileage history. Required because
      `CheckLog` does not currently record `mileageAtCheck` and `Vehicle.mileage` is overwritten on
      each update — no historical signal exists today. Defer until Visual Refresh ships
      (frontend-only contract per `docs/features/09-visual-refresh.md`).

## Check logs — per-log mileage capture (post Visual Refresh)

- [ ] **Add `mileage` field to `CheckLog`** — schema (Zod + DTO), Prisma migration, persistence, and
      `CreateCheckLogSchema` form input. The V01 mockup for `/check-logs` shows an `ODO` column on
      every row (`block-4-check-logs-history-desktop.png`) and a `KILOMÉTRAGE` input in the
      `LogCheckDialog` (`block-4-check-log-dialog-desktop.png`). The Visual Refresh plan rule #5 (no
      schema modifications) deliberately stopped at the frontend, so: - `CheckLogCard` ODO column
      shows `—` placeholder - `LogCheckForm` omits the KILOMÉTRAGE input The backend pass to add the
      field unlocks both surfaces. Coordinate with the parallel `MileageLog` feature (post Visual
      Refresh) — both entities want to capture mileage at a point in time, decide whether to persist
      via `CheckLog.mileage` (denormalised) or by writing a `MileageLog` row on each
      `CheckLog.create` (normalised, one source of truth).

## Layout — profile avatar dropdown outside-click (Block 1 follow-up)

- [ ] **Profile avatar dropdown does not close on outside click** — desktop top-bar avatar menu in
      `apps/web/src/layouts/Main.astro` opens on click but stays open when clicking elsewhere on the
      page (or in empty space). Should close on outside click + on Escape, mirroring the pattern
      used by Radix dialogs / DaisyUI dropdowns elsewhere. Surfaced during Block 4 (Checks) browser
      smoke test on 2026-04-27. Scope: `Main.astro` script block — likely a missing document-level
      listener or a daisy `dropdown` open-state hand-rolled instead of using `<details>` with
      `summary` toggle. Quick fix branch suggested: `fix/profile-dropdown-outside-click`.

## Dashboard — fold `/budget` page into the BudgetPanel (post Visual Refresh)

- [ ] **Consolidate `/budget` page into the dashboard `BudgetPanel`** — Phase 16 of Feature 09 ships
      `BudgetPanel` as a read-only KPI card in the dashboard sidebar (mensuel + annuel sections,
      `Modifier →` link out to `/budget`). The longer-term plan is to fold `/budget` page CRUD
      capabilities (create / edit / delete) into the panel itself so the dedicated route can go
      away. Decision deferred until the user sees the shipped panel in production context. Source:
      `~/.claude/plans/car-cost-tracker-09-visual-refresh.md:1727-1732`.

## UI / dialog button consistency (post Visual Refresh)

- [ ] **`ConfirmDialog` action buttons full-width on mobile** — currently `Annuler` / confirm
      buttons inside `<div className='modal-action'>` keep their natural width even on small
      viewports, which is inconsistent with the in-page action buttons that all expand to
      `w-full md:w-auto` since Block 3 (Vehicles). Touching `ConfirmDialog` cascades on every
      consumer (`DeleteVehicleDialog`, `DeleteCheckTypeDialog`, `DeleteCheckLogDialog`,
      `DeleteExpenseDialog`, `DeleteBudgetDialog`, `DeleteAccountDialog`, `ResetPasswordDialog`,
      etc.) — defer to a dedicated cross-feature pass once the visual refresh ships.

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
