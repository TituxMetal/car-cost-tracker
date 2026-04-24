# Feature Shape: Admin Onboarding

## Problem

Email delivery is intentionally disabled in this project (verification tokens are logged to the
server console rather than sent). This is fine for a solo developer, but it blocks a real-world use
case: onboarding colleagues, friends, and family to test the application before launch. Currently an
admin cannot create a user from the admin UI, cannot mark a pending user as verified without copying
a token out of server logs, and cannot reset a password if a tester forgets theirs. Without these
three actions, delivering a usable app to ~5-10 testers without standing up email infrastructure is
operationally impossible.

## Solution (Broad Strokes)

Three client-only admin actions wiring the existing Better Auth admin plugin (already used in the
app for `setRole`, `banUser`, `unbanUser`, `removeUser`, and `listUsers`):

- **Create user** — a form dialog on `/admin/users` where the admin enters email, username,
  password, and optional firstName/lastName. The user is created with `role: 'user'` and
  `emailVerified: true`, ready to log in immediately. Credentials are transmitted admin-to-tester
  out-of-band (Signal, SMS, verbal).
- **Verify user** — a button on `/admin/users/:id`, visible only when `emailVerified` is false, that
  flips the flag to true. Covers users who went through the standard signup flow or who existed
  before this feature.
- **Reset password** — a form dialog on `/admin/users/:id` where the admin sets a new password for
  the target user. Used when a tester forgets their password. The new password is transmitted
  out-of-band.

No email is ever sent. All credentials are transmitted admin-to-tester via out-of-app channels —
this constraint is accepted given the trusted-circle tester audience ("not a bank"). The feature
ships in the current admin visual style (DaisyUI vanilla); visual polish is grouped with the Visual
Refresh Block 6 that restyles the entire admin area.

## User Flow

### Create a new user

1. Admin navigates to `/admin/users`
2. Clicks "Ajouter un user" in the page header
3. Dialog opens with a form (email, username, password, firstName?, lastName?)
4. Admin fills the form and submits
5. System validates (Zod on frontend, Better Auth on the backend side) and creates the user with
   `emailVerified: true` and `role: 'user'`
6. Dialog closes, admin is redirected to `/admin/users/:id` for the newly created user
7. Admin transmits email + password to the tester via Signal/SMS/verbal
8. Tester signs in at `/auth` immediately; no verification step required

### Verify an existing pending user

1. Admin navigates to `/admin/users/:id` for a user whose status badge reads "Unverified"
2. In the Actions card, sees the "Valider l'email" button (visible only when
   `emailVerified === false`)
3. Clicks the button (no confirmation dialog — low-stakes action)
4. System flips `emailVerified` to true
5. Status badge updates to "Verified", a success alert confirms the action, and the button
   disappears
6. The tester can now sign in

### Reset a user's password

1. Admin navigates to `/admin/users/:id`
2. Clicks "Réinitialiser le password" in the Actions card
3. Dialog opens with a single password field
4. Admin types the new password and submits
5. System validates against the same rules as signup and updates the password
6. Dialog closes, a success alert confirms the change and reminds the admin to transmit the new
   password to the tester

## Dependencies

**Requires:**

- Better Auth admin plugin — already installed and wired client-side in `authClient.ts`
- Admin route guard — already enforced via middleware for `/admin/**` routes
- Existing admin pages (`/admin`, `/admin/users`, `/admin/users/:id`) — already in place ✅
- Existing signup validation rules (email format, username format, password minimum length) — reused
  verbatim for the admin create form

**Enables:**

