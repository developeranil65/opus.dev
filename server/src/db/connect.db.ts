import mongoose from "mongoose";
import { DB_NAME } from "../constants";
import { Logger } from "../utils/logger";

const connectDB = async (): Promise<void> => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        Logger.info(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        Logger.error("MONGODB connection error", error);
        process.exit(1);
    }
};

export default connectDB;