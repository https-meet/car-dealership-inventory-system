# AI Conversation and Prompt History (`PROMPTS.md`)

This file records the entire chronological prompt history and interaction steps between the developer and the AI assistant (**Antigravity**) during the implementation of the Car Dealership Inventory System.

---

## 🛠 Phase 1: Project Initiation & Codebase Discovery

### Prompt 1
> **User:** (Initial instructions detailing the full-stack system layout, Completed Backend setup, Frontend scaffolding, constraints regarding database structures, TypeScript guidelines, Tailwind-only styling rules, TDD and commit workflows, and the scope of Features 2–5.)

### Action & Staging
* **AI Analysis:** Discovered existing files and backend routes.
* **Result:** Formulated a detailed `implementation_plan.md` and created the `task.md` tracker mapping out Feature 2 (Vehicle Management) through Feature 5 (UI Polish).

---

## 🚗 Phase 2: Feature 2 — Vehicle Management Module

### Prompt 2
> **User:** continue

### Action & Staging
* **AI Action:** 
  1. Identified that `/vehicles` was outside the routing guard in `AppRoutes.tsx` and moved it into `ProtectedRoute`.
  2. Implemented `getVehicleById`, `updateVehicle`, and `deleteVehicle` endpoints inside `vehicle.service.ts`.
  3. Created a reusable and accessible overlay component: `Modal.tsx`.
  4. Created `Badge.tsx` (`StockBadge`) for vehicle list rendering.
  5. Rewrote `VehicleForm.tsx` to add full edit mode, category validations mapping to Prisma enums, and image URL cleanup logic.
  6. Created `EditVehicleModal.tsx` and integrated it with row action triggers in `VehicleTable.tsx`.
  7. Updated `VehiclesPage.tsx` with search state management.
  8. Created compilation placeholder routes for `/purchases` and `/reports` (`PurchasesPage.tsx` and `ReportsPage.tsx`).
  9. Executed `npx tsc --noEmit` to confirm 100% compilation safety.

---

## 💻 Phase 3: Git Commit Styling

### Prompt 3
> **User:** make the commit like git commit -m "feat: Implement user registration endpoint
> Used an AI assistant to generate the initial boilerplate for the
> controller and service, then manually added validation logic.
> Co-authored-by: AI Tool Name <AI@users.noreply.github.com>"

### Action & Staging
* **AI Action:** Prompted the user with the exact multi-line command to execute from the command line root.

---

## 🛒 Phase 4: Feature 3 — Purchase Management Module

### Prompt 4
> **User:** continue

### Action & Staging
* **AI Action:**
  1. Created `src/types/purchase.ts` detailing raw `Purchase` models and DTO structures.
  2. Implemented the API service calls in `src/services/purchase.service.ts`.
  3. Created a custom authentication hook, `useAuth.ts`, to check current user roles (`useIsAdmin`, `useIsCustomer`).
  4. Built `PurchaseTable.tsx` with list lookups, unit price caching, and formatting.
  5. Built `PurchaseVehicleModal.tsx` featuring estimated price multiplier calculations that update live.
  6. Replaced `PurchasesPage.tsx` stub with a role-based summary page displaying cards for Total Revenue (Admin) vs Total Spend (Customer).
  7. Integrated a **Buy** button in `VehicleTable.tsx` visible to customers, and bound it to the purchase flow in `VehiclesPage.tsx`.

---

## 📊 Phase 5: Feature 4 — Reports Dashboard

### Prompt 5
> **User:** continue

### Action & Staging
* **AI Action:**
  1. Staged `src/types/report.ts` defining shapes for low stock alerts, recent transactions, top selling statistics, and general sales metrics.
  2. Implemented `src/services/report.service.ts` forwarding parameters (such as `limit` or `threshold`).
  3. Built `SalesSummaryCard.tsx` rendering KPIs for Revenue, Units Sold, and Transactions.
  4. Built `LowStockTable.tsx` styling low stock items with danger colors.
  5. Built `RecentPurchasesTable.tsx` detailing customer emails, purchased items, and dates.
  6. Built `TopSellingTable.tsx` with custom rank badges for gold, silver, and bronze positions.
  7. Implemented `ReportsPage.tsx` using `@tanstack/react-query`'s `useQueries` hook to load all reports in parallel.
  8. Configured `Sidebar.tsx` using user role guards to hide `/reports` from customers.

---

## 🎨 Phase 6: Feature 5 — UI Polish & Responsive Design

### Prompt 6
> **User:** continue

### Action & Staging
* **AI Action:**
  1. Restyled `src/index.css` by importing the Google Font **Inter** and implementing fadeIn / fadeUp utility animations.
  2. Restyled `LoginForm.tsx` adding eye icons for password visibility toggling, a spinning animation during submit events, and a greeting notification.
  3. Modified `LoginPage.tsx` into a high-fidelity split-panel layout containing value proposition descriptions on the left and input forms on the right.
  4. Added top accent colors and elevation states to `DashboardCard.tsx`.
  5. Updated `DashboardPage.tsx` adding greetings matching time-of-day, role subtitles, and skeleton loading grids.
  6. Staged responsive container margins inside `DashboardLayout.tsx`.

---

## 💅 Phase 7: Design Upgrades & Refinements

### Prompt 7
> **User:** now continue to make design morden and better there are many bugs the design should be responsive as well as it the vehicles images should be there and everything in short make it amazing and the login button is not visible there is only signup button so change that also it means need to change the whole design but not change the backend logic i want to just refine the front end so change the design completely and make it good and unique yet proffessional

### Action & Staging
* **AI Action:**
  1. Added registration endpoint types and services inside `src/types/auth.ts` and `src/services/auth.service.ts`.
  2. Replaced the plain login card with a unified **Sign In / Sign Up tabbed card** featuring full user details collection and role assignment matching backend schemas.
  3. Implemented a beautiful customer showroom view using **Vehicle Cards** displaying images, pricing, and stock status badges with zoom animations on hover.
  4. Added inline image thumbnails inside the vehicle column of the administrative table view.
  5. Staged a fully responsive **Mobile Drawer Layout** with dynamic backdrop overlays and toggle hooks in the navbar.
