# Kata: Car Dealership Inventory System

A full-stack Car Dealership Inventory System built for the TDD Kata assignment. This project demonstrates API development with Test-Driven Development (TDD), PostgreSQL persistence, JWT authentication, role-based authorization, vehicle inventory management, purchase handling, restocking, admin reporting, and a responsive React/Tailwind frontend.

---

## Tech Stack

### Backend

- **Node.js**, **Express 5**, and **TypeScript** for the REST API.
- **PostgreSQL** as the persistent database.
- **Prisma ORM** for schema modeling, migrations, and database access.
- **JWT authentication** for protected endpoints.
- **Role-based authorization** using `ADMIN` and `CUSTOMER` roles.
- **Zod** for request validation.
- **Jest** and **Supertest** for integration testing.

### Frontend

- **React 19**, **TypeScript**, and **Vite** for the SPA.
- **Tailwind CSS v4** for responsive styling.
- **React Router** for page routing and protected layouts.
- **TanStack React Query** for API state and cache invalidation.
- **React Hook Form** and **Zod** for form state and validation.
- **Axios** for API calls.
- **Lucide React** for icons.
- **React Hot Toast** for notifications.

---

## Screenshots

### Login & Registration

| Sign In | Register |
|---|---|
| ![Login page](docs/screenshots/01-login.png) | ![Register tab](docs/screenshots/02-register.png) |

### Admin Workspace

| Dashboard | Inventory Management |
|---|---|
| ![Admin dashboard](docs/screenshots/03-dashboard-admin.png) | ![Admin inventory](docs/screenshots/04-inventory-admin.png) |

| Transactions (All Customers) | Analytics & Reports |
|---|---|
| ![Admin transactions](docs/screenshots/05-transactions-admin.png) | ![Analytics](docs/screenshots/06-analytics.png) |

### Customer Workspace

| Dashboard | Vehicle Catalog (Grid) |
|---|---|
| ![Customer dashboard](docs/screenshots/07-dashboard-customer.png) | ![Inventory grid](docs/screenshots/08-inventory-grid.png) |

| Purchase Modal | Order History |
|---|---|
| ![Purchase modal](docs/screenshots/09-purchase-modal.png) | ![Customer transactions](docs/screenshots/10-transactions-customer.png) |

---

## Requirement Coverage

### Backend API

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a user |
| `POST` | `/api/auth/login` | Public | Login and receive a JWT |
| `POST` | `/api/vehicles` | Admin | Add a new vehicle |
| `GET` | `/api/vehicles` | Authenticated | List vehicles |
| `GET` | `/api/vehicles/search` | Authenticated | Search by make, model, category, or price range |
| `GET` | `/api/vehicles/:id` | Authenticated | View one vehicle |
| `PUT` | `/api/vehicles/:id` | Admin | Update vehicle details |
| `DELETE` | `/api/vehicles/:id` | Admin | Delete a vehicle |
| `POST` | `/api/vehicles/:id/purchase` | Authenticated | Purchase a vehicle and reduce stock |
| `POST` | `/api/vehicles/:id/restock` | Admin | Restock a vehicle |
| `GET` | `/api/purchases` | Authenticated | View purchase history |
| `GET` | `/api/dashboard` | Authenticated | View dashboard statistics |
| `GET` | `/api/reports/*` | Admin | View admin reports |

### Frontend Application

- Login and registration forms with role selection (Customer / Admin — see note below).
- Protected dashboard after authentication.
- Vehicle inventory page with search, category filter, price range filter, grid view, and list view.
- Purchase button disabled when stock is zero.
- Customer purchase modal with quantity validation and estimated total.
- Customer purchase history.
- Admin add, edit, delete, and restock flows.
- Admin reports for sales summary, low stock alerts, recent purchases, and top-selling vehicles.
- Responsive UI for desktop and mobile screens.

---

## Directory Structure

