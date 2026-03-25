# Feature Shape: Check Logging

## Problem

Knowing what to check and how often (Check Types) is only half the solution. Car owners need to
actually record when they perform a check and know when the next one is due. Without logging,
there's no history, no tracking, and no way to see if you're keeping up with your maintenance
routine.

## Solution (Broad Strokes)

The user can log a completed check against any of their defined check types. When logging, the
system captures the completion date and calculates the next due date based on the check type's
interval. Users can view their check history — both overall and filtered by check type.

**Main UI elements:**

- Quick log action accessible from the check type list (button on each check type card)
- Log check modal (Radix UI Dialog) with date input and optional notes
- Check history list (all logs or filtered per check type)
- "Next due" status indicator on each check type card (badge showing days until due or days overdue)

**Data involved:**

- CheckLog entity linked to a CheckType (which is linked to a Vehicle)
- Completed date (date-only, no time component), optional notes, calculated next due date

## User Flow

### Logging a Check

1. User sees their check type list (e.g., "Niveau d'huile — dans 2 jours")
2. User clicks "Enregistrer" on a check type card
3. A modal dialog opens with:
   - Check type name displayed as read-only header
   - Date input (defaults to today, allows backdating but not future dates)
   - Notes textarea (optional, max 500 characters)
4. User submits the form
5. System validates input (Zod on frontend, class-validator + domain validation on backend)
6. System calculates `nextDueAt = completedAt + intervalDays`
7. System saves the check log
8. Modal closes, check type card updates with the new "next due" status
9. Success feedback displayed (toast or inline alert)

### Viewing History

1. User navigates to check history (from the check types page or a dedicated history view)
2. User sees a chronological list of all logged checks (newest first)
3. Each entry shows: check type name, completed date, notes (if any), next due date
4. User can filter by check type using a dropdown selector
5. User can delete a log entry (with confirmation dialog using existing ConfirmDialog component)

### Check Status on Check Type Cards

1. Each check type card displays a status badge:
   - **"À jour"** (success) — next due date is in the future, more than 2 days away
   - **"Bientôt"** (warning) — next due date is within 2 days
   - **"En retard"** (error) — next due date is in the past
   - **"Jamais effectué"** (neutral) — no logs exist for this check type
2. Status is computed on the frontend from the most recent log's `nextDueAt` vs today's date

## Dependencies

**Requires:**

- Vehicle Profile (Feature 02) — logs are ultimately tied to a vehicle ✅ Done
- Check Types (Feature 03) — logs are recorded against a specific check type ✅ Done
- UI Design System (Feature 03b) — DaisyUI 5 components, Radix UI Dialog ✅ Done
- Post-Feature-03 housekeeping Block 5 (develop → main merge) — should be completed before starting
  this feature

**Enables:**

- Dashboard (Feature 05) — displays overdue checks, upcoming checks, last check performed
- Provides the data needed to calculate per-check-type status (on time, due soon, overdue)
- Lays groundwork for future notification/reminder features

## What Must Exist (Backend)

### Domain Layer

**Entity:**

- CheckLog entity with behavior:
  - Encapsulates business logic for next due date calculation
  - Constructor validates invariants (completed date not in future, notes length)
  - `nextDueAt` computed from `completedAt + intervalDays` at creation time
  - Properties: id, checkTypeId, completedAt, notes, nextDueAt, createdAt, updatedAt

**Value Objects:**

- CheckLog ID (UUID validation, immutable, equality comparison)
- CompletedAt (date validation — required, not in the future, date-only)

**Repository Interface (port):**

- Create a check log
- Find check log by ID
- Find all check logs by check type
- Find all check logs by vehicle (through check type relationship)
- Find most recent log per check type (for status calculation)
- Delete a check log
- Count logs per check type (optional, for statistics)

**Domain Exceptions:**

- CheckLog not found
- Invalid check log (validation failures)

**Validation Constants:**

- Notes max length (500 characters)
- Completed date constraints (not in future)

### Application Layer

**Use Cases:**

- Create check log — receives check type ID + input, fetches check type to get interval, creates
  entity with calculated nextDueAt, saves via repository
- List check logs by vehicle — returns all logs for a vehicle, optionally filtered by check type,
  sorted newest first
- Get single check log — by ID with ownership verification
- Delete check log — with ownership verification and confirmation
- Get check status summary — returns latest log + status per check type for a vehicle (used by
  frontend for status badges, and later by dashboard)

**Service Orchestrator:**

- Delegates to use cases, provides a unified API for the controller

