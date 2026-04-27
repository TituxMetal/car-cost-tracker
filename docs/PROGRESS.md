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

### Block 1: Foundation — `feature/visual-refresh-foundation` ✅

#### Phase 1: Self-host fonts + globals.css swap + Layout preload

- [x] `apps/web/public/fonts/{oxanium,jetbrains-mono}/` populated with `woff2` + `OFL.txt`
- [x] `apps/web/src/styles/globals.css` replaced with handoff tokens + `@font-face` +
      `:focus-visible`
- [x] `apps/web/src/layouts/Main.astro` `<head>` preloads `Oxanium-SemiBold` +
      `JetBrainsMono-Regular`

#### Phase 2: `Gauge` primitive (refactored from handoff to remove inline `style`)

- [x] `apps/web/src/components/ui/Gauge.tsx` + spec — `role='meter'`, 270° arc, no inline `style`

#### Phase 3: `TelltaleLight` primitive

- [x] `apps/web/src/components/ui/TelltaleLight.tsx` + spec — `role='status'` / `role='alert'`

#### Phase 4: `components/ui/index.ts` barrel update

- [x] Export `Gauge`, `GaugeProps`, `GaugeStatus`, `TelltaleLight`, `TelltaleLightProps`,
      `TelltaleStatus`

#### Phase 5: `Button` `warning` variant + cluster base classes

- [x] `Button.tsx` adds `warning` variant + `font-display uppercase tracking-wider` baseline
- [x] `Button.spec.tsx` adds warning variant test

#### Phase 6: Refresh shared UI primitives

- [x] `DialogShell.tsx` — cluster panel + mobile full-sheet behaviour. Other primitives (`Input` /
      `Label` / `Textarea` / `Select` / `FormWrapper` / `ConfirmDialog`) inherit the cluster look
      from the new theme tokens (`--radius-field`, `--color-base-200`, `font-sans` = Oxanium) —
      verified, no code change required

#### Phase 7: Restructure layouts — desktop top-nav + mobile bottom tab bar (V1 mockup)

- [x] `Main.astro` rewritten — desktop top bar with `COST.LOG` brand + horizontal nav + avatar
      dropdown; mobile context bar (greeting + avatar); fixed bottom tab bar (5 tabs: DASH / AUTO /
      CONTRÔLES / LOGS / DÉPENSES); no hamburger anywhere
- [x] `AdminLayout.astro` admin sub-nav adopts cluster type
- [x] `MenuIcon` removed if no other consumer remains
- [ ] Inner-feature `max-width` wrappers — deferred to per-feature blocks (2-8) where each container
      is class-refreshed in its own block, avoids merge conflicts with later work

### Block 2: Auth — `feature/visual-refresh-auth` ✅

#### Phase 8: `AuthContainer` + login/signup surfaces + specs

- [x] New `Auth.astro` layout (no Main chrome) hosts the auth pages full-bleed
- [x] `AuthContainer.tsx` rewritten as V1Login split-screen: `AuthHero` editorial column (kicker
      `// IGNITION` + 5xl/6xl headline + tag + version footer) + form column (`// ACCÈS PILOTE`
      kicker + h1 `Connexion` / `Inscription` + inlined `Input` fields + full-width button
      `Mettre le contact →` / `Créer le dashboard →` + switch link + `SystemStatusPanel` bottom)
- [x] New helpers: `AuthShell.tsx`, `AuthHeader.tsx`, `AuthHero.tsx`, `SystemStatusPanel.tsx` (mono
      labels, telltale dots, plain `API en ligne · {date} {time}` / `Better Auth · OK` /
      `Prisma · OK` — no hardcoded versions)
- [x] Removed obsolete `LoginForm.tsx` / `SignupForm.tsx` + specs (their fields are inlined via
      `Input` directly in `AuthContainer`)
- [x] All UX strings translated to French; `AuthContainer.spec.tsx` rewritten for FR labels +
      heading + `SystemStatusPanel` assertions
- [x] `pages/auth/index.astro` switched to `Auth.astro`

#### Phase 9: `ForgotPasswordContainer` + `ResetPasswordContainer` + `VerifyEmailContainer` + `VerificationPendingContainer` + `SessionList` + specs

- [x] Four standalone containers reuse the V1 split-screen pattern (`AuthHero` left, form column
      right with cluster kicker + h1 + status-aware notice/form blocks); kickers
      `// MOT DE PASSE OUBLIÉ`, `// RÉINITIALISER`, `// VÉRIFICATION`, `// EN ATTENTE`
- [x] `VerificationPendingContainer` info text wrapped in `info` notice box with `role='note'`;
      success/error inline alerts colour-tagged