- Actually delivering the app to real testers without email infrastructure
- Recovering from tester password loss without data destruction (create + delete + recreate would
  lose the tester's vehicle / check logs / expenses / budget)

## What Must Exist (Backend)

**N/A — all three actions are fully supported by the Better Auth admin plugin (v1.5.5 installed),
verified against the package source:**

- `authClient.admin.createUser({ email, password, name, data: { username, firstName, lastName, emailVerified: true } })`
  — the server spreads `data` into the user record (`plugins/admin/routes.mjs` line 167), so custom
  inferred fields and the pre-verified flag all pass through. When `password` is present, it is
  hashed and linked as a credential account (same file, lines 170-177) so the user can sign in
  immediately.
- `authClient.admin.updateUser({ userId, data: { emailVerified: true } })` — the server forwards
  `data` unchanged to the internal adapter (`plugins/admin/routes.mjs` line 239), so any column
  update goes through, including `emailVerified`. Used to verify pre-existing users who went through
  the regular signup flow before this feature landed.
- `authClient.admin.setUserPassword({ userId, newPassword })` — direct native support, returns
  `{ status: boolean }`.

No backend code is added in this feature.

## What Must Exist (Frontend)

### Shared logic

- A Zod schema for the create-user form, mirroring the existing signup rules (email, username,
  password; firstName and lastName optional). Not stricter than signup, not laxer — the same rules,
  reused
- A Zod schema for the reset-password form (single password field, same minimum length as signup)

### Components

- **Create user dialog** — Radix Dialog wrapper, consistent with the existing dialog pattern used by
  Expenses, Budget, Check Logs, and Check Types (shared `DialogShell`/`ConfirmDialog` primitives
  reused)
- **Create user form** — React Hook Form + Zod resolver, fields: email, username, password,
  firstName (optional), lastName (optional). Submit/Cancel buttons in the modal-action footer
- **Reset password dialog** — same Radix Dialog pattern, single password field, submit/cancel
- **Extended user list** — the existing `/admin/users` page gets a page-level header with the page
  title and an "Ajouter un user" primary button. Clicking the button opens the Create user dialog
- **Extended user management** — the existing Actions card on `/admin/users/:id` gains two buttons:
  "Valider l'email" (conditional on `!emailVerified`, no dialog, direct action) and "Réinitialiser
  le password" (opens Reset password dialog)

### State & interactions

- Each dialog manages its own open/closed state via the parent component (`UserList` for create,
  `UserManagement` for reset)
- After successful create, the dialog closes and the admin is redirected to the new user's detail
  page, giving immediate visibility of all actions available on that user
- After successful verify, the consuming component's local user state is updated so the button
  disappears and the status badge flips
- After successful reset, the dialog closes, an inline success alert informs the admin to transmit
  the new password, and no page navigation happens

## UI Reference

### Visual Target

Matches the current `/admin/**` area — DaisyUI zebra table for `UserList`, card-based sections for
`UserManagement`, semantic status badges (success / warning / error), inline `alert` for feedback.
No design deviation from the current admin look. The whole area — including these two new dialogs —
is scheduled for a unified restyle in Block 6 of the Visual Refresh feature.

### Layout & Structure

- `/admin/users` page gains a header row above the existing table: page title on the left, the
  "Ajouter un user" primary button on the right (inline on desktop, stacked on mobile)
- Create dialog: centered modal on desktop (`modal modal-open` + `modal-box`), full-screen sheet on
  mobile. Body holds the form fields in a single column; footer holds Cancel + Submit
- Reset dialog: identical shape, single input row in the body
- `/admin/users/:id` Actions card gains two buttons in the existing flex-wrap action row; "Valider
  l'email" is only rendered when `emailVerified === false`

### UI Components & Patterns

- **Button variants** reused from the shared primitive: default (primary amber) for Submit and
  Verify, outline for Cancel
- **Inputs** use the existing shared `Input`, `Label`, `FormWrapper` primitives
- **Confirmation dialogs** — none for Create and Verify (form submit and button click are themselves
  the user intent). Reset is a dialog with a form, not a confirm-style dialog
- **Success feedback** — inline `alert alert-success` above the content area. For Reset the copy
  explicitly reminds the admin to transmit the password out-of-band
- **Error feedback** — inline `alert alert-error` above the form for server errors (duplicate email,
  duplicate username); per-field errors for Zod validation
- **Status badges** on `UserList` rows are unchanged — Verified / Unverified / Banned via
  `badge-success` / `badge-warning` / `badge-error`

### Design Tokens

All via existing DaisyUI theme tokens — no hardcoded hex, no pure black, no pure white. When the
Visual Refresh foundation block swaps the theme tokens, these new components pick up the new cockpit
look automatically; the explicit per-component class refresh follows in Visual Refresh Block 6.

### Responsiveness

- Create and Reset dialogs collapse to full-screen sheets on mobile, centered overlays on desktop —
  inherited from the existing dialog pattern
- The "Ajouter un user" button stacks below the page title on mobile (`< sm`) and sits inline on
  desktop (`≥ sm`)
- `UserList` table keeps its `overflow-x-auto` wrapper (already in place)
- Verify and Reset buttons inherit the existing `flex-wrap gap-3` of the Actions card — they wrap to
  the next line on narrow viewports

## Open Questions

1. **Button copy (FR).** "Valider l'email" vs "Marquer comme vérifié" vs "Activer le compte" —
   subtle semantic difference. The user understands email is never sent, so "Activer le compte" may
   actually be clearer than "Valider l'email". → **Tune during implementation.**
2. **Confirm field on Reset password.** The password field is filled by the admin, not by the target
   user, and the action is trivially repeatable. A confirm-second-time field adds friction with no
   real safety benefit. → **Recommendation: single field, no confirm.**
3. **Generate-random-password helper.** A small "Générer un password" button that pre-fills a secure
   random password in the create form would remove thinking-about-passwords from the admin flow.
   Useful but not essential. → **Recommendation: deferred. Track as a polish item if the feature is
   used enough to warrant it.**

## Out of Scope

- Any form of email delivery — verification email, password reset email, welcome email. The entire
  point of this feature is to operate without email infrastructure
- Multi-admin coordination — the application has exactly one admin (the user himself); any
  multi-admin concerns are future work
- Impersonate / "login as" — Better Auth admin plugin exposes `impersonateUser`, and it would be
  useful for debugging, but it solves a different problem (debug) and is deferred
- Audit trail / log of admin actions — tracked as a future concern, not needed for tester onboarding
- Bulk user creation or CSV import — one user at a time is fine for the tester volume
- 2FA, backup codes, WebAuthn — same decision as the rest of the app: security level suited to the
  tester-circle context, no escalation here
- Password strength meter — same rules as signup, no new UI affordance
- Auto-generated password helper — see Open Questions #3
- Visual polish — belongs to Visual Refresh Block 6

## Risks / Gotchas

- **Cleartext password transmission.** Admin transmits passwords out-of-band via Signal, SMS, or
  verbal. This is explicitly accepted given the trusted-circle context. Document the assumption in
  the dialog copy and in the user flow so future contributors do not reintroduce an email flow "to
  fix security" without understanding the trade-off.
- **Self-target edges.** An admin can theoretically target their own account (self-verify if somehow
  unverified, self-reset their own password). Both are harmless: self-verify on an already-verified
  user is a no-op; self-reset simply changes their password, same as the profile page would. No
  special guard added.
- **Verify button visibility logic.** Button shown only when `emailVerified === false`. If an admin
  navigates to an already-verified user's page, the button must not render. This matches the
  existing Ban/Unban pattern in `UserManagement` (only the inverse action is shown).
- **Error surface in dialogs.** Better Auth returns structured errors for duplicate email, duplicate
  username, and password policy failures. These must surface inline in the dialog — not swallowed,
  not bounced to a page-level alert that gets hidden by the dialog overlay. The form error component
  lives inside the dialog body.
- **Create-then-redirect ordering.** After `admin.createUser` resolves, the flow is: close the
  dialog → navigate to `/admin/users/:id`. The target user's detail page re-fetches via
  `admin.listUsers` (existing pattern). There is a brief moment where the list cache is stale;
  acceptable given the low traffic on this page.
- **Reset password UX clarity.** The admin must understand that the new password is NOT communicated
  automatically. The dialog body subtitle and the success alert both explicitly say: "Le nouveau
  password n'est envoyé à personne — transmettez-le vous-même au testeur."
- **Visual refresh coupling.** This feature ships in the current admin visual style. When Visual
  Refresh Block 6 lands, the two new dialogs and the three new buttons must be restyled as part of
  that block. Add an explicit reminder in the Visual Refresh implementation plan so they are not
  forgotten.
- **Admin table refresh after create.** The user list at `/admin/users` is not directly refreshed
  after a create (since the flow redirects to the new user's detail page). When the admin navigates
  back to the list, it re-fetches on mount via the existing `useEffect`. No stale-cache risk.
