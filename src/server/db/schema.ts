import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const todoTable = pgTable("todo", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  text: varchar({ length: 255 }).notNull(),
  completed: boolean().default(false),
});
