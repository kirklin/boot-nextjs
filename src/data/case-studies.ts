export interface CaseStudy {
  title: string;
  description: string;
  image: string;
  url: string;
  tags: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    title: "MDUtil",
    description: "A suite of Markdown utilities for content creators and developers",
    image: "/case-studies/mdutil.png",
    url: "https://mdutil.com",
    tags: ["Next.js", "Markdown", "Tailwind CSS"],
  },
];
