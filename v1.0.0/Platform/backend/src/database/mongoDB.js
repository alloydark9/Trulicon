import mongoose from "mongoose";

import {MONGO_URI} from "../config/env.js"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI, {
            retryWrites: false,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:");
        console.error(error.message);

        process.exit(1);
    }
};

export default connectDB;