
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

const DiscordCallback = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthorized } = useAuth();

  useEffect(() => {
    const processAuth = async () => {
      // Get the access token from the URL hash
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');

      if (!accessToken) {
        setError('Access token not found');
        toast.error("Authentication failed");
        setIsProcessing(false);
        return;
      }

      try {
        // Fetch the user's profile from Discord
        const response = await fetch('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        
        const user = {
          id: userData.id,
          username: userData.username,
          avatar: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : undefined
        };

        // Check if user is authorized
        if (!isAuthorized(user)) {
          localStorage.setItem('discord_user', JSON.stringify(user));
          setIsProcessing(false);
          toast.error("You are not authorized to access this application");
          return;
        }

        // Store the user in localStorage
        localStorage.setItem('discord_user', JSON.stringify(user));
        toast.success("Logged in successfully");
        
        setIsProcessing(false);
      } catch (error) {
        console.error('Authentication error:', error);
        setError('Failed to authenticate with Discord');
        toast.error("Authentication failed");
        setIsProcessing(false);
      }
    };

    processAuth();
  }, [isAuthorized]);

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Processing Authentication...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rosch-DEFAULT mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <Navigate to="/login" />;
  }

  return <Navigate to="/" />;
};

export default DiscordCallback;
