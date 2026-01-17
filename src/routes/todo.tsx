import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Plus, Square, SquareCheck, X } from "lucide-react";
import { orpc } from "@/server/orpc-client";

export const Route = createFileRoute("/todo")({
  loader: ({ context: { orpc } }) => orpc.todo.list(),
  component: TodoComponent,
});

function TodoComponent() {
  const todos = Route.useLoaderData();
  const router = useRouter();

  return (
    <div className="flex flex-col items-start space-y-3 p-6">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex flex-row items-center space-x-2 h-5 font-normal text-gray-400"
        >
          <button
            type="button"
            onClick={async () => {
              await orpc.todo.update({
                id: todo.id,
                text: todo.text,
                completed: !todo.completed,
              });
              router.invalidate();
            }}
            className="cursor-pointer"
          >
            {todo.completed ? (
              <SquareCheck size={20}></SquareCheck>
            ) : (
              <Square size={20}></Square>
            )}
          </button>
          <input
            type="text"
            value={todo.text}
            onChange={async (e) => {
              await orpc.todo.update({
                id: todo.id,
                text: e.target.value,
                completed: todo.completed,
              });
              router.invalidate();
            }}
            placeholder="Some text"
            className={`outline-none w-60 placeholder:text-gray-300 ${todo.completed ? "text-gray-400 line-through" : "text-gray-950"}`}
          ></input>
          <button
            type="button"
            onClick={async () => {
              await orpc.todo.delete({ id: todo.id });
              router.invalidate();
            }}
            className="cursor-pointer"
          >
            <X size={20} strokeWidth={2}></X>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={async () => {
          await orpc.todo.create({ text: "", completed: false });
          router.invalidate();
        }}
        className="flex flex-row items-center space-x-2 h-5 font-bold text-gray-500 cursor-pointer"
      >
        <Plus size={20} strokeWidth={3}></Plus>
        <div>Add todo</div>
      </button>
    </div>
  );
}
