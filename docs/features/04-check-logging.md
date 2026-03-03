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

- Quick log action (accessible from dashboard and check type list)
- Check log form (date, optional notes)
- Check history list (all logs or per check type)
- "Next due" indicator on check types and dashboard

**Data involved:**

- CheckLog entity linked to a CheckType
- Completed date, optional notes, calculated next due date

## User Flow

### Logging a Check

1. User sees a check type in the list or dashboard (e.g., "Oil Level — due in 2 days")
2. User clicks "Log Check" (or similar action)
3. A form appears with:
   - Check type name (read-only, for context)
   - Completed date (defaults to today, can be backdated)
   - Notes (optional text field)
4. User submits
5. System calculates `nextDueAt = completedAt + interval days`
6. System saves the check log
7. User sees confirmation and updated "next due" status

### Viewing History

1. User navigates to check history (from menu or check type detail)
2. User sees a chronological list of all logged checks
3. Each entry shows: check type name, completed date, notes (if any), next due date
4. User can filter by check type to see history for a specific check
5. User can delete a log entry if needed (with confirmation)

## Dependencies

**Requires:**

- Vehicle Profile — logs are ultimately tied to a vehicle
- Check Types — logs are recorded against a specific check type

**Enables:**

- Dashboard — displays overdue checks, upcoming checks, last check performed
- Provides the data needed to calculate check status (on time, due soon, overdue)

## What Must Exist (Backend)

**Domain layer:**

- CheckLog entity with properties (checkTypeId, completedAt, notes, nextDueAt)
- CheckLog ID value object
- CheckType ID reference (value object)
- CheckLog repository interface
- Domain logic: `nextDueAt` calculation based on check type interval
- Domain exceptions (not found, validation errors)

**Application layer:**

- Create check log use case (includes nextDueAt calculation)
- List check logs (by vehicle, optionally filtered by check type) use case
- Get check log use case
- Delete check log use case
- CheckLog DTOs for input/output
- CheckLog mapper

**Infrastructure layer:**

- CheckLog controller with endpoints
- Prisma CheckLog repository implementation
- Database migration for CheckLog table

**Validations:**

- CheckType must exist and belong to user's vehicle
- Completed date is required, cannot be in the future
- Notes are optional, max 500 characters
- NextDueAt is calculated, not user-provided

**API endpoints:**

- `POST /vehicles/:vehicleId/check-types/:checkTypeId/logs` — create check log
- `GET /vehicles/:vehicleId/check-logs` — list all check logs for vehicle
- `GET /vehicles/:vehicleId/check-types/:checkTypeId/logs` — list logs for specific check type
- `GET /vehicles/:vehicleId/check-logs/:id` — get single check log
- `DELETE /vehicles/:vehicleId/check-logs/:id` — delete check log

## What Must Exist (Frontend)

**Pages/routes:**

- Check history page (all logs)
- Check type history view (logs filtered by check type)

**Components:**

- Log check form (date picker, notes textarea)
- Log check modal or inline form
- Check history list component
- Check log item (showing check type, date, notes, next due)
- Filter/selector for check type
- Delete confirmation dialog
- Empty state ("No checks logged yet")

**State management:**

- Check logs store (list of logs for current vehicle)
- Current filter state (all or specific check type)
- Loading and error states
- Actions: fetch logs, create log, delete log

**User interactions:**

- Quick log from dashboard or check type list
- Date picker with "today" as default
- Optional notes input
- History browsing with filtering
- Delete log action

## UI Reference

### Visual Target

The Spark prototype (`https://github.com/TituxMetal/car-repair-cost-trac`) serves as the **design
reference only** — its theme, color palette, visual hierarchy, and component quality are the
standard to match. Refer to the Design System section in MVP.md for available tokens.

### Layout & Structure

- **Log check form:** Radix UI Dialog (modal) centered over the current page, containing a date
  input (defaulting to today), an optional notes textarea, and submit/cancel buttons. The check type
  name is displayed as a read-only header for context.
- **Check history page:** Full-width content area with a filter bar at the top (check type selector)
  and a chronological list of log cards below. Each card shows the check type name, completed date,
  notes excerpt, and next due date.
- **Visual hierarchy:** Filter bar prominent at top, then log entries sorted newest-first. Each log
  entry is a compact card with date as primary info and notes as secondary.
