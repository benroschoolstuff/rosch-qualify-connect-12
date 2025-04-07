import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface BrandingSettings {
  siteName: string;
  siteTagline: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  footerText: string;
  contactEmail: string;
  socialLinks: {
    discord: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };
}

const defaultSettings: BrandingSettings = {
  siteName: 'ROSCH.UK',
  siteTagline: 'Roblox Education Training',
  logoUrl: '',
  primaryColor: '#1d4ed8',
  accentColor: '#60a5fa',
  footerText: '© ROSCH.UK. All rights reserved.',
  contactEmail: 'rob.hastingsroblox@outlook.com',
  socialLinks: {
    discord: '',
    twitter: '',
    facebook: '',
    instagram: '',
  },
};

// Type guard to check if an object is a valid BrandingSettings
function isBrandingSettings(obj: unknown): obj is BrandingSettings {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as any).siteName === 'string' &&
    typeof (obj as any).siteTagline === 'string' &&
    typeof (obj as any).primaryColor === 'string' &&
    typeof (obj as any).accentColor === 'string' &&
    typeof (obj as any).footerText === 'string' &&
    typeof (obj as any).contactEmail === 'string' &&
    typeof (obj as any).socialLinks === 'object' &&
    (obj as any).socialLinks !== null
  );
}

const BrandingSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<BrandingSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Load settings from Supabase
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('setting_name', 'branding')
          .maybeSingle();
        
        if (error) {
          console.error('Error loading branding settings:', error);
        } else if (data?.setting_value) {
          const settingValue = data.setting_value as unknown;
          if (isBrandingSettings(settingValue)) {
            setSettings(settingValue);
          } else {
            console.error('Invalid branding settings format:', settingValue);
          }
        }
      } catch (error) {
        console.error('Error loading branding settings:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested social links
    if (name.startsWith('social.')) {
      const socialPlatform = name.split('.')[1];
      setSettings({
        ...settings,
        socialLinks: {
          ...settings.socialLinks,
          [socialPlatform]: value,
        },
      });
    } else {
      setSettings({
        ...settings,
        [name]: value,
      });
    }
  };
  
  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Save settings to Supabase
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_name: 'branding',
          setting_value: settings as unknown as Json
        }, { onConflict: 'setting_name' });
      
      if (error) throw error;
      
      // Apply settings (in a real app, this would update CSS variables, etc.)
      document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
      document.documentElement.style.setProperty('--color-accent', settings.accentColor);
      
      toast({
        title: "Branding settings saved",
        description: "Your branding changes have been applied.",
      });
    } catch (error) {
      console.error('Error saving branding settings:', error);
      toast({
        title: "Error",
        description: "Failed to save branding settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetSettings = async () => {
    setSettings(defaultSettings);
    
    try {
      // Update Supabase with default settings
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_name: 'branding',
          setting_value: defaultSettings as unknown as Json
        }, { onConflict: 'setting_name' });
      
      if (error) throw error;
      
      toast({
        title: "Branding reset",
        description: "Branding settings have been reset to defaults.",
      });
    } catch (error) {
      console.error('Error resetting branding settings:', error);
      toast({
        title: "Error",
        description: "Failed to reset branding settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Tabs defaultValue="general">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="colors">Colors & Theme</TabsTrigger>
          <TabsTrigger value="contact">Contact & Social</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Identity</CardTitle>
              <CardDescription>
                Configure the basic information about your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  placeholder="Enter site name"
                  value={settings.siteName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteTagline">Tagline</Label>
                <Input
                  id="siteTagline"
                  name="siteTagline"
                  placeholder="Enter site tagline"
                  value={settings.siteTagline}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  name="logoUrl"
                  placeholder="Enter logo image URL"
                  value={settings.logoUrl}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Textarea
                  id="footerText"
                  name="footerText"
                  placeholder="Enter footer text"
                  value={settings.footerText}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Colors & Theme</CardTitle>
              <CardDescription>
                Customize your site's color scheme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-10 h-10 border rounded-md" 
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    type="color"
                    value={settings.primaryColor}
                    onChange={handleInputChange}
                    className="w-16"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={handleInputChange}
                    name="primaryColor"
                    placeholder="#HEX"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <div 
                    className="w-10 h-10 border rounded-md" 
                    style={{ backgroundColor: settings.accentColor }}
                  />
                  <Input
                    id="accentColor"
                    name="accentColor"
                    type="color"
                    value={settings.accentColor}
                    onChange={handleInputChange}
                    className="w-16"
                  />
                  <Input
                    value={settings.accentColor}
                    onChange={handleInputChange}
                    name="accentColor"
                    placeholder="#HEX"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Preview</h3>
                <div 
                  className="p-4 rounded-md border" 
                  style={{ backgroundColor: settings.primaryColor + '10' }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: settings.primaryColor }}
                    >
                      R
                    </div>
                    <div className="text-lg font-bold" style={{ color: settings.primaryColor }}>
                      {settings.siteName}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    <Button
                      style={{ 
                        backgroundColor: settings.primaryColor,
                        color: 'white',
                        borderColor: settings.primaryColor
                      }}
                    >
                      Primary Button
                    </Button>
                    
                    <Button
                      variant="outline"
                      style={{ 
                        borderColor: settings.primaryColor,
                        color: settings.primaryColor
                      }}
                    >
                      Secondary Button
                    </Button>
                  </div>
                  
                  <div 
                    className="p-3 rounded-md"
                    style={{ backgroundColor: settings.accentColor, color: 'white' }}
                  >
                    Accent color element
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Update your site's contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  placeholder="Enter contact email"
                  value={settings.contactEmail}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Configure your social media links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="socialDiscord">Discord</Label>
                <Input
                  id="socialDiscord"
                  name="social.discord"
                  placeholder="Enter Discord server invite URL"
                  value={settings.socialLinks.discord}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="socialTwitter">Twitter/X</Label>
                <Input
                  id="socialTwitter"
                  name="social.twitter"
                  placeholder="Enter Twitter/X profile URL"
                  value={settings.socialLinks.twitter}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="socialFacebook">Facebook</Label>
                <Input
                  id="socialFacebook"
                  name="social.facebook"
                  placeholder="Enter Facebook page URL"
                  value={settings.socialLinks.facebook}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="socialInstagram">Instagram</Label>
                <Input
                  id="socialInstagram"
                  name="social.instagram"
                  placeholder="Enter Instagram profile URL"
                  value={settings.socialLinks.instagram}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={handleResetSettings}
          disabled={isLoading}
        >
          Reset to Defaults
        </Button>
        
        <Button 
          onClick={handleSaveSettings} 
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Branding Settings'}
        </Button>
      </div>
    </div>
  );
};

export default BrandingSettings;
