import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { todoTable } from "./db/schema";

const db = drizzle(process.env.DATABASE_URL || "");

async function main() {
  const todo: typeof todoTable.$inferInsert = {
    text: "task2",
  };

  await db.insert(todoTable).values(todo);

  const todos = await db.select().from(todoTable);
  console.log(todos);
}

main();
