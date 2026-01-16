import { createFileRoute } from "@tanstack/react-router";
import { Plus, Square, SquareCheck, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/todo")({
  component: TodoComponent,
});

function TodoComponent() {
  const [todos, setTodos] = useState<
    {
      id: string;
      text: string;
      completed: boolean;
    }[]
  >([]);

  return (
    <div className="flex flex-col items-start space-y-3 p-6">
      {todos.map((i1) => (
        <div
          key={i1.id}
          className="flex flex-row items-center space-x-2 h-5 font-normal text-gray-400"
        >
          <button
            type="button"
            onClick={() =>
              setTodos(
                todos.map((i2) =>
                  i2.id === i1.id ? { ...i2, completed: !i1.completed } : i2,
                ),
              )
            }
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
            onChange={(e) =>
              setTodos(
                todos.map((i2) =>
                  i2.id === i1.id ? { ...i2, text: e.target.value } : i2,
                ),
              )
            }
            placeholder="Some text"
            className={`outline-none w-60 placeholder:text-gray-300 ${i1.completed ? "text-gray-400 line-through" : "text-gray-950"}`}
          ></input>
          <button
            type="button"
            onClick={() => setTodos(todos.filter((i2) => i1.id !== i2.id))}
            className="cursor-pointer"
          >
            <X size={20} strokeWidth={2}></X>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setTodos(
            todos.concat([
              { id: crypto.randomUUID(), text: "", completed: false },
            ]),
          )
        }
        className="flex flex-row items-center space-x-2 h-5 font-bold text-gray-500 cursor-pointer"
      >
        <Plus size={20} strokeWidth={3}></Plus>
        <div>Add todo</div>
      </button>
    </div>
  );
}
