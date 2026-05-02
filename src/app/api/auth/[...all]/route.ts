import { toNextJsHandler } from "better-auth/next-js";
import { NextResponse } from "next/server";
import { auth } from "~/lib/auth/server";

const handler = auth ? toNextJsHandler(auth) : null;

export const GET = handler?.GET ?? (() => NextResponse.json({ error: "Auth not configured. DATABASE_URL is required." }, { status: 503 }));
export const POST = handler?.POST ?? (() => NextResponse.json({ error: "Auth not configured. DATABASE_URL is required." }, { status: 503 }));
