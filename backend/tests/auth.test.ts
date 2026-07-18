import request from "supertest";
import app from "../src/app";

describe("Authentication API", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          firstName: "Meet",
          lastName: "Chauhan",
          email: "meet@gmail.com",
          password: "meet123",
        });

      expect(response.status).toBe(201);
    });
  });
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