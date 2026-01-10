# Car Cost Tracker — MVP Definition

## Overview

A web application to track vehicle maintenance, recurring checks, and associated costs. Built for
car owners who want to stay on top of their vehicle's health and understand their true cost of
ownership.

**Target users:** Initially myself and family (sister, brother-in-law) who own Mini Coopers and
classic cars (205 GTI, R5 GT Turbo). Potentially open to other users later.

**UI Language:** French

## Core Value

1. **Never miss a check** — Know exactly when to check oil, coolant, tire pressure, etc.
2. **Track everything** — Full history of checks performed and expenses incurred
3. **Financial clarity** — See how much you're spending vs your budget
4. **Multiple vehicles** — Manage a whole garage, not just one car

## Reference

Functional prototype (Spark): `https://github.com/TituxMetal/car-repair-cost-trac`

This prototype serves as the visual and functional reference. The real project will be rebuilt from
scratch with proper architecture, testing, and multi-user support.

## MVP Scope

### MVP Core (Must Ship — 6-8 weeks)

Single-user, single-car version. The minimum to have something usable and presentable.

### MVP Full (Nice to Have — if time permits)

Multi-user, multi-car version. Allows sharing with family/friends.

---

## MVP Core Features

### 1. Authentication

- [ ] User registration (email/password)
- [ ] User login/logout
- [ ] Protected routes

### 2. Vehicle Profile (Single Car)

- [ ] Create a vehicle with full details:
  - Make, Model, Year
  - Engine type (e.g., "1.6L Turbo 182ch")
  - Fuel type
  - VIN
  - License plate
  - Purchase date
  - Current mileage
- [ ] Edit vehicle information
- [ ] Delete vehicle

### 3. Check Types (Templates)

- [ ] Create custom check types (e.g., "Oil Level Check", "Tire Pressure", "Coolant Level")
- [ ] Define interval in days (e.g., every 7 days, every 14 days)
- [ ] Add description/instructions for each check type
- [ ] Edit/delete check types

### 4. Check Logging

- [ ] Log a completed check (date, optional notes)
- [ ] System calculates next due date based on interval
- [ ] View check history
- [ ] View check history per check type

### 5. Dashboard

- [ ] Vehicle summary (make, model, mileage)
- [ ] Status: "All checks complete" or list of overdue/upcoming checks
- [ ] Last check performed
- [ ] Budget overview (spent vs budget)
- [ ] Quick access to log a check

### 6. Expenses

- [ ] Add expense (date, amount, category, description)
- [ ] Categories: Service, Parts, Labor, Other
- [ ] View expense history
- [ ] Total spent calculation

### 7. Budget

- [ ] Set monthly or yearly budget
- [ ] View spent vs budget
- [ ] Visual indicator (remaining budget, overspent warning)

---

## MVP Full Features (v1.1)

Everything in MVP Core, plus:

### 8. Multi-Car Support

- [ ] Support multiple vehicles per user
- [ ] Vehicle selector/switcher in UI
- [ ] Per-vehicle check types, logs, expenses, budget

### 9. Multi-User Support

- [ ] Multiple users can register and use the app
- [ ] Each user sees only their own vehicles
- [ ] Basic role system (admin vs user) — optional

### 10. Public Profile (Optional)

- [ ] Option to make some vehicle info public (read-only)
- [ ] Shareable link to vehicle profile

## Technical Stack

| Layer                     | Technology                                 |
| ------------------------- | ------------------------------------------ |
| Monorepo                  | Turborepo                                  |
| Runtime & Package Manager | Bun 1.3.x                                  |
| Backend                   | NestJS 11.x (Clean/Hexagonal Architecture) |
| Database                  | SQLite (dev & prod)                        |
| ORM                       | Prisma 7.x                                 |
| Auth                      | Better Auth 1.4.x                          |
| Frontend                  | Astro 5.x + React 19.x                     |
| Styling                   | TailwindCSS v4 (dark/zinc theme)           |
| Testing                   | Bun test (backend & frontend)              |
| Linting                   | ESLint 9.x + Prettier 3.x                  |
| Git Hooks                 | Husky 9.x + CommitLint 20.x                |
| Deployment                | Docker, docker-compose (Portainer-ready)   |

