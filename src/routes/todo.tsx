import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Plus, Square, SquareCheck, X } from "lucide-react";
import { orpc } from "@/server/client";

export const Route = createFileRoute("/todo")({
  loader: ({ context: { orpc } }) => orpc.todo.list(),
  component: TodoComponent,
});

function TodoComponent() {
  const todos = Route.useLoaderData();
  const router = useRouter();

  return (
    <div className="flex flex-col items-start space-y-3 p-6">
      {todos.map((i1) => (
        <div
          key={i1.id}
          className="flex flex-row items-center space-x-2 h-5 font-normal text-gray-400"
        >
          <button
            type="button"
            onClick={async () => {
              await orpc.todo.update({
                id: i1.id,
                text: i1.text,
                completed: !i1.completed,
              });
              router.invalidate();
            }}
            className="cursor-pointer"
          >
            {i1.completed ? (
              <SquareCheck size={20}></SquareCheck>
            ) : (
              <Square size={20}></Square>
            )}
          </button>
          <input
            type="text"
            value={i1.text}
            onChange={async (e) => {
              await orpc.todo.update({
                id: i1.id,
                text: e.target.value,
                completed: i1.completed,
              });
              router.invalidate();
            }}
            placeholder="Some text"
            className={`outline-none w-60 placeholder:text-gray-300 ${i1.completed ? "text-gray-400 line-through" : "text-gray-950"}`}
          ></input>
          <button
            type="button"
            onClick={async () => {
              await orpc.todo.delete({ id: i1.id });
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
