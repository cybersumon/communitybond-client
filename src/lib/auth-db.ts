
import "server-only";

import dns from "node:dns";
import { MongoClient } from "mongodb";

/**
 * MongoDB Atlas DNS configuration.
 *
 * PURPOSE:
 * Fix DNS SRV resolution issues on the
 * current Windows + Node.js environment.
 *
 * Must run before MongoClient connects.
 */
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.DB_NAME;

if (!mongoUri || !databaseName) {
  throw new Error(
    "MONGODB_URI or DB_NAME is missing."
  );
}

// Create the MongoDB connection client.
export const mongoClient = new MongoClient(mongoUri);

// Select the CommunityBond database.
export const authDatabase = mongoClient.db(databaseName);
