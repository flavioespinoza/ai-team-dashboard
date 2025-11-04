// Date: 2025-11-04
// Version: 1.0.0
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!
const MONGODB_DB = process.env.MONGODB_DB!

if (!MONGODB_URI) {
	throw new Error('Please define MONGODB_URI environment variable')
}

if (!MONGODB_DB) {
	throw new Error('Please define MONGODB_DB environment variable')
}

let cached = global.mongoose

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
	if (cached.conn) {
		return cached.conn
	}

	if (!cached.promise) {
		cached.promise = mongoose
			.connect(MONGODB_URI, {
				dbName: MONGODB_DB,
				bufferCommands: false
			})
			.then((mongoose) => mongoose)
	}

	try {
		cached.conn = await cached.promise
	} catch (e) {
		cached.promise = null
		throw e
	}

	return cached.conn
}
