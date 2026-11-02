
import "server-only";

import dns from "node:dns";
import { MongoClient } from "mongodb";

/**
 * Better Auth MongoDB Connection
 *
 * PURPOSE:
 * Connect Next.js authentication to MongoDB Atlas.
 *
 * IMPORTANT:
 * This file runs on the server only.
 *
 * DNS:
 * Our Windows environment previously required
 * explicit DNS servers for Atlas SRV lookup.
 */

// Use the working DNS configuration from Lesson 12.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const uri = process.env.MONGODB_URI;
const databaseName = process.env.DB_NAME;

if (!uri) {
  throw new Error("MONGODB_URI is missing.");
}

if (!databaseName) {
  throw new Error("DB_NAME is missing.");
}

// Reuse one MongoDB client instance.
export const mongoClient = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
});

// Select the same database used by Express.
export const authDatabase = mongoClient.db(databaseName);
