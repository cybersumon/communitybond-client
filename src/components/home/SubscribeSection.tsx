
"use client";

import {
  useState,
  type FormEvent,
} from "react";

import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  HeartHandshake,
  LoaderCircle,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";



export default function SubscribeSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /**
   * Submit subscription to the Express API.
   */
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL ??
        "http://localhost:5001";

      const response = await fetch(
        `${apiBase}/api/subscribers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const result: {
        success?: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
            "Unable to subscribe. Please try again."
        );
      }

      setMessage(
        result.message ??
          "Your subscription request was received."
      );

      setEmail("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to subscribe right now."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="cause-alerts"
      aria-labelledby="cause-alerts-title"
      className="relative bg-(--color-background) pt-2 pb-10 sm:pt-6 sm:pb-12 lg:pt-8 lg:pb-10"
    >
      {/* Same container width as Community Gallery */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[28px] bg-[#073b35] shadow-[0_24px_70px_-35px_rgba(2,44,34,0.55)] sm:rounded-[36px]">

          {/* Decorative gradient */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(52,211,153,0.28),transparent_48%),radial-gradient(ellipse_at_100%_100%,rgba(20,184,166,0.17),transparent_45%)]"
          />

          {/* Decorative subtle grid */}
          <div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-size-[38px_38px]"
/>

          {/* Decorative glowing circles */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full bg-emerald-400/20 blur-[90px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-teal-400/15 blur-[100px]"
          />

          {/* Content */}
          <div className="relative grid grid-cols-1 items-center gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-16 lg:py-20">

            {/* LEFT COLUMN */}
            <div className="max-w-xl">

              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-bold tracking-wide text-emerald-100 backdrop-blur-sm">
                <Sparkles
                  size={14}
                  className="text-emerald-300"
                  aria-hidden="true"
                />
                STAY INSPIRED. STAY CONNECTED.
              </div>

              {/* Heading */}
              <h2
                id="cause-alerts-title"
                className="mt-6 text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[44px]"
              >
                Good Things Happen
                <span className="mt-1 block text-emerald-300">
                  When We Connect.
                </span>
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-lg text-sm leading-7 text-emerald-50/75 sm:text-base">
                Discover meaningful causes, local volunteer
                opportunities, and inspiring community
                initiatives — delivered directly to your
                inbox.
              </p>

              {/* Benefits */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-50/90">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                    <MapPin
                      size={15}
                      className="text-emerald-300"
                    />
                  </span>
                  Local opportunities
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-emerald-50/90">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                    <HeartHandshake
                      size={15}
                      className="text-emerald-300"
                    />
                  </span>
                  Meaningful impact
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-emerald-50/90">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
                    <BellRing
                      size={15}
                      className="text-emerald-300"
                    />
                  </span>
                  Community alerts
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="relative">

              {/* Subscription card */}
              <div className="rounded-3xl border border-white/15 bg-white/9 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-7">

                {/* Card heading */}
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-300 text-emerald-950 shadow-lg shadow-emerald-950/20">
                    <Mail
                      size={23}
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Join Our Community
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-emerald-50/65">
                      Stay in the loop with local causes.
                    </p>
                  </div>
                </div>

                {/* Subscription form */}
                <form
                  onSubmit={handleSubmit}
                  className="mt-7 space-y-3"
                >
                  <label
                    htmlFor="cause-subscribe-email"
                    className="block text-xs font-semibold text-emerald-50/85"
                  >
                    Your Email Address
                  </label>

                  {/* Email input */}
                  <div className="relative">
                    <Mail
                      size={18}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="cause-subscribe-email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      disabled={loading}
                      className="h-13 w-full rounded-xl border border-transparent bg-white py-3 pl-12 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-400/20 disabled:opacity-60"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group inline-flex h-13 w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-300 px-5 text-sm font-extrabold text-emerald-950 shadow-lg shadow-emerald-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Subscribe for Updates

                        <ArrowRight
                          size={18}
                          aria-hidden="true"
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </form>

                {/* Success feedback */}
                {message && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-300/30 bg-emerald-400/15 p-3 text-sm font-medium text-emerald-100"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0"
                    />
                    <span>{message}</span>
                  </div>
                )}

                {/* Error feedback */}
                {error && (
                  <p
                    role="alert"
                    className="mt-4 rounded-xl border border-red-400/25 bg-red-500/15 p-3 text-sm text-red-100"
                  >
                    {error}
                  </p>
                )}

                {/* Privacy text */}
                <div className="mt-6 flex items-start gap-2 border-t border-white/15 pt-5">
                  <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-emerald-300"
                    aria-hidden="true"
                  />

                  <p className="text-xs leading-5 text-emerald-50/65">
                    Your inbox, your choice. No spam.
                    Unsubscribe anytime using the link
                    in your email.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom decorative line */}
          <div
            aria-hidden="true"
            className="h-1 w-full bg-linear-to-r from-emerald-500 via-teal-300 to-emerald-500"
          />
        </div>
      </div>
    </section>
  );
}
