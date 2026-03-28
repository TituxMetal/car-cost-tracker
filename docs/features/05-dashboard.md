# Feature Shape: Dashboard

## Problem

Users currently navigate between separate pages (vehicle, check types, history) with no central
overview. They can't see at a glance whether their vehicle maintenance is on track, which checks are
overdue, or what was last performed. The dashboard solves this by aggregating the most important
information into a single hub — the first thing users see after login.

## Solution (Broad Strokes)

A single-page dashboard that serves as the authenticated user's home screen. It displays:

- **Vehicle identity** — make, model, year, mileage at a glance
- **Check status overview** — counts by status category (on-time, due soon, overdue, never
  performed)
- **Action items** — overdue and upcoming checks with quick-log buttons
- **Recent activity** — last few check logs performed
- **Budget overview** — spent vs budget (placeholder until Features 06-07 are built)

The dashboard is read-only with quick-action shortcuts (log a check, navigate to detailed pages). It
composes existing data — no new domain entities are needed.

## User Flow

### First Visit (No Vehicle)

1. User logs in, lands on dashboard
2. Dashboard shows an empty state: "Aucun véhicule enregistré"
3. Call-to-action button redirects to `/vehicle` to create one

### First Visit (Vehicle, No Check Types)

1. User logs in, lands on dashboard
2. Vehicle summary card is displayed
3. Check status section shows empty state: "Aucun type de contrôle défini"
4. Call-to-action button redirects to `/check-types`

### Normal Use

1. User logs in → lands on dashboard
2. Sees vehicle summary (make, model, year, current mileage)
3. Sees status overview: 4 stat indicators showing count per status category
4. Sees action items section: overdue checks first (error), then due-soon checks (warning), each
   with a "Enregistrer" quick-log button
5. Sees recent activity: last 5 check logs with date, check type name, and notes excerpt
6. (Future) Sees budget bar showing spent vs budget for the current month

### Quick Log from Dashboard

1. User clicks "Enregistrer" on an overdue or upcoming check in the action items section
2. The existing log check modal opens (reuses LogCheckDialog from check-logs feature)
3. User logs the check
4. Dashboard refreshes — status counts update, action item disappears or moves, recent activity
   updates

## Dependencies

**Requires:**

- Vehicle Profile (Feature 01) — vehicle data display ✅ Done
- Check Types (Feature 02) — check type names and intervals ✅ Done
- Check Logging (Feature 04) — check logs and status summaries ✅ Done

**Partially requires (progressive enhancement):**

- Expenses (Feature 06) — expense totals for budget overview ❌ Not yet
- Budget (Feature 07) — budget thresholds for comparison ❌ Not yet

**Enables:**

- Serves as the entry point and central navigation hub
- Validates that all existing features compose well together
- Establishes the pattern for adding budget/expense widgets later

## What Must Exist (Backend)

### New Endpoint: Dashboard Summary

A single aggregated endpoint that returns everything the dashboard needs in one call, avoiding
multiple round-trips from the frontend:

- Vehicle basic info (make, model, year, mileage)
- Check status summaries (reuses existing GetCheckStatusSummary use case)
- Recent check logs (last 5, sorted newest first)
- Counts by status category (on-time, due-soon, overdue, never)
- (Future) Budget summary (spent this month, budget limit, remaining)

This endpoint orchestrates existing use cases — no new domain logic is needed.

### Alternative: Frontend Composition

If the aggregated endpoint adds too much complexity for MVP, the frontend can compose the dashboard
from existing endpoints:

- `GET /vehicles` → vehicle data
- `GET /vehicles/:id/check-status` → status summaries
- `GET /vehicles/:id/check-logs` → recent logs (take first 5)

**Recommendation:** Start with frontend composition (simpler, no new backend code). Add a dedicated
dashboard endpoint later if performance requires it.

### Validations

- All existing ownership validations apply (vehicle belongs to authenticated user)
- No new write operations — dashboard is read-only (quick-log delegates to existing check-log
  endpoints)

## What Must Exist (Frontend)

### Pages / Routes

- Dashboard page at `/` for authenticated users (replaces current landing content when logged in)
- Unauthenticated visitors continue to see the existing landing page
- Navigation: add "Tableau de bord" as the first link in the navbar

### Components

**Container (smart):**

- Dashboard container — orchestrates data fetching from vehicle, check types, and check logs hooks.
  Manages loading/error states. Determines which sections to show based on data availability (no
  vehicle → empty state, no check types → partial empty state, etc.)

**Presentational (dumb):**

- Vehicle summary card — compact display of make, model, year, and mileage. Links to `/vehicle` for
  details.
- Status overview — row of stat indicators showing count per status category (on-time, due-soon,
  overdue, never). Each indicator uses the appropriate status color.
- Action items list — sorted list of checks needing attention. Overdue items first (error styling),
  then due-soon (warning styling). Each item shows check type name, days overdue/until due, and a
  quick-log button.
- Recent activity list — last 5 check logs. Each entry shows check type name, completion date, and
  notes excerpt (truncated). Links to `/check-logs` for full history.
- Budget overview card — (placeholder for Features 06-07) shows "Fonctionnalité à venir" or is
  simply absent until expenses/budget are built.
- Empty state variants — contextual empty states for each section with appropriate call-to-action
  buttons

**Reused from existing features:**

- LogCheckDialog (from check-logs) — for quick-log action
- CheckStatusBadge (from check-logs) — for status indicators
- useVehicle hook (from vehicles) — vehicle data
- useCheckLogs hook (from check-logs) — statuses and recent logs

### State Management

- No new store needed — dashboard composes from existing stores (vehicle, check logs)
- Dashboard container fetches on mount using existing hooks
- After a quick-log action, container triggers refresh of statuses and recent logs

### User Interactions

