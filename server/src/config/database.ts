import mongoose from "mongoose";
import {env} from "./env";

export const connectDatabase = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");
    }catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};

mongoose.connection.on("disconnected",() => {
    console.warn("⚠️ MongoDB disconnected!");
});
mongoose.connection.on("reconnected",() => {
    console.log("✅ MongoDB reconnected!");
});
mongoose.connection.on("error",(err) => {
    console.error("❌ MongoDB connection error:", err);
});