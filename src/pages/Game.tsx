import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useGameState } from '../hooks/useGameState';
import GameCanvas from '../components/GameCanvas';
import BettingPanel from '../components/BettingPanel';
import BetsHistory from '../components/BetsHistory';
import CasesGame from '../components/CasesGame';
import '../styles/Game.scss';

type GameType = 'rocket' | 'cases';

export default function Game() {
  const { user, signOut } = useAuth();
  const [balance, setBalance] = useState(user?.balance || 0);
  const [activeGame, setActiveGame] = useState<GameType>('rocket');
  
  const gameState = useGameState();

  useEffect(() => {
    if (user) {
      setBalance(user.balance);
    }
  }, [user, user?.balance]);

  useEffect(() => {
    if (!user) return;

    const fetchBalance = async () => {
      const { data } = await supabase
        .from('users')
        .select('balance')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setBalance(data.balance);
      }
    };

    const interval = setInterval(fetchBalance, 2000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="game-page">
      <header className="game-header">
        <div className="header-content">
          <div className="header-left">
            <div className="game-switcher">
              <button 
                className={`game-tab ${activeGame === 'rocket' ? 'active' : ''}`}
                onClick={() => setActiveGame('rocket')}
              >
                🚀 Rocket
              </button>
              <button 
                className={`game-tab ${activeGame === 'cases' ? 'active' : ''}`}
                onClick={() => setActiveGame('cases')}
              >
                📦 Cases
              </button>
            </div>
            <nav className="game-nav">
              <Link to="/game" className="nav-link active">
                Game
              </Link>
              <Link to="/leaderboard" className="nav-link">
                Leaderboard
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
            </nav>
          </div>
          
          <div className="header-right">
            <div className="balance-card">
              <span className="balance-label">Balance:</span>
              <span className="balance-amount">${balance.toFixed(2)}</span>
            </div>
            
            <button onClick={signOut} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="game-content">
        {activeGame === 'rocket' ? (
          <>
            <div className="game-grid">
              <GameCanvas gameState={gameState} />

              <div className="game-sidebar">
                <BettingPanel balance={balance} setBalance={setBalance} gameState={gameState} />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <BetsHistory />
            </div>
          </>
        ) : (
          <div className="cases-container">
            <CasesGame 
              balance={balance} 
              setBalance={setBalance} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
