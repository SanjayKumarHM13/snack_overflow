# Snack Overflow — Database Architecture & Specification

## 1. Overview
The persistence layer of Snack Overflow is powered by **PostgreSQL 18** managed via **Prisma ORM**. It enforces relational integrity, check constraints, composite uniqueness, and transactional consistency directly in the database engine.

---

## 2. Entity-Relationship Model

```mermaid
erDiagram
    users ||--o{ sessions : "maintains (CASCADE)"
    users ||--o{ votes : "casts (CASCADE)"
    users ||--o{ activities : "performs (RESTRICT)"
    snacks ||--o{ votes : "receives (CASCADE)"
    snacks ||--o{ activities : "targets (SET NULL)"

    users {
        uuid id PK
        varchar(100) name
        varchar(255) email UK
        varchar(255) passwordHash
        enum role "ADMIN | MEMBER"
        timestamptz createdAt
        timestamptz updatedAt
    }

    sessions {
        uuid id PK
        uuid userId FK
        varchar(64) tokenHash UK
        timestamptz expiresAt
        timestamptz revokedAt "nullable"
        timestamptz createdAt
        varchar(255) userAgent
        varchar(45) ipAddress
    }

    snacks {
        uuid id PK
        varchar(120) name UK
        enum category "SWEET | SAVOURY | DRINK | HEALTHY_ISH"
        int quantity "CHECK (quantity >= 0)"
        int lowStockThreshold "CHECK (lowStockThreshold >= 0)"
        timestamptz createdAt
        timestamptz updatedAt
    }

    votes {
        uuid id PK
        uuid userId FK
        uuid snackId FK
        timestamptz createdAt
    }

    activities {
        uuid id PK
        uuid userId FK
        uuid snackId FK "nullable"
        varchar(120) snackName "historical snapshot"
        enum action "CONSUMED | RESTOCKED"
        int amount "CHECK (amount > 0)"
        timestamptz createdAt
    }
```

---

## 3. Entities & Attributes

### A. User (`users`)
Represents an employee or administrator.
- `id`: `UUID` primary key.
- `name`: `VARCHAR(100)` — user's display name.
- `email`: `VARCHAR(255)` — unique email address.
- `passwordHash`: `VARCHAR(255)` — bcrypt hashed password (salt cost 12).
- `role`: `Role` enum (`ADMIN` or `MEMBER`).
- `createdAt`, `updatedAt`: `TIMESTAMPTZ(6)`.

### B. Session (`sessions`)
Tracks active and revoked user authentication sessions for server-side revocation.
- `id`: `UUID` primary key.
- `userId`: `UUID` foreign key referencing `users(id)` with `ON DELETE CASCADE`.
- `tokenHash`: `VARCHAR(64)` — unique SHA-256 cryptographic hash of the session raw token.
- `expiresAt`: `TIMESTAMPTZ(6)` — session expiry timestamp.
- `revokedAt`: `TIMESTAMPTZ(6)` — nullable; non-null indicates an invalidated/logged-out session.
- `userAgent`: `VARCHAR(255)` — browser client string.
- `ipAddress`: `VARCHAR(45)` — client IP address.
- `createdAt`: `TIMESTAMPTZ(6)`.

### C. Snack (`snacks`)
Represents an inventory item in the office pantry.
- `id`: `UUID` primary key.
- `name`: `VARCHAR(120)` — unique snack item name.
- `category`: `SnackCategory` enum (`SWEET`, `SAVOURY`, `DRINK`, `HEALTHY_ISH`).
- `quantity`: `INTEGER` — current available packet count (default `0`).
- `lowStockThreshold`: `INTEGER` — threshold for running-low alerts (default `5`).
- `createdAt`, `updatedAt`: `TIMESTAMPTZ(6)`.

### C. Vote (`votes`)
Records an employee's endorsement for a snack.
- `id`: `UUID` primary key.
- `userId`: `UUID` foreign key referencing `users(id)` with `ON DELETE CASCADE`.
- `snackId`: `UUID` foreign key referencing `snacks(id)` with `ON DELETE CASCADE`.
- `createdAt`: `TIMESTAMPTZ(6)`.
- **Constraint:** Composite unique constraint on `(userId, snackId)`. Prevents duplicate voting at the database level.

### D. Activity (`activities`)
Immutable historical audit trail of consumption and restocking operations.
- `id`: `UUID` primary key.
- `userId`: `UUID` foreign key referencing `users(id)` with `ON DELETE RESTRICT`. Ensures user records cannot be deleted if historical activity exists.
- `snackId`: `UUID` nullable foreign key referencing `snacks(id)` with `ON DELETE SET NULL`. If a snack is deleted, the activity row is preserved.
- `snackName`: `VARCHAR(120)` — snapshot of the snack name at the moment the event occurred.
- `action`: `ActivityAction` enum (`CONSUMED` or `RESTOCKED`).
- `amount`: `INTEGER` — positive quantity transferred.
- `createdAt`: `TIMESTAMPTZ(6)`.

---

## 4. Database Constraints & Rules

1. **Email Uniqueness:** `UNIQUE ("email")` on `users`.
2. **Snack Name Uniqueness:** `UNIQUE ("name")` on `snacks`.
3. **Voting Uniqueness:** `UNIQUE ("userId", "snackId")` on `votes`.
4. **Non-negative Stock CHECK:** `CHECK (quantity >= 0)` on `snacks`.
5. **Non-negative Threshold CHECK:** `CHECK ("lowStockThreshold" >= 0)` on `snacks`.
6. **Positive Amount CHECK:** `CHECK (amount > 0)` on `activities`.
7. **Foreign Key Integrity:**
   - User deletion with existing activity records is blocked (`RESTRICT`).
   - Snack deletion retains audit history with preserved snack name snapshot (`SET NULL`).

---

## 5. Dynamic Stock Status Calculation
Stock status is dynamically computed and never stored in the database:
- **`STOCKED`:** `quantity > lowStockThreshold`
- **`RUNNING_LOW`:** `quantity > 0 AND quantity <= lowStockThreshold`
- **`GONE`:** `quantity = 0`

---

## 6. Indexes & Query Optimization
- `snacks(category)`: Accelerates category filter dropdown queries.
- `votes(snackId)`: Accelerates vote count aggregation per snack.
- `votes(userId, snackId)`: Composite unique constraint index, covering user duplicate vote checks.
- `activities(createdAt DESC)`: Optimizes paginated audit log queries.
- `activities(userId)`: Speeds up user-specific activity retrieval.
- `activities(snackId)`: Speeds up snack-specific activity history.
