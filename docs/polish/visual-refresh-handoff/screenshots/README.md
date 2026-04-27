# Visual Refresh — Mockup Screenshots Index

Captured from the V01 "Cluster" mockup (`../index.html`) and the shipped post-refresh state. **These
visuals override** any class-only recipe in `../HANDOFF.md` or
`~/.claude/plans/car-cost-tracker-09-visual-refresh.md` when there is a discrepancy. Trust pixels,
not text.

## Block 1 — Foundation (shipped, PR #52)

- `block-1-nav-desktop-old-ref.png` — pre-refresh top nav (`HOME` brand + lowercase tabs +
  `Titux / Admin / Logout` right cluster). Reference for what was replaced.
- `block-1-nav-mobile-old-ref.png` — pre-refresh mobile with hamburger menu.
- `block-1-nav-desktop-shipped.png` — cluster nav as actually shipped: `COST.LOG` brand + 6
  uppercase tabs (`DASHBOARD VÉHICULE CONTRÔLES HISTORIQUE DÉPENSES BUDGET`) + date·time + avatar.
- `block-1-landing-shipped.png` — public landing page shipped (unauthenticated `/`). Big `COST.LOG`
  brand + `LE TABLEAU DE BORD DE VOTRE VOITURE` tagline + 6-card feature grid
  (`VÉHICULE / CONTRÔLES / DÉPENSES / BUDGET / HISTORIQUE / MULTI-UTILISATEUR`) + amber
  `SE CONNECTER` button + footer. Cluster typography throughout.

## Block 2 — Auth (shipped, PR #53)

- `block-2-auth-connexion-mockup.png` — V01 Cluster split-screen target: editorial hero
  (`// IGNITION` kicker + display headline + tag + version footer) on the left, form column with
  `// ACCÈS PILOTE` kicker + `Connexion` h1 + inlined Input fields + amber `METTRE LE CONTACT →`
  button + `ÉTAT SYSTÈME` panel.
- `block-2-auth-old-login-ref.png` — pre-refresh `COST.LOG` login (centered card, light borders,
  casual typography). Reference for what was replaced.
- `block-2-auth-sessions-shipped.png` — `Active Sessions` page as shipped, demonstrating the cluster
  card + mono row labels + filled `RÉVOQUER` red buttons + amber `SESSION ACTUELLE` highlight
  border.

## Block 3 — Vehicles (shipped, PR #54)

> **Naming convention for this project:** any screenshot showing **Peugeot 206 CC** is a V01 mockup
> (rendered from `index.html`). Any screenshot showing **Mini Cooper S Coupé** is the real running
> app on the user's actual data — but **not necessarily the current shipped state**: it may be a
> mid-iteration error state captured at a specific moment.

- `block-3-vehicle-profile-mockup.png` — V01 mockup target (Peugeot 206 CC): kicker
  `FICHE VÉHICULE · ID V1`, display h1, composed sub-line `— 2004 · 1.6L 16V — 109 ch`, striped
  photo placeholder, `<dl>` 2-col grid, footer with `MODIFIER FICHE` (amber filled) and `SUPPRIMER`
  (red outline), right aside `COMPTEUR KILOMÉTRIQUE` panel and `HISTORIQUE ODO` populated list.
- `block-3-vehicle-profile-mockup-annotated-separator.png` — same V01 mockup with a purple rectangle
  overlay labelled `SÉPARATION` between the left spec grid and the right column. Annotation captures
  a wanted vertical separator cue between the two columns. **Not yet implemented in the shipped
  code** — backlog candidate.
- `block-3-vehicle-profile-shipped-mini.png` — **current shipped state** on the real Mini Cooper
  data: cluster typography throughout, sub-line `— 2012 · 1.6L Turbo` in amber accent, abbreviated
  spec labels `TYPE MOTEUR / CARBURANT / PLAQUE`, photo placeholder copy `[ DANS LES CARTONS ]`,
  compteur `96100 km` singular, `HISTORIQUE COMPTEUR` populated with 3 entries (mileage history
  feature shipped in Block 3).
