# Progress Tracking

---

## Feature 03: UI Design System Migration - Progress

### Block 1: Foundation (Phases 1-2) — `feature/design-system-foundation`

#### Phase 1: Package Installation & Configuration

- [x] Install DaisyUI 5.x, Radix UI Dialog, Radix UI AlertDialog, Lucide React
- [x] Configure @plugin "daisyui" in globals.css
- [x] Remove astro-icon integration from astro.config.mjs (done in Phase 8)
- [x] Verify app loads without errors

#### Phase 2: Custom Theme & Global Styles

- [x] Configure custom "cartracker" theme (dim base + amber primary)
- [x] Update base styles to use DaisyUI theme tokens
- [x] Visual sanity check

---

### Block 2: Shared UI Components (Phases 3-7) — `feature/design-system-ui-components`

#### Phase 3: Button Component Migration ✅

- [x] Button.tsx → DaisyUI btn classes + tests

#### Phase 4: Input & Label Components ✅

- [x] Input.tsx → DaisyUI input classes + tests
- [x] Label.tsx → DaisyUI label classes + tests

#### Phase 5: Textarea & Select Components ✅

- [x] Textarea.tsx → DaisyUI textarea classes + tests
- [x] Select.tsx → DaisyUI select classes + tests

#### Phase 6: FormWrapper Migration ✅

- [x] FormWrapper.tsx → DaisyUI alert for errors + tests

#### Phase 7: ConfirmDialog → Radix UI Dialog ✅

- [x] ConfirmDialog.tsx → Radix UI Dialog + DaisyUI modal + tests

---

### Block 3: Layouts (Phase 8) — `feature/design-system-layouts`

#### Phase 8: Layout Migration ✅

- [x] Main.astro → DaisyUI navbar + responsive menu
- [x] AdminLayout.astro → shared navbar, admin sub-nav
- [x] Layout icon replacement (inline SVGs or Lucide)

---

### Block 4: Auth Feature (Phases 9-10) — `feature/design-system-auth`

#### Phase 9: Auth Feature — Login & Signup

- [ ] LoginForm.tsx + tests
- [ ] SignupForm.tsx + tests

#### Phase 10: Auth Feature — Remaining Screens

- [ ] AuthContainer.tsx + tests
- [ ] ForgotPasswordContainer.tsx + tests
- [ ] ResetPasswordContainer.tsx + tests
- [ ] VerifyEmailContainer.tsx + tests
- [ ] VerificationPendingContainer.tsx + tests
- [ ] SessionList.tsx + tests

---

### Block 5: Vehicle Feature (Phases 11-12) — `feature/design-system-vehicles`

#### Phase 11: Vehicle Feature — Form & Profile

- [ ] VehicleForm.tsx + tests
- [ ] VehicleProfile.tsx + tests

#### Phase 12: Vehicle Feature — Container & Remaining

- [ ] VehicleContainer.tsx + tests
- [ ] VehicleEmptyState.tsx + tests
- [ ] QuickMileageUpdate.tsx + tests
- [ ] DeleteVehicleDialog.tsx + tests

---

### Block 6: Check Types Feature (Phases 13-14) — `feature/design-system-check-types`

#### Phase 13: Check Types — Card, List & Suggestions

- [ ] CheckTypeCard.tsx + tests
- [ ] CheckTypeList.tsx + tests
- [ ] SuggestedCheckTypes.tsx + tests

#### Phase 14: Check Types — Form, Container & Dialog

- [ ] CheckTypeForm.tsx + tests
- [ ] CheckTypeContainer.tsx + tests
- [ ] DeleteCheckTypeDialog.tsx + tests

---

### Block 7: Profile, Admin & Cleanup (Phases 15-17) — `feature/design-system-profile-admin`

#### Phase 15: Profile Feature

- [ ] ProfileView.tsx + tests
- [ ] EditProfileForm.tsx + tests
- [ ] EditProfileContainer.tsx + tests
- [ ] ChangePasswordForm.tsx + tests
- [ ] DeleteAccountSection.tsx + tests
- [ ] DeleteAccountDialog.tsx + tests

#### Phase 16: Admin Feature

- [ ] AdminDashboard.tsx + tests
- [ ] UserList.tsx + tests
- [ ] UserManagement.tsx + tests
- [ ] UserDetailContainer.tsx + tests

#### Phase 17: Icon Cleanup & Final Verification

- [ ] Verify all react-icons replaced with Lucide
- [ ] Remove react-icons and astro-icon packages
- [ ] Clean up astro.config.mjs
- [ ] Final automated checks (test, typecheck, lint, format)
- [ ] Manual visual review of all screens

---

## Backlog — Future Improvements

### From Feature 01 PR review (low priority)

- [ ] VehicleContainer: add fallback `return null` at end for defensive rendering
- [ ] VehicleContainer: surface fetch errors to user instead of showing empty state
- [ ] VehicleContainer: replace `vehicle!.id` non-null assertions with guard clauses
- [ ] apiRequest: handle empty-body responses (204/205) explicitly instead of catching JSON parse
      errors
