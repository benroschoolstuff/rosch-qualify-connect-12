
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

// List of authorized Discord user IDs
const AUTHORIZED_USER_IDS = [
  // Add your authorized Discord user IDs here
  // Example: "123456789012345678"
];

// Define the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to check if a user is authorized
  const isAuthorized = (user: User): boolean => {
    return AUTHORIZED_USER_IDS.includes(user.id);
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
    const CLIENT_ID = "YOUR_DISCORD_CLIENT_ID"; // Replace with your Discord application client ID
    const REDIRECT_URI = `${window.location.origin}/auth/discord/callback`;
    const SCOPE = "identify";
    
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=${SCOPE}`;
    
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
