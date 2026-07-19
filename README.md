# Kata - Car Dealership Inventory System

A full-stack Car Dealership Inventory System built for the AI Kata assignment. The system provides a protected REST API, PostgreSQL persistence, JWT authentication, role-based authorization, vehicle inventory management, purchase handling, restocking, reporting, and a responsive React/Tailwind frontend.

---

## Tech Stack

### Backend

- **Node.js**, **Express**, and **TypeScript** for the REST API.
- **PostgreSQL** as the persistent database.
- **Prisma ORM** for schema modeling, migrations, and database access.
- **JWT authentication** for protected endpoints.
- **Role-based authorization** using `ADMIN` and `CUSTOMER` roles.
- **Zod** for request validation.
- **Jest** and **Supertest** for integration testing.

### Frontend

- **React 19**, **TypeScript**, and **Vite** for the SPA.
- **Tailwind CSS** for responsive styling.
- **React Router** for page routing and protected layouts.
- **TanStack React Query** for API state and cache invalidation.
- **React Hook Form** and **Zod** for form state and validation.
- **Axios** for API calls.
- **Lucide React** for icons.
- **React Hot Toast** for notifications.

---

## Requirement Coverage

### Backend API

The backend follows the PDF requirement for a protected vehicle API and role-specific inventory operations.

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

Each vehicle has:

- Unique ID
- Make
- Model
- Category
- Year
- Price
- Quantity in stock
- Optional image URL

### Frontend Application

- Login and registration forms.
- Protected dashboard after authentication.
- Vehicle inventory page with search, category filter, price range filter, grid view, and list view.
- Purchase button disabled when stock is zero.
- Customer purchase modal with quantity validation and estimated total.
- Customer purchase history.
- Admin add, edit, delete, and restock flows.
- Admin reports for sales summary, low stock, recent purchases, and top-selling vehicles.
- Responsive UI for desktop and mobile screens.

---

## Directory Structure

```text
car-dealership-inventory-system/
|-- backend/                  # Express + TypeScript + Prisma API
|   |-- prisma/               # Prisma schema and migrations
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
|   |-- public/               # Static assets
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
|-- docs/                     # Developer notes
|-- docker-compose.yml        # PostgreSQL container
|-- PROMPTS.md                # AI prompt history
`-- README.md                 # Project documentation
```

---

## Setup and Local Installation

### Prerequisites

- Node.js 18 or higher
- npm
- Docker Desktop, if using the provided PostgreSQL container

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

The seed command adds demo users and a showroom-ready vehicle catalog:

```text
Admin:    admin@dealership.com / password123
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
- Login returns a JWT token.
- The frontend stores the token and sends it with protected API requests.
- Auth responses return public user data only; password hashes are never returned.

### Customer Flow

- View dashboard statistics.
- Browse all vehicles.
- Search/filter by make, model, category, and price range.
- View seeded demo vehicles immediately after local setup.
- Purchase available vehicles.
- Cannot purchase vehicles with zero stock.
- View personal purchase history.

### Admin Flow

- View dashboard statistics.
- Add new vehicles.
- Update vehicle details.
- Delete vehicles.
- Restock vehicle inventory.
- View all purchases.
- View reports for revenue, low stock, recent purchases, and top sellers.

### Inventory Logic

- Vehicle creation rejects invalid price, invalid year, negative quantity, and duplicate make/model/year entries.
- Purchase stock updates are transactional.
- The backend prevents stock from going below zero.
- Restock is restricted to admins.

---

## Testing and Verification

### Backend

```bash
cd backend
npm run build
npm test
```

Latest verified result:

```text
Test Suites: 5 passed, 5 total
Tests:       34 passed, 34 total
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

`npm run build` creates a production bundle in `frontend/dist`. That folder is generated output and is ignored by `frontend/.gitignore`, so it should not be committed.

Latest verified result:

```text
npm run lint  - passed
npm run build - passed
```

---

## Screenshots

Add final screenshots before submission, as requested in the PDF:

- Login and registration screen
- Customer inventory page
- Purchase modal
- Admin inventory management page
- Admin reports page

---

## Documentation for Future Maintenance

See [docs/IMPLEMENTATION_NOTES.md](docs/IMPLEMENTATION_NOTES.md) for a short explanation of the main backend and frontend flows.

Important decisions:

- Vehicle list/search endpoints are protected because the PDF lists Vehicles as protected.
- `GET /api/vehicles/search` supports make, model, category, `minPrice`, and `maxPrice`.
- `POST /api/vehicles/:id/purchase` is included to match the PDF endpoint.
- Existing `POST /api/purchases` is kept for frontend compatibility.
- Purchase stock decrement uses a Prisma transaction and conditional update to avoid overselling.
- Query validation stores parsed data in `res.locals.validatedQuery` because Express 5 treats `req.query` as read-only.

---

## My AI Usage

### AI Tools Used

- OpenAI Codex

### How AI Was Used

- Analyzed the kata PDF and compared it with the existing implementation.
- Improved the frontend to be modern, responsive, and aligned with the React/Tailwind SPA requirement.
- Fixed frontend authentication response handling.
- Added and improved backend endpoints required by the PDF.
- Improved backend validation for body, route params, and query params.
- Improved purchase logic so stock updates are atomic.
- Expanded backend tests for protected vehicle access, search, purchase, restock, and sanitized auth responses.
- Added implementation notes for future maintenance.
- Ran verification commands for backend and frontend.

### Reflection

AI helped speed up requirement analysis, code navigation, UI refactoring, API alignment, and test updates. The implementation was still checked against the PDF requirements and verified using builds, linting, and integration tests.

---

## AI Prompt History

The kata requires AI usage transparency. Prompt history is tracked in [PROMPTS.md](PROMPTS.md).

---

## Deliverables Checklist

- Full-stack source code
- Backend setup instructions
- Frontend setup instructions
- Protected REST API
- React/Tailwind SPA
- Test report
- My AI Usage section
- PROMPTS.md
- Screenshots before final submission
- Public repository link after pushing
