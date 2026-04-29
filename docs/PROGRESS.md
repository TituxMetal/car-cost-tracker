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

### Block 4: Checks (Types + Logs) — `feature/visual-refresh-checks` ✅

#### Phase 12: `CheckStatusBadge` (with telltale dot) + `CheckTypeFilter` + specs

- [x] `CheckStatusBadge.tsx`: prefix label with `aria-hidden` circular telltale `<span>`
      (`inline-block h-2 w-2 rounded-full bg-current`), cluster mono uppercase tracking, semantic
      badge colours preserved (no outline+opacity), label `Jamais effectué` shortened to `Jamais` to
      match mockup + dashboard StatusOverview consistency
- [x] `CheckTypeFilter.tsx`: verified — already inherits cluster typography from refreshed `Label`
      primitive (no code change needed)

#### Phase 13: Check-types surface refresh (6 components + 6 specs) + `Button` `destructive-outline` variant

- [x] `Button.tsx`: `variant='destructive-outline'` (`btn-outline btn-error`) + spec. Block 3 local
      overrides (`VehicleProfile` Supprimer + `VehicleContainer` cancel) deferred to Block 8 per
      plan option
- [x] `CheckTypeCard.tsx`: status-driven left border via `borderByStatus` map, `<h3>` cluster +
      `CheckStatusBadge` in title row, 3-col mono mini-table `INTERV. · DERNIER · PROCHAIN`, footer
      with `Journaliser` outline + edit/delete icon buttons (kept inline rather than overflow `…` to
      preserve a11y + spec selectors); date format DD.MM
- [x] `CheckTypeForm.tsx`: cluster legends inherit from cluster `Label`, intervalle input gets
      `font-mono text-lg`
- [x] `CheckTypeList.tsx`: thin Fragment wrapper — container owns the grid; replaced
      `statuses: Map<string, CheckStatus>` with `summaries: Map<string, CheckStatusSummary>` to
      forward the dates needed for the mini-table
- [x] `CheckTypeContainer.tsx`: kicker `CONFIGURATION · TYPES DE CONTRÔLE`, composite h1
      `{count} contrôles programmés`, `+ Nouveau type` button (`w-full md:w-auto`), grid
      `md:grid-cols-2 xl:grid-cols-3` + `serverError`/`successMessage` banner pattern, cluster
      kicker + h1 above create/edit form modes, `Annuler` migrated to `destructive-outline`, passes
      full `CheckType` + `status` to `LogCheckDialog`
- [x] `DeleteCheckTypeDialog.tsx`: inherited cluster `ConfirmDialog`, no code change required
- [x] `SuggestedCheckTypes.tsx`: kicker `// Suggestions rapides`, chip-style outline buttons with
      mono interval suffix, `flex flex-wrap gap-2`

#### Phase 14: Check-logs surface refresh (6 components + 6 specs)

- [x] `CheckLogContainer.tsx`: kicker `ARCHIVES · JOURNAL DES CONTRÔLES`, composite h1
      `{count} entrées · {periodLabel}` (periodLabel derives from selected check type filter or
      defaults to `Tous les contrôles`), NO top-right action button, `serverError` banner via hook's
      existing `error` state
- [x] `CheckLogList.tsx`: Path A — section wraps a `<header>` desktop column band
      (`md:grid-cols-[80px_1fr_120px_1fr_120px_40px]`) over a stack of cards; mobile card stack
      preserved
- [x] `CheckLogCard.tsx`: status derived from `nextDueAt` vs today (overdue/due-soon/on-time
      heuristic at 7-day threshold), status-driven left border, mono `<time>` on dates, ODO column
      shows `—` placeholder (no `mileage` field on `CheckLog` schema — pure schema rule respected),
      responsive: card stack on mobile + grid row on desktop, hover lift mobile only
