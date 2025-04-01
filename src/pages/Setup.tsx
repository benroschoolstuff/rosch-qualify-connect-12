import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, Info, X } from 'lucide-react';
import TeamManagement from '@/components/admin/TeamManagement';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

// Type guard to check if a setting value has a 'value' property that's boolean
function hasValueProperty(obj: any): obj is { value: boolean } {
  return typeof obj === 'object' && obj !== null && typeof obj.value === 'boolean';
}

const Setup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('welcome');
  const [setupComplete, setSetupComplete] = useState(false);
  const [botToken, setBotToken] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [guildId, setGuildId] = useState('');
  const [adminId, setAdminId] = useState('');
  const [siteName, setSiteName] = useState('ROSCH.UK');
  const [siteTagline, setSiteTagline] = useState('Roblox Education Training');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  
  // Check if setup is already complete
  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select()
          .eq('setting_name', 'setup_complete')
          .single();
        
        if (!error && data?.setting_value) {
          // Type-safe check for the value property
          const settingValue = data.setting_value as Json;
          let isComplete = false;
          
          if (hasValueProperty(settingValue)) {
            isComplete = settingValue.value === true;
          }
          
          if (isComplete) {
            setSetupComplete(true);
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error checking setup status:', error);
      }
      
      // Check API connection
      checkApiConnection();
    };
    
    checkSetupStatus();
  }, [navigate]);
  
  const checkApiConnection = async () => {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      setApiStatus('error');
    }
  };
  
  const nextTab = (current: string) => {
    switch (current) {
      case 'welcome':
        setActiveTab('discord');
        break;
      case 'discord':
        setActiveTab('branding');
        break;
      case 'branding':
        setActiveTab('team');
        break;
      case 'team':
        setActiveTab('complete');
        break;
      default:
        break;
    }
  };
  
  const handleSaveDiscordSettings = async () => {
    if (!botToken || !clientId || !clientSecret || !guildId || !adminId) {
      toast({
        title: "Missing information",
        description: "Please fill out all Discord configuration fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save Discord settings to Supabase
      const allowedAdmins = [adminId];
      
      const { error } = await supabase
        .from('discord_settings')
        .upsert({
          id: 'default', // Using a constant ID for easier retrieval
          bot_token: botToken,
          client_id: clientId,
          client_secret: clientSecret,
          guild_id: guildId,
          allowed_admins: allowedAdmins
        }, { onConflict: 'id' });
      
      if (error) throw error;
      
      // Try to save to config file through API if available
      if (apiStatus === 'connected') {
        const config = {
          botToken,
          guildId,
          allowedAdmins
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
      }
      
      toast({
        title: "Discord settings saved",
        description: "Your Discord configuration has been saved successfully.",
      });
      
      nextTab('discord');
    } catch (error) {
      console.error('Error saving Discord settings:', error);
      toast({
        title: "Error saving settings",
        description: "There was an error saving your Discord settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveBrandingSettings = async () => {
    try {
      const brandingSettings = {
        siteName,
        siteTagline,
        primaryColor: '#1d4ed8',
        accentColor: '#60a5fa',
        footerText: `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`,
        contactEmail: 'info@rosch.uk',
        contactPhone: '',
        socialLinks: {
          discord: '',
          twitter: '',
          facebook: '',
          instagram: '',
        },
      };
      
      // Save branding settings to Supabase
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_name: 'branding',
          setting_value: brandingSettings
        }, { onConflict: 'setting_name' });
      
      if (error) throw error;
      
      toast({
        title: "Branding settings saved",
        description: "Your branding configuration has been saved successfully.",
      });
      
      nextTab('branding');
    } catch (error) {
      console.error('Error saving branding settings:', error);
      toast({
        title: "Error saving settings",
        description: "There was an error saving your branding settings.",
        variant: "destructive",
      });
    }
  };
  
  const handleCompleteSetup = async () => {
    try {
      // Mark setup as complete in Supabase
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_name: 'setup_complete',
          setting_value: { value: true } as unknown as Json
        }, { onConflict: 'setting_name' });
      
      if (error) throw error;
      
      toast({
        title: "Setup complete",
        description: "Your site is now configured. You will be redirected to login.",
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error completing setup:', error);
      toast({
        title: "Error",
        description: "There was an error completing the setup.",
        variant: "destructive",
      });
    }
  };
  
  if (setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Setup Already Complete</CardTitle>
            <CardDescription>
              This site has already been configured.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              For security reasons, the setup page is no longer accessible. 
              Please use the management backend to make changes.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/')}>
              Go to Homepage
            </Button>
            <Button onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Website Setup Wizard</CardTitle>
            <CardDescription>
              Configure your website and administrative settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="welcome">Welcome</TabsTrigger>
                <TabsTrigger value="discord">Discord</TabsTrigger>
                <TabsTrigger value="branding">Branding</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="complete">Complete</TabsTrigger>
              </TabsList>
              
              <TabsContent value="welcome" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-4">Welcome to the Setup Wizard</h2>
                  <p className="text-gray-600">
                    This wizard will guide you through the initial configuration of your website.
                    Once complete, this setup page will no longer be accessible for security reasons.
                  </p>
                </div>
                
                <Alert className="mb-6">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Important Note</AlertTitle>
                  <AlertDescription>
                    For this setup to work properly, you need to have created a Discord application and bot. 
                    You'll need your Discord bot token, client ID, client secret, and server (guild) ID.
                  </AlertDescription>
                </Alert>
                
                <Alert className={`mb-6 ${apiStatus === 'connected' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                  {apiStatus === 'connected' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <AlertTitle>API Connection Status</AlertTitle>
                  <AlertDescription>
                    {apiStatus === 'connected' ? (
                      "API connection successful. Your Discord bot configuration will be saved to the bot."
                    ) : (
                      "Unable to connect to the Discord bot API. Settings will only be saved locally."
                    )}
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-end">
                  <Button onClick={() => nextTab('welcome')}>
                    Begin Setup
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="discord" className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Discord Configuration</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="botToken">Discord Bot Token</Label>
                    <Input
                      id="botToken"
                      type="password"
                      placeholder="Enter your Discord bot token"
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      The bot token from your Discord Developer Portal.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientId">OAuth2 Client ID</Label>
                    <Input
                      id="clientId"
                      placeholder="Enter your Discord application client ID"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientSecret">OAuth2 Client Secret</Label>
                    <Input
                      id="clientSecret"
                      type="password"
                      placeholder="Enter your Discord application client secret"
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="guildId">Discord Server ID</Label>
                    <Input
                      id="guildId"
                      placeholder="Enter your Discord server (guild) ID"
                      value={guildId}
                      onChange={(e) => setGuildId(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      The ID of the Discord server where admin commands will be used.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminId">Admin Discord ID</Label>
                    <Input
                      id="adminId"
                      placeholder="Enter your Discord user ID"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Your Discord user ID, which will have admin access to the website.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="callbackUrl">OAuth2 Redirect URI</Label>
                    <Input
                      id="callbackUrl"
                      value={`${window.location.origin}/auth/discord/callback`}
                      readOnly
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">
                      Add this URL to your Discord application's OAuth2 redirect URLs.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveDiscordSettings} 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save and Continue'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="branding" className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Branding Configuration</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      placeholder="Enter the name of your site"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteTagline">Site Tagline</Label>
                    <Input
                      id="siteTagline"
                      placeholder="Enter a tagline for your site"
                      value={siteTagline}
                      onChange={(e) => setSiteTagline(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveBrandingSettings}>
                    Save and Continue
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="team" className="space-y-6">
                <h2 className="text-2xl font-bold mb-4">Team Configuration</h2>
                <p className="text-gray-600 mb-6">
                  Add your team members that will be displayed on the "Meet Our Team" page.
                </p>
                
                <TeamManagement />
                
                <div className="flex justify-end mt-8">
                  <Button onClick={() => nextTab('team')}>
                    Continue to Complete Setup
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="complete" className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Setup Complete!</h2>
                  <p className="text-gray-600">
                    Congratulations! Your website has been successfully configured. 
                    For security reasons, this setup page will no longer be accessible 
                    once you complete this process.
                  </p>
                </div>
                
                <Alert className="mb-6">
                  <Info className="h-4 w-4" />
                  <AlertTitle>What's Next?</AlertTitle>
                  <AlertDescription>
                    After completing setup, you'll be redirected to the login page. 
                    Use your Discord account to log in as an administrator. You can then 
                    access the management backend at {window.location.origin}/managementbackend.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-center">
                  <Button onClick={handleCompleteSetup}>
                    Complete Setup & Redirect to Login
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Setup;
