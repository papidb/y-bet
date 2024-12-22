import { create } from "zustand";
import { BASE_WS_ROUTE } from "./config/env";
import { api } from "./config/wrench";
import { removeDuplicates } from "./lib/utils";
import { Bet, EventData, Game, LeaderboardEntry } from "./types";

interface Store {
  games: Game[];
  leaderboard: LeaderboardEntry[];
  bettingHistory: Bet[];
  connectWebSocket: () => () => void;
  placeBet: (bet: Omit<Bet, "game">) => Promise<void>;
  fetchBettingHistory: () => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  games: [],
  leaderboard: [],
  bettingHistory: [],

  connectWebSocket: () => {
    const socket = new WebSocket(BASE_WS_ROUTE);
    socket.onmessage = (event) => {
      try {
        const data: EventData = JSON.parse(event.data);
        switch (data.type) {
          case "gameData":
            set(({ games }) => {
              const game = games.find((game) => game.id === data.data.gameId);
              if (game) {
                game.homeScore = data.data.score1;
                game.awayScore = data.data.score2;
                game.remainingTime = data.data.timeRemaining;
              }
              return { games };
            });
            break;
          case "leaderboardUpdate":
            // yet to be implemented
            // set({ leaderboard: data.data });
            break;
          case "oddsUpdate":
            set(({ games }) => {
              const game = games.find((game) => game.id === data.data.gameId);
              if (game) {
                game.odds = {
                  ...game.odds,
                  home: data.data.odds.team1,
                  away: data.data.odds.team2,
                };
              }
              return { games };
            });
            break;
          case "createGame":
            set(({ games }) => {
              return { games: removeDuplicates([...games, data.data]) };
            });
            break;
          default:
            console.log("Unknown event:", data);
            break;
        }
      } catch (error) {
        console.error(error);
      }
    };
    const unsubscribe = () => {
      socket.close();
    };

    return unsubscribe;
  },

  placeBet: async (bet: Omit<Bet, "game">) => {
    try {
      const response = await api.url("/bets").post(bet).json<Bet>();
      set({ bettingHistory: [...get().bettingHistory, response] });
      await get().fetchBettingHistory();
    } catch (error) {
      console.error("Error placing bet:", error);
    }
  },

  fetchBettingHistory: async () => {
    try {
      const history = await api.url("/bets").get().json<Bet[]>();
      set({ bettingHistory: history });
    } catch (error) {
      console.error("Error fetching betting history:", error);
    }
  },
}));
