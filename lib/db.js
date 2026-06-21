import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables")
}

// Reuse the cached connection across hot reloads in development
let cached = global._mongoose

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null }
}

const ConnectDB = async () => {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default ConnectDB;