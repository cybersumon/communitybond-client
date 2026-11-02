
import "server-only";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

import {
  mongoClient,
  authDatabase,
} from "./auth-db";

/**
 * CommunityBond Authentication
 *
 * FEATURES:
 * - Email/password registration
 * - Email/password login
 * - Google OAuth login
 * - MongoDB-backed sessions
 * - JWT support for Express.js API
 */

// Validate Google OAuth credentials.
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error(
    "Google OAuth credentials are missing in .env.local"
  );
}

export const auth = betterAuth({
  // Better Auth configuration.
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  // Connect Better Auth to MongoDB.
  database: mongodbAdapter(authDatabase, {
    client: mongoClient,
  }),

  // Email/password authentication.
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  // Google OAuth authentication.
  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  },

  // Enable JWT support for the Express API.
  plugins: [
    jwt(),
  ],

  // Allowed frontend origin.
  trustedOrigins: ["http://localhost:3000"],
});
