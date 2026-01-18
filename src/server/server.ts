import { serve } from "@hono/node-server";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin } from "@orpc/server/plugins";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";
import { router } from "./orpc-router";

const app = new Hono();

app.use(
  "/auth/*",
  cors({
    origin: "http://127.0.0.1:3000",
    credentials: true,
  }),
);
app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

const handler = new RPCHandler(router, {
  plugins: [
    new CORSPlugin({
      origin: "http://127.0.0.1:3000",
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

app.use("/rpc/*", async (c, next) => {
  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: "/rpc",
    context: {}, // Provide initial context if needed
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }

  await next();
});

serve(
  {
    fetch: app.fetch,
    port: 3001,
    hostname: "127.0.0.1",
  },
  (info) => {
    console.log(`Server is running on http://${info.address}:${info.port}`);
  },
);
