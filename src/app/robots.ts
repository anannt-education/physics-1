import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { absUrl } from "@/lib/mount";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/lesson/lesson-motion-graphs",
          "/lesson/lesson-zero-v-a",
          "/about",
          "/faq",
          "/privacy",
          "/legal",
          "/diagnostic",
        ],
        disallow: ["/mock", "/mocks", "/api", "/keys", "/practice", "/frq", "/admin"],
      },
    ],
    sitemap: absUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
