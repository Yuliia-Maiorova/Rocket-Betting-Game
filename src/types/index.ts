export interface User {
  id: string;
  email: string;
  username: string;
  balance: number;
  total_bets: number;
  total_wins: number;
  highest_multiplier: number;
  created_at: string;
}

export interface GameRound {
  id: string;
  round_number: number;
  crash_multiplier: number;
  start_time: string;
  end_time?: string;
  status: 'waiting' | 'active' | 'crashed';
  created_at: string;
}

export interface Bet {
  id: string;
  user_id: string;
  round_id: string;
  bet_amount: number;
  cash_out_multiplier?: number;
  payout?: number;
  auto_cash_out?: number;
  status: 'pending' | 'active' | 'won' | 'lost' | 'cashed_out';
  created_at: string;
  cashed_out_at?: string;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  total_winnings: number;
  rank: number;
}

export interface GameState {
  currentRound: GameRound | null;
  multiplier: number;
  status: 'waiting' | 'active' | 'crashed';
  timeToStart?: number;
  playerBet: Bet | null;
}

export interface BetInput {
  amount: number;
  autoCashOut?: number;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}
