import { BetForm } from "@/sections/bet-form";
import { BettingHistory } from "@/sections/betting-history";
import { Leaderboard } from "@/sections/leader-board";
import { LiveGames } from "@/sections/live-games";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Real-time Sports Betting</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LiveGames />
        <BetForm />
        <Leaderboard />
        <BettingHistory />
      </div>
    </div>
  );
}
