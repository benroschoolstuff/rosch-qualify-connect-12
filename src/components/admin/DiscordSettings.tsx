
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import ApiStatusAlert from './discord/ApiStatusAlert';
import OAuthConfigCard from './discord/OAuthConfigCard';
import AdminAccessCard from './discord/AdminAccessCard';
import { 
  loadDiscordSettings, 
  saveDiscordConfig,
  type DiscordSettings as DiscordSettingsType
} from '@/utils/discord-settings-utils';
import { supabase } from '@/integrations/supabase/client';

const DiscordSettings = () => {
  const { toast } = useToast();
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [allowedAdmins, setAllowedAdmins] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus] = useState<'loading' | 'connected' | 'error'>('connected');
  
  useEffect(() => {
    const initializeSettings = async () => {
      // Load settings from database
      const settings = await loadDiscordSettings();
      if (settings) {
        setClientId(settings.client_id || '');
        setClientSecret(settings.client_secret || '');
        setAllowedAdmins(settings.allowed_admins || []);
      }
    };
    
    initializeSettings();
  }, []);
  
  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      const settings: DiscordSettingsType = {
        bot_token: '', // Empty as we're removing the bot
        client_id: clientId,
        client_secret: clientSecret,
        guild_id: '', // Empty as we're removing the bot
        allowed_admins: allowedAdmins
      };
      
      const saved = await saveDiscordConfig(settings);
      
      if (saved) {
        toast({
          title: "Settings saved",
          description: "Discord OAuth settings have been updated.",
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddAdmin = async (newAdminId: string) => {
    if (!newAdminId || newAdminId.trim() === '') {
      toast({
        title: "Invalid Discord ID",
        description: "Please enter a valid Discord user ID.",
        variant: "destructive",
      });
      return;
    }
    
    if (allowedAdmins.includes(newAdminId)) {
      toast({
        title: "Admin already exists",
        description: "This Discord ID is already in the admin list.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedAdmins = [...allowedAdmins, newAdminId];
    
    try {
      const { error } = await supabase
        .from('discord_settings')
        .update({ allowed_admins: updatedAdmins })
        .eq('id', 'default');
      
      if (error) throw error;
      
      setAllowedAdmins(updatedAdmins);
      
      toast({
        title: "Admin added",
        description: "The Discord user has been added to the admin list.",
      });
    } catch (error) {
      console.error('Error saving admin:', error);
      toast({
        title: "Error",
        description: "Failed to save admin. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRemoveAdmin = async (adminId: string) => {
    const updatedAdmins = allowedAdmins.filter(id => id !== adminId);
    
    try {
      const { error } = await supabase
        .from('discord_settings')
        .update({ allowed_admins: updatedAdmins })
        .eq('id', 'default');
      
      if (error) throw error;
      
      setAllowedAdmins(updatedAdmins);
      
      toast({
        title: "Admin removed",
        description: "The Discord user has been removed from the admin list.",
      });
    } catch (error) {
      console.error('Error removing admin:', error);
      toast({
        title: "Error",
        description: "Failed to remove admin. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <ApiStatusAlert apiStatus={apiStatus} />
      
      <OAuthConfigCard
        clientId={clientId}
        setClientId={setClientId}
        clientSecret={clientSecret}
        setClientSecret={setClientSecret}
        isLoading={isLoading}
        onSave={handleSaveSettings}
      />
      
      <AdminAccessCard
        allowedAdmins={allowedAdmins}
        onAddAdmin={handleAddAdmin}
        onRemoveAdmin={handleRemoveAdmin}
      />
    </div>
  );
};

export default DiscordSettings;
