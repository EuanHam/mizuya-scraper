import mongoose from "mongoose";

let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGO_DB!, {
                dbName: process.env.DB_NAME,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}