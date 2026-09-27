import type { Metadata } from "next";
import { ALL_EVENTS_DATA } from "@/data/nexhackData";

export const metadata: Metadata = {
  title: "Tech Events, Masterclasses & Workshops",
  description:
    "Join live developer workshops, AI engineering masterclasses, cloud architecture deep-dives, and community sessions led by tech mentors. 100% free for students.",
  keywords: [
    "tech events",
    "student coding workshops",
    "developer masterclasses",
    "AI webinars",
    "system design sessions",
    "tech meetups",
    "coding bootcamps",
  ],
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: "Tech Events & Knowledge Sessions | NEXHACK",
    description:
      "Hands-on technical workshops, architecture deep dives, and expert mentorship sessions for student engineers.",
    url: "https://nexhack.tech/events",
    images: [
      {
        url: "https://nexhack.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "NEXHACK Tech Events & Workshops",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Events & Workshops | NEXHACK",
    description: "Hands-on workshops, system design sessions, and mentorship for student developers.",
    images: ["https://nexhack.tech/og-image.png"],
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://nexhack.tech",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Events & Sessions",
        item: "https://nexhack.tech/events",
      },
    ],
  };

  const eventsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NEXHACK Technical Workshops & Masterclasses",
    itemListElement: ALL_EVENTS_DATA.map((evt, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "EducationEvent",
        name: evt.title,
        description: `${evt.title} led by ${evt.speaker.name} (${evt.speaker.role} at ${evt.speaker.company}). Level: ${evt.level}.`,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        location: {
          "@type": "VirtualLocation",
          url: "https://nexhack.tech/events",
        },
        performer: {
          "@type": "Person",
          name: evt.speaker.name,
          jobTitle: evt.speaker.role,
        },
        organizer: {
          "@type": "Organization",
          name: "NEXHACK",
          url: "https://nexhack.tech",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: "https://nexhack.tech/events",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsSchema) }}
      />
      {children}
    </>
  );
}
