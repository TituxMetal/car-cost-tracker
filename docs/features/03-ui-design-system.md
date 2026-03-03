# Feature Shape: UI Design System Migration

## Problem

The current interface is functional but visually inconsistent and amateur-looking. Components use
hand-crafted Tailwind utility classes with no shared design language — buttons, cards, forms, and
dialogs all look slightly different depending on the screen. Color usage is ad-hoc (sky, amber,
indigo mixed without a clear hierarchy), spacing is inconsistent, and interactive elements lack the
polish expected of a production app. The result is an interface that works but doesn't feel cohesive
or professional.

## Solution (Broad Strokes)

Integrate **DaisyUI 5.x** as a Tailwind plugin for consistent component styling and **Radix UI** for
accessible headless interactive primitives. Replace the current ad-hoc Tailwind classes with
DaisyUI's semantic component classes (btn, card, input, modal, etc.) themed with a custom dark
amber/zinc palette. Use Radix UI for complex interactive elements (dialogs, selects, popovers) to
gain built-in keyboard navigation, focus management, and ARIA compliance. Replace the current
react-icons/astro-icon mix with **Lucide** for a unified icon set.

**Main UI elements affected:**

- All shared UI components (Button, Input, Label, Select, Textarea, FormWrapper, ConfirmDialog)
- All feature screens (auth, vehicle, check types, profile, admin)
- Both layouts (Main, Admin)
- Global styles and theme configuration

**Data involved:**

- No data model changes — this is a purely visual/frontend migration

## User Flow

This is a cross-cutting UI migration, not a feature with a specific user flow. The end result from
the user's perspective:

1. User navigates to any screen in the application
2. All screens share a consistent dark theme with amber accents and zinc neutrals
3. Buttons, inputs, cards, and dialogs look and behave identically across all features
4. Interactive elements (dialogs, selects) have proper keyboard navigation and focus management
5. The overall experience feels polished, cohesive, and professional

## Dependencies

**Requires:**

- All currently implemented features (auth, vehicle profile, check types) — they are what gets
  refactored
- DaisyUI 5.x, Radix UI, and Lucide packages installed in the web app

**Enables:**

- All future features (check logging, dashboard, expenses, budget) will be built with the design
  system from day one
