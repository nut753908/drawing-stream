import { createFileRoute, redirect } from "@tanstack/react-router";
import * as React from "react";
import { z } from "zod";
import { authClient } from "@/server/auth-client";

const fallback = "/dashboard" as const;

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: async ({ search }) => {
    const { data } = await authClient.getSession();
    if (data) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  const id = React.useId();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  return (
    <form
      className="flex flex-col mx-auto w-100 space-y-3 p-6 text-sm"
      onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();
        if (!email || !password || password.length < 8) return;
        await authClient.signIn.email(
          {
            email,
            password,
          },
          {
            onSuccess: async () => {
              await navigate({ to: search.redirect || fallback });
            },
          },
        );
      }}
    >
      <h1 className="mb-5 text-2xl font-bold text-gray-800">Log in</h1>
      <div className="flex flex-col w-full space-y-1">
        <label className="text-gray-800" htmlFor={`${id}-email`}>
          Email
        </label>
        <input
          className="px-2 h-8 rounded-sm outline-1 outline-gray-200 focus:outline-2 focus:outline-blue-200 placeholder:text-gray-400"
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="on"
          placeholder="Enter your email address"
          required
        ></input>
      </div>
      <div className="flex flex-col w-full space-y-1">
        <label className="text-gray-800" htmlFor={`${id}-password`}>
          Password
        </label>
        <input
          className="px-2 h-8 rounded-sm outline-1 outline-gray-200 focus:outline-2 focus:outline-blue-200 placeholder:text-gray-400"
          id={`${id}-password`}
          name="password"
          type="password"
          autoComplete="on"
          placeholder="Enter your password"
          required
          minLength={8}
        ></input>
      </div>
      <button
        className="cursor-pointer w-full mt-3 h-10 rounded-xl text-gray-100 bg-gray-800 hover:bg-gray-700 focus:bg-gray-700"
        type="submit"
      >
        Log in
      </button>
    </form>
  );
}
