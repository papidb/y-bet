import { queryClient } from "@/config/tanstack-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { PendingSection } from "./sections/pending";

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPendingComponent: PendingSection,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
