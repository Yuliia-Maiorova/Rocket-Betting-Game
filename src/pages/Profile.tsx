import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, signOut, updateProfile } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage('');

    try {
      const result = await updateProfile({ username });

      if (result.success) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage(result.error || 'Failed to update profile');
      }
    } catch (error: any) {
      setMessage(error.message);
    }

    setLoading(false);
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
              <Link to="/leaderboard" style={{ color: '#888', textDecoration: 'none', fontWeight: '500' }}>
                Leaderboard
              </Link>
              <Link to="/profile" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>
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
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem', color: '#fff' }}>Your Profile</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div style={{ 
            background: '#181825', 
            borderRadius: '1rem', 
            padding: '2rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#fff' }}>Edit Profile</h3>

            {message && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                background: message.includes('success') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: message.includes('success') ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(239, 68, 68, 0.5)',
                color: message.includes('success') ? '#10B981' : '#EF4444'
              }}>
                {message}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#fff' }}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#0D0D14',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </div>

          <div style={{ 
            background: '#181825', 
            borderRadius: '1rem', 
            padding: '2rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#fff' }}>Statistics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ color: '#888' }}>Balance</span>
                <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '1.25rem' }}>${user?.balance.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ color: '#888' }}>Total Bets</span>
                <span style={{ fontWeight: 'bold', color: '#fff' }}>{user?.total_bets || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span style={{ color: '#888' }}>Total Wins</span>
                <span style={{ color: '#10B981', fontWeight: 'bold' }}>{user?.total_wins || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#888' }}>Highest Multiplier</span>
                <span style={{ color: '#7C3AED', fontWeight: 'bold' }}>{user?.highest_multiplier.toFixed(2)}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
