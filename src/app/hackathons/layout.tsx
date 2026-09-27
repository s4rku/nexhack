import type { Metadata } from "next";
import { HACKATHONS_DATA } from "@/data/nexhackData";

export const metadata: Metadata = {
  title: "National Hackathons & Coding Sprints",
  description:
    "Explore upcoming and flagship student hackathons, 24-48 hour coding competitions, tracks in AI, Web3, FinTech, and Cloud. Build bold projects and win prizes.",
  keywords: [
    "student hackathons",
    "coding sprints",
    "hackathon registration",
    "AI hackathons",
    "college coding competitions",
    "hackathon prize pool",
    "developer hackathon",
  ],
  alternates: {
    canonical: "/hackathons",
  },
  openGraph: {
    title: "National Hackathons & Coding Sprints | NEXHACK",
    description:
      "Join premier student hackathons and innovation sprints. Compete with top student developers and creators across the country.",
    url: "https://nexhack.tech/hackathons",
    images: [
      {
        url: "https://nexhack.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "NEXHACK Hackathons",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "National Hackathons & Coding Sprints | NEXHACK",
    description: "Compete in national student hackathons, win cash prizes, and connect with top tech teams.",
    images: ["https://nexhack.tech/og-image.png"],
  },
};

export default function HackathonsLayout({
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
        name: "Hackathons",
        item: "https://nexhack.tech/hackathons",
      },
    ],
  };

  const hackathonEventsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NEXHACK National Hackathons",
    itemListElement: HACKATHONS_DATA.map((h, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: `${h.name} - ${h.edition}`,
        description: h.description,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode:
          h.mode === "Online"
            ? "https://schema.org/OnlineEventAttendanceMode"
            : h.mode === "In-Person"
            ? "https://schema.org/OfflineEventAttendanceMode"
            : "https://schema.org/MixedEventAttendanceMode",
        location: {
          "@type": "Place",
          name: h.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: h.location,
            addressCountry: "IN",
          },
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
          url: "https://nexhack.tech/hackathons",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hackathonEventsSchema) }}
      />
      {children}
    </>
  );
}
