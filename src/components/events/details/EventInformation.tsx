
import {
  CalendarDays,
  Clock3,
  MapPin,
  Tag,
} from "lucide-react";

import type { CommunityEvent } from "@/types/event";

type EventInformationProps = {
  event: CommunityEvent;
};

export default function EventInformation({
  event,
}: EventInformationProps) {
  const eventDate = new Date(event.eventDate);

  const formattedDate = eventDate.toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const formattedTime = eventDate.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Dhaka",
    }
  );

  const information = [
    {
      label: "Event Date",
      value: formattedDate,
      icon: CalendarDays,
    },
    {
      label: "Event Time",
      value: formattedTime,
      icon: Clock3,
    },
    {
      label: "Location",
      value: event.location,
      icon: MapPin,
    },
    {
      label: "Category",
      value: event.eventType,
      icon: Tag,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {information.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="flex items-start gap-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--color-primary)/10 text-(--color-primary)">
              <Icon
                size={19}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium text-(--color-muted)">
                {item.label}
              </p>

              <p className="mt-1 wrap-break-word text-sm font-bold text-(--color-foreground)">
                {item.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
