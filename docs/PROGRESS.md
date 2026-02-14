# Feature 01: Vehicle Profile - Progress

## Phase 1: Database Schema ✅

- [x] Add FuelType enum
- [x] Add Vehicle model to Prisma schema
- [x] Run migration

---

## Phase 2: Domain Layer ✅

### Value Objects

- [x] VehicleId.vo.ts + tests
- [x] Vin.vo.ts + tests
- [x] Year.vo.ts + tests
- [x] Mileage.vo.ts + tests

### Entity

- [x] Vehicle.entity.ts + tests

### Repository & Exceptions

- [x] IVehicleRepository interface
- [x] VehicleNotFound.exception.ts
- [x] VehicleAlreadyExists.exception.ts
- [x] InvalidVehicle.exception.ts

---

## Phase 3: Application Layer ✅

### DTOs ✅

- [x] CreateVehicle.dto.ts + tests
- [x] UpdateVehicle.dto.ts + tests
- [x] UpdateMileage.dto.ts + tests
- [x] GetVehicle.dto.ts + tests

### Mapper ✅

- [x] Vehicle.mapper.ts + tests

### Use Cases

- [x] CreateVehicle.uc.ts + tests
- [x] GetVehicleByUser.uc.ts + tests
- [x] UpdateVehicle.uc.ts + tests
- [x] UpdateMileage.uc.ts + tests
- [x] DeleteVehicle.uc.ts + tests

### Service

- [x] Vehicle.service.ts + tests

---

## Phase 4: Infrastructure Layer ✅

- [x] PrismaVehicle.repository.ts + tests
- [x] Vehicle.mapper.ts (infrastructure) + tests
- [x] Vehicle.controller.ts + tests

---

## Phase 5: Module & Wiring ✅

- [x] Vehicles.module.ts
- [x] Update app.module.ts
- [x] Add validation constants
- [x] Manual API testing (all 5 endpoints verified)

---

## Phase 6: Frontend Types & Schemas

- [x] vehicle.types.ts (Vehicle, FuelType, FUEL_TYPE_LABELS)
- [x] vehicle.schema.ts (createVehicle, updateVehicle, updateMileage)
- [x] vehicle.schema.spec.ts

---

## Phase 7: Frontend API & Store

- [x] vehicle.service.ts (getMyVehicle, create, update, updateMileage, delete)
- [x] vehicle.service.spec.ts
- [x] vehicle.store.ts (atoms, computed, actions)
- [x] vehicle.store.spec.ts

---

## Phase 8A: Select UI Component + Hook ✅

- [x] Select.tsx + Select.spec.tsx (reusable UI component)
- [x] Update ui/index.ts barrel export
- [x] useVehicle.ts + useVehicle.spec.ts

---

## Phase 8B: VehicleForm + VehicleProfile ✅

- [x] VehicleForm.tsx + VehicleForm.spec.tsx (create/edit modes)
- [x] VehicleProfile.tsx + VehicleProfile.spec.tsx (display view)

---

## Phase 8C: EmptyState + DeleteDialog + QuickMileage ✅

- [x] VehicleEmptyState.tsx + VehicleEmptyState.spec.tsx
- [x] DeleteVehicleDialog.tsx + DeleteVehicleDialog.spec.tsx
- [x] QuickMileageUpdate.tsx + QuickMileageUpdate.spec.tsx

---

## Phase 9: Container, Pages & Navigation

### Step 9A: Astro Page + Nav + Container Empty Mode ✅

- [x] /vehicle/index.astro
- [x] Update Main.astro navigation ("Mon véhicule" link)
- [x] features/vehicles/index.ts (barrel export)
- [x] VehicleContainer.tsx loading + empty modes (3 tests)

### Step 9B: Container Create Mode ✅

- [x] VehicleContainer create mode (4 tests)

### Step 9C: Container View Mode ✅

- [x] VehicleContainer view mode + QuickMileageUpdate (3 tests)

### Step 9D: Container Edit Mode ✅

- [x] VehicleContainer edit mode (5 tests)

### Step 9E: Container Delete Flow ✅

- [x] VehicleContainer delete flow (4 tests + 1 error handling)

---

## Phase 10: PR Polish — CI Fixes & Code Review Feedback

### 10A: Fix missing explicit cleanup in 4 test files + CI bun version ✅

- [x] Select.spec.tsx — add `beforeEach` with `cleanup()`
- [x] useVehicle.spec.ts — add `cleanup()` to existing `beforeEach`
- [x] vehicle.store.spec.ts — add `cleanup()` to existing `beforeEach`
- [x] user.service.spec.ts — add `cleanup()` to existing `beforeEach`
- [x] Update CI bun version from 1.3.3 to 1.3.5 (match local)

### 10B: ConfirmDialog unique IDs ✅

- [x] Use `useId()` for `aria-labelledby` and `aria-describedby`
- [x] Existing tests pass (no spec update needed — tests verify behavior not IDs)

### 10C: vehicle.service.ts falsy data fix ✅

- [x] Change `!response.data` to `response.data == null`
- [x] Existing tests pass (falsy data not a realistic scenario for Vehicle API)

### 10D: Schema empty string preprocessing — DROPPED

- Reverted: `z.preprocess` breaks `zodResolver` type inference (input types become `unknown`)
- React Hook Form already handles empty optional fields correctly — theoretical problem, not real

### 10E: VehicleContainer shouldUnregister ✅

- [x] Add `shouldUnregister: true` to useForm options

### 10F: Remove redundant fetchVehicle after mileage update ✅

- [x] Remove `await fetchVehicle()` from handleQuickMileageSubmit

### 10G: Remove leftover TODO comments ✅

- [x] Clean up 3 TODO(human) comments in VehicleContainer.spec.tsx

### 10H: Final check suite + push ✅

- [x] All tests pass locally (368 pass, 0 fail)
- [x] typecheck passes
- [x] lint passes
- [x] format passes
- [x] CI passes after push

### Future improvements (from Copilot review, low priority)

- [ ] VehicleContainer: add fallback `return null` at end for defensive rendering
- [ ] VehicleContainer: surface fetch errors to user instead of showing empty state
- [ ] VehicleContainer: replace `vehicle!.id` non-null assertions with guard clauses
- [ ] apiRequest: handle empty-body responses (204/205) explicitly instead of catching JSON parse
      errors
