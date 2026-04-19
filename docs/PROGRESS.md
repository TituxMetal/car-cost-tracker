# Progress Tracking

---

## Feature 06: Expenses

- Feature shape: `docs/features/06-expenses.md`
- Implementation plan: `~/.claude/plans/car-cost-tracker-06-expenses.md`

### Block 1: Backend (Phases 1-5) — `feature/expenses-backend`

#### Phase 1: Database schema & migration ✅

- [x] Prisma schema + migration (Expense model, ExpenseCategory enum, Vehicle relation, indexes)

#### Phase 2: Backend domain layer ✅

- [x] ExpenseId value object + tests
- [x] OccurredAt value object + tests (date-only, backdating allowed, no future)
- [x] Amount value object + tests (integer cents, Math.round, sanity cap)
- [x] Expense validation constants
- [x] Expense entity + tests (mutable with update methods)
- [x] Repository interface + domain exceptions

#### Phase 3: Backend application DTOs & mapper ✅

- [x] CreateExpense DTO + tests
- [x] UpdateExpense DTO (partial) + tests
- [x] GetExpense DTO + tests
- [x] Application mapper + tests

#### Phase 4: Backend application use cases & service ✅

- [x] CreateExpense use case + tests
- [x] UpdateExpense use case + tests (partial update orchestration)
- [x] DeleteExpense use case + tests
- [x] GetExpenseById use case + tests
- [x] ListExpensesByVehicle use case + tests
- [x] Expense service (facade) + tests

#### Phase 5: Backend infrastructure & module ✅

- [x] Infrastructure mapper + tests
- [x] Prisma repository + tests
- [x] Expense controller + tests (5 endpoints under `/vehicles/:vehicleId/expenses`)
- [x] Expenses module (DI wiring)
- [x] App module registration

### Block 2: Frontend outside-in (Phases 6-11) — `feature/expenses-frontend`

#### Phase 6: Page shell + navigation

- [ ] Astro page `/expenses` (auth-gated)
- [ ] Navigation link "Dépenses" in Main.astro (desktop + mobile)
- [ ] Minimal ExpensesContainer stub + tests (visible in browser)

#### Phase 7: Frontend plumbing (types, schemas, utils, API, store)

- [ ] Types + category labels utils + tests
- [ ] Amount utils (formatEuros, parseEurosToCents) + tests
- [ ] Zod schemas (create + update with transform) + tests
- [ ] API service + tests
- [ ] Nanostores store (atoms, computed money, actions) + tests

#### Phase 8: Hook + list + card (first render)

- [ ] useExpenses hook + tests
- [ ] ExpenseCard component + tests
- [ ] ExpensesList component + tests
- [ ] ExpensesEmptyState component
- [ ] Wire into ExpensesContainer (real data visible)

#### Phase 9: Form + create dialog

- [ ] ExpenseForm (RHF + Zod transform) + tests
- [ ] ExpenseFormDialog (Radix) + tests
- [ ] Wire "Ajouter" button + create flow in container

#### Phase 10: Edit + delete

- [ ] Wire edit flow (reuse ExpenseFormDialog in edit mode)
- [ ] DeleteExpenseDialog + wire delete flow + tests

#### Phase 11: Header (totals + breakdown) + filter

- [ ] ExpensesHeader (total + category breakdown + "Ajouter" button) + tests
- [ ] ExpensesFilter (category dropdown) + tests
- [ ] Wire header & filter into container (complete feature)

### Block 3: Docs & tracking (Phase 12)

- [ ] Feature barrel exports (`features/expenses/index.ts`)
- [ ] PROGRESS.md final pass (mark all Feature 06 phases complete)

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
