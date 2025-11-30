import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          navigate('/game');
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="loading">
      <div className="spinner"></div>
    </div>
  );
}
