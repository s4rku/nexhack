import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "NEXHACK | The Next Generation of Student Tech Community",
  description:
    "Build. Hack. Learn. Connect. NEXHACK brings students, developers, creators, and innovators together through national hackathons, technical workshops, knowledge sessions, and community experiences.",
  keywords: [
    "NEXHACK",
    "hackathons",
    "student hackathon",
    "college hackathon",
    "school hackathon",
    "coding competitions",
    "student tech community",
    "technology workshops",
    "student innovation",
    "developer community",
    "coding sprints",
    "AI hackathons",
    "web development competitions",
  ],
  authors: [{ name: "NEXHACK Community", url: "https://nexhack.tech" }],
  creator: "NEXHACK",
  publisher: "NEXHACK",
  metadataBase: new URL("https://nexhack.tech"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NEXHACK | Build the Future. Hack What's Next.",
    description:
      "A student-driven technology community organizing hackathons, technical workshops, knowledge sessions, and innovation challenges across schools and colleges.",
    url: "https://nexhack.tech",
    siteName: "NEXHACK",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200&h=630",
        width: 1200,
        height: 630,
        alt: "NEXHACK Student Tech Community & Hackathons",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXHACK | Student Tech Community & Hackathons",
    description: "Build. Hack. Learn. Connect. Join the premier student technology ecosystem.",
    creator: "@nexhack_tech",
    images: ["https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200&h=630"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org structured data for organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NEXHACK",
    url: "https://nexhack.tech",
    logo: "https://nexhack.tech/logo.png",
    description:
      "Student-driven technology community organizing national hackathons, technical workshops, knowledge sessions, and innovation experiences.",
    sameAs: [
      "https://discord.gg/nexhack",
      "https://x.com/nexhack_tech",
      "https://linkedin.com/company/nexhack",
      "https://instagram.com/nexhack.tech",
      "https://github.com/nexhack-tech",
    ],
  };

  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen bg-white text-[#0A0F1D] font-sans antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
