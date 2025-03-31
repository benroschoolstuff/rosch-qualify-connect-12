import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const SETUP_COMPLETE_KEY = 'discord_setup_complete';

interface DiscordSetupGuardProps {
  children: React.ReactNode;
}

const DiscordSetupGuard: React.FC<DiscordSetupGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    // Check if setup is already complete
    const isComplete = localStorage.getItem(SETUP_COMPLETE_KEY) === 'true';
    setSetupComplete(isComplete);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  // If setup is already complete, redirect to home
  if (setupComplete) {
    return <Navigate to="/" />;
  }

  // Otherwise, allow access to the setup page
  return <>{children}</>;
};

export default DiscordSetupGuard;
