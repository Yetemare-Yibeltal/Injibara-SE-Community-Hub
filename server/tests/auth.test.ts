import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";
import { connectDB } from "../src/config/db.config";
import User from "../src/models/user.model";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/health", () => {
  it("returns 200 and confirms the API is running", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("POST /api/auth/login", () => {
  it("returns 400 when identifier is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ password: "somepassword" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: "TEST-STU-001" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 401 for a non-existent account", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: "DOES-NOT-EXIST-999", password: "whatever123" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("returns 401 for a real account with the wrong password", async () => {
    const student = await User.findOne({ studentId: "TEST-STU-001" });

    if (!student) {
      throw new Error(
        "Seed data missing: run `npm run seed` before running tests.",
      );
    }

    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: "TEST-STU-001", password: "wrong-password-here" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("returns 200 and an access token for correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: "TEST-STU-001", password: "Password123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.identifier).toBe("TEST-STU-001");
  });
});
