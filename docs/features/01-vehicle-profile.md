# Feature Shape: Vehicle Profile

## Problem

Car owners need a central place to store their vehicle's essential information. Without this, they
can't track checks or expenses against a specific vehicle. The vehicle profile is the foundation of
the entire app — everything else (checks, expenses, budget) is tied to it.

## Solution (Broad Strokes)

The user can create, view, edit, and delete ONE vehicle (MVP Core scope). The vehicle stores all
relevant details that a car owner might need to reference: identification (VIN, license plate),
specifications (make, model, year, engine, fuel type), and ownership info (purchase date, current
mileage).

**Main UI elements:**

- A vehicle form for creating/editing
- A vehicle profile view displaying all details
- Edit and delete actions accessible from the profile view

**Data involved:**

- Vehicle entity owned by the authenticated user
- All fields stored and editable

## User Flow

1. User logs in and lands on the dashboard
2. If no vehicle exists, user sees a prompt to create their first vehicle
3. User clicks "Add Vehicle" and sees a form with all vehicle fields
4. User fills in the details and submits
5. System validates the data and creates the vehicle
6. User is redirected to the vehicle profile view
7. From the profile view, user can:
   - Edit vehicle details (opens the same form in edit mode)
   - Delete the vehicle (with confirmation dialog)
8. After deletion, user is redirected to dashboard showing the "no vehicle" state

## Dependencies

**Requires:**

- Authentication system (already implemented)
- Authenticated user session available via `@Session()` decorator
- Database schema for Vehicle entity

**Enables:**

- Check Types — templates are tied to a vehicle
- Check Logging — logs are recorded against a vehicle
- Expenses — expenses are tied to a vehicle
- Dashboard — displays vehicle summary and status
- Budget — budget is set per vehicle

## What Must Exist (Backend)

**Domain layer:**

- Vehicle entity with all properties (make, model, year, engine, fuel type, VIN, license plate,
  purchase date, current mileage)
- Vehicle ID value object for type-safe identification
- Vehicle repository interface for persistence operations
- Domain exceptions (vehicle not found, validation errors)

**Application layer:**

- Create vehicle use case
- Get vehicle use case (by user)
- Update vehicle use case
- Delete vehicle use case
- Vehicle DTOs for input/output
- Vehicle mapper for domain ↔ DTO conversion

**Infrastructure layer:**

- Vehicle controller with CRUD endpoints
- Prisma vehicle repository implementation
- Database migration for Vehicle table

**Validations:**

- Required fields: make, model, year
- Year must be a valid 4-digit number (reasonable range, e.g., 1900-2030)
- Mileage must be non-negative if provided
- VIN format validation (17 characters, alphanumeric, no I/O/Q)
- License plate: no strict validation (formats vary by country)
- User can only have ONE vehicle (MVP Core constraint)

**API endpoints:**

- `POST /vehicles` — create vehicle
- `GET /vehicles/mine` — get current user's vehicle
- `PATCH /vehicles/:id` — update vehicle
- `DELETE /vehicles/:id` — delete vehicle

## What Must Exist (Frontend)

**Pages/routes:**

- Vehicle creation page (or modal)
- Vehicle profile view page
- Vehicle edit page (could reuse creation form)

**Components:**

- Vehicle form (reusable for create/edit)
- Vehicle profile card/view
- Delete confirmation dialog
- Empty state component ("No vehicle yet")

**State management:**

- Vehicle store (current user's vehicle)
- Loading and error states
- Actions: fetch, create, update, delete

**User interactions:**

- Form submission with validation feedback
- Inline editing or dedicated edit page
- Delete with confirmation
- Navigation between dashboard and vehicle views

## Open Questions

1. Should mileage be updateable independently (quick update from dashboard) or only via the full
   edit form?
2. For the "single vehicle" constraint — should we show an error if they try to create a second, or
   just not show the "Add" button at all?
3. Should deleting the vehicle also delete all related data (check types, logs, expenses)? Or soft
   delete?

## Out of Scope

- Multiple vehicles per user (MVP Full)
- Vehicle image/photo upload
- Mileage history tracking (only current mileage stored)
- Vehicle sharing with other users
- Import vehicle data from external sources (VIN lookup API)

## Risks / Gotchas

- **Cascade deletion:** Deleting a vehicle should cascade to check types, check logs, and expenses.
  Need to decide on hard delete vs soft delete. Hard delete is simpler for MVP but loses history.
- **User ownership validation:** Every vehicle operation must verify the authenticated user owns the
  vehicle. Following the existing pattern in the users feature.
- **Single vehicle constraint:** This is a business rule for MVP Core only. Implementation should be
  easy to lift later for MVP Full. Consider checking at creation time rather than hardcoding in the
  schema.
- **Mileage updates:** Users will want to update mileage frequently. If it requires opening the full
  edit form, it might be friction. Consider a quick-update option.
