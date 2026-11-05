
import { HeartHandshake } from "lucide-react";


export default function JoinEventPanel() {
  return (
    <section className="mt-8 rounded-2xl bg-(--color-hero) p-5">
      {/* Section icon and introduction. */}
      <div className="flex items-start gap-3">
        <HeartHandshake
          size={25}
          aria-hidden="true"
          className="shrink-0 text-(--color-primary)"
        />

        <div>
          <h3 className="font-bold text-(--color-foreground)">
            Be Part of the Change
          </h3>

          <p className="mt-2 text-sm leading-6 text-(--color-muted)">
            Join this community initiative and help make
            a positive difference.
          </p>
        </div>
      </div>

      {/* Disabled until authenticated API integration. */}
      <button
        type="button"
        disabled
        title="Event joining will be available after authentication is implemented"
        className="mt-6 w-full cursor-not-allowed rounded-xl bg-[#176B50] px-6 py-3 font-semibold text-white opacity-60"
      >
        Join Event
      </button>

      <p className="mt-3 text-center text-xs text-(--color-muted)">
        Joining will be enabled after authentication setup.
      </p>
    </section>
  );
}
