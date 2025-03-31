
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

// Define the user type
interface User {
  id: string;
  username: string;
  avatar?: string;
}

// Define the context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  isAuthorized: (user: User) => boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  isAuthorized: () => false,
});

// Local storage keys
const AUTHORIZED_USERS_KEY = 'discord_authorized_users';
const CLIENT_ID_KEY = 'discord_client_id';

// Define the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to check if a user is authorized
  const isAuthorized = (user: User): boolean => {
    const authorizedUsersString = localStorage.getItem(AUTHORIZED_USERS_KEY);
    if (!authorizedUsersString) return false;
    
    // Split by newlines, commas, or spaces to handle different formats
    const authorizedUsers = authorizedUsersString.split(/[\n,\s]+/).filter(id => id.trim());
    return authorizedUsers.includes(user.id);
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('discord_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('discord_user');
      }
    }
    setLoading(false);
  }, []);

  // Redirect to Discord OAuth page
  const login = () => {
    const clientId = localStorage.getItem(CLIENT_ID_KEY);
    
    if (!clientId) {
      toast.error("Discord Client ID not configured. Please complete the setup first.");
      return;
    }
    
    const REDIRECT_URI = `${window.location.origin}/auth/discord/callback`;
    const SCOPE = "identify";
    
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=${SCOPE}`;
    
    window.location.href = discordAuthUrl;
  };

  // Clear stored user data
  const logout = () => {
    localStorage.removeItem('discord_user');
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
