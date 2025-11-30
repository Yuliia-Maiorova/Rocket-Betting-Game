# 🚀 Rocket Betting Game

A real-time multiplayer betting game built with React, TypeScript, and Supabase.

## 🎮 How to Play

1. **Place Your Bet** - Choose an amount ($10 minimum)
2. **Watch the Rocket** - Multiplier increases as rocket flies
3. **Cash Out** - Click to cash out before it crashes
4. **Win or Lose** - Cash out in time = win, crash = lose

Optional: Set **Auto Cash Out** multiplier (min 5.00x) to automatically cash out.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account ([supabase.com](https://supabase.com))

### Setup

```bash
npm install
# Add your Supabase credentials to .env
npm run dev
```

### Database Setup

1. Create a Supabase project
2. Run the SQL in `fix-game-rounds-rls.sql` in SQL Editor
3. Enable Realtime for: `users`, `bets`, `game_rounds`

## 🎯 Features

- Real-time multiplayer gameplay
- Live betting system with auto cash-out
- User profiles with statistics
- Leaderboard
- Responsive design

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: SCSS
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Auth**: Supabase Auth

- Balance management

### Leaderboard ✅

- Top 100 players
- Real-time updates
- User ranking
- Live balance changes

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Vite** - Build tool

## 🎮 How to Play

1. **Sign up** - Get $1000 starting balance
2. **Place bet_amount** - Before round starts
3. **Watch multiplier** - Rocket flies, multiplier increases
4. **Cash out** - Click before crash!
5. **Claim bonuses** - Every 24 hours
6. **Climb leaderboard** - Compete with others

## 🚀 Deployment

### Frontend

```bash
npm run build
```

### Environment Variables

Set in deployment platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
