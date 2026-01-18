import { createFileRoute, redirect } from "@tanstack/react-router";
import * as React from "react";
import { z } from "zod";
import { authClient } from "@/server/auth-client";

const fallback = "/dashboard" as const;

export const Route = createFileRoute("/signup")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: async ({ search }) => {
    const { data } = await authClient.getSession();
    if (data) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: SignupComponent,
});

function SignupComponent() {
  const id = React.useId();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  return (
    <form
      onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get("name")?.toString();
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();
        if (!name || !email || !password || password.length < 8) return;
        await authClient.signUp.email(
          {
            name,
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
      <div>
        <label htmlFor={`${id}-name`}>Username</label>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="on"
        ></input>
      </div>
      <div>
        <label htmlFor={`${id}-email`}>Email</label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="on"
        ></input>
      </div>
      <div>
        <label htmlFor={`${id}-password`}>Password</label>
        <input
          id={`${id}-password`}
          name="password"
          type="password"
          autoComplete="on"
        ></input>
      </div>
      <button type="submit">Sign up</button>
    </form>
  );
}
