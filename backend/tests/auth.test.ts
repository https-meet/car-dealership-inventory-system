import request from "supertest";
import bcrypt from "bcrypt";
import app from "../src/app";
import { prisma } from "../src/config/prisma";
import { clearDatabase } from "./helpers/test-db";


beforeEach(async () => {
  await clearDatabase();
});

describe("Authentication API", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const password = "meet123";

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          firstName: "Meet",
          lastName: "Chauhan",
          email: "meet@gmail.com",
          password,
        });

      expect(response.status).toBe(201);
      expect(response.body.user.password).toBeUndefined();

      const user = await prisma.user.findUnique({
        where: {
          email: "meet@gmail.com",
        },
      });

      expect(user).not.toBeNull();
      expect(user!.password).not.toBe(password);

      const isMatch = await bcrypt.compare(password, user!.password);

      expect(isMatch).toBe(true);
    });

    it("should return 409 if email already exists", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          firstName: "Meet",
          lastName: "Chauhan",
          email: "meet@gmail.com",
          password: "meet123",
        });

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          firstName: "Meet",
          lastName: "Chauhan",
          email: "meet@gmail.com",
          password: "meet123",
        });

      expect(response.status).toBe(409);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          firstName: "Meet",
          lastName: "Chauhan",
          email: "meet@gmail.com",
          password: "meet123",
        });
    });

    it("should login successfully", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "meet@gmail.com",
          password: "meet123",
        });

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.token).toBeDefined();

      expect(response.body.user.email).toBe("meet@gmail.com");
    });

    it("should return 401 for wrong password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "meet@gmail.com",
          password: "wrongpassword",
        });

      expect(response.status).toBe(401);

      expect(response.body.success).toBe(false);

      expect(response.body.message).toBe(
        "Invalid email or password"
      );
    });

    it("should return 401 if email does not exist", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "unknown@gmail.com",
          password: "meet123",
        });

      expect(response.status).toBe(401);

      expect(response.body.success).toBe(false);

      expect(response.body.message).toBe(
        "Invalid email or password"
      );
    });
  });
});
