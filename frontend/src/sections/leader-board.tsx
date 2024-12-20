import React from "react";
import { useStore } from "../store";

export const Leaderboard: React.FC = () => {
  const leaderboard = useStore((state) => state.leaderboard);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Rank</th>
            <th className="text-left">Username</th>
            <th className="text-right">Total Winnings</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry.username}>
              <td>{index + 1}</td>
              <td>{entry.username}</td>
              <td className="text-right">${entry.totalWinnings.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
