import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/config/prisma";

beforeEach(async () => {
  await prisma.user.deleteMany();
});

describe("Authentication Middleware", () => {

  let token: string;

  beforeEach(async () => {

    await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "Meet",
        lastName: "Chauhan",
        email: "meet@gmail.com",
        password: "meet123",
      });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "meet@gmail.com",
        password: "meet123",
      });

    token = login.body.token;
  });

  it("should return 401 when authorization header is missing", async () => {

    const response = await request(app)
      .get("/api/profile");

    expect(response.status).toBe(401);

  });

  it("should return 401 for invalid token", async () => {

    const response = await request(app)
      .get("/api/profile")
      .set("Authorization", "Bearer invalidtoken");

    expect(response.status).toBe(401);

  });

  it("should allow access with valid token", async () => {

    const response = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.user.email).toBeUndefined();

    expect(response.body.user.id).toBeDefined();

    expect(response.body.user.role).toBeDefined();

  });

});