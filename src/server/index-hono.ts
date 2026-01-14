import "dotenv/config";
import { serve } from "@hono/node-server";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Hono } from "hono";
import { todoTable } from "./db/schema";

const db = drizzle(process.env.DATABASE_URL || "");

// TODO: use oRPC
// TODO: add validations

const todo = new Hono();
todo.get("/list", async (c) => {
  const todos = await db.select().from(todoTable);
  return c.json(todos);
});
todo.post("/create", async (c) => {
  const body = await c.req.json<{ text: string }>();
  await db.insert(todoTable).values({ text: body.text });
  return c.text("created");
});
todo.post("/update/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{ completed: boolean }>();
  await db
    .update(todoTable)
    .set({ completed: body.completed })
    .where(eq(todoTable.id, id));
  return c.text("updated");
});
todo.post("/delete/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(todoTable).where(eq(todoTable.id, id));
  return c.text("deleted");
});

const app = new Hono();
app.route("/todo", todo);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
