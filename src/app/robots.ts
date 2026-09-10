import type { MetadataRoute } from "next";
import { BASE_PATH, STUDY_ORIGIN } from "@/lib/gate";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          `${BASE_PATH}/`,
          `${BASE_PATH}/about`,
          `${BASE_PATH}/legal`,
          `${BASE_PATH}/course`,
          `${BASE_PATH}/diagnostic`,
          `${BASE_PATH}/lesson/lesson-motion-graphs`,
          `${BASE_PATH}/lesson/lesson-zero-v-a`,
          `${BASE_PATH}/repair/`,
        ],
        disallow: [
          `${BASE_PATH}/api/`,
          `${BASE_PATH}/mocks`,
          `${BASE_PATH}/practice`,
          `${BASE_PATH}/frq`,
          `${BASE_PATH}/admin`,
          `${BASE_PATH}/review`,
          `${BASE_PATH}/progress`,
          `${BASE_PATH}/results`,
          `${BASE_PATH}/onboarding`,
        ],
      },
    ],
    sitemap: `${STUDY_ORIGIN}${BASE_PATH}/sitemap.xml`,
    host: STUDY_ORIGIN,
  };
}
