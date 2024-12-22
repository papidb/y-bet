import { queryOptions } from "@tanstack/react-query";
import { getGames } from "./api";

const QUERY_KEYS = {
  games: ["games"],
};

export function gamesOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.games,
    queryFn: () => getGames(),
  });
}
