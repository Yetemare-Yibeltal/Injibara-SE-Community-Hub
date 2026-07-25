import mongoose from "mongoose";
import { connectDB } from "../src/config/db.config";
import Course from "../src/models/course.model";

const TEST_COURSE_CODE = "TEST-CS-101";
const TEST_BATCH = "Test Batch 2026";

beforeAll(async () => {
  await connectDB();
  await Course.deleteMany({ code: TEST_COURSE_CODE });
});

afterAll(async () => {
  await Course.deleteMany({ code: TEST_COURSE_CODE });
  await mongoose.connection.close();
});

describe("Course model", () => {
  it("creates and saves a course successfully", async () => {
    const course = await Course.create({
      name: "Test Data Structures",
      code: TEST_COURSE_CODE,
      batch: TEST_BATCH,
      semester: "Semester 1",
      teacherIds: [],
    });

    expect(course._id).toBeDefined();
    expect(course.code).toBe(TEST_COURSE_CODE);
    expect(course.createdAt).toBeDefined();
  });

  it("retrieves the saved course by batch", async () => {
    const found = await Course.findOne({
      batch: TEST_BATCH,
      code: TEST_COURSE_CODE,
    });

    expect(found).not.toBeNull();
    expect(found?.name).toBe("Test Data Structures");
  });

  it("rejects a duplicate course code within the same batch", async () => {
    await expect(
      Course.create({
        name: "Duplicate Attempt",
        code: TEST_COURSE_CODE,
        batch: TEST_BATCH,
        semester: "Semester 1",
      }),
    ).rejects.toThrow();
  });

  it("allows the same course code in a different batch", async () => {
    const otherBatch = await Course.create({
      name: "Test Data Structures",
      code: TEST_COURSE_CODE,
      batch: "Different Test Batch 2027",
      semester: "Semester 1",
    });

    expect(otherBatch._id).toBeDefined();

    await Course.deleteOne({ _id: otherBatch._id });
  });

  it("fails validation when required fields are missing", async () => {
    await expect(
      Course.create({ code: "INCOMPLETE" } as never),
    ).rejects.toThrow();
  });
});
