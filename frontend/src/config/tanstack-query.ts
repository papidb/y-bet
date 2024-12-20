import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { WretchError } from "wretch";
import { ApiError } from "../domains/types";

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      async onError(error) {
        const err = error as WretchError;
        const response = err.json as ApiError;
        toast(response.message, {
          description: new Date().toString(),
        });
      },
    },
  },
});
