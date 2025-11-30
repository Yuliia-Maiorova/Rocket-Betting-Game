# 🚀 Rocket Betting Game

A real-time multiplayer betting game built with React, TypeScript, and Supabase.

## 🎮 How to Play

1. **Place Your Bet** - Choose an amount ($10 minimum)
2. **Watch the Rocket** - Multiplier increases as rocket flies
3. **Cash Out** - Click to cash out before it crashes
4. **Win or Lose** - Cash out in time = win, crash = lose

## 🧪 Testing Instructions (For Developers)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Yuliia-Maiorova/rocket-betting-game.git
cd rocket-betting-game
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Supabase

1. **Create a Supabase Account** (if you don't have one)

   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account

2. **Create a New Project**

   - Click "New Project"
   - Choose a name, database password, and region
   - Wait for the project to be created (~2 minutes)

3. **Get Your API Credentials**

   - Go to **Settings** → **API**
   - Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
   - Copy the **anon/public** key (long string starting with `eyJ...`)

4. **Create Environment File**

   - Create a file named `.env` in the project root
   - Add your credentials:

   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

5. **Set Up Database Tables**

   - Go to **SQL Editor** in your Supabase dashboard
   - Copy the SQL from `database-setup.sql` file in this repo
   - Paste and click "Run"
   - This creates the tables, security policies, and triggers

6. **Enable Realtime**
   - Go to **Database** → **Replication**
   - Find and enable realtime for these tables:
     - ✅ `users`
     - ✅ `bets`
     - ✅ `game_rounds`

### Step 4: Run the Application

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 🎯 Features

- Real-time multiplayer gameplay
- Live betting system with auto cash-out
- User profiles with statistics
- Leaderboard with top players
- Responsive design
- Secure authentication

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: SCSS
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Auth**: Supabase Authentication
