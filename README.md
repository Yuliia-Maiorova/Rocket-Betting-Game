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

### UI/UX ✅

- Dark theme
- Gradient backgrounds
- Smooth animations
- Responsive design
- Loading states
- Error handling

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Vite** - Build tool

### Backend

- **Supabase** - Complete backend
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Storage for avatars
  - Row Level Security

## 📊 Database Tables

- `users` - Player profiles and statistics
- `game_rounds` - Game history
- `bet_amounts` - Player bet_amounts
- `bonuses` - Daily bonus tracking
- `avatars` - User profile pictures (storage)

## 🎮 How to Play

1. **Sign up** - Get $1000 starting balance
2. **Place bet_amount** - Before round starts
3. **Watch multiplier** - Rocket flies, multiplier increases
4. **Cash out** - Click before crash!
5. **Claim bonuses** - Every 24 hours
6. **Climb leaderboard** - Compete with others

## 📚 Documentation

### Frontend Documentation (`/front`)

- `README.md` - Overview and features
- `SETUP_GUIDE.md` - Complete setup instructions
- `TESTING_CHECKLIST.md` - Test all features
- `ARCHITECTURE.md` - System design
- `PROJECT_SUMMARY.md` - Project summary
- `USING_EXISTING_BACKEND.md` - Backend connection

### Setup Scripts

- `setup.sh` - Interactive setup (Unix/Mac)
- Manual setup instructions in docs

## 🔐 Security

- ✅ Row Level Security on all tables
- ✅ Users can only modify own data
- ✅ Passwords hashed by Supabase
- ✅ API keys safe in frontend (RLS protected)
- ✅ File uploads validated

## 🧪 Testing

Run the complete test checklist:

```bash
cd front
# Open TESTING_CHECKLIST.md
# Follow all test steps
```

250+ test cases covering:

- Authentication flows
- Game mechanics
- Leaderboard
- UI/UX
- Security
- Performance

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd front
npm run build
# Deploy dist/ folder
```

### Environment Variables

Set in deployment platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Production Checklist

- [ ] Database backups configured
- [ ] Email verification enabled
- [ ] Rate limiting added
- [ ] Error tracking (Sentry)
- [ ] Analytics added
- [ ] Terms of service
- [ ] Age verification (18+)
- [ ] Responsible gambling features

## 🐛 Troubleshooting

### Frontend won't start

```bash
cd front
npm install
npm run dev
```

### Database errors

- Run `supabase-schema.sql` in Supabase
- Enable RLS policies
- Check credentials in `.env`

### Realtime not working

- Enable Realtime in Supabase Dashboard
- Check WebSocket connection in console
- Verify API key permissions

See `front/SETUP_GUIDE.md` for detailed troubleshooting.

## 📈 Future Enhancements

- [ ] Sound effects and music
- [ ] Chat system
- [ ] Betting history page
- [ ] Multiple game modes
- [ ] Achievements system
- [ ] Friends list
- [ ] Tournament mode
- [ ] Cryptocurrency payments
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License - Open source

## 🙏 Credits

Built with:

- React
- TypeScript
- Supabase
- Tailwind CSS
- Vite

## 📞 Support

- Documentation: See `/front` folder
- Issues: Open GitHub issue
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)

---

## 🎯 Quick Links

- **Frontend App**: `/front`
- **Setup Guide**: `/front/SETUP_GUIDE.md`
- **Architecture**: `/front/ARCHITECTURE.md`
- **Testing**: `/front/TESTING_CHECKLIST.md`
- **Backend Connection**: `/front/USING_EXISTING_BACKEND.md`

---

## 📊 Project Stats

- **Lines of Code**: ~2,500
- **Components**: 11
- **Pages**: 6
- **Features**: 25+
- **Documentation**: 6 guides
- **Test Cases**: 250+

---

**Start building now!**

```bash
cd front
./setup.sh
```

**Good luck and have fun! 🚀🎉**
