
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import ApiStatusAlert from './discord/ApiStatusAlert';
import BotConfigCard from './discord/BotConfigCard';
import OAuthConfigCard from './discord/OAuthConfigCard';
import AdminAccessCard from './discord/AdminAccessCard';
import { 
  loadDiscordSettings, 
  checkApiConnection, 
  saveDiscordConfig,
  type DiscordSettings as DiscordSettingsType
} from '@/utils/discord-settings-utils';
import { supabase } from '@/integrations/supabase/client';

const DiscordSettings = () => {
  const { toast } = useToast();
  const [botToken, setBotToken] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [guildId, setGuildId] = useState('');
  const [allowedAdmins, setAllowedAdmins] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  
  useEffect(() => {
    const initializeSettings = async () => {
      // Check API connection
      const connectionStatus = await checkApiConnection();
      setApiStatus(connectionStatus);
      
      // Load settings from database
      const settings = await loadDiscordSettings();
      if (settings) {
        setBotToken(settings.bot_token || '');
        setClientId(settings.client_id || '');
        setClientSecret(settings.client_secret || '');
        setGuildId(settings.guild_id || '');
        setAllowedAdmins(settings.allowed_admins || []);
      }
    };
    
    initializeSettings();
  }, []);
  
  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      const settings: DiscordSettingsType = {
        bot_token: botToken,
        client_id: clientId,
        client_secret: clientSecret,
        guild_id: guildId,
        allowed_admins: allowedAdmins
      };
      
      const saved = await saveDiscordConfig(settings);
      
      if (saved) {
        toast({
          title: "Settings saved",
          description: "Discord bot and OAuth settings have been updated.",
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
      
      // Save to API if connected
      const settings: DiscordSettingsType = {
        bot_token: botToken,
        client_id: clientId,
        client_secret: clientSecret,
        guild_id: guildId,
        allowed_admins: updatedAdmins
      };
      
      await saveDiscordConfig(settings);
      
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
      
      // Save to API if connected
      const settings: DiscordSettingsType = {
        bot_token: botToken,
        client_id: clientId,
        client_secret: clientSecret,
        guild_id: guildId,
        allowed_admins: updatedAdmins
      };
      
      await saveDiscordConfig(settings);
      
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
      
      <BotConfigCard
        botToken={botToken}
        setBotToken={setBotToken}
        guildId={guildId}
        setGuildId={setGuildId}
      />
      
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
