# Snack Overflow — Office Pantry & Snack Inventory System

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Node](https://img.shields.io/badge/Node.js-22_LTS-green?logo=node.js)
![Next.js](https://img.shields.io/badge/Next.js-15_App_Router-black?logo=next.js)
![Express](https://img.shields.io/badge/Express-4.21-lightgrey?logo=express)
![Prisma](https://img.shields.io/badge/Prisma-6.4-blueviolet?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue?logo=postgresql)

**Snack Overflow** is a full-stack, production-minded office pantry and snack inventory management application built to handle high-concurrency snack consumption without race conditions, stock discrepancies, or duplicate voting.

---

## Key Features

- **Race-Condition-Free Inventory Consumption:** Employs atomic conditional PostgreSQL `UPDATE` statements with row-level locks ensuring that even if 10 users click "Consume" simultaneously on the last 3 items, exactly 3 succeed and 7 receive `409 Conflict`.
- **Multi-Snack Transactional Basket:** Members can assemble multiple snack varieties and quantities into a snack basket, atomically consumed in an all-or-nothing PostgreSQL transaction (`POST /api/snacks/consume-basket`).
- **Strict Role-Based Experience (RBAC):**
  - **Admin:** Insight-driven dashboard (`/dashboard`), full inventory management (`/admin`), and immutable audit trail (`/activities`). Consumption controls are completely removed from both UI and API (`403 MEMBER_ROLE_REQUIRED`).
  - **Member:** Primary landing on the Snack Catalog (`/snacks`), personalized **My Favourites** (`/favourites`), and personal **Consumption History** (`/history`).
- **Global Theme Engine:** Seamless switching between **Light** (`#F8F7F3`), **Dark** (`#0B1120`), and **System** preference with zero page flicker, persistent storage, and WCAG AAA contrast.
- **Hardened Database Integrity:** Enforces composite unique constraints on `(userId, snackId)`, `CHECK (quantity >= 0)`, `CHECK (lowStockThreshold >= 0)`, and `CHECK (amount > 0)`.
- **Dynamic Stock Status:** Real-time computation of `STOCKED`, `RUNNING_LOW`, and `GONE` statuses—never stored statically in the database.
- **Audit-Trail Continuity:** Uses `ON DELETE RESTRICT` for users to guarantee immutable activity history, and `ON DELETE SET NULL` with a historical snack snapshot for deleted items.
- **Dual-Layer CSRF Defense:** Origin and Referer verification coupled with cryptographic synchronizer tokens (`snack_csrf` cookie + `X-CSRF-Token` header) and server-side session revocation.
- **Modern Pantry Dashboard:** Live telemetry, Snack of the Week calculation with deterministic tie-breaking, real-time alerts, and recent activities.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, TanStack Query, React Hook Form, Zod |
| **Backend** | Node.js 22, Express.js, TypeScript, Prisma ORM 6, Zod, JWT, bcryptjs, Cookie-Parser |
| **Database** | PostgreSQL 18 with relational constraints and atomic row updates |
| **Testing** | Vitest, Supertest, real PostgreSQL concurrency test suite, frontend interaction tests |

---

## Project Structure

```
snack-overflow/
├── frontend/             # Next.js 15 App Router web client
│   ├── src/
│   │   ├── app/          # Routes: login, dashboard, snacks, favourites, history, admin, activities
│   │   ├── components/   # UI components, layout shell, basket drawer, modals, cards
│   │   ├── context/      # AuthContext, BasketContext, ThemeContext, ToastContext, QueryProvider
│   │   ├── services/     # Centralized API service modules (snack, activity, auth, api)
│   │   └── lib/          # Utilities, dynamic status calculations
│   ├── tests/            # Frontend service and basket state tests (Vitest)
│   └── package.json
├── backend/              # Express.js REST API
│   ├── src/
│   │   ├── config/       # Environment and database configuration
│   │   ├── controllers/  # Request handlers and response envelopes
│   │   ├── middleware/   # Authentication, RBAC, error handling, CSRF
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic and atomic concurrency transactions
│   │   ├── utils/        # Status calculations, error classes
│   │   └── validators/   # Zod request validators
│   ├── prisma/           # Schema, versioned migrations, idempotent seed
│   ├── tests/            # Supertest API & PostgreSQL concurrency tests
│   └── package.json
├── docs/                 # Engineering documentation
│   ├── ARCHITECTURE.md   # System architecture and concurrency design
│   ├── DATABASE.md       # ERD, constraints, schema specification
│   ├── API_SPEC.md       # Full REST API documentation
│   └── DESIGN_SYSTEM.md  # Design tokens, typography, component guidelines
├── .env.example          # Safe template for environment configuration
└── README.md
```

---

## Seed Credentials (Demo Accounts)

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `Admin1234!` | Full inventory CRUD, restock, view activity audit logs |
| **Member** | `member@example.com` | `Member1234!` | View catalog, consume snacks, vote/unvote |

---

## Getting Started

### Prerequisites
- **Node.js**: `v22.x` or higher
- **npm**: `10.x` or higher
- **PostgreSQL**: `v18.x` running on port `5432`

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/SanjayKumarHM13/snack_overflow.git
   cd snack_overflow
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run migrations and seed database:
   ```bash
   npm --prefix backend run prisma:migrate
   npm --prefix backend run prisma:seed
   ```
5. Start development servers:
   ```bash
   # In terminal 1 (Backend API on port 4000)
   npm --prefix backend run dev

   # In terminal 2 (Frontend on port 3000)
   npm --prefix frontend run dev
   ```

---

## Automated Testing & Quality Verification

All integration and concurrency tests execute against a dedicated, isolated PostgreSQL test database (`snack_overflow_test`) with zero mock data for database queries.

```bash
# Run all tests across the monorepo (74 tests: 59 backend + 15 frontend)
npm run test

# Run backend integration & concurrency tests only (59 tests)
npm run test:backend

# Run frontend service & basket logic tests only (15 tests)
npm run test:frontend

# Run strict TypeScript typecheck across monorepo
npm run typecheck

# Run ESLint across monorepo
npm run lint

# Build frontend production bundle
npm --prefix frontend run build
```

### Concurrency Test Scenarios Verified

1. **Scenario 1 (10 Simultaneous Requests against Stock 3):**
   - 10 parallel HTTP POST `/api/snacks/:id/consume` requests with amount = 1.
   - Result: Exactly 3 requests succeed with `200 OK`, exactly 7 requests receive `409 Conflict (INSUFFICIENT_STOCK)`.
   - Final stock quantity: exactly 0.
   - Activity audit records created: exactly 3.

2. **Scenario 2 (2 Concurrent Multi-Packet Requests against Stock 3):**
   - 2 parallel HTTP POST `/api/snacks/:id/consume` requests with amount = 2.
   - Result: Exactly 1 request succeeds with `200 OK`, exactly 1 request receives `409 Conflict`.
   - Final stock quantity: exactly 1.
   - Activity audit records created: exactly 1.

---

## Concurrency Guarantees

Snack Overflow's core engineering achievement is safe, high-concurrency inventory decrementing without overconsumption:
```sql
UPDATE "snacks"
SET "quantity" = "quantity" - $1, "updatedAt" = NOW()
WHERE "id" = $2::uuid AND "quantity" >= $1
RETURNING *;
```
Combined with an atomic transaction that records the activity log, this guarantees that inventory updates are race-free, durable, and strictly positive.