- `block-3-vehicle-profile-old-error-state-mini.png` — **NOT the current shipped state.**
  Mid-iteration error captured during Block 3 development on the same real Mini Cooper data:
  sub-line `— 2012 · 1.6L Turbo` rendered without amber accent, spec labels in full words
  (`TYPE DE MOTEUR / TYPE DE CARBURANT / PLAQUE D'IMMATRICULATION` instead of the cluster
  abbreviated forms), compteur showing `96065 kms` (plural `kms`), placeholder copy
  `[ PLACEHOLDER PHOTO VÉHICULE ]`. All fixed in subsequent commits before PR #54 merged. Kept here
  as a "what NOT to ship again" reference and as a diff baseline against
  `block-3-vehicle-profile-shipped-mini.png`.

## Block 4 — Checks (Phases 12-14, NEXT — `feature/visual-refresh-checks`)

- `block-4-check-types-desktop.png` — **Phase 13 target.** `CONFIGURATION · TYPES DE CONTRÔLE`
  kicker + h1 `8 contrôles programmés` + `+ NOUVEAU TYPE` amber filled button top-right. Cards in
  3-col grid: **left-border colored by status** (red `EN RETARD`, amber `BIENTÔT`, green `À JOUR`,
  neutral `JAMAIS`) + `border base-300`. Card body: title row (h3 + filled status badge) +
  description + 3-col mini-table mono `INTERV. · DERNIER · PROCHAIN` + footer split: `JOURNALISER`
  outline (~90% width) + `…` overflow (~10%).
- `block-4-check-log-dialog-desktop.png` — **Phase 14 target (LogCheckDialog).** Centered modal/page
  card. Kicker `// NOUVELLE ENTRÉE` amber + h2 `Journaliser un contrôle` display. Selected-type row
  showing type + status sub-line + `TOUS LES X JRS` right (border colored by status). Then `DATE` +
  `KILOMÉTRAGE` 2-col mono inputs. Then `NOTES (OPT.)` mono textarea. Then
  **`PROCHAIN CONTRÔLE CALCULÉ`** info panel with green date + `+N JOURS` (computed from selected
  type's interval + entered date — NEW LOGIC). Footer: `ANNULER` outline + `ENREGISTRER L'ENTRÉE`
  amber filled.
- `block-4-check-log-dialog-mobile.png` — same dialog vertical stacked, full-width `ENREGISTRER`
  button.
- `block-4-check-logs-history-desktop.png` — **Phase 14 target (CheckLogList desktop).** Kicker
  `ARCHIVES · JOURNAL DES CONTRÔLES` + composite h1 `7 entrées · 90 derniers jours`
  - **NO top-right action button** (logs are created from Dashboard or CheckTypeCard, not from
    here). Layout = **TABLE** with columns `DATE · TYPE · ODO · NOTES · PROCHAIN · ×`. Each row
    carries a left border colored by status at log time + a colored dot before the type name. Mono
    throughout. `×` per row deletes.
- `block-4-check-logs-history-mobile.png` — same data as a vertical card list (NOT a table). Each
  card: type name title, `{date} · PROCHAIN {date}` mono sub-line, ODO amber right-aligned, optional
  notes truncated.

## Block 5 — Dashboard (Phases 15-18, AFTER 4)

- `block-5-dashboard-desktop.png` — **Phase 15-18 cockpit target.** Top nav 4 tabs (mockup shows
  fewer than what's shipped — ignore the count delta). 2-col main: **left aside** `VÉHICULE ACTIF`
  kicker + composed name/year/engine + `ODO` mono + `+ DEPUIS` delta composite +
  `+ METTRE À JOUR KILOMÉTRAGE` outline button + `VOYANTS ACTIFS` 6-cell TelltaleLight grid +
  `DERNIÈRE ENTRÉE` recap. **Right main**: `SANTÉ GLOBALE` huge mono number `/100` + 4-stat row
  `EN RETARD · BIENTÔT · À JOUR · JAMAIS` + segmented bar visualisation (per-check colored cells
  across timeline) + `PROCHAINS CONTRÔLES // 8 TYPES` with link `JOURNALISER →` + 4×2 grid of
  **Gauges** (each = circular ring + jrs count + type label + status). Footer
  `TIMELINE · 30 DERNIERS JOURS` with horizontal scatter plot.
- `block-5-dashboard-mobile.png` — vertical: greeting + vehicle name + `SANTÉ` panel (number +
  segmented bar + 3-stat legend) + `KILOMÈTRES` panel + `+ ODO` square button side by side +
  `À TRAITER · 3 ENTRÉES` list of action items (circular telltale + name + status), bottom tab bar 5
  tabs `DASH · AUTO · CONTRÔLES · LOGS · PROFIL` (NOT Dépenses/Budget — Profile is the 5th).