- [x] `VerifyEmailContainer` status-driven copy table (verifying / success / error / no-token) with
      semantic notice boxes
- [x] `SessionList.tsx` aligned to cluster vocabulary: square `bg-base-200 border-base-300` panel,
      mono row labels, `Révoquer` / `Tout déconnecter` buttons in FR, current-session badge
      `Session actuelle`
- [x] All four pages (`forgot-password`, `reset-password`, `verify-email`, `verification-pending`)
      switched to `Auth.astro` layout
- [x] All five specs translated to FR + adapted to new structure
- [x] Post-review fixes: `Input` / `Label` / `FormWrapper` rewritten cluster-only (variant prop
      removed, daisy classes gone, cluster typography baked in); shared `AuthShell.tsx` +
      `AuthHeader.tsx` collapse the previously duplicated shell/kicker/heading constants across 5
      containers; `<main>` landmark added on every auth surface; `SystemStatusPanel` shows live
      `{date} {time}` (placeholder until mount to avoid Astro hydration mismatch, 1-minute refresh)
      and dropped versions to plain `OK` to stop lying about hardcoded numbers; `SessionList` revoke
      actions guarded against double-click via per-token + bulk in-flight states; `auth.schema.ts`
      object-form normalised + dead signup `name` field dropped (Better Auth payload preserved via
      `useAuth.ts:76` mapping `name: data.username`); `pages/profile/sessions.astro` lightly
      polished as a side-effect of `SessionList` testing — full Phase 23 refresh still pending

### Block 3: Vehicles — `feature/visual-refresh-vehicles` ✅

#### Phase 10: `VehicleProfile` + `QuickMileageUpdate` + `VehicleContainer` + new `MileageHistoryCard` + history utilities

