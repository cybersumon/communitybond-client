
"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";


export default function AuthTestPage() {
  const { data: session, isPending } =
    authClient.useSession();

  // Form values.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state.
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /**
   * Create a new user account.
   */
  async function handleRegister() {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      
if (error) {

  // Show useful error details without triggering
  // the Next.js development error overlay.
  setMessage(
    `Registration failed: ${
      error.message ||
      error.code ||
      "Please check the Network response"
    } (HTTP ${error.status || "unknown"})`
  );

  return;
}


      setMessage("Account created successfully!");
    } catch {
      setMessage("Unable to complete registration.");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Sign in with email and password.
   */
  async function handleLogin() {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setMessage(error.message || "Login failed.");
        return;
      }

      setMessage("Login successful!");
    } catch {
      setMessage("Unable to complete login.");
    } finally {
      setLoading(false);
    }
  }

  /**
   * End the current session.
   */
  async function handleLogout() {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await authClient.signOut();

      if (error) {
        setMessage(error.message || "Logout failed.");
        return;
      }

      setMessage("Logged out successfully.");
    } catch {
      setMessage("Unable to complete logout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-5 py-12">
      <div className="rounded-3xl border border-(--color-border) bg-(--color-surface) p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-(--color-primary)">
          CommunityBond
        </p>

        <h1 className="mt-2 text-2xl font-bold text-(--color-foreground)">
          Authentication Test
        </h1>

        {/* Display the current authenticated user. */}
        <div className="mt-6 rounded-xl bg-(--color-background) p-4">
          {isPending ? (
            <p className="text-sm text-(--color-muted)">
              Checking session...
            </p>
          ) : session?.user ? (
            <div>
              <p className="font-semibold text-(--color-foreground)">
                Logged in as {session.user.name}
              </p>

              <p className="text-sm text-(--color-muted)">
                {session.user.email}
              </p>
            </div>
          ) : (
            <p className="text-sm text-(--color-muted)">
              You are not logged in.
            </p>
          )}
        </div>

        {/* Registration and login fields. */}
        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Your full name"
            aria-label="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm text-(--color-foreground)"
          />

          <input
            type="email"
            placeholder="Email address"
            aria-label="Email address"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm text-(--color-foreground)"
          />

          <input
            type="password"
            placeholder="Password (at least 8 characters)"
            aria-label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-(--color-border) bg-(--color-background) px-4 py-3 text-sm text-(--color-foreground)"
          />
        </div>

        {/* Authentication actions. */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={handleRegister}
            className="cursor-pointer rounded-xl bg-(--color-primary) px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            Register
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleLogin}
            className="cursor-pointer rounded-xl border border-(--color-border) px-5 py-3 text-sm font-semibold text-(--color-foreground) disabled:opacity-50"
          >
            Login
          </button>

          <button
            type="button"
            disabled={loading || !session?.user}
            onClick={handleLogout}
            className="cursor-pointer rounded-xl border border-(--color-border) px-5 py-3 text-sm font-semibold text-(--color-foreground) disabled:opacity-50"
          >
            Logout
          </button>
        </div>

        {/* Show error or success messages. */}
        {message && (
          <p role="status" className="mt-5 text-sm text-(--color-foreground)">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
