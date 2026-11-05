
import "server-only";

import dns from "node:dns";
import { MongoClient } from "mongodb";

// Configure reliable DNS servers.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Read MongoDB configuration.
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!mongoUri || !dbName) {
  throw new Error(
    "MONGODB_URI or DB_NAME is missing"
  );
}

// Create MongoDB client.
export const mongoClient = new MongoClient(mongoUri);

// Select the database.
export const authDatabase = mongoClient.db(dbName);
