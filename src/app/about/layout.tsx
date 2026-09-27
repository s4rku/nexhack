import type { Metadata } from "next";
import { FAQS_DATA } from "@/data/nexhackData";

export const metadata: Metadata = {
  title: "About Us | Student Tech Ecosystem & Mission",
  description:
    "Learn about NEXHACK's mission, leadership, core pillars, and national roadmap. Empowering the next generation of student developers, creators, and innovators.",
  keywords: [
    "About NEXHACK",
    "student tech ecosystem",
    "hackathon mission",
    "student innovation community",
    "developer leadership",
    "tech chapter network",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About NEXHACK | Mission & Student Tech Community",
    description:
      "Empowering students across universities and schools through national hackathons, technical workshops, knowledge sessions, and community experiences.",
    url: "https://nexhack.tech/about",
    images: [
      {
        url: "https://nexhack.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "About NEXHACK Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About NEXHACK | Mission & Student Tech Community",
    description: "Learn about NEXHACK's mission, vision, and student tech community.",
    images: ["https://nexhack.tech/og-image.png"],
  },
};

export default function AboutLayout({
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
        name: "About Us",
        item: "https://nexhack.tech/about",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS_DATA.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
