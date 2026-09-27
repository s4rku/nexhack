import type { Metadata } from "next";
import { RESOURCES_DATA } from "@/data/nexhackData";

export const metadata: Metadata = {
  title: "Developer Resources, Hackathon Guides & Toolkits",
  description:
    "Curated hackathon starter kits, pitch deck frameworks, GitHub templates, and developer roadmaps designed to help student developers build and win.",
  keywords: [
    "hackathon guides",
    "hackathon starter kit",
    "pitch deck template",
    "developer cheat sheets",
    "student project ideas",
    "coding sprint resources",
  ],
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "Developer Resources & Hackathon Guides | NEXHACK",
    description:
      "Playbooks, project boilerplates, and winning pitch frameworks to accelerate your hackathon journey.",
    url: "https://nexhack.tech/resources",
    images: [
      {
        url: "https://nexhack.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "NEXHACK Developer Resources",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Resources & Hackathon Guides | NEXHACK",
    description: "Curated guides, boilerplate templates, and toolkits for student developers.",
    images: ["https://nexhack.tech/og-image.png"],
  },
};

export default function ResourcesLayout({
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
        name: "Developer Resources",
        item: "https://nexhack.tech/resources",
      },
    ],
  };

  const resourcesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NEXHACK Developer Guides and Hackathon Resources",
    itemListElement: RESOURCES_DATA.map((res, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        name: res.title,
        headline: res.title,
        description: res.excerpt,
        author: {
          "@type": "Organization",
          name: res.author,
        },
        publisher: {
          "@type": "Organization",
          name: "NEXHACK",
          url: "https://nexhack.tech",
        },
        url: "https://nexhack.tech/resources",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resourcesSchema) }}
      />
      {children}
    </>
  );
}
