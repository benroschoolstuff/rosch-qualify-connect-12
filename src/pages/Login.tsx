
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const CLIENT_ID_KEY = 'discord_client_id';
const SETUP_COMPLETE_KEY = 'discord_setup_complete';

const Login = () => {
  const { user, login } = useAuth();
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clientId = localStorage.getItem(CLIENT_ID_KEY);
    const setupComplete = localStorage.getItem(SETUP_COMPLETE_KEY) === 'true';
    
    setSetupNeeded(!clientId || !setupComplete);
    setLoading(false);
  }, []);
  
  // If already logged in, redirect to home
  if (user) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Login with your Discord account to access restricted areas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {setupNeeded ? (
              <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md flex gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800">
                    Discord authentication is not set up yet. Please complete the setup first.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <Button 
                onClick={login}
                className="w-full bg-[#5865F2] hover:bg-[#4752c4]" 
                disabled={setupNeeded}
              >
                Login with Discord
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            {setupNeeded && (
              <Link to="/discord-setup" className="w-full">
                <Button variant="outline" className="w-full">
                  Complete Discord Setup
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;
