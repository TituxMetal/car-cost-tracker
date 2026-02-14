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
