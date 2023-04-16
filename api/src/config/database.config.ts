import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectToDatabase = async (): Promise<void> => {
  try {
    const uri = process.env.CONNECTION_DB;

    await mongoose.connect(uri, {
      tls: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
