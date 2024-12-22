import React, { useState } from "react";
import { useStore } from "../store";
import { BetType } from "../types";

export const BetForm: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [betAmount, setBetAmount] = useState<string>("");
  const [betType, setBetType] = useState<BetType>(BetType.Home);
  const games = useStore((state) => state.games);
  const placeBet = useStore((state) => state.placeBet);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGame || !betAmount) return;

    await placeBet({
      gameId: selectedGame,
      amount: parseFloat(betAmount),
      type: betType,
      username: "currentUser",
      id: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Place a Bet</h2>
      <div className="mb-4">
        <label className="block mb-2">Select Game</label>
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a game</option>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.homeTeam} vs {game.awayTeam}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Bet Amount</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          className="w-full p-2 border rounded"
          min="0"
          step="0.01"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Bet Type</label>
        <select
          value={betType}
          onChange={(e) => setBetType(e.target.value as BetType)}
          className="w-full p-2 border rounded"
        >
          <option value={BetType.Home}>Home</option>
          <option value={BetType.Away}>Away</option>
          {/* <option value={BetType.Draw}>Draw</option> */}
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Place Bet
      </button>
    </form>
  );
};
