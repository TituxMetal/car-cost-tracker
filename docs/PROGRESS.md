# Progress Tracking

Current state only. Deferred items live in [`BACKLOG.md`](./BACKLOG.md).

---

## Feature 09: Visual Refresh

- Feature shape: `docs/features/09-visual-refresh.md`
- Implementation plan: `~/.claude/plans/car-cost-tracker-09-visual-refresh.md`
- Scope: V01 "Cluster" direction across every shipped screen — theme + fonts + 2 primitives
  (`Gauge`, `TelltaleLight`) + restructured layout (desktop top-nav + mobile bottom tab bar) +
  per-feature class refresh + 2 net-new dashboard widgets (Budget, Recent Expenses) closing MVP Core
  §5. Frontend-only, zero backend changes. Responsive + a11y + Lighthouse verification is Definition
  of Done per phase — no separate QA block.

### Block 1: Foundation — `feature/visual-refresh-foundation`

#### Phase 1: Self-host fonts + globals.css swap + Layout preload

- [ ] `apps/web/public/fonts/{oxanium,jetbrains-mono}/` populated with `woff2` + `OFL.txt`
- [ ] `apps/web/src/styles/globals.css` replaced with handoff tokens + `@font-face` +
      `:focus-visible`
- [ ] `apps/web/src/layouts/Main.astro` `<head>` preloads `Oxanium-SemiBold` +
      `JetBrainsMono-Regular`

#### Phase 2: `Gauge` primitive (refactored from handoff to remove inline `style`)

- [ ] `apps/web/src/components/ui/Gauge.tsx` + spec — `role='meter'`, 270° arc, no inline `style`

#### Phase 3: `TelltaleLight` primitive

- [ ] `apps/web/src/components/ui/TelltaleLight.tsx` + spec — `role='status'` / `role='alert'`

#### Phase 4: `components/ui/index.ts` barrel update

- [ ] Export `Gauge`, `GaugeProps`, `GaugeStatus`, `TelltaleLight`, `TelltaleLightProps`,
      `TelltaleStatus`

#### Phase 5: `Button` `warning` variant + cluster base classes

- [ ] `Button.tsx` adds `warning` variant + `font-display uppercase tracking-wider` baseline
- [ ] `Button.spec.tsx` adds warning variant test

#### Phase 6: Refresh shared UI primitives

- [ ] `Input` / `Label` / `Textarea` / `Select` / `FormWrapper` / `DialogShell` / `ConfirmDialog` +
      each spec

#### Phase 7: Restructure layouts — desktop top-nav + mobile bottom tab bar (V1 mockup)

- [ ] `Main.astro` rewritten — desktop top bar with `COST.LOG` brand + horizontal nav + avatar
      dropdown; mobile context bar (greeting + avatar); fixed bottom tab bar (5 tabs: DASH / AUTO /
      CONTRÔLES / LOGS / DÉPENSES); no hamburger anywhere
- [ ] `AdminLayout.astro` admin sub-nav adopts cluster type
- [ ] `MenuIcon` removed if no other consumer remains
- [ ] Inner-feature `max-width` containers collapsed (single layout-level `max-w-7xl`)

### Block 2: Auth — `feature/visual-refresh-auth`

#### Phase 8: `AuthContainer` + `LoginForm` + `SignupForm` + specs

- [ ] Markup preserved, classes updated

#### Phase 9: `ForgotPasswordContainer` + `ResetPasswordContainer` + `VerifyEmailContainer` + `VerificationPendingContainer` + `SessionList` + specs

- [ ] Markup preserved, classes updated

### Block 3: Vehicles — `feature/visual-refresh-vehicles`

#### Phase 10: `VehicleProfile` + `QuickMileageUpdate` + `VehicleContainer` + specs

- [ ] Markup preserved, classes updated; 2-col grid on desktop view mode; delete button has
      `aria-describedby` pointing to `.sr-only` warning

#### Phase 11: `VehicleForm` + `DeleteVehicleDialog` + `VehicleEmptyState` + specs

- [ ] Markup preserved, classes updated

### Block 4: Checks (Types + Logs) — `feature/visual-refresh-checks`

#### Phase 12: `CheckStatusBadge` (with telltale dot) + `CheckTypeFilter` + specs

- [ ] Status badge prefixed by `aria-hidden` circular dot, semantic colours preserved

#### Phase 13: Check-types surface refresh (6 components + 6 specs)

- [ ] `CheckTypeCard` / `CheckTypeForm` / `CheckTypeList` / `CheckTypeContainer` /
      `DeleteCheckTypeDialog` / `SuggestedCheckTypes`

#### Phase 14: Check-logs surface refresh (6 components + 6 specs)

- [ ] `CheckLogCard` / `CheckLogList` / `CheckLogContainer` / `LogCheckForm` / `LogCheckDialog` /
      `DeleteCheckLogDialog`

### Block 5: Dashboard + new widgets — `feature/visual-refresh-dashboard`

#### Phase 15: Refresh existing dashboard components (7 components + specs)

- [ ] `DashboardContainer` / `VehicleSummaryCard` / `StatusOverview` (with `Gauge`) /
      `ActionItemsList` / `ActionItemCard` / `RecentActivityList` / `DashboardEmptyState`

#### Phase 16: New `BudgetWidget` component + spec

- [ ] Composes `useBudget` (`monthlyStatus`), renders nothing if `!hasBudget`, links to `/budget`

#### Phase 17: New `RecentExpensesWidget` component + spec

- [ ] Composes `useExpenses` + `$spentThisMonthCents`, renders nothing if `!hasExpenses`, links to
      `/expenses`

#### Phase 18: Wire both widgets into `DashboardContainer` + spec update

- [ ] Both widgets render inside `vehicle && hasCheckTypes` branch; barrel updated

### Block 6: Expenses — `feature/visual-refresh-expenses`

#### Phase 19: List + filter + cards + empty state (6 components + specs)

- [ ] `ExpensesContainer` / `ExpensesHeader` / `ExpensesFilter` / `ExpensesList` / `ExpenseCard` /
      `ExpensesEmptyState`

#### Phase 20: Forms + dialogs (3 components + specs)

- [ ] `ExpenseForm` / `ExpenseFormDialog` / `DeleteExpenseDialog`

### Block 7: Budget — `feature/visual-refresh-budget`

#### Phase 21: Container + header + status + empty state (4 components + specs)

- [ ] `BudgetContainer` / `BudgetHeader` / `BudgetStatus` (linear `<progress>` + `.sr-only` per
      status) / `BudgetEmptyState`

#### Phase 22: Forms + dialogs (3 components + specs)

- [ ] `BudgetForm` / `BudgetFormDialog` / `DeleteBudgetDialog`

### Block 8: Profile + Admin — `feature/visual-refresh-profile-admin`

#### Phase 23: Profile main views (4 components + specs)

- [ ] `ProfileView` / `EditProfileContainer` / `EditProfileForm` / `ChangePasswordForm`

#### Phase 24: Profile danger zone (2 components + specs)

- [ ] `DeleteAccountSection` / `DeleteAccountDialog`

#### Phase 25: Admin surfaces (8 components + specs)

- [ ] `AdminDashboard` / `UserList` / `UserManagement` / `UserDetailContainer` / `CreateUserForm` /
      `CreateUserDialog` / `ResetPasswordForm` / `ResetPasswordDialog`

---

## Not started

- **MVP Full** — multi-car support, vehicle switcher, optional public profile. Feature shapes to be
  written later (post Visual Refresh).
