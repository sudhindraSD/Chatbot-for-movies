import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

//talks to db and backend like a waiter for the backend and db
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017"}/${DB_NAME}`
    );
    console.log(
      `MongoDB connection is successful ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
