import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Developer Community & Builder Network",
  description:
    "Join thousands of passionate student developers, UI/UX designers, AI researchers, and campus innovators. Find hackathon teammates, share projects, and collaborate.",
  keywords: [
    "student developer community",
    "coding community online",
    "hackathon teams",
    "student tech network",
    "open source student contributors",
    "peer tech learning",
  ],
  alternates: {
    canonical: "/community",
  },
  openGraph: {
    title: "Join NEXHACK Student Community | Builders & Innovators",
    description:
      "Find hackathon teammates, get code reviews, participate in game nights, and build real-world software together.",
    url: "https://nexhack.in/community",
    images: [
      {
        url: "https://nexhack.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "NEXHACK Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join NEXHACK Student Tech Community",
    description: "Connect with thousands of student developers, designers, and hackathon competitors.",
    images: ["https://nexhack.in/og-image.png"],
  },
};

export default function CommunityLayout({
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
        item: "https://nexhack.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Community",
        item: "https://nexhack.in/community",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
