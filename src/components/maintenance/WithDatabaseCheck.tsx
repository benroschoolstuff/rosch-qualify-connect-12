import React from 'react';
import { useDatabase } from '@/contexts/DatabaseContext';
import MaintenanceMode from './MaintenanceMode';
import { useLocation } from 'react-router-dom';

// List of routes that should bypass maintenance mode
const ADMIN_ROUTES = ['/managementbackend', '/login', '/auth', '/setup'];

interface WithDatabaseCheckProps {
  children: React.ReactNode;
}

const WithDatabaseCheck: React.FC<WithDatabaseCheckProps> = ({ children }) => {
  const { isConnected, isLoading } = useDatabase();
  const location = useLocation();
  
  // Check if the current path is an admin route that should bypass maintenance mode
  const isAdminRoute = ADMIN_ROUTES.some(route => location.pathname.startsWith(route));
  
  // If still loading the connection status, show a simple loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  // If database is not connected and we're not on an admin route, show maintenance mode
  if (!isConnected && !isAdminRoute) {
    return <MaintenanceMode />;
  }
  
  // Otherwise, render the children (normal application)
  return <>{children}</>;
};

export default WithDatabaseCheck;
