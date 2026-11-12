# Snack Overflow — Design System & UI Specification

## 1. Visual Philosophy
The design language of **Snack Overflow** balances the warmth and delight of an office kitchen with the clarity and precision of a modern enterprise SaaS platform.

### Design Principles
- **Clarity over Clutter:** Essential metrics (quantity, status, votes) take precedence.
- **Warm & Trustworthy:** Friendly, warm off-white tones paired with deep navy for structural authority.
- **Instant Visual Feedback:** Action states, optimistic increments, and unambiguous stock pill indicators.
- **Inclusive Accessibility:** First-class Dark Mode and System Preference synchronization with WCAG AAA contrast ratios.

---

## 2. Color Palette & Semantic Design Tokens

### Dual-Theme Semantic Tokens
The application implements Tailwind CSS semantic CSS variable tokens configured in `tailwind.config.ts` and `src/app/globals.css`:

| Semantic Token | Light Mode (`:root`) | Dark Mode (`.dark`) | UI Role |
| :--- | :--- | :--- | :--- |
| `pantry-bg` | `#F8F7F3` (Warm Canvas) | `#0B1120` (Midnight Slate) | Main viewport background |
| `pantry-surface` | `#FFFFFF` (Pure White) | `#151E32` (Deep Navy Card) | Elevated cards, modals, table surfaces |
| `pantry-subtle` | `#F3F2EC` (Warm Soft) | `#1E293B` (Navy Charcoal) | Input backgrounds, table headers, hover states |
| `pantry-border` | `#E5E3D8` (Sandstone) | `#334155` (Slate Muted) | Structural borders, card outlines, dividers |
| `pantry-text` | `#0F172A` (Ink Slate) | `#F8FAFC` (Clean Crisp) | High-contrast headings and body copy |
| `coral` | `#F97316` (Vibrant Coral) | `#F97316` (Vibrant Coral) | Primary interactive actions, basket badges |
| `navy-900` | `#0F172A` | `#020617` | Structural navigation, admin badges |

### Dynamic Stock Status Tokens
| Status | Text Color (Light / Dark) | Background (Light / Dark) | Border (Light / Dark) | Icon |
| :--- | :--- | :--- | :--- | :--- |
| **STOCKED** | `#15803D` / `#86EFAC` | `#DCFCE7` / `rgba(20,83,45,0.4)` | `#86EFAC` / `#166534` | `CheckCircle2` |
| **RUNNING_LOW** | `#B45309` / `#FCD34D` | `#FEF3C7` / `rgba(120,53,15,0.4)` | `#FCD34D` / `#92400E` | `AlertTriangle` |
| **GONE** | `#B91C1C` / `#FCA5A5` | `#FEE2E2` / `rgba(127,29,29,0.4)` | `#FCA5A5` / `#991B1B` | `XCircle` |

---

## 3. Typography
- **Primary Typeface:** `Plus Jakarta Sans`, Google Font with display swap.
- **Font Scale:**
  - `Display / Page Title`: `24px–30px` (`text-2xl sm:text-3xl`), Extra-bold (`font-black`), tracking tight.
  - `Section Header`: `18px` (`text-lg`), Bold (`font-extrabold`).
  - `Card Header`: `16px` (`text-base`), Bold (`font-extrabold`).
  - `Body`: `13px–14px` (`text-xs sm:text-sm`), Regular (`font-normal`), line-height 1.5.
  - `Caption / Badges`: `10px–11px` (`text-[10px] sm:text-xs`), Extra-bold (`font-extrabold`), uppercase tracking-wider.

---

## 4. UI Components Specification

### A. Navigation Architecture (Strict Role Separation)
- **Top Navigation Bar (`Header.tsx`):**
  - Brand header with pantry icon logo (`🍿 Snack Overflow`).
  - Role-based navigation links:
    - **Member Links:** *Snack Catalog* (`/snacks`), *My Favourites* (`/favourites`), *My History* (`/history`).
    - **Admin Links:** *Dashboard* (`/dashboard`), *Inventory Management* (`/admin`), *Activity Log* (`/activities`).
  - Interactive Action Tray:
    - **Theme Switcher (`ThemeToggle.tsx`):** Dropdown selector supporting Light, Dark, and System modes with immediate state transition and `localStorage` persistence.
    - **Basket Button (`useBasket`):** Visible for Members with real-time numeric counter badge and drawer trigger.
    - **User Profile Pill & Logout:** Displays user name, role badge (`ADMIN` or `MEMBER`), and session revocation logout action.
- **Mobile Responsive Drawer (`Sidebar.tsx`):**
  - Slide-out mobile menu mirroring desktop navigation links with touch-friendly spacing.

### B. Snack Cards (`SnackCard.tsx`)
- Elevated card with theme-adaptive background (`bg-pantry-surface`) and subtle border (`border-pantry-border`).
- Visual Category Banner: Dynamic gradient with thematic emoji (`🍫 Sweet`, `🥨 Savoury`, `🧃 Drink`, `🥗 Healthy-ish`).
- Real-time stock status badge and live packet counter.
- Interactive actions:
  - **Quick Add to Basket:** Primary button adding the snack to the member's basket; transforms into a stepper (`-` / `count` / `+`) when the item is in the basket.
  - **Vote Heart:** Heart icon with count. Filled rose when voted by the user, with optimistic instant toggle.

### C. Snack Basket Drawer (`BasketDrawer.tsx`)
- Slide-out right sheet displaying accumulated basket items.
- Itemized thumbnail, category badge, and quantity stepper (`-` / `count` / `+`) clamped to live pantry stock.
- Conflict alert banner displaying itemized stock depletion warnings if a `409 Conflict` occurs.
- Atomic consumption trigger: "Confirm Consumption ({totalPackets})".

### D. Admin Inventory Controls
- High-density data table (`SnackTable.tsx`) with stock level status badges and reorder thresholds.
- Zero snack consumption controls.
- Modals for inventory management:
  - **Add Snack Modal:** Name, category, initial quantity, and low stock threshold.
  - **Edit Snack Modal:** Name, category, threshold adjustments.
  - **Restock Modal:** Numeric packet increment with quick-add chips (`+5`, `+10`, `+20`, `+50`) and projected total stock preview.
  - **Delete Confirm Modal:** Warning with explanation of historical audit preservation (`SET NULL`).

### E. Conflict Resolution & Feedback
- Centralized `ToastProvider` delivering animated toasts (`success`, `error`, `warning`, `info`).
- When a `409 Conflict` occurs during multi-item or single-item consumption:
  - Toast notification informing user of the specific item shortage.
  - Automatic TanStack Query cache invalidation (`queryKey: ['snacks']`) to refresh available stock numbers without page reload.
