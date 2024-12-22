import React from "react";
import { useStore } from "../store";

export const LiveGames: React.FC = () => {
  const games = useStore((state) => state.games);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Live Games</h2>
      {games.map((game) => (
        <div key={game.id} id={game.id} className="mb-4 p-2 border rounded">
          <div className="flex justify-between">
            <span>{game.homeTeam}</span>
            <span>{game.homeScore}</span>
          </div>
          <div className="flex justify-between">
            <span>{game.awayTeam}</span>
            <span>{game.awayScore}</span>
          </div>
          <div className="text-sm text-gray-500">
            Time: {game.remainingTime}
          </div>
          <div className="mt-2">
            {/* <span className="mr-2">Home: {game.odds.home}</span> */}
            {/* <span className="mr-2">Away: {game.odds.away}</span> */}
            {/* <span>Draw: {game.odds.draw}</span> */}
          </div>
        </div>
      ))}
    </div>
  );
};
