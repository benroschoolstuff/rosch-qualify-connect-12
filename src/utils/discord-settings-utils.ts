
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

// Type definitions
export interface DiscordSettings {
  bot_token: string;
  client_id: string;
  client_secret: string;
  guild_id: string;
  allowed_admins: string[];
}

// Type guard to check if an object is a valid Discord settings object
function isDiscordSettings(obj: unknown): obj is DiscordSettings {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as any).bot_token === 'string' &&
    typeof (obj as any).client_id === 'string' &&
    typeof (obj as any).client_secret === 'string' &&
    typeof (obj as any).guild_id === 'string' &&
    Array.isArray((obj as any).allowed_admins) &&
    (obj as any).allowed_admins.every((item: unknown) => typeof item === 'string')
  );
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
    
    // Validate and convert the data to the proper type
    if (data && isDiscordSettings(data)) {
      return data;
    } else if (data) {
      // If data exists but isn't in the right format, try to convert it
      try {
        const convertedData: DiscordSettings = {
          bot_token: data.bot_token || '',
          client_id: data.client_id || '',
          client_secret: data.client_secret || '',
          guild_id: data.guild_id || '',
          allowed_admins: Array.isArray(data.allowed_admins) 
            ? data.allowed_admins.filter(item => typeof item === 'string')
            : []
        };
        return convertedData;
      } catch (convError) {
        console.error('Error converting discord settings:', convError);
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error loading settings from Supabase:', error);
    return null;
  }
};

// Check API connection status - Now always returns 'connected' since we're removing the bot
export const checkApiConnection = async (): Promise<'connected' | 'error'> => {
  return 'connected';
};

// Save Discord settings to database only (API part removed)
export const saveDiscordConfig = async (settings: DiscordSettings): Promise<boolean> => {
  try {
    // Ensure settings is in the correct format for Supabase
    const { error } = await supabase
      .from('discord_settings')
      .upsert({
        id: 'default',
        bot_token: settings.bot_token,
        client_id: settings.client_id,
        client_secret: settings.client_secret,
        guild_id: settings.guild_id,
        allowed_admins: settings.allowed_admins as unknown as Json
      }, { onConflict: 'id' });
    
    if (error) {
      console.error('Error saving to Supabase:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving Discord configuration:', error);
    return false;
  }
};
