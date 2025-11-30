import { useState } from 'react';
import type { FormEvent } from 'react';
import type { GameState } from '../types';

interface BettingPanelProps {
  balance: number;
  setBalance: (balance: number) => void;
  gameState: GameState & {
    placeBet: (amount: number, autoCashOut?: number) => Promise<any>;
    cashOut: () => Promise<any>;
  };
}

export default function BettingPanel({ balance, setBalance, gameState }: BettingPanelProps) {
  const { status, playerBet, placeBet, cashOut, multiplier } = gameState;
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashOut, setAutoCashOut] = useState<number | undefined>(undefined);
  const [error, setError] = useState('');

  const handlePlaceBet = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (betAmount > balance) {
      setError('Insufficient balance');
      return;
    }

    if (betAmount < 10) {
      setError('Minimum bet is $10');
      return;
    }

    if (autoCashOut !== undefined && autoCashOut < 5) {
      setError('Minimum auto cash-out multiplier is 5.00x');
      return;
    }

    const result = await placeBet(betAmount, autoCashOut);
    
    if (result.success) {
      setBalance(balance - betAmount);
    } else {
      setError(result.error || 'Failed to place bet');
    }
  };

  const handleCashOut = async () => {
    const result = await cashOut();
    
    if (result.success && result.payout) {
      setBalance(balance + result.payout);
    }
  };

  const quickBetAmounts = [10, 25, 50, 100];

  return (
    <div style={{ 
      background: '#181825', 
      borderRadius: '1rem', 
      padding: '1.5rem',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
    }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fff' }}>Place Your Bet</h3>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          color: '#EF4444',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {playerBet ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#0D0D14', padding: '1rem', borderRadius: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ color: '#888' }}>Bet Amount</span>
              <span style={{ fontWeight: 'bold', color: '#fff' }}>${playerBet.bet_amount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ color: '#888' }}>Current Multiplier</span>
              <span style={{ fontWeight: 'bold', color: '#7C3AED' }}>{multiplier.toFixed(2)}x</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#888' }}>Potential Win</span>
              <span style={{ fontWeight: 'bold', color: '#10B981' }}>
                ${(playerBet.bet_amount * multiplier).toFixed(2)}
              </span>
            </div>
          </div>

          {status === 'active' && playerBet.status === 'active' && (
            <button
              onClick={handleCashOut}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                cursor: 'pointer'
              }}
            >
              🎯 Cash Out ${(playerBet.bet_amount * multiplier).toFixed(2)}
            </button>
          )}

          {status === 'waiting' && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              color: '#F59E0B',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              Bet placed! Wait for round to start...
            </div>
          )}

          {(status === 'crashed' || playerBet.status === 'lost') && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              color: '#EF4444',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              Round ended. Place a new bet!
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handlePlaceBet} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#fff' }}>
              Bet Amount ($)
            </label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              min="10"
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
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {quickBetAmounts.map(amount => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setBetAmount(amount)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: '#27272A',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#3A3A4E'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#27272A'}
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: '#fff' }}>
              Auto Cash Out (Optional)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                value={autoCashOut || ''}
                onChange={(e) => setAutoCashOut(e.target.value ? Number(e.target.value) : undefined)}
                min="5"
                step="1"
                placeholder="e.g., 5.00"
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  background: '#0D0D14',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />
              <button
                type="button"
                onClick={() => setAutoCashOut(undefined)}
                style={{
                  padding: '0.75rem 1rem',
                  background: '#27272A',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: '1.125rem'
                }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>
              Automatically cash out when this multiplier is reached (min 5.00x)
            </p>
          </div>

          <button
            type="submit"
            disabled={status === 'active'}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: status === 'active' ? '#4A4A5E' : 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#fff',
              fontWeight: 'bold',
              cursor: status === 'active' ? 'not-allowed' : 'pointer',
              opacity: status === 'active' ? 0.5 : 1
            }}
          >
            {status === 'active' ? '⏳ Round in Progress...' : '🎲 Place Bet'}
          </button>
        </form>
      )}
    </div>
  );
}
