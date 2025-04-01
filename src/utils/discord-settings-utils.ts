
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';

// Type definitions
export interface DiscordSettings {
  bot_token: string;
  client_id: string;
  client_secret: string;
  guild_id: string;
  allowed_admins: string[];
}

// Load Discord settings from the database
export const loadDiscordSettings = async (): Promise<DiscordSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('discord_settings')
      .select('*')
      .maybeSingle();
    
    if (error) {
      console.error('Error loading discord settings:', error);
      return null;
    }
    
    return data as DiscordSettings;
  } catch (error) {
    console.error('Error loading settings from Supabase:', error);
    return null;
  }
};

// Check API connection status
export const checkApiConnection = async (): Promise<'connected' | 'error'> => {
  try {
    const response = await fetch('/api/health', { method: 'GET' });
    if (response.ok) {
      return 'connected';
    } else {
      return 'error';
    }
  } catch (error) {
    return 'error';
  }
};

// Save Discord settings to database and API if connected
export const saveDiscordConfig = async (settings: DiscordSettings): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('discord_settings')
      .upsert({
        id: 'default',
        bot_token: settings.bot_token,
        client_id: settings.client_id,
        client_secret: settings.client_secret,
        guild_id: settings.guild_id,
        allowed_admins: settings.allowed_admins
      }, { onConflict: 'id' });
    
    if (error) throw error;
    
    // Try to save to API if connected
    try {
      const config = {
        botToken: settings.bot_token,
        guildId: settings.guild_id,
        allowedAdmins: settings.allowed_admins
      };
      
      const response = await fetch('/api/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save configuration to API');
      }
    } catch (error) {
      console.error('Error saving to API:', error);
      sonnerToast.error('Configuration saved to database but could not be saved to the bot. The Discord bot might not receive the changes.', {
        duration: 5000,
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error saving Discord configuration:', error);
    return false;
  }
};
