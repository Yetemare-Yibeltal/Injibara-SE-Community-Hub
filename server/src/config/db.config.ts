import mongoose from "mongoose";
import { config } from "./env.config";

mongoose.set("strictQuery", true);

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(config.mongodbUri);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Failed to connect to MongoDB: ${error.message}`);
    } else {
      console.error("❌ Failed to connect to MongoDB: unknown error");
    }
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected gracefully");
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error disconnecting MongoDB: ${error.message}`);
    }
  }
}

export default connectDB;