- Quick-log: opens LogCheckDialog pre-filled with the selected check type
- Vehicle card: clicking navigates to `/vehicle`
- Status indicators: clicking navigates to `/check-types` (filtered by status if feasible)
- Recent activity: clicking "Voir tout" navigates to `/check-logs`
- Empty state CTAs: navigate to the appropriate feature page

## UI Reference

> **Note:** Detailed visual design (DaisyUI components, exact classes, layout specifics) will be
> defined via `/frontend-design` during implementation. This section describes intent only.

### Visual Target

Reference: the Spark prototype (`https://github.com/TituxMetal/car-repair-cost-trac`) for overall
aesthetic. The dashboard follows the same visual language as existing pages (check types, check
logs) but with a more information-dense, overview-oriented layout.

### Layout & Structure

- **Top:** Vehicle summary — compact, full-width. Make + model prominent, year and mileage
  secondary.
- **Stats row:** 4 status counters (on-time, due-soon, overdue, never) — the key at-a-glance info.
- **Main content:** Two zones — action items (overdue + due-soon checks, primary attention-grabber)
  and recent activity (last few check logs). Side-by-side on desktop, stacked on mobile.
- **Bottom (future):** Budget overview — reserved for Features 06-07, omitted until then.

### UI Components & Patterns

- **UI patterns used:** card, stat, badge, button, modal (reused LogCheckDialog), alert, spinner
- **Interactive patterns:** Quick-log buttons open existing log modal, cards link to detail pages
- **States:** full empty (no vehicle), partial empty (no check types), all-clear (everything
  on-time), attention needed (overdue items), loading, error with retry

### Design Tokens

Uses project theme tokens from MVP.md (primary, success, error, warning, neutral, base layers). No
hardcoded hex values. Color semantics: success = on-time, error = overdue, warning = due-soon.

### Responsiveness

- Stats row: 2 columns on mobile, 4 on desktop
- Main content: stacked on mobile, side-by-side on desktop
- Quick-log buttons adapt to available width
- Navigation link visible in both desktop navbar and mobile dropdown

## Open Questions

1. **Dashboard route:** Should the dashboard live at `/` (replacing landing page for authenticated
   users) or at a dedicated `/dashboard` route? → **Recommendation: `/` for authenticated users** —
   the landing page is only useful for unauthenticated visitors, and having the dashboard at root
   feels natural as the home screen.

2. **Quick-log scope:** Should the dashboard allow logging ALL check types (including on-time ones),
   or only show overdue/due-soon in the action items? → **Recommendation: only overdue and due-soon
   in the action items section** — on-time checks don't need attention. Users can still log any
   check from `/check-types`.

3. **Recent activity count:** How many recent check logs to show? → **Recommendation: 5** — enough
   to be useful without overwhelming. "Voir tout" links to `/check-logs` for the full history.

4. **Status navigation:** Should clicking a stat indicator navigate to `/check-types` filtered by
   that status? → **Recommendation: not for MVP** — would require adding filter state to the check
   types page. Keep it simple, navigate to `/check-types` without filtering.

5. **Auto-refresh:** Should the dashboard poll for updates or only refresh on navigation? →
   **Recommendation: refresh on mount only** — manual refresh via page reload. Real-time updates are
   unnecessary for a personal maintenance tracker.

6. **Budget placeholder:** Should the dashboard show a "coming soon" placeholder for the budget
   section, or simply omit it until Features 06-07 are built? → **Recommendation: omit entirely** —
   a "coming soon" placeholder adds no value and clutters the UI.

## Out of Scope

- Budget and expense data (Features 06-07 — will be integrated into dashboard when built)
- Mileage tracking or reminders (not in MVP)
- Notifications or alerts (email, push)
- Analytics or charts (cost over time, check frequency graphs)
- Multi-vehicle support (MVP is single vehicle)
- Dashboard customization or widget reordering
- Calendar view of scheduled checks
- Weather or driving condition advisories
- Export or sharing of dashboard data

## Risks / Gotchas

- **Data composition performance:** The dashboard fetches from multiple existing endpoints (vehicle,
  check statuses, check logs). For a single user with one vehicle, this is fine. If latency becomes
  noticeable, consider a dedicated backend summary endpoint.
- **Stale status badges:** Status is computed from `nextDueAt` vs today's date. If the dashboard
  stays open across midnight, statuses won't update until page refresh. Same limitation as the check
  types page — acceptable for MVP.
- **No vehicle guard:** The dashboard must gracefully handle the case where the user has no vehicle
  yet. The container should check vehicle existence first and show the appropriate empty state
  before attempting to fetch check data.
- **No check types guard:** Similarly, if the user has a vehicle but no check types, the status and
  action items sections should show contextual empty states, not error states.
- **Hook reuse and double-fetching:** The dashboard reuses `useVehicle` and `useCheckLogs` hooks. If
  nanostores are shared across pages, navigating away and back might show stale data. Ensure
  fetch-on-mount always refreshes.
- **LogCheckDialog reuse:** The quick-log feature reuses the existing LogCheckDialog component from
  the check-logs feature. This component needs to be importable standalone (it already is via barrel
  exports). After a successful log, the dashboard must refresh both statuses and recent activity.
- **Progressive enhancement for budget:** The dashboard layout should be designed so that the budget
  section can be added later without restructuring. Using a grid layout with a dedicated bottom row
  makes this straightforward.
- **Navigation change:** Adding "Tableau de bord" to the navbar affects all pages (Main.astro
  layout). This is a small change but touches a shared layout file — test that existing pages still
  render correctly.
- **Landing page bifurcation:** If `/` shows different content based on auth status, the Astro page
  needs to handle both cases. The existing pattern of checking `isAuthenticated` in Astro
  frontmatter and conditionally rendering different components applies here.
