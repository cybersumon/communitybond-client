
import {
  Search,
  Users,
  CalendarPlus,
  HeartHandshake,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

/**
 * FeatureItem Type
 *
 * PURPOSE:
 * Define the structure of a feature card.
 *
 * WHY:
 * TypeScript checks that each feature contains
 * an id, title, description and valid icon.
 */
export type FeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

/**
 * Static homepage features.
 *
 * NOTE:
 * These describe platform capabilities.
 * Dynamic event data will come from MongoDB later.
 */
export const features: FeatureItem[] = [
  {
    id: "discover",
    title: "Discover Local Events",
    description:
      "Explore meaningful volunteering opportunities and community activities happening near you.",
    icon: Search,
  },
  {
    id: "connect",
    title: "Connect with People",
    description:
      "Meet compassionate volunteers who share your passion for building stronger communities.",
    icon: Users,
  },
  {
    id: "create",
    title: "Create Your Own Event",
    description:
      "Organize cleanup drives, donation campaigns, plantation events, and more.",
    icon: CalendarPlus,
  },
  {
    id: "impact",
    title: "Make a Real Impact",
    description:
      "Turn small acts of kindness into meaningful positive change for people around you.",
    icon: HeartHandshake,
  },

];
