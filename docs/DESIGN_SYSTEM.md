# Snack Overflow — Design System & UI Specification

## 1. Visual Philosophy
The design language of **Snack Overflow** balances the warmth and delight of an office kitchen with the clarity and precision of a modern enterprise SaaS platform.

### Design Principles
- **Clarity over Clutter:** Essential metrics (quantity, status, votes) take precedence.
- **Warm & Trustworthy:** Friendly, warm off-white tones paired with deep navy for structural authority.
- **Instant Visual Feedback:** Action states, optimistic increments, and unambiguous stock pill indicators.

---

## 2. Color Palette & Design Tokens

### Core Colors
| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `primary-navy` | `#172554` | Primary brand color, headers, navigation rail |
| `primary-navy-dark` | `#0F172A` | High-contrast text, active item backgrounds |
| `warm-bg` | `#F8F7F3` | Application background (gentle on eyes, warm pantry aesthetic) |
| `surface-white` | `#FFFFFF` | Cards, modals, elevated surfaces |
| `border-subtle` | `#E6E4DF` | Dividers, card borders, input borders |
| `accent-coral` | `#F97366` | Primary action highlights, active voting heart |
| `accent-amber` | `#F5B942` | Snack of the week medal, secondary highlights |

### Dynamic Stock Status Tokens
| Status | Text Color | Background Color | Border Color | Icon |
| :--- | :--- | :--- | :--- | :--- |
| **STOCKED** | `#15803D` | `#DCFCE7` | `#86EFAC` | `CheckCircle2` |
| **RUNNING_LOW** | `#B45309` | `#FEF3C7` | `#FCD34D` | `AlertTriangle` |
| **GONE** | `#B91C1C` | `#FEE2E2` | `#FCA5A5` | `XCircle` |

---

## 3. Typography
- **Primary Typeface:** `Inter`, system sans-serif fallback.
- **Scale:**
  - `Display / Page Title`: `24px` (`1.5rem`), Semi-bold (`font-semibold`), Tracking tight.
  - `Section Header`: `18px` (`1.125rem`), Medium (`font-medium`).
  - `Card Header`: `16px` (`1rem`), Semi-bold (`font-semibold`).
  - `Body`: `14px` (`0.875rem`), Regular (`font-normal`), line-height 1.5.
  - `Caption / Badges`: `12px` (`0.75rem`), Medium (`font-medium`), uppercase tracking-wider for status pills.

---

## 4. UI Components Specification

### A. Navigation Shell
- **Desktop Sidebar:**
  - Width: `260px` (`w-64`), fixed left rail.
  - Brand header with pantry icon logo and version indicator.
  - Navigation links:
    - *Dashboard* (`/dashboard`)
    - *Snack Catalog* (`/snacks`)
    - *Admin Inventory* (`/admin` — Admin only)
    - *Activity Log* (`/activities` — Admin only)
  - Bottom user tray showing avatar, user name, role badge (`ADMIN` or `MEMBER`), and logout action.
- **Mobile Header:**
  - Top app bar with brand mark and accessible hamburger drawer.

### B. Snack Cards
- Clean white card with `1px` subtle warm-gray border and soft shadow (`shadow-sm hover:shadow-md`).
- Category pill in top corner (`SWEET`, `SAVOURY`, `DRINK`, `HEALTHY_ISH`).
- Prominent snack title with quantity counter (`X packets left`).
- Dynamic stock badge (`STOCKED`, `RUNNING LOW`, `OUT OF STOCK`).
- Interactive actions:
  - **Vote Button:** Heart icon with count. Filled coral on active vote.
  - **Consume Button:** Primary button with packet decrement action; disabled when `GONE` with tooltip.

### C. Admin Inventory Controls
- High-density data table with inline editing, threshold management, restock trigger modal, and soft-delete confirmation.
- Restock modal with numeric packet counter and instant stock level projection.

### D. Conflict Resolution & Feedback
- When a `409 Conflict` occurs during consumption:
  - Visual toast notification: *"Someone beat you to the last packet! Please refresh the inventory."*
  - Automatic query cache invalidation to reflect the true server quantity instantly without manual page reload.
