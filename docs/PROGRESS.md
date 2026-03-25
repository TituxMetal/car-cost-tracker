# Progress Tracking

---

## Feature 04: Check Logging

### Block 1: Database + Domain (Phases 1-2) — `feature/check-logging-domain`

#### Phase 1: Database & Types Foundation

- [ ] Prisma schema: CheckLog model + migration
- [ ] Frontend types: CheckLog, CheckStatus, CheckStatusSummary
- [ ] Backend validation constants
- [ ] Frontend Zod schema + tests

#### Phase 2: Backend Domain Layer

- [ ] CheckLogId value object + tests
- [ ] CompletedAt value object + tests
- [ ] CheckLog entity + tests
- [ ] Domain exceptions (CheckLogNotFound, InvalidCheckLog)
- [ ] Repository interface (ICheckLogRepository)

---

### Block 2: Application + Infrastructure + API (Phases 3-5) — `feature/check-logging-backend`

#### Phase 3: Application DTOs & Mapper

- [ ] CreateCheckLog DTO + tests
- [ ] GetCheckLog DTO + tests
- [ ] CheckStatusSummary DTO + tests
- [ ] Application mapper + tests

#### Phase 4: Application Use Cases & Service

- [ ] CreateCheckLog use case + tests
- [ ] ListCheckLogsByVehicle use case + tests
- [ ] GetCheckLog use case + tests
- [ ] DeleteCheckLog use case + tests
- [ ] GetCheckStatusSummary use case + tests
- [ ] CheckLog service + tests

#### Phase 5: Infrastructure + Frontend API

- [ ] Infrastructure mapper + tests
- [ ] Prisma repository + tests
- [ ] Frontend API service + tests
- [ ] CheckLog controller + tests
- [ ] CheckStatus controller + tests (separate route prefix)
- [ ] CheckLogs module + app.module registration

---

### Block 3: State + Components (Phases 6-7) — `feature/check-logging-frontend`

#### Phase 6: Frontend State & Hook

- [ ] Nanostores store + tests
- [ ] Custom hook (useCheckLogs) + tests

#### Phase 7: Frontend UI Components

- [ ] CheckStatusBadge + tests
- [ ] LogCheckForm + tests
- [ ] LogCheckDialog + tests
- [ ] CheckLogCard + tests
- [ ] CheckLogList + tests
- [ ] CheckTypeFilter + tests
- [ ] DeleteCheckLogDialog + tests
- [ ] CheckLogContainer + tests

---

### Block 4: Integration (Phase 8) — `feature/check-logging-integration`

#### Phase 8: Integration & Enhancement

- [ ] Enhanced CheckTypeCard (status badge + "Enregistrer" button) + updated tests
- [ ] Enhanced CheckTypeList (forward status + onLog props) + updated tests
- [ ] Enhanced CheckTypeContainer (status fetching + log modal + success feedback) + updated tests
- [ ] Astro page: /check-logs
- [ ] Navigation link: "Historique" in Main.astro
- [ ] Feature barrel exports

---

## Backlog — Future Improvements

### From Feature 01 PR review (low priority)

- [ ] VehicleContainer: add fallback `return null` at end for defensive rendering
- [ ] VehicleContainer: surface fetch errors to user instead of showing empty state
- [ ] VehicleContainer: replace `vehicle!.id` non-null assertions with guard clauses
- [ ] apiRequest: handle empty-body responses (204/205) explicitly instead of catching JSON parse
      errors
