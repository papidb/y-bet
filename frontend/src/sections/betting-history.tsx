import React, { useEffect } from "react";
import { useStore } from "../store";

export const BettingHistory: React.FC = () => {
  const bettingHistory = useStore((state) => state.bettingHistory);
  const fetchBettingHistory = useStore((state) => state.fetchBettingHistory);

  useEffect(() => {
    fetchBettingHistory();
  }, [fetchBettingHistory]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Betting History</h2>
      <ul>
        {bettingHistory.map((bet) => (
          <li key={bet.id} className="mb-2">
            Game: {bet.game.homeTeam} vs {bet.game.awayTeam}, Amount: $
            {bet.amount}, Type: {bet.type}
          </li>
        ))}
      </ul>
    </div>
  );
};
