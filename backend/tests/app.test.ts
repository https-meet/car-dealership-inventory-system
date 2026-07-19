import request from "supertest";
import app from "../src/app";

describe("Application", () => {
  describe("GET /api/health", () => {
    it("should return API health status", async () => {
      const response = await request(app).get("/api/health");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Car Dealership Inventory API is running",
      });
    });
  });
});