**DTOs:**

- Create check log input DTO (checkTypeId, completedAt, notes) with class-validator decorators
  referencing domain validation constants
- Check log response DTO (id, checkTypeId, checkTypeName, completedAt, notes, nextDueAt, createdAt)
- Check status summary DTO (checkTypeId, checkTypeName, lastCompletedAt, nextDueAt, status)

**Application Mapper:**

- Entity → response DTO conversion (unwraps value objects to primitives)

### Infrastructure Layer

**Controller:**

- Mounted at nested route under vehicles (consistent with check types pattern)
- All endpoints verify vehicle ownership before delegating to service
- Uses `@Session()` decorator for authentication

**Prisma Repository:**

- Implements the domain repository interface
- Handles Prisma error codes → domain exceptions (P2002, P2025)
- Uses infrastructure mapper for Prisma ↔ domain entity conversion

**Infrastructure Mapper:**

- Prisma record → domain entity (reconstructs value objects)
- Domain entity → Prisma record (unwraps value objects to primitives)

**Database Migration:**

- New CheckLog table with:
  - Foreign key to CheckType (cascade delete when check type is deleted)
  - Index on checkTypeId for efficient lookups
  - completedAt as date-only field
  - nextDueAt as date-only field
  - Relation added to CheckType model (one-to-many)

**Module:**

- NestJS module with useFactory DI pattern (consistent with CheckTypes module)
- Imports: Auth module, Vehicles module, CheckTypes module
- Exports: CheckLog service (for future dashboard consumption)

### API Endpoints

- `POST /vehicles/:vehicleId/check-logs` — create check log (checkTypeId in request body)
- `GET /vehicles/:vehicleId/check-logs` — list all check logs for vehicle (optional `?checkTypeId=`
  query filter)
- `GET /vehicles/:vehicleId/check-logs/:id` — get single check log
- `DELETE /vehicles/:vehicleId/check-logs/:id` — delete check log
- `GET /vehicles/:vehicleId/check-status` — get status summary per check type

### Validations

- Check type must exist and belong to the user's vehicle
- Completed date is required, must be a valid date, cannot be in the future
- Notes are optional, max 500 characters
- NextDueAt is calculated server-side, never user-provided
- Vehicle ownership verified on every endpoint

## What Must Exist (Frontend)

### Types

- CheckLog interface (id, checkTypeId, checkTypeName, completedAt, notes, nextDueAt, createdAt)
- CheckStatus type union: `'on-time' | 'due-soon' | 'overdue' | 'never'`
- CheckStatusSummary interface (checkTypeId, checkTypeName, lastCompletedAt, nextDueAt, status)
- CreateCheckLogInput interface (checkTypeId, completedAt, notes)

### Validation Schemas (Zod)

- Create check log schema:
  - completedAt: required date string, validated as not-in-future
  - notes: optional string, max 500 characters
  - French error messages (consistent with existing schemas)
- Type inference from schemas for form typing

### API Service

- Typed service methods: create log, list logs (with optional filter), get log, delete log, get
  status summary
- Uses existing `apiRequest` client (`api.get`, `api.post`, `api.delete`)
- Uses existing `handleApiResponse` for error handling
- Endpoints prefixed with `/api/vehicles/:vehicleId/` (Astro proxy)

### State Management (Nanostores)

- Atoms: `$checkLogs`, `$checkStatuses`, `$isLoading`, `$error`
- Computed: `$hasCheckLogs`, `$checkLogCount`
- Actions: fetch logs (with optional filter), create log, delete log, fetch statuses, clear error
- Separate atoms for statuses vs logs (different lifecycle — statuses refresh after every log
  action)

### Custom Hook

- Connects store to components
- Provides: logs, statuses, loading, error, actions (create, delete, refresh, filter)
- Handles the fetch-on-mount and refresh-after-mutation patterns

### Pages / Routes

- Check history page (all logs for the vehicle) — Astro page with React island
- Potentially integrated into the check types page (logs visible per check type)

### Components

**Container (smart):**

- Check log container — manages modes (list, create), orchestrates data fetching, handles form
  submission, error handling

**Presentational (dumb):**

- Log check form — date input (defaults to today), notes textarea, submit/cancel buttons. Uses React
  Hook Form + Zod resolver. Receives `onSubmit` callback.
- Check log list — renders a list of check log cards, accepts logs array as prop
- Check log card — displays single log entry: check type name, completed date, notes excerpt, next
  due date. Edit/delete action buttons.
