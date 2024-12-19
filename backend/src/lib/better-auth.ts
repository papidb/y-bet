import { Context } from "elysia";

import { Session, User } from "better-auth/types";
import { auth } from "./auth";

export const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];
  // validate request method
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return auth.handler(context.request);
  } else {
    context.error(405);
  }
};

// user middleware (compute user and session and pass to routes)
export const userMiddleware = async (request: Request) => {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return {
      user: null,
      session: null,
    };
  }

  return {
    user: session.user,
    session: session.session,
  };
};
// user info view
// type User can be export from `typeof auth.$Infer.Session.user`
// type Session can be export from `typeof auth.$Infer.Session.session`
export const userInfo = (user: User | null, session: Session | null) => {
  return {
    user: user,
    session: session,
  };
};
