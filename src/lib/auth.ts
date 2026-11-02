
import "server-only";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

import {
  mongoClient,
  authDatabase,
} from "./auth-db";

/**
 * Better Auth Configuration
 *
 * PURPOSE:
 * Configure user authentication and sessions.
 *
 * CURRENT FEATURES:
 * - Email/password registration
 * - Email/password login
 * - Logout
 * - Database-backed sessions
 *
 * NEXT:
 * - Google OAuth
 * - Email verification
 * - JWT integration with Express
 */

export const auth = betterAuth({
  // Main authentication website.
  baseURL: process.env.BETTER_AUTH_URL,

  // Secret used for authentication security.
  secret: process.env.BETTER_AUTH_SECRET,

  // Store authentication data in MongoDB.
  database: mongodbAdapter(authDatabase, {
    client: mongoClient,
  }),

  // Enable email and password authentication.
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  // Only allow the local Next.js app during development.
  trustedOrigins: ["http://localhost:3000"],
});
 