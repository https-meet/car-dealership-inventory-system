import request from "supertest";
import bcrypt from "bcrypt";
import app from "../src/app";
import { prisma } from "../src/config/prisma";

beforeEach(async () => {
  await prisma.user.deleteMany();
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

      const user = await prisma.user.findUnique({
        where: { email: "meet@gmail.com" },
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
});