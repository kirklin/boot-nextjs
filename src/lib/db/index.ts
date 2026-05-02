import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return null;
  }
  const client = postgres(url, {
    max: 10,
    idle_timeout: 20,
  });
  return drizzle(client, { schema });
}

export const db = createDb();
