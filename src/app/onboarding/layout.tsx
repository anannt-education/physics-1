import type { Metadata } from "next";
import { pageMetadata, ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMetadata(ROUTES.onboarding);

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
