import type { MetadataRoute } from "next";
import { ROBOTS_DISALLOW, SITE_ORIGIN, absUrl } from "@/lib/mount";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/legal",
          "/course",
          "/diagnostic",
          "/lesson/lesson-motion-graphs",
          "/lesson/lesson-zero-v-a",
          "/repair/",
        ],
        disallow: ROBOTS_DISALLOW,
      },
    ],
    sitemap: absUrl("/sitemap.xml"),
    host: SITE_ORIGIN,
  };
}
