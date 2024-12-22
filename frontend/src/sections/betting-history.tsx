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
      <div>
        {bettingHistory.map((bet) => (
          <div key={bet.id} className="mb-2">
            <h4 className="text-lg font-semibold">
              Game: {bet.game.homeTeam} vs {bet.game.awayTeam}{" "}
            </h4>
            <span className="text-sm">Amount: {bet.amount}</span>
            <br />
            <span className="text-sm">Type: {bet.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
