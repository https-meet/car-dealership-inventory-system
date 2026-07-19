# Car Dealership Inventory System

A full-stack, enterprise-grade Car Dealership Inventory System designed with role-based access control, real-time inventory tracking, transactional purchases, and interactive management dashboards.

---

## 🚀 Tech Stack

### Backend
* **Node.js** with **Express** & **TypeScript**
* **Prisma ORM** for database modeling and query safety
* **MySQL** for robust relational storage
* **JWT Authentication** & **Role-Based Authorization** (ADMIN / CUSTOMER)
* **Zod** for schema and payload validation
* **Jest** & **Supertest** for the API test suite

### Frontend
* **React 19** with **TypeScript** & **Vite**
* **Tailwind CSS** for modern utility-first styling
* **React Router v7** for nested dashboard routing and guards
* **React Query (@tanstack/react-query)** for server-state caching and synchronization
* **React Hook Form** + **Zod** for validation and form state
* **Lucide React** for premium iconography
* **React Hot Toast** for animated user notifications

---

## 📦 Directory Structure

```
car-dealership-inventory-system/
├── backend/                  # Express + Prisma + MySQL API
│   ├── prisma/               # Schema, migrations, and seed data
│   ├── src/                  # Controllers, services, and middlewares
│   └── tests/                # Jest integration test suite
├── frontend/                 # React + Vite client application
│   ├── public/               # Static assets
│   └── src/                  # Components, pages, hooks, services, and types
│       ├── api/              # Axios instance with interceptors
│       ├── components/       # Layout, Navbar, Sidebar, and UI components
│       ├── features/         # Feature-based components (auth, vehicles, purchases, reports)
│       ├── hooks/            # Global custom hooks (useAuth)
│       ├── pages/            # Page-level components
│       ├── services/         # API service calls
│       ├── types/            # TypeScript interfaces
│       └── utils/            # Shared formatting helpers
└── docker-compose.yml        # Optional containerized database setup
```

---

## 🛠 Setup and Local Installation

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **MySQL Database** running locally or via Docker

---

### Step 1: Database Setup
You can either use a local MySQL instance or run the database using the provided `docker-compose.yml` file:

```bash
# Start MySQL via Docker
docker-compose up -d
```

---

### Step 2: Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=3000
   DATABASE_URL="mysql://root:password@localhost:3306/car_dealership"
   JWT_SECRET="your-super-secret-jwt-key"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Seed the database with sample vehicles, administrators, and customer users:
   ```bash
   npm run seed
   ```
   > **Note:** The seed script creates:
   > * **Admin User:** `admin@dealership.com` / Password: `password123`
   > * **Customer User:** `customer@dealership.com` / Password: `password123`
6. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run at `http://localhost:3000`.

---

### Step 3: Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`. Open this URL in your web browser.

---

## 🚥 Application Features & Role Behavior

### 🔑 User Authentication
* **Registration & Login:** Simple and validated registration flow. Persists session tokens and typed user details.
* **Role Badging:** Interactive, color-coded badges in the navbar indicating the current user's role.

### 🚗 Vehicle Inventory (`/vehicles`)
* **Shared Access:** Both Admins and Customers can search, filter, and view the entire fleet of vehicles.
* **Admin Privilege:** Admins see action buttons to **Edit** (with pre-filled fields) or **Delete** vehicles. They also have an **Add Vehicle** button to open the vehicle creation form.
* **Customer Privilege:** Customers see a **Buy** button. If stock is 0, the button turns into a disabled **Sold Out** state.

### 🛒 Purchase Flow (`/purchases`)
* **Customer Buy Form:** Opens a purchase modal displaying a summary card, stock availability, and quantity input. The estimated total price updates in real-time as the user types.
* **Smart Invalidation:** On successful purchase, both the purchases history and vehicles stock count cache are immediately invalidated and refetched.
* **History Table:**
  * **Customer View:** Shows only their own purchase history and calculating total order costs.
  * **Admin View:** Displays a master list of all transactions across all customers, showing full Customer IDs.

