import mongoose from "mongoose";
import { ENV_VARS } from "./env_vars";

export const connectDb = async () => {
  try {
    const connect = await mongoose.connect(ENV_VARS.MONGO_URI);

    console.log(`Mongodb successfully connected!: ${connect.connection.host}`);
  } catch (e) {
    console.error(`Error connecting to mongodb: ${e.message}`);
    process.exit(1);
  }
};
