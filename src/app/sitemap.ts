import type { MetadataRoute } from "next";
import { getBaseUrl } from "~/lib/url";

export default function sitemap(): MetadataRoute.Sitemap {
  // Use the utility function to get the dynamic base URL
  const baseUrl = getBaseUrl();

  // TODO: Replace these placeholder entries with your actual site structure
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/showcase`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // Add more URLs for your specific pages and content here
  ];
}
