# Progress Tracking

---

## Feature 02: Check Types - Progress

## Phase 1: Database Schema ✅

- [x] Add CheckType model to Prisma schema
- [x] Add Vehicle → CheckType relation
- [x] Run migration

---

## Phase 2: Domain Layer

### Value Objects

- [x] CheckTypeId.vo.ts + tests
- [x] CheckTypeName.vo.ts + tests
- [x] IntervalDays.vo.ts + tests

### Entity

- [x] CheckType.entity.ts + tests

### Validation, Repository & Exceptions

- [x] CheckType.validation.ts
- [x] ICheckTypeRepository interface
- [x] CheckTypeNotFound.exception.ts
- [x] CheckTypeAlreadyExists.exception.ts
- [x] InvalidCheckType.exception.ts

---

## Phase 3: Application Layer

### DTOs

- [ ] CreateCheckType.dto.ts + tests
- [ ] UpdateCheckType.dto.ts + tests
- [ ] GetCheckType.dto.ts + tests

### Mapper

- [ ] CheckType.mapper.ts + tests

### Use Cases

- [ ] CreateCheckType.uc.ts + tests
- [ ] GetCheckTypesByVehicle.uc.ts + tests
- [ ] GetCheckType.uc.ts + tests
- [ ] UpdateCheckType.uc.ts + tests
- [ ] DeleteCheckType.uc.ts + tests

### Service

- [ ] CheckType.service.ts + tests

---

## Phase 4: Infrastructure Layer

- [ ] CheckTypeInfra.mapper.ts + tests
- [ ] PrismaCheckType.repository.ts + tests
- [ ] CheckType.controller.ts + tests

---

## Phase 5: Module & Wiring

- [ ] CheckTypes.module.ts
- [ ] Update app.module.ts
- [ ] Manual API testing

---

## Phase 6: Frontend Types & Schemas

- [ ] checkType.types.ts (CheckType, SuggestedCheckType, SUGGESTED_CHECK_TYPES)
- [ ] checkType.schema.ts + tests

---

## Phase 7: Frontend API & Store

- [ ] checkType.service.ts + tests
- [ ] checkType.store.ts + tests

---

## Phase 8: Hook & Components

### 8A: Hook

- [ ] useCheckTypes.ts + tests

### 8B: List & Card

- [ ] CheckTypeList.tsx + tests
- [ ] CheckTypeCard.tsx + tests

### 8C: Form

- [ ] CheckTypeForm.tsx + tests

### 8D: Empty State & Suggestions

- [ ] CheckTypeEmptyState.tsx + tests
- [ ] SuggestedCheckTypes.tsx + tests

### 8E: Delete Dialog

- [ ] DeleteCheckTypeDialog.tsx + tests

### 8F: Container

- [ ] CheckTypeContainer.tsx + tests

---

## Phase 9: Page & Navigation

- [ ] /check-types/index.astro
- [ ] Update Main.astro navigation ("Contrôles" link)
- [ ] features/check-types/index.ts (barrel export)

---

## Backlog — Future Improvements

### From Feature 01 PR review (low priority)

- [ ] VehicleContainer: add fallback `return null` at end for defensive rendering
- [ ] VehicleContainer: surface fetch errors to user instead of showing empty state
- [ ] VehicleContainer: replace `vehicle!.id` non-null assertions with guard clauses
- [ ] apiRequest: handle empty-body responses (204/205) explicitly instead of catching JSON parse
      errors
