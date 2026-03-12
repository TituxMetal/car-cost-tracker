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

### Block 4: Auth Feature (Phases 9-10) — `feature/design-system-auth` ✅

#### Phase 9: Auth Feature — Login & Signup ✅

- [x] LoginForm.tsx + tests (no changes needed — uses shared Input)
- [x] SignupForm.tsx + tests (no changes needed — uses shared Input)

#### Phase 10: Auth Feature — Remaining Screens ✅

- [x] AuthContainer.tsx + tests
- [x] ForgotPasswordContainer.tsx + tests
- [x] ResetPasswordContainer.tsx + tests
- [x] VerifyEmailContainer.tsx + tests
- [x] VerificationPendingContainer.tsx + tests
- [x] SessionList.tsx + tests

---

### Block 5: Vehicle Feature (Phases 11-12) — `feature/design-system-vehicles`

#### Phase 11: Vehicle Feature — Form & Profile ✅

- [x] VehicleForm.tsx + tests (fieldset grouping, responsive grid, required props)
- [x] VehicleProfile.tsx + tests (max-w-lg → max-w-2xl)

#### Phase 12: Vehicle Feature — Container & Remaining ✅

- [x] VehicleContainer.tsx + tests (text-zinc-100 → text-base-content)
- [x] VehicleEmptyState.tsx + tests (no changes needed — uses shared Button)
- [x] QuickMileageUpdate.tsx + tests (no changes needed — uses shared Input/Button)
- [x] DeleteVehicleDialog.tsx + tests (no changes needed — uses shared ConfirmDialog)

---

### Block 6: Check Types Feature (Phases 13-14) — `feature/design-system-check-types`

#### Phase 13: Check Types — Card, List & Suggestions ✅

- [x] CheckTypeCard.tsx + tests (card card-body bg-base-200, badge badge-neutral for interval)
- [x] CheckTypeList.tsx + tests (grid gap-4)
- [x] SuggestedCheckTypes.tsx + tests (card card-body card-compact bg-base-300, badge-sm)

#### Phase 14: Check Types — Form, Container & Dialog ✅

- [x] CheckTypeForm.tsx + tests (no changes needed — uses shared Input/Textarea)
- [x] CheckTypeContainer.tsx + tests (text-zinc-100 → text-base-content)
- [x] DeleteCheckTypeDialog.tsx + tests (no changes needed — uses shared ConfirmDialog)

---

### Block 7: Profile, Admin & Cleanup (Phases 15-17) — `feature/design-system-profile-admin` ✅

#### Phase 15: Profile Feature ✅

- [x] ProfileView.tsx + tests (card bg-base-200, semantic colors, page layout fix)
- [x] EditProfileForm.tsx + tests (no changes needed — uses shared Input)
- [x] EditProfileContainer.tsx + tests (card bg-base-200 + card-body wrapper)
- [x] ChangePasswordForm.tsx + tests (card bg-base-200, alert alert-success)
- [x] DeleteAccountSection.tsx + tests (card border-error, semantic colors)
- [x] DeleteAccountDialog.tsx + tests (Radix UI Dialog + DaisyUI modal)

#### Phase 16: Admin Feature ✅

- [x] AdminDashboard.tsx + tests (card bg-base-200 stat cards, semantic colors)
- [x] UserList.tsx + tests (table table-zebra, badge badge-primary/success/error/warning)
- [x] UserManagement.tsx + tests (card bg-base-200, badges, alert alert-error/success)
- [x] UserDetailContainer.tsx + tests (semantic loading/error colors)

#### Phase 17: Icon Cleanup & Final Verification ✅

- [x] Verify all react-icons replaced with Lucide (none remaining)
- [x] Remove react-icons and astro-icon packages
- [x] Clean up astro.config.mjs (already clean from Phase 8)
- [x] Final automated checks (522 tests pass, typecheck, lint, format)
- [x] Manual visual review of all screens

---

## Post-Feature-03 Housekeeping

### Block 1: MVP Sync + develop → main PR ✅

- [x] Update MVP.md checkboxes for Check Types (4 items + 1 Done criteria)

### Block 2: Docker Bug Fix — `fix/docker-migrations-env` ✅

- [x] Fix RUN_MIGRATIONS mismatch (start.sh checks 'yes', compose.yaml sets 'true')
- [x] Remove deprecated `version: '3.8'` from compose.yaml

### Block 3: Dependency Updates — `chore/dependency-updates`

- [ ] Batch 1: Safe updates (NestJS, Prisma, React, Astro 5.x, tooling)
- [ ] Batch 2: TailwindCSS 4.2 (verify DaisyUI 5 compatibility)
- [ ] Batch 2: better-auth 1.5 + nestjs-better-auth (review changelogs first)
- [ ] Batch 2: @happy-dom 20.x (optional — skip if tests break)
- [ ] Ship updates to develop

### Block 4: Fly.io Deployment — `feature/fly-deployment`

- [ ] Create Fly.io apps (api + web) and SQLite volume
- [ ] Create fly-api.toml and fly-web.toml configs
- [ ] Deploy both apps
- [ ] Verify full flow on live URL
- [ ] Update MVP.md "Deployed to a public URL" checkbox
- [ ] Ship to develop

### Block 5: Final Merge

- [ ] Create PR develop → main (Blocks 2-4)
- [ ] Merge and sync
- [ ] Ready for Feature 04: Check Logging

---

## Backlog — Future Improvements

### From Feature 01 PR review (low priority)

- [ ] VehicleContainer: add fallback `return null` at end for defensive rendering
- [ ] VehicleContainer: surface fetch errors to user instead of showing empty state
- [ ] VehicleContainer: replace `vehicle!.id` non-null assertions with guard clauses
- [ ] apiRequest: handle empty-body responses (204/205) explicitly instead of catching JSON parse
      errors
