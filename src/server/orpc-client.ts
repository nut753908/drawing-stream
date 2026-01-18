import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { router } from "./orpc-router";

const link = new RPCLink({
  url: "http://127.0.0.1:3001/rpc",
  headers: { Authorization: "Bearer token" },
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const orpc: RouterClient<typeof router> = createORPCClient(link);
