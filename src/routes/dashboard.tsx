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
    <div className="flex flex-col mx-auto w-100 space-y-3 p-6 text-sm">
      <h1 className="mb-5 text-2xl font-bold text-gray-800">Dashboard</h1>
      <div className="text-gray-400">
        Username: <span className="text-gray-800">{name}</span>
      </div>
      <button
        className="cursor-pointer w-full mt-3 h-10 rounded-xl text-gray-100 bg-gray-800 hover:bg-gray-700 focus:bg-gray-700"
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
