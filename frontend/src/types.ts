// Import necessary Prisma Client types if using with Prisma

// Enum for BetType
export enum BetType {
  Home = "home",
  Away = "away",
  Draw = "draw",
}

// Interface for Odds
export interface Odds {
  id: string;
  home: number;
  away: number;
  draw: number;
  game?: Game | null;
}

// Interface for Game
export interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  remainingTime: string;
  oddsId: string;
  odds: Odds;
  bets: Bet[];
}

// Interface for Bet
export interface Bet {
  id: string;
  gameId: string;
  amount: number;
  type: BetType; // Strict typing using the enum
  game: Game;
  username: string;
}

// Interface for LeaderboardEntry
export interface LeaderboardEntry {
  id: string;
  username: string;
  totalWinnings: number;
}