- [x] `VehicleProfile.tsx` restructured per the mockup `Profil véhicule (vue)` (Image #3): kicker
      `Fiche véhicule`, h1 display `{make} {model}`, composed sub line `— {year} · {engineType}`
      (handles `engineType === null`), striped photo placeholder, mono uppercase `<dt>` kickers +
      sans-serif `<dd>` grid, footer with `Modifier fiche` and `Supprimer` (the latter carries
      `aria-describedby` to a `.sr-only` warning)
- [x] `QuickMileageUpdate.tsx` rebuilt as `COMPTEUR KILOMÉTRIQUE` card: kicker, inner panel with
      current km in `font-mono text-primary` + label, `Nouvelle valeur` input (`font-mono text-lg`),
      live delta below when watched value `> currentMileage`, full-width `Valider` button — copy
      change `Mettre à jour` → `Valider`
- [x] `VehicleContainer.tsx`: view mode renders `lg:grid-cols-3` with `lg:col-span-2` profile +
      `<aside lg:col-span-1>` stack (compteur + history); standalone `<h1>` dropped in view mode
      (lives in `VehicleProfile`); cluster kickers above create / edit form cards; nested
      `max-w-2xl` wrappers removed across the 3 modes; mileage-history `append` wired after each
      successful `updateMileage` (only when `delta > 0`)
- [x] New `MileageHistoryCard.tsx` + spec — kicker, empty state mono dimmed, populated entries 3-col
      grid (`<time>` · mileage · `+ delta`), capped at 10 visible
- [x] New `useMileageHistory.ts` hook + spec, `mileageHistory.utils.ts` + spec, and atom-only
      `mileageHistory.store.ts` — frontend-only stub backed by `localStorage` keyed
      `mileage-history:{vehicleId}`, capped at 20 entries (the real cross-device backend feature
      lives in `BACKLOG.md` as `Mileage Log`, post-Visual-Refresh)
- [x] Spec updates: `VehicleContainer` view-mode h1 assertion split (year moves to sub line),
      `Valider` / `Nouvelle valeur` copy adjustments, `toHaveAccessibleDescription` on delete,
      `MileageHistoryCard` empty state assertion + populated history after submit

#### Phase 11: `VehicleForm` + `DeleteVehicleDialog` + `VehicleEmptyState` + specs

- [x] `VehicleForm.tsx`: daisy `fieldset` / `fieldset-legend` classes replaced with cluster mono
      uppercase typography on legends; kilométrage input gets `font-mono text-lg` for the odometer
      screen look
- [x] `DeleteVehicleDialog.tsx`: no code change — inherits the cluster `ConfirmDialog` already
      shipped in Block 1; verification only
- [x] `VehicleEmptyState.tsx`: cluster kicker `Créer votre fiche` above the icon, mono dimmed body,
      primary amber CTA

#### Block 3 implementation notes

- `VehicleProfile` destructive button uses `className='btn-outline'` locally (option b in the plan)
  to keep the change surgical; existing `Button` `destructive` variant remains solid `btn-error` and
  unchanged for the rest of the codebase. Same pattern used for the cancel buttons in
  `VehicleContainer` create/edit modes.

### Block 4: Checks (Types + Logs) — `feature/visual-refresh-checks`

#### Phase 12: `CheckStatusBadge` (with telltale dot) + `CheckTypeFilter` + specs

- [ ] `CheckStatusBadge.tsx`: prefix label with `aria-hidden` circular telltale `<span>`
      (`inline-block h-2 w-2 rounded-full bg-current`), semantic badge colours preserved (no
      outline+opacity)
- [ ] `CheckTypeFilter.tsx`: adopt refreshed `Select` primitive, label uses
      `font-display uppercase tracking-wide text-sm`

#### Phase 13: Check-types surface refresh (6 components + 6 specs) + `Button` `destructive-outline` variant

- [ ] `Button.tsx`: introduce `variant='destructive-outline'` (`btn-outline btn-error`) + spec —
      must land before any card refresh in this phase; Block 3 local overrides (`VehicleProfile`
      Supprimer + `VehicleContainer` cancel) migrated in same commit OR deferred to Block 8
- [ ] `CheckTypeCard.tsx`: status-driven left border
      (`border-l-error`/`warning`/`success`/`base-content/30`), `<h3>` cluster + `CheckStatusBadge`
      in title row, 3-col mono mini-table `INTERV. · DERNIER · PROCHAIN`, footer split
      (`JOURNALISER` outline ≈ 90% + `…` overflow ≈ 10%)
- [ ] `CheckTypeForm.tsx`: cluster mono uppercase legends, kilométrage / interval input gets
      `font-mono text-lg`
- [ ] `CheckTypeList.tsx`: thin wrapper renders children grid; container owns the grid
- [ ] `CheckTypeContainer.tsx`: kicker `CONFIGURATION · TYPES DE CONTRÔLE`, composite h1
      `{count} contrôles programmés`, `+ NOUVEAU TYPE` button (`w-full md:w-auto`), `serverError`
      banner pattern (4 mutations: create / update / delete / suggest-create), grid
      `md:grid-cols-2 xl:grid-cols-3`
- [ ] `DeleteCheckTypeDialog.tsx`: inherits cluster `ConfirmDialog`; verification only
- [ ] `SuggestedCheckTypes.tsx`: chip-style buttons
      `btn btn-sm btn-outline font-display uppercase tracking-wide`, `flex flex-wrap gap-2`

#### Phase 14: Check-logs surface refresh (6 components + 6 specs)

- [ ] `CheckLogContainer.tsx`: kicker `ARCHIVES · JOURNAL DES CONTRÔLES`, composite h1
      `{count} entrées · {periodLabel}`, NO top-right action button (logs created from Dashboard /
      `CheckTypeCard`), `serverError` banner pattern (3 mutations: create / update / delete)
- [ ] `CheckLogList.tsx`: desktop = TABLE-style via Path A (CSS-grid on `<ul>` keeping `<article>`
      semantics); mobile = card stack — fall back to Path B (real `<table>`) only if pixels don't
      match after coding
- [ ] `CheckLogCard.tsx`: status-driven left border, lucide icons `text-primary`, `font-mono` on
      date / ODO / prochain, `hover:-translate-y-0.5` mobile only
- [ ] `LogCheckForm.tsx`: enriched type selector (status badge + interval inline via radix
      `Popover` + `<select>` fallback), 2-col DATE / KILOMÉTRAGE grid (`font-mono     text-lg`), NEW
      `PROCHAIN CONTRÔLE CALCULÉ` info panel computed live from `intervalDays` + entered date
- [ ] `LogCheckDialog.tsx`: cluster header (kicker `// NOUVELLE ENTRÉE` + h2
      `Journaliser un contrôle`), full-width primary on mobile (`w-full md:w-auto md:ml-auto`)
- [ ] `DeleteCheckLogDialog.tsx`: inherits cluster `ConfirmDialog`; verification only

### Block 5: Dashboard + new widgets — `feature/visual-refresh-dashboard`

> Recipes below are the legacy class-swap version. `block-5-dashboard-{desktop,mobile}.png`
> screenshots are on disk — **amend recipes against pixels before coding** (Block 4 precedent: 7+
> markup/logic discrepancies surfaced when amended).

#### Phase 15: Refresh existing dashboard components (7 components + specs)

- [ ] `DashboardContainer.tsx`: cluster refresh
- [ ] `VehicleSummaryCard.tsx`: cluster refresh
- [ ] `StatusOverview.tsx`: cluster refresh, integrates `Gauge` primitive (Block 1)
- [ ] `ActionItemsList.tsx`: cluster refresh
- [ ] `ActionItemCard.tsx`: cluster refresh
- [ ] `RecentActivityList.tsx`: cluster refresh
- [ ] `DashboardEmptyState.tsx`: cluster refresh

#### Phase 16: New `BudgetWidget` component + spec

- [ ] `BudgetWidget.tsx`: composes `useBudget` (`monthlyStatus`), renders nothing if `!hasBudget`,
      links to `/budget`

#### Phase 17: New `RecentExpensesWidget` component + spec

- [ ] `RecentExpensesWidget.tsx`: composes `useExpenses` + `$spentThisMonthCents`, renders nothing
      if `!hasExpenses`, links to `/expenses`

#### Phase 18: Wire both widgets into `DashboardContainer` + spec update

- [ ] `DashboardContainer.tsx`: render both widgets inside `vehicle && hasCheckTypes` branch + spec
      update
- [ ] `components/index.ts`: export `BudgetWidget` + `RecentExpensesWidget`

### Block 6: Expenses — `feature/visual-refresh-expenses`

> No V01 mockup captured yet — capture from `index.html` V1Expenses or ask the user before coding.
> **Amend recipes against pixels** (Block 4 precedent).

#### Phase 19: List + filter + cards + empty state (6 components + specs)

- [ ] `ExpensesContainer.tsx`: cluster refresh
- [ ] `ExpensesHeader.tsx`: cluster refresh
- [ ] `ExpensesFilter.tsx`: cluster refresh
- [ ] `ExpensesList.tsx`: cluster refresh
- [ ] `ExpenseCard.tsx`: cluster refresh
- [ ] `ExpensesEmptyState.tsx`: cluster refresh

#### Phase 20: Forms + dialogs (3 components + specs)

- [ ] `ExpenseForm.tsx`: cluster refresh
- [ ] `ExpenseFormDialog.tsx`: cluster refresh
- [ ] `DeleteExpenseDialog.tsx`: inherits cluster `ConfirmDialog`; verification only

### Block 7: Budget — `feature/visual-refresh-budget`

> No V01 mockup captured yet — capture from `index.html` V1Budget or ask the user before coding.
> **Amend recipes against pixels** (Block 4 precedent).

#### Phase 21: Container + header + status + empty state (4 components + specs)

- [ ] `BudgetContainer.tsx`: cluster refresh
- [ ] `BudgetHeader.tsx`: cluster refresh
- [ ] `BudgetStatus.tsx`: cluster refresh, linear `<progress>` + `.sr-only` per status
- [ ] `BudgetEmptyState.tsx`: cluster refresh

#### Phase 22: Forms + dialogs (3 components + specs)

- [ ] `BudgetForm.tsx`: cluster refresh
- [ ] `BudgetFormDialog.tsx`: cluster refresh
- [ ] `DeleteBudgetDialog.tsx`: inherits cluster `ConfirmDialog`; verification only

### Block 8: Profile + Admin — `feature/visual-refresh-profile-admin`

> No V01 mockup captured yet — capture from `index.html` V1Profile / V1Admin or ask the user before
> coding. **Amend recipes against pixels** (Block 4 precedent).

#### Phase 23: Profile main views (4 components + specs)

- [ ] `ProfileView.tsx`: cluster refresh
- [ ] `EditProfileContainer.tsx`: cluster refresh
- [ ] `EditProfileForm.tsx`: cluster refresh
- [ ] `ChangePasswordForm.tsx`: cluster refresh

#### Phase 24: Profile danger zone (2 components + specs)

- [ ] `DeleteAccountSection.tsx`: cluster refresh
- [ ] `DeleteAccountDialog.tsx`: inherits cluster `ConfirmDialog`; verification only

#### Phase 25: Admin surfaces (8 components + specs)

- [ ] `AdminDashboard.tsx`: cluster refresh
- [ ] `UserList.tsx`: cluster refresh
- [ ] `UserManagement.tsx`: cluster refresh
- [ ] `UserDetailContainer.tsx`: cluster refresh
- [ ] `CreateUserForm.tsx`: cluster refresh
- [ ] `CreateUserDialog.tsx`: inherits cluster `DialogShell`; verification only
- [ ] `ResetPasswordForm.tsx`: cluster refresh
- [ ] `ResetPasswordDialog.tsx`: inherits cluster `DialogShell`; verification only

---

## Not started

- **MVP Full** — multi-car support, vehicle switcher, optional public profile. Feature shapes to be
  written later (post Visual Refresh).
