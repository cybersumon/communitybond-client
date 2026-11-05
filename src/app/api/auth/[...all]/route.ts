
import { auth } from "@/lib/auth";

import { toNextJsHandler } from "better-auth/next-js";



// MongoDB-backed authentication must run in Node.js.
export const runtime = "nodejs";

// Better Auth provides the GET and POST handlers.
export const { GET, POST } = toNextJsHandler(auth);
