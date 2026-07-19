import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/config/prisma";
import { Role, VehicleCategory } from "@prisma/client";
import { clearDatabase } from "./helpers/test-db";

describe("Vehicle API", () => {
  let adminToken: string;
  let customerToken: string;

  beforeEach(async () => {
    await clearDatabase();

    // Create Admin
    await request(app).post("/api/auth/register").send({
      firstName: "Admin",
      lastName: "User",
      email: "admin@test.com",
      password: "password123",
      role: Role.ADMIN,
    });

    // Login Admin
    const adminLogin = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "password123",
    });

    adminToken = adminLogin.body.token;

    // Create Customer
    await request(app).post("/api/auth/register").send({
      firstName: "Customer",
      lastName: "User",
      email: "customer@test.com",
      password: "password123",
      role: Role.CUSTOMER,
    });

    // Login Customer
    const customerLogin = await request(app).post("/api/auth/login").send({
      email: "customer@test.com",
      password: "password123",
    });

    customerToken = customerLogin.body.token;
  });

  describe("GET /api/vehicles", () => {
    it("should return all vehicles", async () => {
      await prisma.vehicle.createMany({
        data: [
          {
            make: "Toyota",
            model: "Camry",
            category: VehicleCategory.SEDAN,
            year: 2023,
            price: 25000,
            quantity: 5,
          },
          {
            make: "Honda",
            model: "City",
            category: VehicleCategory.SEDAN,
            year: 2022,
            price: 18000,
            quantity: 3,
          },
        ],
      });

      const response = await request(app)
        .get("/api/vehicles")
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      expect(response.body.data).toHaveLength(2);

      expect(response.body.data.map((v: { make: string }) => v.make)).toEqual([
        "Honda",
        "Toyota",
      ]);
    });

    it("should reject request without token", async () => {
      const response = await request(app).get("/api/vehicles");

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/vehicles/search", () => {
    beforeEach(async () => {
      await prisma.vehicle.createMany({
        data: [
          {
            make: "Toyota",
            model: "Camry",
            category: VehicleCategory.SEDAN,
            year: 2023,
            price: 25000,
            quantity: 5,
          },
          {
            make: "Tesla",
            model: "Model 3",
            category: VehicleCategory.ELECTRIC,
            year: 2024,
            price: 42000,
            quantity: 2,
          },
        ],
      });
    });

    it("should search by category and price range", async () => {
      const response = await request(app)
        .get("/api/vehicles/search")
        .query({
          category: VehicleCategory.ELECTRIC,
          minPrice: 40000,
          maxPrice: 50000,
        })
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].make).toBe("Tesla");
    });

    it("should reject invalid price range", async () => {
      const response = await request(app)
        .get("/api/vehicles/search")
        .query({
          minPrice: 50000,
          maxPrice: 40000,
        })
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/vehicles/:id", () => {
    it("should return a vehicle by id", async () => {
      const vehicle = await prisma.vehicle.create({
        data: {
          make: "Toyota",
          model: "Fortuner",
          category: VehicleCategory.SUV,
          year: 2024,
          price: 45000,
          quantity: 8,
        },
      });

      const response = await request(app)
        .get(`/api/vehicles/${vehicle.id}`)
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.id).toBe(vehicle.id);
      expect(response.body.data.make).toBe("Toyota");
      expect(response.body.data.model).toBe("Fortuner");
    });
    it("should return 404 when vehicle does not exist", async () => {
      const response = await request(app).get(
        "/api/vehicles/00000000-0000-0000-0000-000000000000",
      ).set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(404);
    });

    it("should reject request without token", async () => {
      const response = await request(app).get(
        "/api/vehicles/00000000-0000-0000-0000-000000000000",
      );

      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/vehicles", () => {
    const vehicleData = {
      make: "Toyota",
      model: "Innova",
      category: VehicleCategory.SUV,
      year: 2024,
      price: 35000,
      quantity: 10,
    };

    it("should allow admin to create vehicle", async () => {
      const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(vehicleData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.make).toBe(vehicleData.make);
    });

    it("should reject request without token", async () => {
      const response = await request(app)
        .post("/api/vehicles")
        .send(vehicleData);

      expect(response.status).toBe(401);
    });

    it("should reject customer access", async () => {
      const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${customerToken}`)
        .send(vehicleData);

      expect(response.status).toBe(403);
    });

    it("should reject invalid payload", async () => {
      const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          make: "",
          price: -1,
        });

      expect(response.status).toBe(400);
    });

    it("should reject duplicate vehicle", async () => {
      await prisma.vehicle.create({
        data: vehicleData,
      });

      const response = await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(vehicleData);

      expect(response.status).toBe(409);
    });
  });

  describe("PUT /api/vehicles/:id", () => {
    it("should update vehicle", async () => {
      const vehicle = await prisma.vehicle.create({
        data: {
          make: "BMW",
          model: "X5",
          category: VehicleCategory.SUV,
          year: 2023,
          price: 50000,
          quantity: 5,
        },
      });

      const response = await request(app)
        .put(`/api/vehicles/${vehicle.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          price: 60000,
        });

      expect(response.status).toBe(200);
      expect(Number(response.body.data.price)).toBe(60000);
    });

    it("should return 404 for invalid id", async () => {
      const response = await request(app)
        .put("/api/vehicles/invalid-id")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          price: 100,
        });

      expect(response.status).toBe(400);
    });

    it("should reject customer", async () => {
      const vehicle = await prisma.vehicle.create({
        data: {
          make: "Audi",
          model: "A4",
          category: VehicleCategory.SEDAN,
          year: 2023,
          price: 40000,
          quantity: 5,
        },
      });

      const response = await request(app)
        .put(`/api/vehicles/${vehicle.id}`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({
          price: 45000,
        });

      expect(response.status).toBe(403);
    });

    it("should reject without token", async () => {
      const vehicle = await prisma.vehicle.create({
        data: {
          make: "Audi",
          model: "A6",
          category: VehicleCategory.SEDAN,
          year: 2023,
          price: 40000,
          quantity: 5,
        },
      });

      const response = await request(app)
        .put(`/api/vehicles/${vehicle.id}`)
        .send({
          price: 45000,
        });

      expect(response.status).toBe(401);
    });
  });

  describe("DELETE /api/vehicles/:id", () => {
    it("should delete vehicle", async () => {
      const vehicle = await prisma.vehicle.create({
        data: {
          make: "Mahindra",
          model: "Scorpio",
          category: VehicleCategory.SUV,
          year: 2024,
          price: 30000,
          quantity: 4,
        },
      });

      const response = await request(app)
        .delete(`/api/vehicles/${vehicle.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should reject customer", async () => {
      const vehicle = await prisma.vehicle.create({
        data: {
          make: "Kia",
          model: "Seltos",
          category: VehicleCategory.SUV,
          year: 2024,
          price: 25000,
          quantity: 6,
        },
      });

      const response = await request(app)
        .delete(`/api/vehicles/${vehicle.id}`)
        .set("Authorization", `Bearer ${customerToken}`);

      expect(response.status).toBe(403);
    });

    it("should reject without token", async () => {
      const vehicle = await prisma.vehicle.create({
        data: {
          make: "Hyundai",
          model: "Creta",
          category: VehicleCategory.SUV,
          year: 2024,
          price: 27000,
          quantity: 7,
        },
      });

      const response = await request(app).delete(`/api/vehicles/${vehicle.id}`);

      expect(response.status).toBe(401);
    });

    it("should return 404 for invalid vehicle", async () => {
      const response = await request(app)
        .delete("/api/vehicles/invalid-id")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/vehicles/:id/purchase", () => {
    it("should create purchase and decrement stock", async () => {
      const vehicle = await prisma.vehicle.create({
        data: {
          make: "Tata",
          model: "Nexon EV",
          category: VehicleCategory.ELECTRIC,
          year: 2024,
          price: 22000,
          quantity: 4,
        },
      });

      const response = await request(app)
        .post(`/api/vehicles/${vehicle.id}/purchase`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ quantity: 2 });

      expect(response.status).toBe(201);

      const updated = await prisma.vehicle.findUnique({
        where: { id: vehicle.id },
      });

      expect(updated?.quantity).toBe(2);
    });

    it("should reject purchase above available stock", async () => {
      const vehicle = await prisma.vehicle.create({
        data: {
          make: "Tata",
          model: "Punch",
          category: VehicleCategory.SUV,
          year: 2024,
          price: 16000,
          quantity: 1,
        },
      });

      const response = await request(app)
        .post(`/api/vehicles/${vehicle.id}/purchase`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ quantity: 2 });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/vehicles/:id/restock", () => {
    it("should allow admin to restock vehicle", async () => {
      const vehicle = await prisma.vehicle.create({
        data: {
          make: "Toyota",
          model: "Hilux",
          category: VehicleCategory.TRUCK,
          year: 2024,
          price: 38000,
          quantity: 2,
        },
      });

      const response = await request(app)
        .post(`/api/vehicles/${vehicle.id}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 3 });

      expect(response.status).toBe(200);
      expect(response.body.data.quantity).toBe(5);
    });

    it("should reject customer restock", async () => {
      const vehicle = await prisma.vehicle.create({
        data: {
          make: "Toyota",
          model: "Hilux",
          category: VehicleCategory.TRUCK,
          year: 2024,
          price: 38000,
          quantity: 2,
        },
      });

      const response = await request(app)
        .post(`/api/vehicles/${vehicle.id}/restock`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ quantity: 3 });

      expect(response.status).toBe(403);
    });
  });
});
