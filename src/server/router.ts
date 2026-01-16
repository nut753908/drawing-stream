import "dotenv/config";
import { os } from "@orpc/server";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as z from "zod";
import { todoTable } from "./db/schema";

const db = drizzle(process.env.DATABASE_URL || "");

const TodoSchema = z.object({
  id: z.uuid(),
  text: z.string(),
  completed: z.boolean(),
});

export const listTodo = os.handler(async () => {
  const todos = await db.select().from(todoTable);
  return todos;
});

export const createTodo = os
  .input(TodoSchema.omit({ id: true }))
  .handler(async ({ input }) => {
    await db
      .insert(todoTable)
      .values({ text: input.text, completed: input.completed });
  });

export const updateTodo = os.input(TodoSchema).handler(async ({ input }) => {
  await db
    .update(todoTable)
    .set({ text: input.text, completed: input.completed })
    .where(eq(todoTable.id, input.id));
});

export const deleteTodo = os
  .input(TodoSchema.pick({ id: true }))
  .handler(async ({ input }) => {
    await db.delete(todoTable).where(eq(todoTable.id, input.id));
  });

export const router = {
  todo: {
    list: listTodo,
    create: createTodo,
    update: updateTodo,
    delete: deleteTodo,
  },
};
