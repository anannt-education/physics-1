import type { MetadataRoute } from "next";
import { absoluteUrl, SITEMAP_PATHS } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return SITEMAP_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" || path === "/about" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/about" || path === "/course" ? 0.8 : 0.6,
  }));
}
