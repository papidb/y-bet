import { gamesOptions } from "@/domains/hooks";
import { removeDuplicates } from "@/lib/utils";
import { BetForm } from "@/sections/bet-form";
import { BettingHistory } from "@/sections/betting-history";
import { Leaderboard } from "@/sections/leader-board";
import { LiveGames } from "@/sections/live-games";
import { useStore } from "@/store";
import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: (opts) => opts.context.queryClient.ensureQueryData(gamesOptions()),
});

function RouteComponent() {
  const { connectWebSocket } = useStore();
  const gameData = Route.useLoaderData();

  useEffect(() => {
    connectWebSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // sync user with store
  React.useEffect(() => {
    if (gameData) {
      useStore.setState({ games: removeDuplicates(gameData) });
    }
  }, [gameData]);
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
