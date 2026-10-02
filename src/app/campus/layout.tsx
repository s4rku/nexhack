import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campus Chapters & University Hackathon Partnerships",
  description:
    "Partner with NEXHACK to organize university hackathons, student tech societies, and developer workshops. Access industry sponsors, judging panels, and starter toolkits.",
  keywords: [
    "campus hackathons",
    "university tech chapter",
    "college coding partnership",
    "host college hackathon",
    "student club sponsorship",
    "campus ambassador program",
  ],
  alternates: {
    canonical: "/campus",
  },
  openGraph: {
    title: "NEXHACK Campus Chapters | Partner With Us",
    description:
      "Bring national hackathons and developer experiences to your university or school. 100% free partnership and student empowerment.",
    url: "https://nexhack.in/campus",
    images: [
      {
        url: "https://nexhack.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "NEXHACK Campus Chapters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXHACK Campus Chapters & College Partnerships",
    description: "Empower your institution with national hackathons and student tech events.",
    images: ["https://nexhack.in/og-image.png"],
  },
};

export default function CampusLayout({
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
        name: "Campus Chapters",
        item: "https://nexhack.in/campus",
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
