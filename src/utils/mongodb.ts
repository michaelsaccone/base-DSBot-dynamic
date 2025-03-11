import mongoose from "mongoose";

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI || "";

    try {
        const conn = await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        const err = error as Error;
    }
};
