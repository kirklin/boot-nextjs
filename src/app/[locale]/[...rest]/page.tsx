import { notFound } from "next/navigation";

// Catch-all for unknown routes inside the locale segment — funnels them into
// the localized not-found page (src/app/[locale]/not-found.tsx).
export default function CatchAllPage() {
  notFound();
}
