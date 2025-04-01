
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast as sonnerToast } from 'sonner';

const Setup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [botToken, setBotToken] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [guildId, setGuildId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [discordRedirectUri, setDiscordRedirectUri] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if setup is already complete
    const setupComplete = localStorage.getItem('setupComplete');
    if (setupComplete === 'true') {
      navigate('/');
    }
    
    // Set the redirect URI based on current domain
    const domain = window.location.origin;
    setDiscordRedirectUri(`${domain}/auth/discord/callback`);
  }, [navigate]);

  const saveDiscordConfig = async (config) => {
    try {
      // Create a config directory if it doesn't exist
      const configData = JSON.stringify(config, null, 2);
      
      // Use localStorage as a temporary solution
      // In a real implementation, this would be a server API call
      localStorage.setItem('discordConfig', configData);
      
      // Save to config/discord-config.json using fetch API
      const response = await fetch('/api/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: configData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }
      
      return true;
    } catch (error) {
      console.error('Error saving Discord configuration:', error);
      sonnerToast.error('Configuration saved to localStorage but could not be saved to disk. The Discord bot might not start automatically.', {
        duration: 10000,
      });
      
      // Return true even if server-side saving fails
      // This allows setup to continue even if the API isn't available
      return true;
    }
  };

  const handleSetupBot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Save Discord bot configuration
      const botConfig = {
        botToken,
        guildId,
        allowedAdmins: []
      };
      
      const saved = await saveDiscordConfig(botConfig);
      
      if (saved) {
        // Store the bot token in localStorage for the admin panel
        localStorage.setItem('botToken', botToken);
        localStorage.setItem('guildId', guildId);
        
        toast({
          title: "Bot configuration saved",
          description: "Your Discord bot has been configured successfully.",
        });
        
        setStep(2);
      } else {
        throw new Error('Failed to save bot configuration');
      }
    } catch (error) {
      console.error('Error setting up bot:', error);
      toast({
        title: "Error",
        description: "Failed to setup the Discord bot. Please check your token and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupOAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Store OAuth credentials (in a real app this would be on the server)
      localStorage.setItem('clientId', clientId);
      localStorage.setItem('clientSecret', clientSecret);
      
      toast({
        title: "OAuth configuration saved",
        description: "Your Discord OAuth has been configured successfully.",
      });
      
      // Mark setup as complete
      localStorage.setItem('setupComplete', 'true');
      setIsComplete(true);
    } catch (error) {
      console.error('Error setting up OAuth:', error);
      toast({
        title: "Error",
        description: "Failed to setup Discord OAuth. Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Discord Bot Setup Instructions</DialogTitle>
            <DialogDescription>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold">1. Create a Discord Application</h3>
                  <p className="text-sm">Visit the Discord Developer Portal and create a new application.</p>
                </div>
                <div>
                  <h3 className="font-semibold">2. Create a Bot</h3>
                  <p className="text-sm">Go to the Bot section and create a new bot. Copy the bot token.</p>
                </div>
                <div>
                  <h3 className="font-semibold">3. OAuth2 Settings</h3>
                  <p className="text-sm">In the OAuth2 section, add the following redirect URL:</p>
                  <code className="text-xs bg-gray-100 p-1 rounded block mt-1 overflow-x-auto">
                    {discordRedirectUri}
                  </code>
                  <p className="text-sm mt-2">Copy the Client ID and Client Secret.</p>
                </div>
                <div>
                  <h3 className="font-semibold">4. Bot Permissions</h3>
                  <p className="text-sm">Ensure your bot has these permissions:</p>
                  <ul className="text-xs list-disc pl-5 mt-1">
                    <li>Read Messages/View Channels</li>
                    <li>Send Messages</li>
                    <li>Manage Roles (to control admin access)</li>
                  </ul>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-blue-700">ROSCH.UK Setup</CardTitle>
          <CardDescription className="text-center">
            {step === 1 ? "Configure Discord Bot" : step === 2 ? "Configure Discord OAuth" : "Setup Complete"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={handleSetupBot} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="botToken">Discord Bot Token</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="text-blue-600 text-xs"
                    onClick={() => setShowInstructions(true)}
                  >
                    Need help?
                  </Button>
                </div>
                <Input
                  id="botToken"
                  type="password"
                  placeholder="Enter your Discord bot token"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guildId">Discord Server ID</Label>
                <Input
                  id="guildId"
                  placeholder="Enter your Discord server ID"
                  value={guildId}
                  onChange={(e) => setGuildId(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  This is the server where admin commands will be used.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Continue'}
              </Button>
            </form>
          )}
          
          {step === 2 && (
            <form onSubmit={handleSetupOAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Discord Client ID</Label>
                <Input
                  id="clientId"
                  placeholder="Enter your Discord application client ID"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientSecret">Discord Client Secret</Label>
                <Input
                  id="clientSecret"
                  type="password"
                  placeholder="Enter your Discord application client secret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="redirectUri">Redirect URI</Label>
                <Input
                  id="redirectUri"
                  value={discordRedirectUri}
                  readOnly
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  Add this URL to your Discord application's OAuth2 redirect URLs.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Complete Setup'}
              </Button>
            </form>
          )}
          
          {isComplete && (
            <div className="space-y-4 text-center">
              <div className="py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">Setup Complete</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your Discord bot and OAuth have been configured successfully. You can now start using the admin panel.
                </p>
              </div>
              <Button 
                onClick={handleComplete} 
                className="w-full btn-primary"
              >
                Go to Admin Panel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Setup;
