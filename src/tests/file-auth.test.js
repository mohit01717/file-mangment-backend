const request = require("supertest");
const app = require("../app");

describe("File API authentication", () => {
  test("should reject a request without a token", async () => {
    const response = await request(app).get("/api/v1/files/");

    expect(response.status).toBe(401);
  });

  test("rejects requests without a login token for a file ID", async () => {
    const response = await request(app).get(
      "/api/v1/files/507f1f77bcf86cd799439011",
    );

    expect(response.status).toBe(401);
  });
});
