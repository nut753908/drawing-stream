import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/server/auth-client";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    const { data } = await authClient.getSession();
    if (!data) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: DashboardComponent,
});

function DashboardComponent() {
  const { data } = authClient.useSession();
  const name = data?.user.name ?? "";
  const navigate = Route.useNavigate();

  return (
    <div>
      <div>Username: {name}</div>
      <button
        type="button"
        onClick={async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: async () => {
                await navigate({ to: "/" });
              },
            },
          });
        }}
      >
        Log out
      </button>
    </div>
  );
}
