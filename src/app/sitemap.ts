import type { MetadataRoute } from "next";
import { absoluteUrl, SITEMAP_PATHS } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return SITEMAP_PATHS.map((path, i) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: i === 0 ? "weekly" : "monthly",
    priority: i === 0 ? 1 : 0.8,
  }));
}
