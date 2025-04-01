
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      navigate('/admin');
    }
    
    // Check if setup is complete
    const setupComplete = localStorage.getItem('setupComplete');
    if (setupComplete !== 'true') {
      navigate('/setup');
    }
  }, [navigate]);

  const handleDiscordLogin = () => {
    // Get stored credentials
    const clientId = localStorage.getItem('clientId');
    
    if (!clientId) {
      navigate('/setup');
      return;
    }
    
    // Build Discord OAuth URL
    const redirectUri = `${window.location.origin}/auth/discord/callback`;
    const scope = 'identify email';
    
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Log in with your Discord account to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-full max-w-xs">
            <Button 
              onClick={handleDiscordLogin} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.9298 5.3879C18.5317 4.7484 17.0644 4.2857 15.5644 4C15.3644 4.3604 15.1317 4.8352 14.9644 5.2088C13.3651 4.9428 11.7312 4.9428 10.1317 5.2088C9.96443 4.8352 9.73172 4.3604 9.53172 4C8.03172 4.2857 6.56443 4.7484 5.16636 5.3879C1.83598 10.3516 0.936003 15.1825 1.37885 19.9473C3.24795 21.3516 5.06448 22.1582 6.83169 22.6667C7.26443 22.0714 7.6317 21.4319 7.96448 20.7593C7.39787 20.5374 6.83169 20.2714 6.31172 19.9473C6.47852 19.8352 6.64531 19.7055 6.80533 19.5824C9.4317 20.7857 12.389 20.7857 15.0153 19.5824C15.1753 19.7055 15.3421 19.8352 15.5089 19.9473C14.989 20.2714 14.4228 20.5374 13.8562 20.7593C14.189 21.4319 14.5626 22.0714 14.9953 22.6667C16.7562 22.1582 18.5726 21.3516 20.4417 19.9473C20.9649 14.4659 19.5916 9.6791 19.9298 5.3879ZM7.60505 16.956C6.60502 16.956 5.78488 16.0274 5.78488 14.8901C5.78488 13.7528 6.57892 12.8242 7.60505 12.8242C8.63118 12.8242 9.45132 13.7528 9.42522 14.8901C9.42522 16.0274 8.63118 16.956 7.60505 16.956ZM17.5157 16.956C16.5157 16.956 15.6955 16.0274 15.6955 14.8901C15.6955 13.7528 16.4896 12.8242 17.5157 12.8242C18.5418 12.8242 19.362 13.7528 19.3359 14.8901C19.3359 16.0274 18.5481 16.956 17.5157 16.956Z" fill="white"/>
              </svg>
              Login with Discord
            </Button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Only authorized Discord users can access the admin panel.</p>
            <p className="mt-2">
              If you need access, contact the administrator to add your Discord ID.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
