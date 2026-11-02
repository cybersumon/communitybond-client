
import "server-only";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

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
 */

// Validate required Google OAuth settings.
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error(
    "Google OAuth credentials are missing in .env.local"
  );
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  // Reuse the working MongoDB connection.
  database: mongodbAdapter(authDatabase, {
    client: mongoClient,
  }),

  // Keep existing email/password authentication.
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  // Enable Google OAuth authentication.
  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  },

  trustedOrigins: ["http://localhost:3000"],
});
