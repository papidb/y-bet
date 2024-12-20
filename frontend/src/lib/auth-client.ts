import { createAuthClient } from "better-auth/react";
import { BASE_API_ROUTE } from "../config/env";

export const authClient = createAuthClient({
  baseURL: BASE_API_ROUTE,
});

export const { signIn, signOut, signUp, useSession } = authClient;
