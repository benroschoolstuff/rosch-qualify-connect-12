import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast as sonnerToast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const DiscordSettings = () => {
  const { toast } = useToast();
  const [botToken, setBotToken] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [guildId, setGuildId] = useState('');
  const [allowedAdmins, setAllowedAdmins] = useState<string[]>([]);
  const [newAdminId, setNewAdminId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('discord_settings')
          .select('*')
          .maybeSingle();
        
        if (error) {
          console.error('Error loading discord settings:', error);
        } else if (data) {
          setBotToken(data.bot_token || '');
          setClientId(data.client_id || '');
          setClientSecret(data.client_secret || '');
          setGuildId(data.guild_id || '');
          setAllowedAdmins(data.allowed_admins || []);
        }
      } catch (error) {
        console.error('Error loading settings from Supabase:', error);
      }
      
      checkApiConnection();
      
      try {
        const response = await fetch('/api/get-config');
        if (response.ok) {
          setApiStatus('connected');
          const config = await response.json();
          console.log('Config loaded from API:', config);
          if (config.botToken) setBotToken(config.botToken);
          if (config.guildId) setGuildId(config.guildId);
          if (config.allowedAdmins) setAllowedAdmins(config.allowedAdmins);
        } else {
          throw new Error('Failed to load configuration');
        }
      } catch (error) {
        console.error('Error loading config from API:', error);
        setApiStatus('error');
      }
    };
    
    loadSettings();
  }, []);
  
  const checkApiConnection = async () => {
    try {
      const response = await fetch('/api/health', { method: 'GET' });
      if (response.ok) {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      setApiStatus('error');
    }
  };
  
  const saveDiscordConfig = async () => {
    try {
      const config = {
        botToken,
        guildId,
        allowedAdmins
      };
      
      const { error } = await supabase
        .from('discord_settings')
        .upsert({
          id: 'default',
          bot_token: botToken,
          client_id: clientId,
          client_secret: clientSecret,
          guild_id: guildId,
          allowed_admins: allowedAdmins
        }, { onConflict: 'id' });
      
      if (error) throw error;
      
      if (apiStatus === 'connected') {
        const response = await fetch('/api/save-config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(config),
        });
        
        console.log('Save config API response:', response);
        
        if (!response.ok) {
          throw new Error('Failed to save configuration');
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error saving Discord configuration:', error);
      sonnerToast.error('Configuration saved to database but could not be saved to the bot. The Discord bot might not receive the changes.', {
        duration: 5000,
      });
      
      return true;
    }
  };
  
  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      const saved = await saveDiscordConfig();
      
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
  
  const handleAddAdmin = async () => {
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
      
      await saveDiscordConfig();
      
      setNewAdminId('');
      
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
      
      await saveDiscordConfig();
      
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
      {apiStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">API Connection Error:</strong>
          <span className="block sm:inline"> Unable to connect to the Discord bot API. Configurations will only be saved to the database.</span>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Discord Bot Configuration</CardTitle>
          <CardDescription>
            Configure your Discord bot for the admin command functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="botToken">Bot Token</Label>
            <Input
              id="botToken"
              type="password"
              placeholder="Enter Discord bot token"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guildId">Discord Server ID</Label>
            <Input
              id="guildId"
              placeholder="Enter Discord server ID"
              value={guildId}
              onChange={(e) => setGuildId(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              This is the server where admin commands will be used.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Discord OAuth Configuration</CardTitle>
          <CardDescription>
            Configure Discord OAuth for admin login
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Client ID</Label>
            <Input
              id="clientId"
              placeholder="Enter Discord application client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientSecret">Client Secret</Label>
            <Input
              id="clientSecret"
              type="password"
              placeholder="Enter Discord application client secret"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="redirectUri">Redirect URI</Label>
            <Input
              id="redirectUri"
              value={`${window.location.origin}/auth/discord/callback`}
              readOnly
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              Add this URL to your Discord application's OAuth2 redirect URLs.
            </p>
          </div>
          
          <Button 
            onClick={handleSaveSettings} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Saving...' : 'Save Discord Settings'}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>
            Manage which Discord users can access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Discord User ID"
                value={newAdminId}
                onChange={(e) => setNewAdminId(e.target.value)}
              />
              <Button onClick={handleAddAdmin}>Add Admin</Button>
            </div>
            
            <div className="space-y-2">
              <Label>Authorized Admin Users</Label>
              {allowedAdmins.length === 0 ? (
                <div className="text-center p-4 border rounded-md bg-gray-50">
                  <p className="text-gray-500">No admin users configured yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {allowedAdmins.map(adminId => (
                    <div key={adminId} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <span className="font-mono text-sm">{adminId}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveAdmin(adminId)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Only these Discord users will be able to access the admin panel.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscordSettings;
