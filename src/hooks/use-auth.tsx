
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Json } from '@/integrations/supabase/types';

interface AuthUser {
  id: string;
  username: string;
  avatar?: string;
  email?: string;
}

// Type guard to check if a setting value has a 'value' property that's boolean
function hasValueProperty(obj: any): obj is { value: boolean } {
  return typeof obj === 'object' && obj !== null && typeof obj.value === 'boolean';
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);
  const [allowedAdmins, setAllowedAdmins] = useState<string[]>([]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          setSupabaseUser(newSession.user);
          
          // Format user data
          const authUser: AuthUser = {
            id: newSession.user.id,
            username: newSession.user.user_metadata.full_name || newSession.user.user_metadata.name || 'User',
            avatar: newSession.user.user_metadata.avatar_url,
            email: newSession.user.email
          };
          
          setUser(authUser);
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
      }
    );
    
    // Check for existing session
    const initializeAuth = async () => {
      try {
        // Check if setup is complete
        await checkSetupComplete();
        
        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user) {
          setSession(currentSession);
          setSupabaseUser(currentSession.user);
          
          // Format user data
          const authUser: AuthUser = {
            id: currentSession.user.id,
            username: currentSession.user.user_metadata.full_name || currentSession.user.user_metadata.name || 'User',
            avatar: currentSession.user.user_metadata.avatar_url,
            email: currentSession.user.email
          };
          
          setUser(authUser);
        }
        
        // Load admin list
        await loadAdminList();
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSetupComplete = async () => {
    try {
      // Try to get a site setting to determine if setup is complete
      const { data, error } = await supabase
        .from('site_settings')
        .select()
        .eq('setting_name', 'setup_complete')
        .single();
      
      if (error) {
        console.error('Error checking setup status:', error);
        // If no setup_complete setting found, assume setup not complete
        setSetupComplete(false);
      } else if (data?.setting_value) {
        // Check if the setting value has a 'value' property that is true
        const settingValue = data.setting_value as Json;
        
        if (hasValueProperty(settingValue)) {
          setSetupComplete(settingValue.value === true);
        } else {
          setSetupComplete(false);
        }
      } else {
        setSetupComplete(false);
      }
    } catch (error) {
      console.error('Error checking setup status:', error);
      setSetupComplete(false);
    }
  };

  const loadAdminList = async () => {
    try {
      // Get discord settings from database
      const { data, error } = await supabase
        .from('discord_settings')
        .select('allowed_admins')
        .maybeSingle();
      
      if (error) {
        console.error('Error loading admin list:', error);
        setAllowedAdmins([]);
      } else if (data?.allowed_admins) {
        // Type safety check - ensure we're working with a string array
        const adminList = data.allowed_admins as Json;
        if (Array.isArray(adminList)) {
          // Make sure every item is a string
          const stringAdmins = adminList.filter(item => typeof item === 'string') as string[];
          setAllowedAdmins(stringAdmins);
        } else {
          console.error('allowed_admins is not an array:', data.allowed_admins);
          setAllowedAdmins([]);
        }
      } else {
        setAllowedAdmins([]);
      }
    } catch (error) {
      console.error('Error loading admin list:', error);
      setAllowedAdmins([]);
    }
  };

  const isAdmin = (): boolean => {
    if (!user) return false;
    return allowedAdmins.includes(user.id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
    setSession(null);
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