- [x] `LogCheckForm.tsx`: bordered cluster panel for the selected check type (name + status badge +
      `Tous les X jrs`), date input `font-mono text-lg`, NEW `Prochain contrôle calculé` info panel
      (`bg-success/10 border-l-2 border-l-success`) computed live from selected type's
      `intervalDays` + entered date — KILOMÉTRAGE input from mockup omitted (no `mileage` field on
      `CreateCheckLogSchema` — strict rule #5)
- [x] `LogCheckDialog.tsx`: cluster kicker `// Nouvelle entrée` + DialogShell-rendered h2
      `Journaliser un contrôle`, accepts new optional `checkType` + `status` props passed to form,
      footer `Annuler` (`destructive-outline`) + `Enregistrer l'entrée`
      (`w-full md:w-auto     md:ml-auto`)
- [x] `DeleteCheckLogDialog.tsx`: inherited cluster `ConfirmDialog`, no code change required

#### Phase 14 documented deviations from plan (intentional)

- **`CheckLogCard` markup** — `<ul>/<li>/<section>` from the original card-style markup are dropped
  because the new layout is a tabular row (DATE / TYPE / ODO / NOTES / PROCHAIN / ×) on desktop, not
  a list of metadata items inside a card body. `<article>` (kept), `<header>` (added, wraps dot+h3,
  `md:contents` so it dissolves into the grid on desktop), `<footer>` (added, wraps delete button,
  same `md:contents` trick), `<h2>` demoted to `<h3>` (subordinate to page h1 in a list of rows),
  `<time>` for both dates (kept). Plan strict rule #1 ("never replace semantic elements with
  `<div>`") respected for `<article>/<header>/<footer>/<time>`; `<ul>/<li>/<section>` removal is a
  redesign-driven change, not a generic `<div>`-ification
- **`CheckStatusBadge` `never` color** — uses `badge-info` (cyan/teal) per the V01 mockup pixels
  (`block-4-check-types-desktop.png` JAMAIS badge is clearly cyan). Plan text recipe said
  `badge-neutral`; the WARNING preamble's "VISUAL REFERENCE OVERRIDES TEXT RECIPES" rule arbitrates
  in favour of pixels
- **`LogCheckDialog` kicker placement** — kicker `// Nouvelle entrée` rendered BELOW the
  `Dialog.Title` h2 (not above as in mockup). Trade-off: keeps a single accessible h2 owned by Radix
  `Dialog.Title`. Inverting to render the kicker above would require a `kicker?` prop on
  `DialogShell` — deferred to Block 8 polish (BACKLOG candidate). The `-mt-2` margin pulls the
  kicker close to the title to mitigate the visual divergence
- **`LogCheckForm` KILOMÉTRAGE input** — omitted. The mockup shows a 2-col DATE/KM grid in the
  dialog body; `CreateCheckLogSchema` has no `mileage` field and strict rule #5 forbids schema
  modification. Tracked in `BACKLOG.md` (`Check logs — per-log mileage capture`)
- **`CheckLogList` ODO column placeholder** — every row shows `—`. Same root cause as KILOMÉTRAGE
  omission. Tracked in `BACKLOG.md`
- **`SuggestedCheckTypes` element choice** — uses native `<button>` instead of the project `Button`
  primitive to escape DaisyUI's `btn` height/hover constraints (the chip is conceptually a
  tile-trigger, not a `btn`). Local override is justified at first occurrence; if 2+ more chip
  surfaces appear (FuelLog filter chips, Expense category chips), extract a shared `Chip` primitive
  then. Logged for future review

#### Phase 14 cross-cutting fixes (surfaced during browser smoke test)

- [x] `CheckStatusBadge.tsx`: added `inline-flex shrink-0 whitespace-nowrap` to prevent badge wrap
      inside constrained card title rows
- [x] `Textarea.tsx`: cluster-rewritten to match `Input` primitive (was still inheriting daisy
      `textarea` class from Block 1 pre-cluster styling); spec updated for new error class +
      typography
- [x] `DashboardContainer.spec.tsx`: stale assertions for old `Enregistrer un contrôle: Vidange`
      title + `^Enregistrer$` submit button updated to new `Journaliser un contrôle` h2 +
      `Enregistrer l'entrée` submit name (Block 5 still owns the dashboard refresh proper)

### Block 5: Dashboard + new widgets — `feature/visual-refresh-dashboard` ✅

> **Naming**: planned `BudgetWidget` / `RecentExpensesWidget` shipped as `BudgetPanel` /
> `RecentExpensesPanel` — `Panel` suffix matches the rest of the cluster surfaces.
>
> **Phase 18 layout deviation**: planned bottom-row `lg:grid-cols-2` containing both panels was
> abandoned after browser test — the row left a visible gap below `LastEntryCard` in the sidebar
> (the right column ran longer). Final layout: `BudgetPanel` lives at the bottom of the sidebar
> after `LastEntryCard` (now showing both `Mensuel` and `Annuel` sections), `RecentExpensesPanel`
> lives at the bottom of the main column after `RecentTimeline`. The two columns balance.
>
> **Category badges**: `RecentExpensesPanel` uses `CATEGORY_TINT_BASE` + `CATEGORY_TINT_CLASS`
> (cluster palette: accent / primary / secondary / muted) from
> `~/features/expenses/utils/expenseCategory.utils.ts`. Legacy `CATEGORY_BADGE_CLASS` remains for
> the un-refreshed `ExpenseCard` / `ExpensesHeader`; Block 6 will switch them over.

#### Phase 15: Restructure dashboard layout + 8 cluster surfaces