- Check type status badge — displays status badge on check type cards (success/warning/error/neutral
  based on status). This component enhances the existing CheckTypeCard.
- Check type filter — dropdown to filter history by check type (uses existing Select component)
- Delete check log dialog — wraps existing ConfirmDialog for log deletion confirmation
- Empty state — "Aucun contrôle enregistré" with call-to-action icon and message

**Reused shared components:**

- ConfirmDialog (from `components/ui/`) — for delete confirmation
- Button, Input, Textarea, Label, FormWrapper, Select (from `components/ui/`)

### State & Interactions

- Log check modal triggered from check type card "Enregistrer" button
- Modal uses Radix UI Dialog (same pattern as existing ConfirmDialog)
- Date input defaults to today, uses native HTML date input for MVP
- After successful log creation: modal closes, check type status refreshes, success feedback shown
- Filter dropdown in history view: updates store filter, re-renders list
- Delete: ConfirmDialog → API call → refresh list → success feedback

## UI Reference

### Visual Target

The Spark prototype (`https://github.com/TituxMetal/car-repair-cost-trac`) serves as the **design
reference only** — its theme, color palette, visual hierarchy, and component quality are the
standard to match. Refer to the Design System section in MVP.md for available tokens.

### Layout & Structure

- **Log check modal:** Radix UI Dialog (`modal modal-open` + `modal-box`) centered over the current
  page. Contains check type name as `modal-box` title, a date input (defaulting to today), an
  optional notes textarea, and submit/cancel buttons in `modal-action`. Same structural pattern as
  existing ConfirmDialog and DeleteCheckTypeDialog.
- **Check history page:** Full-width content area within `container mx-auto px-4 py-8` (same as
  check types page). Filter bar at the top (check type selector using `select` component), then a
  chronological list of log cards below.
- **Check type cards enhanced:** Each existing CheckTypeCard gains a status badge
  (`badge badge-success`, `badge-warning`, or `badge-error`) and a "Enregistrer" action button
  (`btn btn-primary btn-sm`).
- **Visual hierarchy:** Filter bar prominent at top, then log entries sorted newest-first. Each log
  entry is a compact card (`card card-body bg-base-200`) with date as primary info and notes as
  secondary.

### UI Components & Patterns

**DaisyUI components used:**

- `btn` — "Enregistrer" action button (`btn-primary btn-sm`), cancel (`btn-outline`), delete
  (`btn-error`)
- `card card-body bg-base-200` — each check log entry in the history list
- `input` — date input for completed date (no `-bordered` suffix, DaisyUI 5)
- `textarea` — optional notes field (no `-bordered` suffix, DaisyUI 5)
- `badge` — status indicators: `badge-success` (à jour), `badge-warning` (bientôt), `badge-error`
  (en retard), `badge-neutral` (jamais effectué)
- `modal modal-open` + `modal-box` + `modal-action` — log check form dialog (backed by Radix UI
  Dialog)
- `alert` — success feedback after logging (`alert-success`), error on failure (`alert-error`)
- `select` — check type filter in history view (no `-bordered` suffix, DaisyUI 5)
- `divider` — separating filter area from history list
- `loading loading-spinner` — during form submission and data fetching

**Radix UI primitives used:**

- Dialog — for the log check form modal and delete confirmation (reuses existing ConfirmDialog
  pattern). Note: only `@radix-ui/react-dialog` is installed.

**Interactive patterns:**

- Quick log: clicking "Enregistrer" on a check type card opens the modal pre-filled with that check
  type's context
- Date input defaults to today but allows backdating (native HTML `<input type="date">` for MVP)
- Filter: selecting a check type from dropdown filters the history list immediately
- Delete: confirmation dialog before removing a log entry (reuses existing ConfirmDialog)

**States:**

- Empty state — "Aucun contrôle enregistré — enregistrez votre premier contrôle !" with Lucide icon
  (`ClipboardCheck` or similar) and call-to-action
- Empty filtered state — "Aucun enregistrement pour ce type de contrôle" when filter yields no
  results
- Loading state — `loading loading-spinner` centered in content area
- Error state — `alert alert-error` with error message and retry action
- Success feedback — `alert alert-success` confirming "Contrôle enregistré avec succès" (auto-
  dismiss or inline)

### Design Tokens

All styling uses DaisyUI theme tokens referencing the tokens defined in MVP.md Design System:

- **primary (amber):** "Enregistrer" buttons, active filter highlight, form submit button
- **neutral (zinc):** Card backgrounds (`bg-base-200`), card borders, secondary text (dates, notes),
  history list background
