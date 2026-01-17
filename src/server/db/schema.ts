import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const todoTable = pgTable("todo", {
  id: uuid().primaryKey().defaultRandom(),
  text: varchar({ length: 255 }).notNull(),
  completed: boolean().notNull().default(false),
});