- [x] `DashboardContainer.tsx`: new layout `lg:grid-cols-[360px_1fr]` with sidebar
      (`VehicleActivePanel` → `TelltaleGrid` → `LastEntryCard`) + main (`HealthSummary` →
      `UpcomingChecksGrid` → `RecentTimeline`); mobile-only `ActionItemsList` banner above the grid;
      `sr-only` h1; loading/error/empty banners preserved; LogCheckDialog wiring preserved
- [x] `VehicleSummaryCard.tsx` → **renamed to** `VehicleActivePanel.tsx`: kicker `VÉHICULE ACTIF` +
      h2 `{make} {model}` + sub mono `{year} · {engineType}` + dl ODO / + DEPUIS (mono mileage +
      delta from `useMileageHistory`) + CTA `+ Mettre à jour kilométrage` (warning outline)
- [x] `TelltaleGrid.tsx`: NEW — 1-col grid of dot+label rows for top-6 worst-status check-types
      (hand-rolled markup; `TelltaleLight` primitive's API didn't fit `CheckStatus` enum + lucide
      icon requirement), dimmed when status is `on-time` or `never`. Plan called for `grid-cols-2`
      but the 360px sidebar wraps labels awkwardly in 2-col — single column matches the rendered
      reality on both desktop sidebar and mobile full-width
- [x] `RecentActivityList.tsx` → **renamed to** `LastEntryCard.tsx`: single most-recent log preview
      (date · ODO em-dash · type · notes), `Aucune entrée pour le moment.` fallback
- [x] `StatusOverview.tsx` → **renamed to** `HealthSummary.tsx`: huge mono `{score}/100` + 4 inline
      stats (EN RETARD/BIENTÔT/À JOUR/JAMAIS) + 40-segment bar (status-coloured) + `.sr-only`
      narration
- [x] `UpcomingChecksGrid.tsx`: NEW — 4-col `Gauge` grid (Block-1 primitive) per check-type, header
      kicker + `Journaliser →` action that opens `LogCheckDialog` with no preselected type
- [x] `RecentTimeline.tsx`: NEW — scatter timeline of logs in [-30, +30] days window, axis + labels
      `J-30 · AUJ. · J+30`, status-coloured dots
- [x] `ActionItemsList.tsx`: cluster refresh, mobile-only (`lg:hidden`), kicker
      `À TRAITER · {N} ENTRÉES`
- [x] `ActionItemCard.tsx`: cluster row pattern (status-coloured circle + h3 + status sub +
      ChevronRight), full-width button
- [x] `DashboardEmptyState.tsx`: cluster panel restyle, lucide icon + h2 display + sub mono +
      warning outline CTA
- [x] `useDashboard.ts` (+ spec): expose `healthScore` (`100 - 15·overdue - 8·dueSoon - 3·never`,
      clamped [0,100]) and `tellTaleSummaries` (top-6 sorted by status priority)
- [x] `components/index.ts`: drop renamed exports, add the 3 new components

#### Phase 16: New `BudgetPanel` component + spec

- [x] `BudgetPanel.tsx` (+ spec): composes `useBudget` from `~/features/budget` barrel, renders
      nothing if `!hasBudget`. Top-level kicker `Budget` + single `Modifier →` link to `/budget`,
      then two stacked sections (`Mensuel` + `Annuel`) each with spent/target in `font-mono` +
      DaisyUI `<progress>` status-coloured + `.sr-only` narration. Both sections always render — the
      two views give the user mensuel vs annuel context at a glance

#### Phase 17: New `RecentExpensesPanel` component + spec

- [x] `RecentExpensesPanel.tsx` (+ spec): composes `useExpenses` + `$spentThisMonthCents` directly
      via `useStore`, renders nothing if `!hasExpenses`, otherwise cluster card with kicker
      `Dépenses récentes` + total mois + 3 most recent rows (bare inline rows; `ExpenseCard` density
      didn't fit) + cluster-tinted category badges + `Voir tout →` link to `/expenses` (consistent
      with `LastEntryCard` / `MileageHistoryCard` and avoids the `DÉPENSES` redundancy with the
      kicker on narrow viewports)

#### Phase 18: Wire both panels into `DashboardContainer` + spec update

- [x] `DashboardContainer.tsx`: `BudgetPanel` rendered at the bottom of the sidebar after
      `LastEntryCard`, `RecentExpensesPanel` rendered at the bottom of the main column after
      `RecentTimeline` (deviation from the planned `lg:grid-cols-2` bottom row — see block header
      note); `window.location.assign('/vehicle')` swapped for `redirect('/vehicle')` from
      `~/utils/navigation`
- [x] `DashboardContainer.spec.tsx`: assertions for `BudgetPanel` (sidebar) + `RecentExpensesPanel`
      (main column) presence
- [x] `components/index.ts`: exports `BudgetPanel` + `RecentExpensesPanel`

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
