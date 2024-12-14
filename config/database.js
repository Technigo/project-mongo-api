import mongoose from "mongoose";

export const connectDatabase = async () => {
  const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/triptracking"
  
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB!")
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error.message);
    process.exit(1); // Exit process on connection failure
  }
}
