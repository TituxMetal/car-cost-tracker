# HANDOFF — "V1 Cluster" visual refresh for car-cost-tracker

> **For Claude Code (or another agent).** The goal of this document is to **refresh the visual
> styling** of the Astro app so it looks like a retro-modern car dashboard, WITHOUT regressing the
> existing work on semantics, accessibility, and contrast. Read this ENTIRE file before touching any
> code.

---

## STRICT RULES — DO NOT BREAK

### FORBIDDEN

1. **NEVER replace a semantic element with a `<div>`.** `<article>`, `<section>`, `<header>`,
   `<footer>`, `<nav>`, `<main>`, `<aside>`, `<dl>/<dt>/<dd>`, `<ul>/<li>`, `<h1>…<h6>`, `<time>`,
   `<form>`, `<fieldset>`, `<legend>`, `<label>` MUST be preserved.
2. **NEVER remove or modify existing ARIA attributes** (`aria-label`, `aria-describedby`,
   `aria-invalid`, `aria-hidden`, `role`, `htmlFor`, `aria-live`, etc.).
3. **NEVER remove `data-testid` attributes** or break `*.spec.tsx` tests. If a test breaks for a
   visual reason (class renamed), fix the test selector — never drop the accessibility assertion.
4. **NEVER introduce inline `style={{…}}`.** Tailwind and DaisyUI classes only. If a custom effect
   is required, go through `@apply` in `globals.css` or a custom utility class.
5. **NEVER modify**:
   - component prop signatures
   - nanostores stores (`*.store.ts`)
   - hooks (`use*.ts`)
   - API services (`*.service.ts`)
   - Zod schemas (`*.schema.ts`)
   - TypeScript types
   - Astro routing structure (`pages/`)
6. **NEVER drop contrast below WCAG AA** (4.5:1 for body text, 3:1 for large text ≥ 18px or ≥ 14px
   bold). Stated goal: strict AA everywhere, AAA (7:1) wherever it comes for free.
7. **NEVER encode information by color alone.** Every colored badge/telltale/gauge MUST have a
   visible text label OR an `aria-label` OR an `.sr-only` fallback.

### ALLOWED

1. Modifying **Tailwind classes** on existing markup.
2. Adding **new components** to `~/components/ui/` provided they comply with the rules above (see
   the reference `Gauge.tsx` and `TelltaleLight.tsx` shipped with this handoff).
3. Adding **purely visual wrappers** (`<span>`, `<div>`) around existing content when needed for
   layout — provided they do NOT break the semantic hierarchy.
4. Adding extra `className` values to `<Button>`, `<Input>`, etc. via their `className` prop.
5. Adding new **DaisyUI tokens** in `globals.css` if needed.
6. Adding extra `aria-label` / `aria-describedby` (never fewer).
7. Improving keyboard handling (`:focus-visible`) and `prefers-reduced-motion` support.

### Guiding principle

The HTML mockups provided as reference (V1 in `export/src/index.html`) are **visual only**. Their
markup is deliberately loose (nested `<div>` everywhere) to prototype quickly. **DO NOT COPY THE
MARKUP.** Copy only the **visual result**: colors, spacing, typography, composition, visual
hierarchy.

---

## 1. Theme & tokens

### File: `apps/web/src/styles/globals.css`

Replace **entirely** with the contents of `handoff/styles/globals.css`.

**Key changes vs. the old theme:**

| Token                  | Before                     | After                 | Reason                            |
| ---------------------- | -------------------------- | --------------------- | --------------------------------- |
| `--color-base-100`     | `oklch(30.857% 0.023 264)` | `oklch(18% 0.01 264)` | Darker background, cockpit feel   |
| `--color-base-200`     | `28.036%`                  | `22%`                 | Darker panels                     |
| `--color-base-300`     | `26.346%`                  | `28%`                 | More visible borders              |
| `--color-base-content` | `82.9%`                    | `93%`                 | Brighter text → more contrast     |
| `--color-primary`      | `79.5% 0.157 70`           | `80% 0.16 75`         | Warmer amber                      |
| `--color-error`        | `82.4% 0.099 33`           | `70% 0.22 25`         | More saturated red = real warning |
| `--radius-field`       | `0.375rem`                 | `0.25rem`             | Squarer, more technical           |
| `--font-sans`          | (system)                   | `Oxanium`             | Geometric, retro-techno           |
| `--font-mono`          | (system)                   | `JetBrains Mono`      | Gauge-panel screens               |

