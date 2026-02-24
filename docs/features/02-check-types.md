# Feature Shape: Check Types

## Problem

Car owners need to define what checks they want to perform on their vehicle and how often. Without
predefined check types, there's no structure to the maintenance routine — users would have to
remember what to check and when. Check types act as templates that define the "what" and "how often"
so that logging becomes a simple action.

## Solution (Broad Strokes)

The user can create custom check type templates for their vehicle. Each check type has a name (e.g.,
"Oil Level", "Tire Pressure"), an optional description with instructions, and an interval in days
that defines how often the check should be performed.

**Main UI elements:**

- List view of all check types for the vehicle
- Form for creating/editing a check type
- Individual check type detail view (optional, could be inline)
- Delete action with confirmation

**Data involved:**

- CheckType entity linked to the user's vehicle
- Name, description, interval in days

## User Flow

1. User navigates to "Check Types" section (from dashboard or menu)
2. User sees a list of existing check types (or empty state if none)
3. User clicks "Add Check Type"
4. User fills in:
   - Name (required) — e.g., "Oil Level Check"
   - Description (optional) — e.g., "Check with engine cold, wait 5 minutes after stopping"
   - Interval in days (required) — e.g., 7 days
5. User submits the form
6. System validates and creates the check type
7. User sees the new check type in the list
8. From the list, user can:
   - Edit a check type (opens form in edit mode)
   - Delete a check type (with confirmation)
9. After deletion, check type is removed from list

## Dependencies

**Requires:**

- Vehicle Profile — check types belong to a vehicle
- At least one vehicle must exist before creating check types

**Enables:**

- Check Logging — users log checks against a check type
- Dashboard — displays upcoming/overdue checks based on check types and their intervals

## What Must Exist (Backend)

**Domain layer:**

- CheckType entity with properties (name, description, interval in days)
- CheckType ID value object
- Vehicle ID reference (value object)
- CheckType repository interface
- Domain exceptions (not found, validation errors, duplicate name)

**Application layer:**

- Create check type use case
- List check types (by vehicle) use case
- Get check type use case
- Update check type use case
- Delete check type use case
- CheckType DTOs for input/output
- CheckType mapper

**Infrastructure layer:**

- CheckType controller with CRUD endpoints
- Prisma CheckType repository implementation
- Database migration for CheckType table

**Validations:**

- Name is required, non-empty, min 5 characters, max 100 characters
- Name must be unique within the vehicle (no duplicate check types)
- Interval must be a positive integer (minimum 1 day)
- Description is optional, max 500 characters
- Vehicle must exist and belong to authenticated user

**API endpoints:**

- `POST /vehicles/:vehicleId/check-types` — create check type
- `GET /vehicles/:vehicleId/check-types` — list all check types for vehicle
- `GET /vehicles/:vehicleId/check-types/:id` — get single check type
- `PATCH /vehicles/:vehicleId/check-types/:id` — update check type
- `DELETE /vehicles/:vehicleId/check-types/:id` — delete check type

## What Must Exist (Frontend)

**Pages/routes:**

- Check types list page
- Check type creation page (or modal)
- Check type edit page (could reuse creation form)

**Components:**

- Check type list component
- Check type list item (showing name, interval, last check info if available)
- Check type form (reusable for create/edit)
- Delete confirmation dialog
- Empty state ("No check types yet — create your first one")

**State management:**

- Check types store (list of check types for current vehicle)
- Loading and error states
- Actions: fetch list, create, update, delete

**User interactions:**

- Form submission with validation feedback
- List navigation and filtering (if many check types)
- Inline actions (edit, delete) from list
- Quick interval adjustment (nice-to-have)

## Open Questions (Resolved)

1. Should we provide a set of suggested/default check types that users can add with one click?
   **Yes** — Minimal set: Niveau d'huile (7j), Pression des pneus (14j), Niveau de liquide de
   refroidissement (30j). Shown in empty state, addable with one click.
2. Should the list show the "last performed" and "next due" status for each check type? **No** —
   Check Logging not built yet. Card design accommodates future addition.
3. Can interval be 0 (meaning "no recurring schedule")? **No** — Backend validates minimum 1 day.
   All checks are recurring.

## Out of Scope

- Mileage-based intervals (time-based only per MVP)
- Check type templates shared across vehicles (each vehicle has its own)
- Check type categories/grouping
- Reordering check types
- Import/export check type definitions

## Risks / Gotchas

- **Cascade deletion:** Deleting a check type should cascade to its check logs. User should be
  warned that history will be lost.
- **Changing interval:** If the user changes the interval on an existing check type, existing logs
  keep their original `nextDueAt`. Only new logs will use the new interval. This should be clear in
  the UI or documentation.
- **Duplicate names:** The unique name constraint is per vehicle. Error messages should be clear
  ("You already have a check type called 'Oil Level'").
- **Empty vehicle state:** If user tries to access check types but has no vehicle, redirect to
  vehicle creation.
- **Suggested check types:** If we implement suggested defaults, they should be addable but not
  automatically created. User should explicitly choose which ones they want.