**Starting point:** Clone from `https://github.com/TituxMetal/sample-project`

### Architecture

- **Backend:** Clean/Hexagonal Architecture (domain, application, infrastructure layers)
- **Frontend:** Feature-based folder structure
- **Testing:** TDD approach — write tests before or immediately after each feature

### Git Workflow

- **Branching:** `main` ← `develop` ← `feature/*`, `fix/*`, `hotfix/*`
- **Commits:** Conventional commits, atomic (one logical change per commit)
- **PRs:** Required for merging feature branches → develop, and develop → main
- **History:** Keep it clean and readable

### To Explore (nice-to-have)

- [ ] TanStack Query (data fetching & caching)
- [ ] TanStack Form (form management)
- [ ] Basic role/permissions system (admin vs user)

## Data Model (High-Level)

```text
User
├── id
├── email
├── password (hashed)
└── vehicles[]

Vehicle
├── id
├── userId (owner)
├── make, model, year
├── engine, fuelType
├── vin, licensePlate
├── purchaseDate
├── currentMileage
├── monthlyBudget (optional)
├── checkTypes[]
├── checkLogs[]
└── expenses[]

CheckType
├── id
├── vehicleId
├── name (e.g., "Oil Level Check")
├── description
├── intervalDays
└── checkLogs[]

CheckLog
├── id
├── checkTypeId
├── completedAt
├── notes (optional)
└── nextDueAt (calculated)

Expense
├── id
├── vehicleId
├── date
├── amount
├── category (service | parts | labor | other)
└── description
```

## Out of Scope (for MVP Core & Full)

- Mileage-based check intervals (time-based only for now)
- Photo upload for receipts/invoices
- Email/push notifications for upcoming checks
- AI suggestions for maintenance
- Advanced analytics (cost per km, graphs over time)
- Multiple currencies (EUR only)

## "Done" Criteria

### MVP Core (Required)

- [ ] Deployed to a public URL
- [ ] Auth works (register, login, logout)
- [ ] Can create and manage ONE vehicle
- [ ] Can create check types with intervals
- [ ] Can log checks and see history
- [ ] Dashboard shows vehicle status and upcoming checks
- [ ] Can track expenses and see totals
- [ ] Budget comparison works
- [ ] Mobile-friendly (responsive)
- [ ] Core features tested
- [ ] Basic documentation (README with setup instructions)

### MVP Full (Stretch Goal)

- [ ] All MVP Core criteria met
- [ ] Can create and manage MULTIPLE vehicles
- [ ] Vehicle switcher in UI
- [ ] Multiple users can use the app independently

## Build Order (High-Level)

> **Note:** This is a bird's-eye view, not a detailed dev plan. Each item represents a complete
> feature (backend + frontend + tests). Detailed step-by-step planning happens in dev sessions with
> Claude Code — keep sessions focused on ONE feature to avoid context compaction issues.

### MVP Core

1. **Project setup & deploy** — Clone sample-project, rename, configure, deploy skeleton to prod.
   CI/CD should be working from day 1.
2. **Vehicle CRUD** — Full feature: create, read, update, delete ONE vehicle
3. **Check Types** — Full feature: CRUD for check templates
4. **Check Logging** — Full feature: log checks, calculate next due date
5. **Dashboard** — Full feature: overview with status, upcoming checks
6. **Expenses** — Full feature: CRUD for expenses, total calculation
7. **Budget** — Full feature: set budget, compare with spent
8. **Polish** — UI refinements, mobile responsiveness, final fixes

### MVP Full (if time permits)

All the MVP Core features, plus:

1. **Multi-car** — Refactor vehicle to support multiple per user
2. **Vehicle switcher** — UI to select active vehicle
3. **Multi-user cleanup** — Ensure data isolation between users
