import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/admin"],
      },
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot"],
        allow: "/",
        disallow: ["/api/", "/admin/", "/admin"],
      },
    ],
    sitemap: "https://nexhack.in/sitemap.xml",
    host: "https://nexhack.in",
  };
}
