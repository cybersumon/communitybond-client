
"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

/**
 * PasswordInput
 *
 * PURPOSE:
 * Reusable password input with visibility toggle.
 *
 * FEATURES:
 * - Show/hide password
 * - Accessible button label
 * - Browser autocomplete support
 */
type PasswordInputProps = {
  value: string;
  onChange: (value: string) => void;
  autoComplete?: "current-password" | "new-password";
};

export default function PasswordInput({
  value,
  onChange,
  autoComplete = "current-password",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <label
        htmlFor="auth-password"
        className="text-sm font-semibold text-(--color-foreground)"
      >
        Password
      </label>

      <div className="relative">
        <LockKeyhole
          aria-hidden="true"
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-muted)"
        />

        <input
          id="auth-password"
          name="password"
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={8}
          maxLength={128}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter your password"
          className="w-full rounded-xl border border-(--color-border) bg-(--color-background) py-3 pl-11 pr-12 text-sm text-(--color-foreground) outline-none transition focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/15"
        />

        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 text-(--color-muted) transition hover:text-(--color-primary)"
        >
          {visible ? (
            <EyeOff size={18} aria-hidden="true" />
          ) : (
            <Eye size={18} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
