# Progress Tracking

Current state only. Deferred items live in [`BACKLOG.md`](./BACKLOG.md).

---

## Feature 08: Admin Onboarding

- Feature shape: `docs/features/08-admin-onboarding.md`
- Implementation plan: `~/.claude/plans/car-cost-tracker-08-admin-onboarding.md`
- Scope: client-only via Better Auth 1.5.5 admin plugin — zero backend changes. Unblocks external
  tester onboarding without email infrastructure.

### Block 1: Frontend outside-in (Phases 1-5) — `feature/admin-onboarding`

#### Phase 1: Shell — visible buttons wired to placeholder handlers ✅

- [x] Move `<h1>` into `UserList` + add "Ajouter un user" button (placeholder handler) + spec
      assertions for title and button presence
- [x] Extend `UserManagement` with "Valider l'email" (conditional on `!emailVerified`) and
      "Réinitialiser le password" buttons (placeholder handlers) + spec assertions for conditional
      render

#### Phase 2: Zod schemas (create + reset) + barrel ✅

- [x] `createUser.schema.ts` + spec — reuses signup rules verbatim (username 3-50 alnum/underscore,
      email, password min 8), `firstName` / `lastName` optional
- [x] `resetPassword.schema.ts` + spec — single password field, min 8, no confirm
- [x] `features/admin/schemas/index.ts` barrel

#### Phase 3: Create User flow (form + dialog + wiring) ✅

- [x] `CreateUserForm` component + spec — 5 fields (username, email, password, firstName?,
      lastName?), password rendered as `type='text'` so admin can read before transmitting
      out-of-band
- [x] `CreateUserDialog` component + spec — Radix dialog wrapper (reuses `DialogShell` +
      `FormWrapper`), RHF + Zod resolver, inline server error surface
- [x] Wire create flow in `UserList` (`admin.createUser` with `data` spread for custom fields +
      `emailVerified: true`, `name` computed from first+last or username fallback, redirect to
      `/admin/users/:id`) + spec update

#### Phase 4: Verify email action ✅

- [x] Wire `handleVerify` in `UserManagement`
      (`admin.updateUser({ userId, data: { emailVerified:     true } })`, local state update flips
      badge + hides button, inline success alert) + spec update

#### Phase 5: Reset Password flow (form + dialog + wiring) ✅

- [x] `ResetPasswordForm` component + spec — single password field rendered as `type='text'`
- [x] `ResetPasswordDialog` component + spec — dialog body description includes the out-of-band
      reminder (`"n'est envoyé à personne — transmettez-le vous-même au testeur"`), RHF + Zod
      resolver, inline server error surface
- [x] Wire reset flow in `UserManagement` (`admin.setUserPassword`, inline success alert that
      reminds admin to transmit the new password out-of-band) + spec update

---

## Ready to plan (feature shapes written, no implementation plan yet)

- **Feature 09: Visual Refresh** — shape `docs/features/09-visual-refresh.md`. Applies the V01
  Cluster direction across every shipped screen, ships the Budget / Recent Expenses dashboard
  widgets that complete MVP Core §5, covers mobile-friendly audit. Plan pending, follows Feature 08.

## Not started

- **MVP Full** — multi-car support, vehicle switcher, optional public profile. Feature shapes to be
  written later (post Visual Refresh).
