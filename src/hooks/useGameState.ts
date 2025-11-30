import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import type { Bet, GameState } from '../types';

export function useGameState() {
  const { user, refreshUser } = useAuth();
  const [gameState, setGameState] = useState<GameState>({
    currentRound: null,
    multiplier: 1.00,
    status: 'waiting',
    timeToStart: undefined,
    playerBet: null,
  });

  const roundStartTimeRef = useRef<number | null>(null);
  const crashPointRef = useRef<number>(2.00);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roundNumberRef = useRef<number>(0);
  const currentRoundIdRef = useRef<string | null>(null);
  const isCreatingRoundRef = useRef<boolean>(false);

  useEffect(() => {
    const gameRoundSubscription = supabase
      .channel('game-rounds-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_rounds',
        },
        async (payload) => {
          if (payload.eventType === 'INSERT' && payload.new.status === 'active') {
            const newRound = payload.new;
            currentRoundIdRef.current = newRound.id;
            roundStartTimeRef.current = new Date(newRound.start_time).getTime();
            crashPointRef.current = newRound.crash_multiplier;
            
            setGameState(prev => ({
              ...prev,
              status: 'active',
              multiplier: 1.00,
              timeToStart: undefined,
              playerBet: prev.playerBet?.status === 'pending' 
                ? { ...prev.playerBet, status: 'active' }
                : prev.playerBet,
            }));

            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
              const elapsed = Date.now() - (roundStartTimeRef.current || Date.now());
              const currentMultiplier = 1 + (elapsed / 2000);

              if (currentMultiplier >= crashPointRef.current) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                
                if (currentRoundIdRef.current) {
                  supabase
                    .from('bets')
                    .update({
                      status: 'lost',
                      cash_out_multiplier: crashPointRef.current,
                      payout: 0,
                    })
                    .eq('round_id', currentRoundIdRef.current)
                    .in('status', ['active', 'pending'])
                    .then(() => {});
                  
                  supabase
                    .from('game_rounds')
                    .update({
                      end_time: new Date().toISOString(),
                      status: 'crashed',
                    })
                    .eq('id', currentRoundIdRef.current)
                    .then(() => {});
                }
                
                setGameState(prev => ({
                  ...prev,
                  status: 'crashed',
                  multiplier: crashPointRef.current,
                  playerBet: prev.playerBet?.status === 'active' 
                    ? { ...prev.playerBet, status: 'lost' }
                    : prev.playerBet,
                }));

                setTimeout(() => {
                  setGameState(prev => ({ ...prev, playerBet: null }));
                }, 3000);
              } else {
                setGameState(prev => {
                  if (
                    prev.playerBet?.status === 'active' &&
                    prev.playerBet.auto_cash_out &&
                    currentMultiplier >= prev.playerBet.auto_cash_out
                  ) {
                    handleAutoCashOut(prev.playerBet, currentMultiplier);
                    return { ...prev, multiplier: currentMultiplier, playerBet: null };
                  }
                  return { ...prev, multiplier: currentMultiplier };
                });
              }
            }, 50);
          }
        }
      )
      .subscribe();

    return () => {
      gameRoundSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const startNewRound = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);

      const random = Math.random();
      const crashPoint = random < 0.5 
        ? 1 + random * 4
        : 3 + random * 12;
      crashPointRef.current = Number(crashPoint.toFixed(2));

      let countdown = 10;
      setGameState(prev => ({
        ...prev,
        status: 'waiting',
        multiplier: 1.00,
        timeToStart: countdown,
        playerBet: prev.playerBet?.status === 'pending' ? prev.playerBet : null,
      }));

      countdownRef.current = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          beginRound();
        } else {
          setGameState(prev => ({ ...prev, timeToStart: countdown }));
        }
      }, 1000);
    };

    const beginRound = async () => {
      if (isCreatingRoundRef.current) {
        return;
      }
      
      isCreatingRoundRef.current = true;
      
      try {
        const finalCrashPoint = crashPointRef.current;
        roundNumberRef.current++;
        
        const { data, error } = await supabase.from('game_rounds').insert({
          round_number: roundNumberRef.current,
          crash_multiplier: finalCrashPoint,
          start_time: new Date().toISOString(),
          status: 'active',
        }).select().single();

        if (error) {
          isCreatingRoundRef.current = false;
          return;
        }
        
        if (data) {
          currentRoundIdRef.current = data.id;
          roundStartTimeRef.current = new Date(data.start_time).getTime();
          
          await supabase
            .from('bets')
            .update({
              round_id: data.id,
              status: 'active',
            })
            .eq('status', 'pending');
          
          setGameState(prev => ({
            ...prev,
            status: 'active',
            multiplier: 1.00,
            timeToStart: undefined,
            playerBet: prev.playerBet?.status === 'pending' 
              ? { ...prev.playerBet, status: 'active' }
              : prev.playerBet,
          }));

          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - (roundStartTimeRef.current || Date.now());
            const currentMultiplier = 1 + (elapsed / 2000);

            if (currentMultiplier >= crashPointRef.current) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              
              supabase
                .from('bets')
                .update({
                  status: 'lost',
                  cash_out_multiplier: crashPointRef.current,
                  payout: 0,
                })
                .eq('round_id', currentRoundIdRef.current)
                .in('status', ['active', 'pending'])
                .then(() => {});
              
              supabase
                .from('game_rounds')
                .update({
                  end_time: new Date().toISOString(),
                  status: 'crashed',
                })
                .eq('id', currentRoundIdRef.current)
                .then(() => {});
              
              setGameState(prev => ({
                ...prev,
                status: 'crashed',
                multiplier: crashPointRef.current,
                playerBet: prev.playerBet?.status === 'active' 
                  ? { ...prev.playerBet, status: 'lost' }
                  : prev.playerBet,
              }));

              setTimeout(() => {
                setGameState(prev => ({ ...prev, playerBet: null }));
                isCreatingRoundRef.current = false;
                startRoundIfPlayersExist();
              }, 3000);
            } else {
              setGameState(prev => {
                if (
                  prev.playerBet?.status === 'active' &&
                  prev.playerBet.auto_cash_out &&
                  currentMultiplier >= prev.playerBet.auto_cash_out
                ) {
                  handleAutoCashOut(prev.playerBet, currentMultiplier);
                  return { ...prev, multiplier: currentMultiplier, playerBet: null };
                }
                return { ...prev, multiplier: currentMultiplier };
              });
            }
          }, 50);
        }
      } catch (error) {
        isCreatingRoundRef.current = false;
      }
    };

    const checkPendingBets = async (): Promise<boolean> => {
      try {
        const { count } = await supabase
          .from('bets')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        
        return (count || 0) > 0;
      } catch (error) {
        return false;
      }
    };

    const startRoundIfPlayersExist = async () => {
      const hasPendingBets = await checkPendingBets();
      
      if (hasPendingBets) {
        startNewRound();
      } else {
        setGameState(prev => ({
          ...prev,
          status: 'waiting',
          multiplier: 1.00,
          timeToStart: undefined,
          playerBet: null,
        }));
        setTimeout(() => startRoundIfPlayersExist(), 2000);
      }
    };

    const handleFirstBet = () => {
      startRoundIfPlayersExist();
    };

    window.addEventListener('firstBetPlaced', handleFirstBet);
    startRoundIfPlayersExist();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      window.removeEventListener('firstBetPlaced', handleFirstBet);
    };
  }, []);

  const handleAutoCashOut = async (bet: Bet, multiplier: number) => {
    if (!user) return;
    
    const payout = bet.bet_amount * multiplier;
    
    try {
      await supabase
        .from('bets')
        .update({
          status: 'cashed_out',
          cash_out_multiplier: multiplier,
          payout,
          cashed_out_at: new Date().toISOString(),
        })
        .eq('id', bet.id);

      await supabase
        .from('users')
        .update({
          balance: user.balance + payout,
          total_wins: user.total_wins + 1,
          total_bets: user.total_bets + 1,
          highest_multiplier: Math.max(user.highest_multiplier, multiplier),
        })
        .eq('id', user.id);

      await refreshUser();
    } catch (error) {
    }
  };

  const placeBet = useCallback(async (amount: number, autoCashOut?: number) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (gameState.status === 'active') {
      return { success: false, error: 'Wait for round to finish' };
    }

    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('balance')
      .eq('id', user.id)
      .single();

    if (fetchError || !userData) {
      return { success: false, error: 'Failed to fetch balance' };
    }

    const currentBalance = userData.balance;

    if (amount > currentBalance) {
      return { success: false, error: 'Insufficient balance' };
    }

    try {
      const { count: existingPendingBets } = await supabase
        .from('bets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { error: updateError } = await supabase
        .from('users')
        .update({ balance: currentBalance - amount })
        .eq('id', user.id);

      if (updateError) throw updateError;

      const { data: betData, error: betError } = await supabase
        .from('bets')
        .insert({
          user_id: user.id,
          round_id: null,
          bet_amount: amount,
          auto_cash_out: autoCashOut,
          status: 'pending',
        })
        .select()
        .single();

      if (betError) throw betError;

      setGameState(prev => ({ ...prev, playerBet: betData }));
      
      if ((existingPendingBets || 0) === 0) {
        window.dispatchEvent(new CustomEvent('firstBetPlaced'));
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [user, gameState]);

  const cashOut = useCallback(async () => {
    if (!gameState.playerBet || gameState.status !== 'active') {
      return { success: false, error: 'Cannot cash out at this time' };
    }

    try {
      const payout = gameState.playerBet.bet_amount * gameState.multiplier;

      await supabase
        .from('bets')
        .update({
          status: 'cashed_out',
          cash_out_multiplier: gameState.multiplier,
          payout,
          cashed_out_at: new Date().toISOString(),
        })
        .eq('id', gameState.playerBet.id);

      if (user) {
        await supabase
          .from('users')
          .update({
            balance: user.balance + payout,
            total_wins: user.total_wins + 1,
            total_bets: user.total_bets + 1,
            highest_multiplier: Math.max(user.highest_multiplier, gameState.multiplier),
          })
          .eq('id', user.id);

        await refreshUser();
      }

      setGameState(prev => ({ ...prev, playerBet: null }));

      return { success: true, payout };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [gameState, user, refreshUser]);

  return {
    ...gameState,
    placeBet,
    cashOut,
  };
}
