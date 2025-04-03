
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type DatabaseContextType = {
  isConnected: boolean;
  isLoading: boolean;
  lastChecked: Date | null;
  checkConnection: () => Promise<boolean>;
};

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async (): Promise<boolean> => {
    try {
      // Try to fetch from a simple table to test connection
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_name')
        .limit(1)
        .maybeSingle();
      
      const connected = !error;
      setIsConnected(connected);
      setLastChecked(new Date());
      return connected;
    } catch (error) {
      console.error('Database connection error:', error);
      setIsConnected(false);
      setLastChecked(new Date());
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check connection on mount
    checkConnection();

    // Set up periodic connection checking every 30 seconds
    const intervalId = setInterval(() => {
      checkConnection();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <DatabaseContext.Provider value={{ isConnected, isLoading, lastChecked, checkConnection }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
