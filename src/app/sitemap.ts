import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // TODO: Replace with your actual website's base URL
  const baseUrl = "https://github.com/kirklin/boot-nextjs";

  // TODO: Replace these placeholder entries with your actual site structure
  return [
    {
      url: baseUrl, // Homepage
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`, // Example: About page
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/[category-path]`, // Example: Category page placeholder
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/[resource-path]`, // Example: Resource page placeholder
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // Add more URLs for your specific pages and content here
  ];
}
