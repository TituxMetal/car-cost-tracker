# Progress Tracking

---

## Feature 04: Check Logging

### Block 1: Database + Domain (Phases 1-2) — `feature/check-logging-domain`

#### Phase 1: Database & Types Foundation

- [x] Prisma schema: CheckLog model + migration
- [x] Frontend types: CheckLog, CheckStatus, CheckStatusSummary
- [x] Backend validation constants
- [x] Frontend Zod schema + tests

#### Phase 2: Backend Domain Layer

- [x] CheckLogId value object + tests
- [x] CompletedAt value object + tests
- [x] CheckLog entity + tests
- [x] Domain exceptions (CheckLogNotFound, InvalidCheckLog)
- [x] Repository interface (ICheckLogRepository)

---

### Block 2: Application + Infrastructure + API (Phases 3-5) — `feature/check-logging-backend`

#### Phase 3: Application DTOs & Mapper

- [x] CreateCheckLog DTO + tests
- [x] GetCheckLog DTO + tests
- [x] CheckStatusSummary DTO + tests
- [x] Application mapper + tests

#### Phase 4: Application Use Cases & Service

- [x] CreateCheckLog use case + tests
- [x] ListCheckLogsByVehicle use case + tests
- [x] GetCheckLog use case + tests
- [x] DeleteCheckLog use case + tests
- [x] GetCheckStatusSummary use case + tests
- [x] CheckLog service + tests

#### Phase 5: Infrastructure + Frontend API

- [x] Infrastructure mapper + tests
- [x] Prisma repository + tests
- [x] Frontend API service + tests
- [x] CheckLog controller + tests
- [x] CheckStatus controller + tests (separate route prefix)
- [x] CheckLogs module + app.module registration

---

### Block 3: State + Components (Phases 6-7) — `feature/check-logging-frontend`

#### Phase 6: Frontend State & Hook

- [x] Nanostores store + tests
- [x] Custom hook (useCheckLogs) + tests

#### Phase 7: Frontend UI Components

- [x] CheckStatusBadge + tests
- [x] LogCheckForm + tests
- [x] LogCheckDialog + tests
- [x] CheckLogCard + tests
- [x] CheckLogList + tests
- [x] CheckTypeFilter + tests
- [x] DeleteCheckLogDialog + tests
- [x] CheckLogContainer + tests

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
