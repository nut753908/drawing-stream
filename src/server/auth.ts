import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { account, session, user, verification } from "./db/schema/auth";

const db = drizzle(process.env.DATABASE_URL || "");

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  trustedOrigins: ["http://127.0.0.1:3000"],
  emailAndPassword: {
    enabled: true,
  },
});
