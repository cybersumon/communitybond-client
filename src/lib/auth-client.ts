
import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

/**
 * CommunityBond Authentication Client
 *
 * PURPOSE:
 * Manage authentication from React components.
 *
 * FEATURES:
 * - Email/password login
 * - Google login
 * - Session management
 * - JWT access for Express.js
 */
export const authClient = createAuthClient({
  plugins: [
    jwtClient(),
  ],
});
