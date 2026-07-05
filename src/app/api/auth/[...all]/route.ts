import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";
import { auth } from "~/lib/auth/server";

const handler = auth ? toNextJsHandler(auth) : null;

// Without DATABASE_URL the app still boots (template convenience): report
// "signed out" for session reads instead of erroring on every page load, and
// 503 for everything else.
function unconfigured(req: Request) {
  if (new URL(req.url).pathname.endsWith("/get-session")) {
    return NextResponse.json(null);
  }
  return NextResponse.json({ error: "Auth not configured. DATABASE_URL is required." }, { status: 503 });
}

export const GET = handler?.GET ?? unconfigured;
export const POST = handler?.POST ?? unconfigured;
