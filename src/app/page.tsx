import { redirect } from "next/navigation";
import { defaultLocale } from "~/lib/i18n/navigation";

export const dynamic = "force-static";

export default function RootPage() {
  redirect(`/${defaultLocale}`);
  return null;
}
