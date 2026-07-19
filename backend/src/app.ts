import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { authenticate } from "./middleware/auth.middleware";
import { authorize } from "./middleware/role.middleware";
import { Role } from "@prisma/client";
import { errorHandler } from "./middleware/error.middleware";
import { AppError } from "./utils/app-error";
import vehicleRoutes from "./routes/vehicle.routes";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);


// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Car Dealership Inventory API is running 🚗",
  });
});

app.get("/api/profile", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated successfully",
    user: req.user,
  });
});

app.get(
  "/api/admin",
  authenticate,
  authorize(Role.ADMIN),
  (req, res) => {

    res.status(200).json({
      success: true,
      message: "Welcome Admin",
    });

  }
);

app.get("/api/error", (req, res, next) => {
  next(new AppError(400, "This is a test error"));
});

app.use(errorHandler);

export default app;