import type { Metadata } from "next";
import { pageMetadata, ROUTES } from "@/lib/site";
import HomePage from "./home-client";

export const metadata: Metadata = pageMetadata({
  title: ROUTES.home.title,
  description: ROUTES.home.description,
  path: ROUTES.home.path,
  index: true,
});

export default function Page() {
  return <HomePage />;
}