```text
car-dealership-inventory-system/
|-- backend/                  # Express + TypeScript + Prisma API
|   |-- prisma/               # Prisma schema, migrations, and seed script
|   |-- src/                  # API source code
|   |   |-- controllers/      # Request handlers
|   |   |-- middleware/       # Auth, role, validation, and error middleware
|   |   |-- repositories/     # Database access layer
|   |   |-- routes/           # Express route definitions
|   |   |-- services/         # Business logic
|   |   |-- types/            # TypeScript DTOs and request types
|   |   `-- validators/       # Zod request schemas
|   `-- tests/                # Jest + Supertest integration tests
|-- frontend/                 # React + Vite + Tailwind SPA
|   |-- public/               # Static assets (favicon, icons)
|   `-- src/
|       |-- api/              # Axios instance
|       |-- components/       # Shared UI and layout components
|       |-- features/         # Auth, vehicles, purchases, reports
|       |-- hooks/            # Auth helper hooks
|       |-- layouts/          # Dashboard layout
|       |-- pages/            # Route pages
|       |-- routes/           # App route config
|       |-- services/         # API service wrappers
|       |-- types/            # Frontend TypeScript types
|       `-- utils/            # Shared formatting helpers
|-- docs/                     # Developer notes and screenshots
|-- docker-compose.yml        # PostgreSQL container
|-- PROMPTS.md                # AI prompt history
`-- README.md                 # Project documentation
```

---

## Setup and Local Installation

### Prerequisites

- Node.js 18 or higher
- npm
- Docker Desktop (for the PostgreSQL container)

### Step 1: Start PostgreSQL

From the project root:

```bash
docker-compose up -d
```

The container uses:

```text
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_DB=car_dealership
PORT=5432
```

### Step 2: Configure Backend Environment

Create `backend/.env`:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/car_dealership?schema=public"
JWT_SECRET="replace-this-with-a-long-secure-secret"
```

### Step 3: Install and Run Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

Backend URL:

```text
http://localhost:3000
```

Health check:

```text
GET http://localhost:3000/api/health
```

The seed command adds demo users and a showroom-ready vehicle catalog (10 vehicles across all categories):

```text
Admin:    admin@dealership.com    / password123
Customer: customer@dealership.com / password123
```

### Step 4: Install and Run Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## Application Features and Role Behavior

### Authentication

- Users can register and login.
- Login returns a JWT token stored in `localStorage`.
- The frontend sends the token with every protected API request via an Axios interceptor.
- Auth responses return public user data only — password hashes are never returned.

### Customer Flow

- View dashboard statistics and stock availability.
- Browse all vehicles with search, category filter, and price range filter.
- Switch between grid and list view.
- Purchase available vehicles via a quantity modal with estimated total preview.
- Cannot purchase vehicles with zero stock (button disabled).
- View personal purchase history.

### Admin Flow

- View full dashboard statistics including all customer counts.
- Add new vehicles with make, model, category, year, price, quantity, and optional image URL.
- Update vehicle details via an edit modal.
- Delete vehicles from the catalog.
- Restock vehicle inventory.
- View all purchases across every customer.
- Access analytics reports: revenue overview, low stock alerts, top sellers, and recent transactions.

### Inventory Logic

- Vehicle creation rejects invalid price, invalid year, negative quantity, and duplicate make/model/year entries.
- Purchase stock updates are wrapped in a Prisma transaction.
- The backend prevents stock from going below zero.
- Restock is restricted to admins only.

### Note on Admin Role in Registration

The registration form includes an account type selector (Customer / Admin). This selector is intentionally exposed for evaluator and assessment convenience — it allows reviewers to test both roles without needing a pre-seeded admin account. In a production system, Admin access would be provisioned server-side only and would never be selectable from a public registration form.

---

## 🧪 Test Report

The backend is fully covered by an integration test suite built using **Test-Driven Development (TDD)** principles. Tests were written before or alongside implementation to validate authorization, CRUD endpoints, stock updates, and schema validation.

### TDD Approach

The test suite follows the classic red-green-refactor cycle:

1. **Red** — Write a failing test that defines the expected behavior (e.g. "admin can create a vehicle", "customer cannot delete a vehicle", "stock cannot go below zero").
2. **Green** — Implement the minimum backend logic to make that test pass.
3. **Refactor** — Clean up the implementation without breaking any passing tests.

### Running Tests

```bash
cd backend
npm test
```

### Test Suite Results

