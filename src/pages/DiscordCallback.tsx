
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const DiscordCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the access token from the URL fragment
        const fragment = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = fragment.get('access_token');
        const tokenType = fragment.get('token_type');
        
        if (!accessToken) {
          throw new Error('No access token found in URL');
        }

        // Fetch user data from Discord API
        const response = await fetch('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Discord API error: ${response.status}`);
        }

        const userData = await response.json();
        
        // Save user data to localStorage
        const user = {
          id: userData.id,
          username: userData.username,
          avatar: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : undefined,
        };
        
        localStorage.setItem('discord_user', JSON.stringify(user));
        
        toast.success(`Welcome, ${userData.username}!`);
        navigate('/');
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        toast.error("Authentication failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {loading ? (
          <>
            <h1 className="text-2xl font-bold mb-4">Processing Login...</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          </>
        ) : error ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h1>
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
            >
              Return to Login
            </button>
          </>
        ) : (
          <p>Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default DiscordCallback;
