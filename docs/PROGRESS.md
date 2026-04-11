# Progress Tracking

---

## Feature 05: Dashboard ✅

### Block 1: Shell → Data → First Sections (Phases 1-4) — `feature/dashboard` ✅

#### Phase 1: Page Shell & Navigation ✅

- [x] Minimal DashboardContainer + barrel exports
- [x] Update index.astro (auth-gated dashboard)
- [x] Update Main.astro (add "Tableau de bord" nav link)

#### Phase 2: Types & Date Utilities ✅

- [x] Dashboard types (StatusCounts, ActionItem)
- [x] Date utility functions (daysFromNow, formatDaysLabel) + tests

#### Phase 3: Hook, Empty States & Container Wiring ✅

- [x] DashboardEmptyState + tests
- [x] useDashboard hook + tests
- [x] DashboardContainer wiring + tests

#### Phase 4: Vehicle Summary & Status Overview ✅

- [x] VehicleSummaryCard + tests
- [x] StatusOverview + tests
- [x] Wire into DashboardContainer

---

### Block 2: Action Items + Recent Activity (Phases 5-6) — `feature/dashboard` ✅

#### Phase 5: Action Items & Quick-Log ✅

- [x] ActionItemCard + tests
- [x] ActionItemsList + tests
- [x] Wire into DashboardContainer + LogCheckDialog integration

#### Phase 6: Recent Activity & Polish ✅

- [x] RecentActivityList + tests
- [x] Wire into DashboardContainer & finalize barrel exports

---

## Backlog — Future Improvements

### From Feature 01 PR review (low priority)

- [ ] VehicleContainer: add fallback `return null` at end for defensive rendering
- [ ] VehicleContainer: surface fetch errors to user instead of showing empty state
- [ ] VehicleContainer: replace `vehicle!.id` non-null assertions with guard clauses
- [ ] apiRequest: handle empty-body responses (204/205) explicitly instead of catching JSON parse
      errors
