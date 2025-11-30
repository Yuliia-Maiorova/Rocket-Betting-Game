import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import type { LeaderboardEntry } from '../types';

export default function Leaderboard() {
  const { signOut, user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, balance')
        .order('balance', { ascending: false })
        .limit(100);

      if (error) throw error;

      const leaderboardData: LeaderboardEntry[] = data.map((user, index) => ({
        user_id: user.id,
        username: user.username,
        total_winnings: user.balance,
        rank: index + 1,
      }));

      setLeaders(leaderboardData);

      if (user) {
        const userIndex = leaderboardData.findIndex(entry => entry.user_id === user.id);
        setUserRank(userIndex >= 0 ? userIndex + 1 : null);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0D0D14' }}>
      <header style={{ 
        background: '#181825', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
        padding: '1rem 1.5rem' 
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              🚀 Rocket Game
            </h1>
            <nav style={{ display: 'flex', gap: '1.5rem' }}>
              <Link to="/game" style={{ color: '#888', textDecoration: 'none', fontWeight: '500' }}>
                Game
              </Link>
              <Link to="/leaderboard" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>
                Leaderboard
              </Link>
              <Link to="/profile" style={{ color: '#888', textDecoration: 'none', fontWeight: '500' }}>
                Profile
              </Link>
            </nav>
          </div>
          
          <button onClick={signOut} style={{ 
            background: 'none', 
            border: 'none', 
            color: '#888', 
            cursor: 'pointer', 
            fontWeight: '500' 
          }}>
            Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ 
          background: '#181825', 
          borderRadius: '1rem', 
          padding: '2rem',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>🏆 Leaderboard</h2>
            {userRank && (
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#888', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>Your Rank</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7C3AED', margin: 0 }}>#{userRank}</p>
              </div>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ 
                width: '3rem', 
                height: '3rem', 
                border: '2px solid #7C3AED', 
                borderTopColor: 'transparent',
                borderRadius: '50%',
                margin: '0 auto',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {leaders.map((leader, index) => (
                <div
                  key={leader.user_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    background: leader.user_id === user?.id ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: leader.user_id === user?.id ? '1px solid rgba(124, 58, 237, 0.5)' : 'none',
                    transition: 'background 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      background: index === 0 ? '#EAB308' : index === 1 ? '#9CA3AF' : index === 2 ? '#EA580C' : '#27272A',
                      color: index < 3 ? '#000' : '#888'
                    }}>
                      {leader.rank}
                    </div>
                    
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 'bold'
                    }}>
                      {leader.username.charAt(0).toUpperCase()}
                    </div>
                    
                    <div>
                      <p style={{ fontWeight: 'bold', color: '#fff', margin: 0 }}>{leader.username}</p>
                      {leader.user_id === user?.id && (
                        <p style={{ fontSize: '0.75rem', color: '#7C3AED', margin: 0 }}>You</p>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 'bold', color: '#10B981', margin: 0 }}>${leader.total_winnings.toFixed(2)}</p>
                    <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>Balance</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
