import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { GameState } from '../types';

interface GameCanvasProps {
  gameState: GameState & {
    placeBet: (amount: number, autoCashOut?: number) => Promise<any>;
    cashOut: () => Promise<any>;
  };
}

export default function GameCanvas({ gameState }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { multiplier, status, timeToStart } = gameState;
  const [rocketPosition, setRocketPosition] = useState({ x: 50, y: 80 });
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    const fetchPlayerCount = async () => {
      const thirtySecondsAgo = new Date(Date.now() - 30000).toISOString();
      
      const { data, error } = await supabase
        .from('bets')
        .select('user_id')
        .eq('status', 'pending')
        .gte('created_at', thirtySecondsAgo);

      if (!error && data) {
        const uniqueUsers = new Set(data.map(bet => bet.user_id));
        setPlayerCount(uniqueUsers.size);
      } else {
        setPlayerCount(0);
      }
    };

    fetchPlayerCount();
    const interval = setInterval(fetchPlayerCount, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#1E1E2E';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw trajectory line if game is active
    if (status === 'active' && multiplier > 1) {
      ctx.strokeStyle = '#7C3AED';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(50, canvas.height - 50);
      
      const progress = Math.min((multiplier - 1) * 50, canvas.width - 100);
      const height = Math.min((multiplier - 1) * 30, canvas.height - 100);
      
      ctx.lineTo(50 + progress, canvas.height - 50 - height);
      ctx.stroke();

      // Update rocket position
      setRocketPosition({
        x: 50 + progress,
        y: canvas.height - 50 - height,
      });
    } else {
      // Reset rocket position
      setRocketPosition({ x: 50, y: canvas.height - 50 });
    }

    ctx.save();
    ctx.translate(rocketPosition.x, rocketPosition.y);
    
    if (status !== 'active') {
      ctx.rotate(-Math.PI / 4);
    }
    
    // Draw rocket emoji
    ctx.font = '64px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚀', 0, 0);
    
    ctx.restore();

  }, [multiplier, status, rocketPosition.x, rocketPosition.y]);

  return (
    <div style={{ 
      position: 'relative',
      background: '#181825',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        pointerEvents: 'none',
        textAlign: 'center'
      }}>
        {status === 'waiting' && timeToStart !== undefined && (
          <div>
            <p style={{ color: '#888', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Next round in</p>
            <p style={{ fontSize: '3.75rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>{timeToStart}s</p>
          </div>
        )}
        
        {status === 'waiting' && timeToStart === undefined && (
          <div>
            <p style={{ color: '#888', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Waiting for players...</p>
            <p style={{ color: '#fff', fontSize: '1.125rem', margin: 0 }}>Place a bet to start!</p>
          </div>
        )}
        
        {status === 'active' && (
          <div>
            <p style={{ 
              fontSize: '5rem', 
              fontWeight: 'bold', 
              color: '#7C3AED',
              margin: 0,
              textShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              {multiplier.toFixed(2)}x
            </p>
          </div>
        )}
        
        {status === 'crashed' && (
          <div>
            <p style={{ color: '#EF4444', fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>💥 CRASHED!</p>
            <p style={{ color: '#fff', fontSize: '1.5rem', margin: 0 }}>at {multiplier.toFixed(2)}x</p>
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        style={{ 
          width: '100%', 
          height: '500px', 
          borderRadius: '0.5rem',
          background: 'linear-gradient(to bottom, #11111B, #181825)',
          display: 'block'
        }}
      />

      <div style={{ 
        marginTop: '1rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        fontSize: '0.875rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '0.75rem',
            height: '0.75rem',
            borderRadius: '50%',
            background: status === 'active' ? '#10B981' : 
                       status === 'waiting' && timeToStart === undefined ? '#888' :
                       status === 'waiting' ? '#EAB308' : '#EF4444',
            animation: (status === 'active' || (status === 'waiting' && timeToStart !== undefined)) ? 'pulse 2s ease-in-out infinite' : 'none'
          }} />
          <span style={{ color: '#888' }}>
            {status === 'active' ? 'Round in progress' :
             status === 'waiting' && timeToStart === undefined ? 'Waiting for players' :
             status === 'waiting' ? `Starting in ${timeToStart}s` :
             'Round ended'}
          </span>
        </div>
        <span style={{ color: '#888' }}>
          {playerCount > 0 ? `Players: ${playerCount}` : 'No players yet'}
        </span>
      </div>
    </div>
  );
}
