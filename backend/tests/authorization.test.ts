import request from "supertest";
import app from "../src/app";

describe("Authorization Middleware", () => {

  it("should deny access without token", async () => {

    const response = await request(app)
      .get("/api/admin");

    expect(response.status).toBe(401);

  });

});