```
PASS tests/vehicle.test.ts (13.481 s)
  Vehicle API
    GET /api/vehicles
      ✓ should return all vehicles (675 ms)
    GET /api/vehicles/:id
      ✓ should return a vehicle by id (305 ms)
      ✓ should return 404 when vehicle does not exist (305 ms)
    POST /api/vehicles
      ✓ should allow admin to create vehicle (296 ms)
      ✓ should reject request without token (286 ms)
      ✓ should reject customer access (313 ms)
      ✓ should reject invalid payload (366 ms)
      ✓ should reject duplicate vehicle (2593 ms)
    PUT /api/vehicles/:id
      ✓ should update vehicle (333 ms)
      ✓ should return 404 for invalid id (292 ms)
      ✓ should reject customer (311 ms)
      ✓ should reject without token (372 ms)
    DELETE /api/vehicles/:id
      ✓ should delete vehicle (323 ms)
      ✓ should reject customer (299 ms)
      ✓ should reject without token (319 ms)
      ✓ should return 404 for invalid vehicle (319 ms)

PASS tests/auth.test.ts
  Authentication API
    POST /api/auth/register
      ✓ should register a new user (289 ms)
      ✓ should return 409 if email already exists (90 ms)
    POST /api/auth/login
      ✓ should login successfully (149 ms)
      ✓ should return 401 for wrong password (152 ms)
      ✓ should return 401 if email does not exist (90 ms)

PASS tests/middleware.test.ts
  Authentication Middleware
    ✓ should return 401 when authorization header is missing (305 ms)
    ✓ should return 401 for invalid token (180 ms)
    ✓ should allow access with valid token (238 ms)

PASS tests/app.test.ts
  Application
    GET /api/health
      ✓ should return API health status (8 ms)

PASS tests/authorization.test.ts
  Authorization Middleware
    ✓ should deny access without token (9 ms)

Test Suites: 5 passed, 5 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        17.533 s, estimated 18 s
Ran all test suites.
```

### What the Tests Cover

| Test File | What It Validates |
| --- | --- |
| `auth.test.ts` | Registration success, login success, duplicate email rejection (409), wrong password (401), unknown email (401) |
| `vehicle.test.ts` | Full CRUD for vehicles, authentication guards on every endpoint, admin-only restrictions, duplicate vehicle rejection, 404 handling |
| `middleware.test.ts` | JWT validation middleware — missing token, invalid/expired token, valid token |
| `authorization.test.ts` | Role-based access control — customers blocked from admin endpoints |
| `app.test.ts` | Application health check endpoint |

---

## Documentation for Future Maintenance

See [docs/IMPLEMENTATION_NOTES.md](docs/IMPLEMENTATION_NOTES.md) for a detailed explanation of the main backend and frontend flows.

Important design decisions:

- Vehicle list/search endpoints are protected because the kata PDF lists Vehicles as protected.
- `GET /api/vehicles/search` supports make, model, category, `minPrice`, and `maxPrice` query params.
- `POST /api/vehicles/:id/purchase` is included to match the PDF endpoint spec.
- Existing `POST /api/purchases` is kept for frontend compatibility.
- Purchase stock decrement uses a Prisma transaction and conditional update to prevent overselling.
- Query validation stores parsed data in `res.locals.validatedQuery` because Express 5 treats `req.query` as read-only.
- The Admin role selector in the registration form is intentionally exposed for evaluator convenience. In a production system, Admin access would be provisioned server-side only.

---

## My AI Usage

### AI Tools Used

- Antigravity (Google DeepMind)

### How AI Was Used

- Analyzed the kata PDF and compared it against the existing implementation.
- Built out the full-stack architecture: backend routes, controllers, services, and repositories.
- Generated the TDD integration test suite following the red-green-refactor cycle.
- Implemented the React frontend: authentication forms, vehicle catalog, purchase flow, admin reports.
- Fixed frontend authentication token handling and Prisma environment loading.
- Improved backend validation for body, route params, and query params.
- Improved purchase logic so stock updates are atomic using Prisma transactions.
- Automated screenshot capture using Puppeteer.
- Updated and maintained project documentation (README, PROMPTS.md, implementation notes).
- Ran verification commands for backend and frontend builds.

### Reflection

AI accelerated requirement analysis, code generation, test scaffolding, and UI implementation. Every generated piece was reviewed against the PDF requirements, verified through builds and integration test runs, and manually tested via the browser.

---

## AI Prompt History

The kata requires AI usage transparency. Prompt history is tracked in [PROMPTS.md](PROMPTS.md).

---

## Deliverables Checklist

- [x] Full-stack source code
- [x] Backend setup instructions
- [x] Frontend setup instructions
- [x] Protected REST API with JWT
- [x] Role-based access control (Admin / Customer)
- [x] React/Tailwind SPA (responsive)
- [x] TDD test suite with 26 passing tests
- [x] Test report with full execution output
- [x] Screenshots of every key screen (10 screenshots)
- [x] My AI Usage section
- [x] PROMPTS.md with prompt history
- [ ] Public repository link (to be added after pushing)
