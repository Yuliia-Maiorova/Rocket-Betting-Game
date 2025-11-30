import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface BetHistoryItem {
  id: string;
  user: {
    username: string;
    avatar_url: string | null;
  };
  bet_amount: number;
  cash_out_multiplier: number | null;
  payout: number | null;
  status: string;
  created_at: string;
}

export default function BetsHistory() {
  const [bets, setBets] = useState<BetHistoryItem[]>([]);

  useEffect(() => {
    fetchRecentBets();

    // Subscribe to new bets
    const channel = supabase
      .channel('bets-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bets',
        },
        () => {
          fetchRecentBets();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const fetchRecentBets = async () => {
    const { data, error } = await supabase
      .from('bets')
      .select(`
        id,
        bet_amount,
        cash_out_multiplier,
        payout,
        status,
        created_at,
        user:users(username, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setBets(data as any);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'cashed_out':
        return 'Won';
      case 'lost':
        return 'Lost';
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <div style={{ 
      background: '#181825', 
      borderRadius: '1rem', 
      padding: '1.5rem',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
    }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fff' }}>🎲 Live Bets</h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', color: '#888', fontWeight: '600' }}>Player</th>
              <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: '#888', fontWeight: '600' }}>Bet</th>
              <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: '#888', fontWeight: '600' }}>Multiplier</th>
              <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', color: '#888', fontWeight: '600' }}>Payout</th>
              <th style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.875rem', color: '#888', fontWeight: '600' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bets.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                  No bets yet. Be the first!
                </td>
              </tr>
            ) : (
              bets.map((bet) => (
                <tr key={bet.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '0.875rem'
                      }}>
                        {bet.user.username.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 'bold', color: '#fff' }}>{bet.user.username}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#fff' }}>
                    ${bet.bet_amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#7C3AED', fontWeight: '500' }}>
                    {bet.cash_out_multiplier ? `${bet.cash_out_multiplier.toFixed(2)}x` : '-'}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: bet.payout ? '#10B981' : '#888' }}>
                    {bet.payout ? `$${bet.payout.toFixed(2)}` : '-'}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      background: bet.status === 'cashed_out' ? 'rgba(16, 185, 129, 0.2)' :
                                 bet.status === 'lost' ? 'rgba(239, 68, 68, 0.2)' :
                                 bet.status === 'active' ? 'rgba(124, 58, 237, 0.2)' :
                                 'rgba(136, 136, 136, 0.2)',
                      color: bet.status === 'cashed_out' ? '#10B981' :
                            bet.status === 'lost' ? '#EF4444' :
                            bet.status === 'active' ? '#7C3AED' :
                            '#888'
                    }}>
                      {getStatusText(bet.status)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
