import "dotenv/config";
import { os } from "@orpc/server";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as z from "zod";
import { todo } from "./db/schema/orpc";

const db = drizzle(process.env.DATABASE_URL || "");

const TodoSchema = z.object({
  id: z.uuid(),
  text: z.string(),
  completed: z.boolean(),
  created_at: z.iso.datetime(),
});

export const listTodo = os.handler(async () => {
  const todos = await db.select().from(todo).orderBy(todo.created_at);
  return todos;
});

export const createTodo = os
  .input(TodoSchema.pick({ text: true, completed: true }))
  .handler(async ({ input }) => {
    await db
      .insert(todo)
      .values({ text: input.text, completed: input.completed });
  });

export const updateTodo = os
  .input(TodoSchema.pick({ id: true, text: true, completed: true }))
  .handler(async ({ input }) => {
    await db
      .update(todo)
      .set({ text: input.text, completed: input.completed })
      .where(eq(todo.id, input.id));
  });

export const deleteTodo = os
  .input(TodoSchema.pick({ id: true }))
  .handler(async ({ input }) => {
    await db.delete(todo).where(eq(todo.id, input.id));
  });

export const router = {
  todo: {
    list: listTodo,
    create: createTodo,
    update: updateTodo,
    delete: deleteTodo,
  },
};