- **success (emerald):** "À jour" status badge, success alert after logging
- **error (red):** "En retard" status badge, delete button, delete confirmation, error alerts
- **warning (amber):** "Bientôt" status badge, approaching deadline indicators
- **base-100/200/300:** Background layering (page → cards → hover states)
- **base-content:** Primary text (check type name, dates)
- **base-content/60, base-content/70:** Secondary text (notes, metadata) — opacity variants

No hardcoded hex values — all colors through DaisyUI theme tokens.

### Responsiveness

- **Log form modal:** Full-screen sheet on mobile, centered overlay on desktop (same as existing
  ConfirmDialog behavior)
- **History list:** Full-width stacked cards on all breakpoints, comfortable reading width on
  desktop
- **Filter bar:** Full-width select on mobile, inline with title on desktop
- **Log cards:** Single-column, full-width — date and status badge on the same row, notes below
- **Action buttons:** Stack vertically on mobile, inline on desktop
- **Check type cards:** Status badge and "Enregistrer" button adapt to card layout (badge in header,
  button in card-actions)
- **Spacing:** Reduced padding (`p-4`) on mobile, standard (`p-6`) on desktop

## Open Questions

1. **Log editing:** Should users be able to edit a check log after creation (change date or notes)?
   Or is it immutable once logged? → **Recommendation: immutable for MVP** (simpler, avoids
   nextDueAt recalculation complexity)
2. **Delete cascade on status:** If a user deletes their most recent log for a check type, what's
   the "next due" status? Should it fall back to the previous log's nextDueAt, or show "never
   performed"? → **Recommendation: fall back to previous log** if one exists, otherwise "jamais
   effectué"
3. **Check history location:** Should check history be a dedicated page, or a section within the
   check types page (expandable per check type)? → **Recommendation: dedicated page** for MVP
   (simpler routing, clearer navigation)
4. **Status badge thresholds:** What defines "due soon"? 2 days? 3 days? Configurable per check
   type? → **Recommendation: fixed 2-day threshold for MVP**, configurable later
5. **Date-only vs DateTime:** Using date-only (no time component) for completedAt and nextDueAt.
   This means "overdue" is triggered at the start of the due date, not at a specific time. Is this
   acceptable? → **Recommendation: yes, date-only for MVP**

## Out of Scope

- Editing check logs (create-only and delete-only for simplicity)
- Bulk logging (log multiple checks at once)
- Recurring reminders/notifications
- Attaching photos to check logs
- Mileage at time of check
- Integration with calendar apps
- Pagination of check log history (show all for MVP, add pagination later if needed)
- Dashboard integration (separate feature — Feature 05)

## Risks / Gotchas

- **Backdating checks:** Users should be able to backdate (log a check they did yesterday). The
  `nextDueAt` must be calculated from the logged date (`completedAt`), not from today's date. The
  domain entity must enforce this.
- **Date handling:** Dates should be stored as date-only (no time component) in the database. Using
  ISO date strings (`YYYY-MM-DD`) avoids timezone confusion. The backend stores dates in UTC, the
  frontend displays as-is (no timezone conversion needed for date-only).
- **Deleting logs and status recalculation:** When the most recent log is deleted, the check type's
  status must recalculate based on the new most recent log (or "never performed" if no logs remain).
  The "get check status summary" use case handles this by always querying the latest log.
- **Interval changes on check types:** If a check type's interval is changed after logs exist,
  existing logs keep their original `nextDueAt` (calculated at creation time). Only new logs use the
  updated interval. The status badge always uses the most recent log's `nextDueAt`, not a
  recalculation.
- **CheckType deletion cascade:** When a check type is deleted, all its logs must be cascade-deleted
  (Prisma `onDelete: Cascade`). This is handled at the database level.
- **Cross-feature dependency:** The CheckLog module needs to import CheckTypes module to access
  check type data (interval, ownership). This creates a module dependency that must be managed via
  NestJS module imports and service exports.
- **Performance for MVP:** Showing all logs without pagination is acceptable for MVP (typical user
  will have dozens, not thousands of logs). Consider adding pagination if usage grows.
- **Frontend status computation:** Status badges are computed client-side from `nextDueAt` vs
  today's date. This means the status is always up-to-date without polling. However, if the page
  stays open across midnight, status badges won't update until refresh.
- **Nanostores atom separation:** Keep `$checkLogs` and `$checkStatuses` as separate atoms with
  different refresh strategies. Statuses should refresh after every create/delete action.
