import { create } from "zustand";
import { api } from "./config/wrench";
import { Bet, Game, LeaderboardEntry } from "./types";

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
    const socket = new WebSocket("ws://localhost:8080/ping");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data)
        if (data.type === "gameUpdate") {
          set({ games: data.games });
        } else if (data.type === "leaderboardUpdate") {
          set({ leaderboard: data.leaderboard });
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
