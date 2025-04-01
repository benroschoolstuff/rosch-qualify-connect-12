
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get the authorization code from URL
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');

        if (!code) {
          throw new Error('No authorization code found');
        }

        // Get stored credentials (in a real app, this would be done server-side)
        const clientId = localStorage.getItem('clientId');
        const clientSecret = localStorage.getItem('clientSecret');
        const redirectUri = `${window.location.origin}/auth/discord/callback`;

        // Exchange code for token (in a real app, this would be done server-side)
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: clientId || '',
            client_secret: clientSecret || '',
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for token');
        }

        const tokenData = await tokenResponse.json();
        
        // Get user info
        const userResponse = await fetch('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to get user info');
        }

        const userData = await userResponse.json();
        
        // Check if user is in allowed list (in a real app, this would verify against a database)
        // For now, we'll simulate this with localStorage
        const allowedAdmins = JSON.parse(localStorage.getItem('allowedAdmins') || '[]');
        
        if (!allowedAdmins.includes(userData.id)) {
          throw new Error('Unauthorized access');
        }
        
        // Store user session
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenData.access_token);
        
        setStatus('success');
        
        toast({
          title: "Login successful",
          description: `Welcome, ${userData.username}!`,
        });
        
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } catch (error) {
        console.error('Authentication error:', error);
        setStatus('error');
        
        toast({
          title: "Authentication failed",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handleAuth();
  }, [location, navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
            <h2 className="mt-4 text-xl font-medium text-gray-900">Authenticating...</h2>
            <p className="mt-2 text-sm text-gray-500">Verifying your Discord credentials</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-medium text-gray-900">Authentication Successful</h2>
            <p className="mt-2 text-sm text-gray-500">Redirecting to admin panel...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-medium text-gray-900">Authentication Failed</h2>
            <p className="mt-2 text-sm text-gray-500">Redirecting to home page...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
