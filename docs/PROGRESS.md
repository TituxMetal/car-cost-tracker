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

## Phase 3: Application Layer 🔄

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
- [ ] UpdateVehicle.uc.ts + tests
- [ ] UpdateMileage.uc.ts + tests
- [ ] DeleteVehicle.uc.ts + tests

### Service

- [ ] Vehicle.service.ts + tests

---

## Phase 4: Infrastructure Layer

- [ ] PrismaVehicle.repository.ts + tests
- [ ] Vehicle.mapper.ts (infrastructure) + tests
- [ ] Vehicle.controller.ts + tests

---

## Phase 5: Module & Wiring

- [ ] Vehicles.module.ts
- [ ] Update app.module.ts
- [x] Add validation constants

---

## Phase 6: Frontend Types & Schemas

- [ ] vehicle.types.ts
- [ ] vehicle.schema.ts + tests

---

## Phase 7: Frontend API & Store

- [ ] vehicle.service.ts
- [ ] vehicle.store.ts

---

## Phase 8: Frontend Components

- [ ] useVehicle.ts hook
- [ ] VehicleForm.tsx + tests
- [ ] VehicleProfile.tsx + tests
- [ ] VehicleEmptyState.tsx
- [ ] DeleteVehicleDialog.tsx
- [ ] QuickMileageUpdate.tsx

---

## Phase 9: Frontend Pages

- [ ] /vehicle/index.astro
- [ ] /vehicle/create.astro
- [ ] /vehicle/edit.astro
- [ ] Update navigation
