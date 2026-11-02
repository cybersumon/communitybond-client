
import { auth } from "@/lib/auth";

import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth API Handler
 *
 * PURPOSE:
 * Handle authentication requests automatically.
 *
 * EXAMPLES:
 * POST /api/auth/sign-up/email
 * POST /api/auth/sign-in/email
 * POST /api/auth/sign-out
 * GET  /api/auth/get-session
 */

// MongoDB-backed authentication must run in Node.js.
export const runtime = "nodejs";

// Better Auth provides the GET and POST handlers.
export const { GET, POST } = toNextJsHandler(auth);
