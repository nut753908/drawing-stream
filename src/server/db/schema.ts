import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const todoTable = pgTable("todo", {
  id: uuid().primaryKey().defaultRandom(),
  text: varchar({ length: 255 }).notNull(),
  completed: boolean().notNull().default(false),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