- **"Next due" indicators:** Displayed on check type cards (from check types feature) as a badge
  showing days until due or days overdue.

### UI Components & Patterns

**DaisyUI components used:**

- `btn` — "Log Check" action button (primary/amber), cancel (ghost), delete (error)
- `card` — each check log entry in the history list
- `input` — date input for completed date
- `textarea` — optional notes field
- `badge` — status indicators: on time (success), due soon (warning), overdue (error)
- `modal` — log check form dialog (backed by Radix UI Dialog)
- `alert` — success feedback after logging, error on failure
- `select` — check type filter in history view (backed by Radix UI Select)
- `divider` — separating filter area from history list
- `loading` — spinner during form submission and data fetching

**Radix UI primitives used:**

- Dialog — for the log check form modal and delete confirmation
- Select — for the check type filter dropdown in history view
- AlertDialog — for delete log confirmation

**Interactive patterns:**

- Quick log: clicking "Log Check" on a check type card opens the modal pre-filled with that check
  type
- Date picker defaults to today but allows backdating
- Filter: selecting a check type instantly filters the history list
- Delete: confirmation dialog before removing a log entry

**States:**

- Empty state — "No checks logged yet — log your first check!" with call-to-action
- Empty filtered state — "No logs for this check type" when filter yields no results
- Loading state — spinner centered in history list area
- Error state — alert with error token color and retry action
- Success feedback — alert confirming "Check logged successfully" with auto-dismiss

### Design Tokens

All styling uses DaisyUI theme tokens referencing the tokens defined in MVP.md Design System:

- **primary (amber):** "Log Check" buttons, active filter highlight, form submit button
- **neutral (zinc):** Card backgrounds (base-200), card borders, secondary text (dates, notes),
  history list background
- **success (emerald):** "On time" status badge, success alert after logging
- **error (red):** "Overdue" status badge, delete button, delete confirmation, error alerts
- **warning (amber):** "Due soon" status badge, approaching deadline indicators
- **base-100/200/300:** Background layering (page → cards → hover states)
- **base-content:** Primary text (check type name, dates), secondary text (notes)

No hardcoded hex values — all colors through DaisyUI theme tokens.

### Responsiveness

- **Log form modal:** Full-screen sheet on mobile, centered overlay on desktop
- **History list:** Full-width stacked cards on all breakpoints, comfortable reading width on
  desktop
- **Filter bar:** Full-width select on mobile, inline with title on desktop
- **Log cards:** Single-column, full-width — date and status badge on the same row, notes below
- **Action buttons:** Stack vertically on mobile, inline on desktop
- **Spacing:** Reduced padding (p-4) on mobile, standard (p-6) on desktop

## Open Questions

1. Should users be able to edit a check log after creation (change date or notes)? Or is it
   immutable once logged?
2. When displaying check history, should we show the "next due" that was calculated at the time, or
   recalculate based on current interval? (Per your answer: keep original)
3. Should we allow logging future checks (scheduled but not yet performed)? Probably no for MVP.
4. If a user deletes their most recent log for a check type, what's the "next due" status? Should it
   fall back to the previous log's nextDueAt, or show "never performed"?

## Out of Scope

- Editing check logs (create-only for simplicity)
- Bulk logging (log multiple checks at once)
- Recurring reminders/notifications
- Attaching photos to check logs
- Mileage at time of check
- Integration with calendar apps

## Risks / Gotchas

- **Backdating checks:** Users should be able to backdate (log a check they did yesterday). But the
  `nextDueAt` should be calculated from the logged date, not today's date.
- **Time zones:** Dates should be handled consistently. Consider storing as UTC dates and displaying
  in user's local time. For MVP, date-only (no time component) might be simpler.
- **Deleting logs:** If a user deletes their most recent log, the check type's "status" needs to
  recalculate. This might require looking up the previous log or marking the check as "never
  performed" if no logs remain.
- **Interval changes:** If a check type's interval is changed, existing logs keep their original
  `nextDueAt`. The UI should reflect the actual stored nextDueAt, not recalculate it. This is the
  behavior you specified.
- **Performance:** As check log history grows, pagination or limiting the displayed history becomes
  important. For MVP, showing the last 50-100 logs per check type should be sufficient.
- **Dashboard integration:** The dashboard will need to query check logs to determine status. This
  might require a dedicated query/endpoint that returns aggregated status per check type (last log,
  next due, status: ok/due-soon/overdue).
