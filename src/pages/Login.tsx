
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Login = () => {
  const [clientId, setClientId] = useState('');
  const [setupComplete, setSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if setup is complete
    const isSetupComplete = localStorage.getItem('setupComplete') === 'true';
    setSetupComplete(isSetupComplete);
    
    // If setup is not complete, redirect to setup page
    if (!isSetupComplete) {
      navigate('/setup');
      return;
    }
    
    // Load Discord OAuth2 client ID
    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
      setClientId(storedClientId);
    }
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      navigate('/managementbackend');
    }
  }, [navigate]);
  
  const handleDiscordLogin = () => {
    if (!clientId) {
      toast({
        title: "Configuration Error",
        description: "Discord client ID is not configured. Please complete the setup process.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Redirect to Discord OAuth2 authorization URL
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/discord/callback`);
      const scope = encodeURIComponent('identify email');
      
      const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
      
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error during Discord login:', error);
      setIsLoading(false);
      
      toast({
        title: "Authentication Error",
        description: "There was an error redirecting to Discord authentication.",
        variant: "destructive",
      });
    }
  };

  if (!setupComplete) {
    return null; // Will redirect to setup page via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Sign in to access the management backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Discord Authentication</AlertTitle>
            <AlertDescription>
              This admin area is protected. You need to sign in with Discord to access it. 
              Only authorized Discord users can access the management backend.
            </AlertDescription>
          </Alert>
          
          {!clientId && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Missing Configuration</AlertTitle>
              <AlertDescription>
                Discord client ID is not configured. Please complete the setup process first.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            className="w-full"
            onClick={handleDiscordLogin} 
            disabled={!clientId || isLoading}
          >
            {isLoading ? 'Redirecting...' : 'Sign in with Discord'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
