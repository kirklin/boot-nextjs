import { defineConfig } from "drizzle-kit";

const dialect = "postgresql";

const url = process.env.DATABASE_URL!;

const schema = "./src/lib/db/schema.ts";

const out = "./src/lib/db/migrations";

export default defineConfig({
  schema,
  out,
  dialect,
  migrations: {},
  dbCredentials: {
    url,
  },
});
