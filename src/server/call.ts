import { orpc } from "./client";

async function list() {
  const todos = await orpc.todo.list();
  console.log(todos);
  console.log();
  return todos;
}

async function main() {
  await list();

  await orpc.todo.create({ text: "task3" });
  const todos = await list();

  const id = todos.find((todo) => todo.text === "task3")?.id;
  if (id === undefined) return;

  await orpc.todo.update({ id, completed: true });
  await list();

  await orpc.todo.delete({ id });
  await list();
}

main();
