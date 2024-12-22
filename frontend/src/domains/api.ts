import { api } from "@/config/wrench";
import { Game } from "@/types";

export const getGames = async () => {
  return api.get("/games").json<Game[]>();
};
