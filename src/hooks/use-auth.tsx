
import { useState, useEffect } from 'react';

interface AuthUser {
  id: string;
  username: string;
  avatar?: string;
  email?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);
  const [allowedAdmins, setAllowedAdmins] = useState<string[]>([]);

  useEffect(() => {
    // Check if setup is complete
    const setupStatus = localStorage.getItem('setupComplete') === 'true';
    setSetupComplete(setupStatus);
    
    // Check for user data in localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Load admin list
        loadAdminList();
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Invalid user data, remove from storage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      loadAdminList();
    }
    
    setIsLoading(false);
  }, []);

  const loadAdminList = async () => {
    try {
      // First try to load from API
      const response = await fetch('/api/get-config');
      if (response.ok) {
        const config = await response.json();
        if (config.allowedAdmins) {
          setAllowedAdmins(config.allowedAdmins);
          return;
        }
      }
      
      // Fallback to localStorage if API fails
      const storedAdmins = JSON.parse(localStorage.getItem('allowedAdmins') || '[]');
      setAllowedAdmins(storedAdmins);
    } catch (error) {
      console.error('Error loading admin list:', error);
      // Fallback to localStorage if API fails
      try {
        const storedAdmins = JSON.parse(localStorage.getItem('allowedAdmins') || '[]');
        setAllowedAdmins(storedAdmins);
      } catch (error) {
        console.error('Error parsing stored admins:', error);
        setAllowedAdmins([]);
      }
    }
  };

  const isAdmin = (): boolean => {
    if (!user) return false;
    return allowedAdmins.includes(user.id);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    setupComplete,
    logout
  };
};