**Computed contrast ratios** (read the header of the shipped `globals.css` — everything is
documented, everything passes AA, most reaches AAA).

**Fonts to import** — add to `apps/web/src/layouts/Layout.astro` (or equivalent):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Oxanium:wght@500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
  rel="stylesheet"
/>
```

---

## 2. New UI components (primitives)

Two new primitives to create under `apps/web/src/components/ui/`. The files are ready to copy from
`handoff/components/ui/`.

### `Gauge.tsx` — circular dashboard-style gauge

- Semantics: `<div role="meter">` with `aria-valuenow/min/max/label`
- SVG is `aria-hidden`, info lives in ARIA + `.sr-only`
- Statuses: `on-time | due-soon | overdue | never` → color via DaisyUI
- **Copy**: `handoff/components/ui/Gauge.tsx` → `apps/web/src/components/ui/Gauge.tsx`
- **Copy**: `handoff/components/ui/Gauge.spec.tsx` → `apps/web/src/components/ui/Gauge.spec.tsx`

### `TelltaleLight.tsx` — telltale warning light

- Semantics: `<span role="status">` (non-critical) or `role="alert"` + `aria-live="assertive"`
  (critical)
- Color + Lucide icon **+ text label** (never color alone)
- **Copy**: `handoff/components/ui/TelltaleLight.tsx` →
  `apps/web/src/components/ui/TelltaleLight.tsx`
- **Copy**: `handoff/components/ui/TelltaleLight.spec.tsx` → same

### Update `components/ui/index.ts`

Add:

```ts
export { Gauge } from './Gauge'
export type { GaugeProps, GaugeStatus } from './Gauge'
export { TelltaleLight } from './TelltaleLight'
export type { TelltaleLightProps, TelltaleStatus } from './TelltaleLight'
```

---

## 3. Existing components — visual refresh only

For each component below, **markup stays identical unless stated otherwise**. Only `className`
values change.

### 3.1 `components/ui/Button.tsx`

**Do NOT touch** the structure (forwardRef, polymorphic `as`, types). Simply add two variants:

```ts
export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'warning'

const variantClasses = {
  default: 'btn-primary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  destructive: 'btn-error',
  warning: 'btn-warning'
}
```

Optional: add a base class for the "cluster" look:

```ts
const baseClasses = 'btn font-display uppercase tracking-wider'
```

Adjust existing tests (`Button.spec.tsx`) if the label is now uppercase via CSS (not via HTML
content) — assertions like `getByText('Modifier')` still hold because `text-transform: uppercase`
does not alter the DOM.

### 3.2 `features/check-logs/components/CheckStatusBadge.tsx`

**Current markup** (keep):

```tsx
<span className={`badge ${statusConfig[status].className}`}>{statusConfig[status].label}</span>
```

**Evolution**: add a small circular telltale **BEFORE** the label, marked `aria-hidden` (the info is
already in the text):

```tsx
<span className={`badge gap-1.5 ${statusConfig[status].className}`}>
  <span aria-hidden='true' className='inline-block h-2 w-2 rounded-full bg-current' />
  {statusConfig[status].label}