### 📊 Reports Dashboard (`/reports` - Admin Only)
* Runs 4 parallel backend queries for aggregated data:
  1. **Sales Summary:** Total Revenue, Units Sold, and Total Transactions metrics.
  2. **Low Stock Warnings:** Lists vehicles with stock counts ≤ 5 using warning badges.
  3. **Recent Purchases:** Recent purchases with customer and vehicle details.
  4. **Top Selling Vehicles:** Ranked lists of top-performing models with rank badges.

---

## 🧪 Test Report

The backend is backed by an integration test suite validating authorization, CRUD endpoints, stock updates, and schema validation.

To run tests:
```bash
cd backend
npm test
```

### Test Suite Execution Output
```
PASS tests/vehicle.test.ts (13.481 s)
  Vehicle API
    GET /api/vehicles
      √ should return all vehicles (675 ms)
    GET /api/vehicles/:id
      √ should return a vehicle by id (305 ms)
      √ should return 404 when vehicle does not exist (305 ms)
    POST /api/vehicles
      √ should allow admin to create vehicle (296 ms)
      √ should reject request without token (286 ms)
      √ should reject customer access (313 ms)
      √ should reject invalid payload (366 ms)
      √ should reject duplicate vehicle (2593 ms)
    PUT /api/vehicles/:id
      √ should update vehicle (333 ms)
      √ should return 404 for invalid id (292 ms)
      √ should reject customer (311 ms)
      √ should reject without token (372 ms)
    DELETE /api/vehicles/:id
      √ should delete vehicle (323 ms)
      √ should reject customer (299 ms)
      √ should reject without token (319 ms)
      √ should return 404 for invalid vehicle (319 ms)

PASS tests/auth.test.ts
  Authentication API
    POST /api/auth/register
      √ should register a new user (289 ms)
      √ should return 409 if email already exists (90 ms)
    POST /api/auth/login
      √ should login successfully (149 ms)
      √ should return 401 for wrong password (152 ms)
      √ should return 401 if email does not exist (90 ms)

PASS tests/middleware.test.ts
  Authentication Middleware
    √ should return 401 when authorization header is missing (305 ms)
    √ should return 401 for invalid token (180 ms)
    √ should allow access with valid token (238 ms)

PASS tests/app.test.ts
  Application
    GET /api/health
      √ should return API health status (8 ms)

PASS tests/authorization.test.ts
  Authorization Middleware
    √ should deny access without token (9 ms)

Test Suites: 5 passed, 5 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        17.533 s, estimated 18 s
Ran all test suites.
```

---

## 🤖 My AI Usage

### AI Tools Used
* **Antigravity (built by Google DeepMind):** Primary pair-programming agent for code discovery, file staging, implementation planning, and clean code refactoring.

### How AI Was Used
1. **Routing Bug Fixes:** The AI assistant analyzed the frontend router (`AppRoutes.tsx`) and correctly identified that vehicle pages and dashboard layouts were leaked to the public. It moved the routes inside the authenticated `ProtectedRoute`.
2. **CRUD Scaffolding:** Assisted in generating CRUD endpoints in the `vehicle.service.ts` layer and mapping the Prisma database schema payload shapes to TS types.
3. **Complex Form Validation:** Assisted in setting up the Zod schemas for forms, transforming input fields to numbers (using `z.coerce`), and verifying that conditional image fields (`imageUrl`) are stripped if empty, matching the database schema constraints.
4. **Dashboard Layout & UI Polish:** Code suggestions for Tailwind-based responsive designs, custom slim scrollbars, transitions, page-entry fade effects, and clean, beautiful loading skeletons for the dashboard.
5. **DRY Refactoring:** Helped build the central `format.ts` utility file and sweep the codebase to replace local formatting helpers, making code more readable.

### Reflections & Workflow Impact
* **Velocity:** Using an AI assistant allowed me to write boilerplate code rapidly (such as CRUD endpoints and tables) while allowing me to focus on role authorization routing and custom business logic.
* **Code Integrity:** The AI checked our TypeScript compiler throughout the session, preventing syntax discrepancies and merging conflicts. It kept track of our task list step-by-step.
* **Test Synchronization:** The assistant made it easy to cross-reference our frontend page implementations with backend controllers to ensure no payloads mismatched.
