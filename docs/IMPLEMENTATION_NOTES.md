# Implementation Notes

This project follows the kata PDF requirements: a protected REST API, a database-backed inventory, token authentication, role-based admin actions, and a React/Tailwind single-page frontend.

## Backend Flow

- `backend/src/app.ts` mounts the API modules under `/api`.
- Auth starts in `routes/auth.routes.ts`, validates input with Zod, hashes passwords, and returns a public user object without the password hash.
- Vehicle routes are protected with JWT auth. Admin-only actions are guarded by `authorize(Role.ADMIN)`.
- Vehicle search supports `make`, `model`, `category`, `minPrice`, and `maxPrice` through `GET /api/vehicles/search`.
- Purchases can be made through both `POST /api/purchases` and the kata endpoint `POST /api/vehicles/:id/purchase`.
- Purchase stock decrement happens inside a Prisma transaction using a conditional update, so stock cannot go below zero under concurrent requests.
- Restocking uses `POST /api/vehicles/:id/restock` and increments stock for admins only.

## Frontend Flow

- `frontend/src/routes/AppRoutes.tsx` defines the protected dashboard routes.
- `frontend/src/layouts/DashboardLayout.tsx` owns the responsive app shell.
- `frontend/src/pages/VehiclesPage.tsx` handles inventory search, category filtering, price filtering, grid/list view, add/edit modals, and purchase modal state.
- `frontend/src/features/vehicles` contains reusable vehicle UI and forms.
- `frontend/src/features/purchases` contains purchase history and checkout UI.
- `frontend/src/features/reports` contains admin-only reporting tables and summary cards.

## Verification Commands

Run these before pushing meaningful changes:

```bash
cd backend
npm run build
npm test

cd ../frontend
npm run lint
npm run build
```

Frontend build note: `npm run build` writes generated production files to `frontend/dist`. The folder is ignored by `frontend/.gitignore`, so it is useful for verification but should not be committed. If you only want a quick frontend check without generated output, run `npm run lint`; run the build before final submission or deployment checks.
