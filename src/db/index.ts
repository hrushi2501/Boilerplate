import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

// Prevent multiple connections in Next.js development hot reloading
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// prepare: false is required for Supabase transaction pooler (port 6543 / Supavisor)
const conn =
  globalForDb.conn ??
  postgres(connectionString ?? "", {
    prepare: false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = conn;
}

export const db = drizzle(conn, { schema });
export type Database = typeof db;
