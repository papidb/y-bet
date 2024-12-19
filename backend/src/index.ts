import { Elysia } from "elysia";

import { betterAuthView, userInfo, userMiddleware } from "./lib/better-auth";

const app = new Elysia()
  .derive(({ request }) => userMiddleware(request))
  .all("/api/auth/*", betterAuthView)
  .get("/user", ({ user, session }) => userInfo(user, session))
  .get("/", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
