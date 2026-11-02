
import type { Metadata } from "next";
import { HandHeart, Leaf, Users } from "lucide-react";

import AuthForm from "@/components/auth/AuthForm";

/**
 * Registration Page
 *
 * PURPOSE:
 * Provide a dedicated page for creating
 * a CommunityBond user account.
 *
 * Reuses AuthForm with mode="register".
 */

export const metadata: Metadata = {
  title: "Register | CommunityBond",
  description: "Create your free CommunityBond account.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-[calc(100dvh-80px)] bg-(--color-background)">
      <div className="mx-auto grid min-h-[calc(100dvh-80px)] max-w-7xl lg:grid-cols-2">
        {/* Left: Registration form. */}
        <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-16">
          <AuthForm mode="register" />
        </section>

        {/* Right: Community mission. */}
        <aside className="relative hidden overflow-hidden bg-[#103D30] px-12 py-16 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <HandHeart size={28} />
            <span className="text-lg font-bold">Join the Movement</span>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Create Positive Change
            </p>

            <h2 className="mt-6 text-4xl font-extrabold leading-tight">
              Small actions.
              <span className="block text-emerald-300">
                Big differences.
              </span>
            </h2>

            <p className="mt-5 text-base leading-8 text-emerald-100/75">
              Become part of a caring community and take
              part in initiatives that matter.
            </p>

            <div className="mt-10 space-y-4">
              <p className="flex items-center gap-3 text-sm text-emerald-50">
                <Leaf size={19} className="text-emerald-300" />
                Discover meaningful initiatives
              </p>

              <p className="flex items-center gap-3 text-sm text-emerald-50">
                <Users size={19} className="text-emerald-300" />
                Participate alongside local volunteers
              </p>
            </div>
          </div>

          <p className="relative z-10 text-xs text-emerald-200/60">
            Together, we can build stronger communities.
          </p>
        </aside>
      </div>
    </main>
  );
}
