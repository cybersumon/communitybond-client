
import { createAuthClient } from "better-auth/react";

/**
 * Better Auth React Client
 *
 * PURPOSE:
 * Provide authentication methods to React.
 *
 * USAGE:
 * authClient.signUp.email(...)
 * authClient.signIn.email(...)
 * authClient.signOut()
 * authClient.useSession()
 */

export const authClient = createAuthClient();
