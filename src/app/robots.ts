import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kitchenproof.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/explore", "/restaurants/", "/how-it-works", "/for-restaurants", "/about"],
        disallow: ["/api/", "/dashboard/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

