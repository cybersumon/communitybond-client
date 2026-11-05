
import type { Metadata } from "next";
import { HeartHandshake, ShieldCheck, Users } from "lucide-react";

import AuthForm from "@/components/auth/AuthForm";



export const metadata: Metadata = {
  title: "Login | CommunityBond",
  description: "Sign in to your CommunityBond account.",
};

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100dvh-80px)] bg-(--color-background)">
      <div className="mx-auto grid min-h-[calc(100dvh-80px)] max-w-7xl lg:grid-cols-2">
        {/* Left: Authentication form. */}
        <section className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-16">
          <AuthForm mode="login" />
        </section>

        {/* Right: Premium community information panel. */}
        <aside className="relative hidden overflow-hidden bg-[#103D30] px-12 py-16 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <HeartHandshake size={28} />
            <span className="text-lg font-bold">CommunityBond</span>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Together We Make a Difference
            </p>

            <h2 className="mt-6 text-4xl font-extrabold leading-tight">
              Your community.
              <span className="block text-emerald-300">
                Your impact.
              </span>
            </h2>

            <p className="mt-5 text-base leading-8 text-emerald-100/75">
              Discover local initiatives, meet passionate
              volunteers, and help build a better tomorrow.
            </p>

            <div className="mt-10 space-y-4">
              <p className="flex items-center gap-3 text-sm text-emerald-50">
                <Users size={19} className="text-emerald-300" />
                Connect with your community
              </p>

              <p className="flex items-center gap-3 text-sm text-emerald-50">
                <ShieldCheck size={19} className="text-emerald-300" />
                Secure account and session management
              </p>
            </div>
          </div>

          <p className="relative z-10 text-xs text-emerald-200/60">
            Every meaningful change starts with people.
          </p>
        </aside>
      </div>
    </main>
  );
}