- Polish step (MVP Build Order #8) becomes significantly simpler
- Consistent UX across the entire application

## What Must Exist (Backend)

N/A — this is a frontend-only migration. No backend changes required.

## What Must Exist (Frontend)

**Package installation and configuration:**

- DaisyUI 5.x installed and configured as Tailwind plugin
- Custom DaisyUI theme with dark amber/zinc tokens
- Radix UI primitives installed (Dialog, Select, and any other needed primitives)
- Lucide React installed, replacing react-icons and astro-icon

**Shared UI components refactored:**

- Button — use DaisyUI `btn` classes with variant mapping
- Input — use DaisyUI `input` classes
- Label — use DaisyUI `label` classes
- Select — replace with Radix UI Select + DaisyUI styling
- Textarea — use DaisyUI `textarea` classes
- FormWrapper — use DaisyUI `form-control` patterns
- ConfirmDialog — replace with Radix UI Dialog + DaisyUI modal styling

**Feature screens refactored:**

- Auth screens (login, signup, forgot password, reset password, verify email, verification pending)
- Vehicle screens (container, form, profile view, empty state, quick mileage, delete dialog)
- Check types screens (container, form, list, card, suggested types, delete dialog)
- Profile screens (view, edit, change password, delete account)
- Admin screens (dashboard, user management, user list, user detail)

**Layouts refactored:**

- Main layout — consistent header/navigation with DaisyUI navbar
- Admin layout — consistent admin shell

**Global styles updated:**

- Theme configuration with DaisyUI custom theme
- Remove hand-crafted color variables, use DaisyUI theme tokens
- Update typography and spacing to use DaisyUI conventions where appropriate

## UI Reference

### Visual Target

The Spark prototype (`https://github.com/TituxMetal/car-repair-cost-trac`) serves as the **design
reference only** — its theme, color palette, visual hierarchy, and component quality are the
standard to match. The Spark's functional behavior and feature scope are NOT part of this
specification. What matters from the Spark:

- Dark theme with warm accent colors
- Clean card-based layouts with clear visual hierarchy
- Professional typography and spacing
- Polished form and button styling
- Consistent visual language across all screens

### Layout & Structure

- **Global structure:** Top navigation bar (DaisyUI navbar) + main content area, full-width layout
  with max-width container for content centering
- **Visual hierarchy:** Page title prominent at top, then primary action area, then content
  cards/lists below
- **Card-based content:** All data displays (vehicle profile, check type list, user profile) use
  DaisyUI card components with consistent border, padding, and shadow treatment
- **Forms:** Centered single-column forms with clear label/input/error stacking, wrapped in card
  containers
- **Spacing:** Consistent section gaps (gap-6 or gap-8 between major sections), card padding (p-6),
  form field spacing (space-y-4)

### UI Components & Patterns

**DaisyUI components used:**

- `btn` — primary (amber), secondary (zinc), ghost, outline, destructive (error) variants
- `card` — content containers with `card-body`, `card-title`, `card-actions`
- `input`, `textarea`, `select` — form elements with `input-bordered` styling
- `navbar` — top navigation with brand and nav links
- `modal` — confirmation dialogs (backed by Radix UI Dialog for accessibility)
- `badge` — status indicators, interval labels on check types
- `alert` — error messages, success feedback, warnings
- `loading` — spinner states during async operations
- `menu` — navigation menus and dropdown options
- `tooltip` — contextual help text
- `divider` — section separators

**Radix UI primitives used:**

- Dialog — for all confirmation dialogs and modals (delete vehicle, delete check type, delete
  account)
- Select — for dropdowns (fuel type, engine type, any future selects)
- Popover — for contextual menus or additional information panels (if needed)
- AlertDialog — for destructive action confirmations

**Interactive patterns:**

- Hover state on cards and list items (subtle background shift)
- Focus ring on all interactive elements (amber ring for primary, zinc for neutral)
- Loading spinners on async actions (form submissions, data fetching)
- Toast/alert feedback after create, update, delete operations

**States:**

- Empty state — illustrated message with call-to-action button (DaisyUI alert or custom)
- Loading state — DaisyUI loading spinner centered in content area
- Error state — DaisyUI alert with error token color and retry action
- Success feedback — DaisyUI alert with success token color, auto-dismiss

### Design Tokens

All styling uses DaisyUI theme tokens referencing the tokens defined in MVP.md Design System:

- **primary (amber):** Main action buttons, focus rings, active navigation links, accent highlights
- **neutral (zinc):** Backgrounds (base-100/200/300 mapped to zinc-900/800/700), card borders, text
  colors, secondary buttons
- **success (emerald):** Success alerts, positive status indicators, confirmation feedback
- **error (red):** Error alerts, destructive buttons, validation error messages, delete actions
- **warning (amber):** Warning alerts, overdue check indicators, budget overspend warnings
- **base-100/200/300:** Dark background scale (zinc-950 → zinc-900 → zinc-800) for depth layers
- **base-content:** Primary text color (zinc-100), secondary text (zinc-300), muted text (zinc-400)

No hardcoded hex values — all colors through DaisyUI theme tokens or Tailwind zinc/amber/emerald/red
scale.

### Responsiveness

- **Mobile-first approach:** Base styles target mobile, breakpoints scale up
- **Navigation:** Navbar collapses to hamburger menu on small screens (DaisyUI drawer pattern)
- **Cards:** Full-width on mobile, constrained max-width on desktop
- **Forms:** Single-column on all breakpoints, max-width constraint on desktop for readability
- **Lists:** Check type cards stack vertically on mobile, could use grid on wider screens
- **Actions:** Action buttons stack vertically on mobile, inline on desktop
- **Dialogs:** Full-screen on mobile, centered overlay on desktop
- **Spacing:** Reduced padding on mobile (p-4 instead of p-6)

## Open Questions

1. Should the DaisyUI theme use a fully custom theme or extend the built-in `dark` theme with
   overrides? **Leaning toward:** Fully custom theme to have complete control over the amber/zinc
   palette.
2. Should existing `react-icons` and `astro-icon` be removed in this migration or deprecated
   gradually? **Leaning toward:** Full removal — clean cut, no dual icon systems.
3. Should the admin layout share the same navbar component as the main layout, or have its own?
   **Leaning toward:** Shared navbar with role-based menu items.

## Out of Scope

- New features or screens — this migration refactors only what already exists
- Backend changes of any kind
- Functional behavior changes — same features, same flows, better visual treatment
- Light mode or theme switching — dark mode only (per code-style rules)
- Animation library integration (Framer Motion, etc.) — keep transitions CSS-only
- Design tokens file export (JSON/YAML) — DaisyUI theme config is sufficient
- Component documentation (Storybook) — defer to a future initiative

## Risks / Gotchas

- **Breaking existing tests:** Component tests that assert on specific class names or DOM structure
  will break when classes change from Tailwind utilities to DaisyUI semantic classes. Tests need to
  be updated alongside each component refactor.
- **DaisyUI class conflicts:** Some DaisyUI class names may conflict with existing utility classes.
  Migration should be done component-by-component, not globally, to catch conflicts early.
- **Radix UI hydration:** Radix UI components are client-side React components. In the Astro SSR
  context, they must be within `client:load` or `client:visible` islands. Existing component
  boundaries should handle this, but verify each dialog/select integration.
- **Icon migration scope:** Replacing react-icons and astro-icon with Lucide across all features is
  a wide change. Some icons may not have direct Lucide equivalents — find closest matches.
- **Regression risk:** With 30+ components across 5 feature domains, visual regressions are likely.
  Manual visual review of each screen is essential after migration.
- **DaisyUI 5.x maturity:** DaisyUI 5.x is relatively new — verify compatibility with Tailwind v4
  and check for known issues before starting.
- **Bundle size:** Adding DaisyUI + Radix UI + Lucide increases the bundle. Monitor size impact,
  though DaisyUI is CSS-only and tree-shakeable, and Radix/Lucide are individually importable.
