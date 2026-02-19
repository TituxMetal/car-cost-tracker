# Progress Tracking

---

## Feature 02: Check Types - Progress

## Phases 1-5: Backend (Complete) ✅

---

## Phase 6: Page Setup & Types ✅

- [x] checkType.types.ts (CheckType, SuggestedCheckType, SUGGESTED_CHECK_TYPES)
- [x] types/index.ts barrel
- [x] /check-types/index.astro (Astro page with auth guard)
- [x] Update Main.astro navigation ("Contrôles" link)

---

## Phase 7: Validation Schemas ✅

- [x] checkType.schema.ts + tests
- [x] schemas/index.ts barrel

---

## Phase 8: API Service

- [ ] checkType.service.ts + tests
- [ ] api/index.ts barrel

---

## Phase 9: State Store

- [ ] checkType.store.ts + tests
- [ ] store/index.ts barrel

---

## Phase 10: Hook

- [ ] useCheckTypes.ts + tests
- [ ] hooks/index.ts barrel

---

## Phase 11: Container + List + Card

- [ ] CheckTypeCard.tsx + tests
- [ ] CheckTypeList.tsx + tests
- [ ] CheckTypeContainer.tsx + tests
- [ ] components/index.ts barrel
- [ ] Update Astro page to mount CheckTypeContainer

---

## Phase 12: Form

- [ ] CheckTypeForm.tsx + tests

---

## Phase 13: Empty State & Suggestions

- [ ] SuggestedCheckTypes.tsx + tests
- [ ] CheckTypeEmptyState.tsx + tests

---

## Phase 14: Delete Dialog & Feature Barrel

- [ ] DeleteCheckTypeDialog.tsx + tests
- [ ] features/check-types/index.ts (feature barrel)

---

## Backlog — Future Improvements

### From Feature 01 PR review (low priority)

- [ ] VehicleContainer: add fallback `return null` at end for defensive rendering
- [ ] VehicleContainer: surface fetch errors to user instead of showing empty state
- [ ] VehicleContainer: replace `vehicle!.id` non-null assertions with guard clauses
- [ ] apiRequest: handle empty-body responses (204/205) explicitly instead of catching JSON parse
      errors