</span>
```

The text label stays mandatory → no a11y loss.

### 3.3 `features/check-logs/components/CheckLogCard.tsx`

Markup **fully preserved** (`<article>/<section>/<header>/<h2>/<ul>/<li>/<footer>`). Only classes
change:

- `card card-border` → `card card-border border-base-300 bg-base-200`
- `hover:-translate-y-0.5` → keep
- On `<header>`: add `border-b border-base-300 pb-2 mb-1`
- On `<h2>`: add `font-display uppercase tracking-wide text-primary`
- Lucide icons: `text-primary/70` → `text-primary`

### 3.4 `features/check-types/components/CheckTypeCard.tsx`

Markup preserved. Class changes:

- Replace `border-l-primary border-l-4` with `border-l-primary border-l-2` (thinner, more elegant)
  AND add `border border-base-300`
- On `<h2 className="card-title">` → `font-display uppercase tracking-wide`
- "Tous les X jours" block → `font-mono text-primary/80`

### 3.5 `features/vehicles/components/VehicleProfile.tsx`

**Your current code is already exemplary** (`<dl>/<dt>/<dd>`). Evolutions:

- `<article className='card bg-base-200'>` → add `border border-base-300`
- Add a `<header>` at the top of `<section className='card-body'>`:

  ```tsx
  <header className='border-base-300 border-b pb-3'>
    <p className='text-base-content/70 font-mono text-xs tracking-widest uppercase'>
      Fiche véhicule
    </p>
  </header>
  ```

- `<dt>` → `text-base-content/70 text-xs font-mono uppercase tracking-wider`
- `<dd>` → add `font-medium`
- Numeric values (year, mileage) could switch to `font-mono` for the cluster look — optional.
- `Delete` button: add `aria-describedby` pointing to an `.sr-only` warning text:

  ```tsx
  <p id='delete-warning' className='sr-only'>
    Cette action est irréversible
  </p>
  <Button variant='destructive' aria-describedby='delete-warning' onClick={onDelete}>
    Supprimer
  </Button>
  ```

### 3.6 `features/vehicles/components/QuickMileageUpdate.tsx`

Markup preserved. Evolutions:

- `<h2 className='card-title'>` → add `font-display uppercase tracking-wide`
- Turn the "Kilométrage actuel : …" paragraph into a digital-screen-style panel:

  ```tsx
  <p className='text-base-content/70'>
    Kilométrage actuel :{' '}
    <span className='text-primary font-mono text-lg'>{formatMileage(currentMileage)}</span>
  </p>
  ```

- The `<Input type='number'>` gets `className='font-mono text-lg'` for the "odometer screen" look.
  **Do not touch** the `Input.tsx` component itself.

### 3.7 `features/auth/components/LoginForm.tsx` / `SignupForm.tsx`

No markup change needed. Make sure the container (`AuthContainer.tsx`) uses:

- A `<main>` wrapper with `max-w-md mx-auto` centered vertically
- An `<h1>` with `font-display uppercase tracking-wider` above
- A `card bg-base-200 border border-base-300` panel

### 3.8 `features/vehicles/components/VehicleContainer.tsx`

**Note**: this component renders several `<h1>` (one per mode). That is semantically correct because
only one mode is rendered at a time. Keep it.

Visual evolutions:

- `<h1 className='text-base-content mb-8 text-center text-4xl font-bold'>` →
  `<h1 className='text-base-content mb-8 text-center text-4xl font-display font-bold uppercase tracking-wider'>`
- The `view` mode could benefit from a 2-column grid on desktop (profile + mileage update side by
  side). Example:

  ```tsx
  <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2'>
    <VehicleProfile ... />
    <QuickMileageUpdate ... />
  </div>
  ```

  But **verify it does not break** the `VehicleContainer.spec.tsx` tests.

---

## 4. Final a11y checklist (run after every modified component)

- [ ] Component keeps its semantic landmark(s)
- [ ] All original `aria-*` attributes are still present
- [ ] Every colored piece of info has a text counterpart (visible label OR `.sr-only`)
- [ ] Keyboard nav: `Tab`, `Shift+Tab`, `Enter`, `Space` all work
- [ ] `:focus-visible` is visible (amber outline via `globals.css`)
- [ ] No inline `style={{…}}` introduced
- [ ] `*.spec.tsx` tests still pass (`bun test`)
- [ ] `bun run lint` passes
- [ ] `bun run typecheck` passes
- [ ] Contrast ratio verified (Chrome DevTools → Lighthouse)

---

## 5. Recommended order

1. **Theme**: replace `globals.css`, import the fonts, visually verify the app does not break.
2. **Primitives**: copy `Gauge.tsx`, `TelltaleLight.tsx` + specs, update `components/ui/index.ts`,
   run `bun test`.
3. **Button**: add `warning` variant + `font-display uppercase` base classes.
4. **Features, one at a time**, in this order:
   - `CheckStatusBadge` (small, easy)
   - `CheckLogCard` / `CheckTypeCard`
   - `VehicleProfile` + `QuickMileageUpdate`
   - `VehicleContainer` (desktop grid)
   - `LoginForm` / `SignupForm` / `AuthContainer`
5. **Manual a11y tests** (keyboard + screen reader) on the 3 main flows: login, view vehicle, log a
   check.
6. **Lighthouse** on each page → a11y score must stay ≥ 95.

---

## 6. Visual reference

The full HTML mockup lives in `export/src/index.html` (or the bundled standalone version). It
contains 10+ component variants. Use it **purely as a visual reference**, not as a markup source.

The mockup's CSS is in `export/src/index.css` and can inspire the `drop-shadow` effects for the
telltales and the transitions.

---

## 7. When in doubt

- If a rule in this file conflicts with existing code, **existing code wins** (it was already
  hardened for a11y).
- If a visual change would require breaking semantics, **do not make the change** and flag it.
- Always prefer **under-delivering** over damaging accessibility.

End of handoff.
