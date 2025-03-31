
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertCircle, Save, Upload, Globe, Github } from 'lucide-react';
import { toast } from "sonner";
import WebhookConfiguration from '@/components/admin/WebhookConfiguration';
import HowItWorks from '@/components/admin/HowItWorks';

// Local storage keys
const SETUP_COMPLETE_KEY = 'initial_setup_complete';
const BRAND_NAME_KEY = 'brand_name';
const WEBSITE_URL_KEY = 'website_url';
const LOGO_URL_KEY = 'logo_url';
const CLIENT_ID_KEY = 'discord_client_id';
const AUTHORIZED_USERS_KEY = 'discord_authorized_users';

const InitialSetup = () => {
  const [brandName, setBrandName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [clientId, setClientId] = useState('');
  const [authorizedUsers, setAuthorizedUsers] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  // Check if setup is already complete
  useEffect(() => {
    const isComplete = localStorage.getItem(SETUP_COMPLETE_KEY) === 'true';
    if (isComplete) {
      setSetupComplete(true);
    } else {
      // Load any existing values
      const savedBrandName = localStorage.getItem(BRAND_NAME_KEY);
      const savedWebsiteUrl = localStorage.getItem(WEBSITE_URL_KEY);
      const savedLogoUrl = localStorage.getItem(LOGO_URL_KEY);
      const savedClientId = localStorage.getItem(CLIENT_ID_KEY);
      const savedUsers = localStorage.getItem(AUTHORIZED_USERS_KEY);
      
      if (savedBrandName) setBrandName(savedBrandName);
      if (savedWebsiteUrl) setWebsiteUrl(savedWebsiteUrl);
      if (savedLogoUrl) setLogoUrl(savedLogoUrl);
      if (savedClientId) setClientId(savedClientId);
      if (savedUsers) setAuthorizedUsers(savedUsers);
    }
  }, []);

  const handleSave = () => {
    // Basic validation for each step
    if (currentStep === 1) {
      if (!brandName.trim()) {
        toast.error("Please enter your brand name");
        return;
      }
      if (!websiteUrl.trim()) {
        toast.error("Please enter your website URL");
        return;
      }
      // Logo is optional
      setCurrentStep(2);
      return;
    }
    
    if (currentStep === 2) {
      // Discord setup (optional but recommended)
      // Show confirmation dialog
      setShowConfirmDialog(true);
    }
  };
  
  const confirmSetup = () => {
    try {
      // Save all values to localStorage
      localStorage.setItem(BRAND_NAME_KEY, brandName);
      localStorage.setItem(WEBSITE_URL_KEY, websiteUrl);
      if (logoUrl) localStorage.setItem(LOGO_URL_KEY, logoUrl);
      
      // Discord settings (optional)
      if (clientId) localStorage.setItem(CLIENT_ID_KEY, clientId);
      if (authorizedUsers) localStorage.setItem(AUTHORIZED_USERS_KEY, authorizedUsers);
      
      // Mark setup as complete
      localStorage.setItem(SETUP_COMPLETE_KEY, 'true');
      setSetupComplete(true);
      setShowConfirmDialog(false);
      
      toast.success("Setup complete! This page will no longer be accessible.");
      
      // Redirect to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
      console.error("Save error:", error);
    }
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we'd upload this to a server and get back a URL
      // For this demo, we'll just create a local object URL
      const objectUrl = URL.createObjectURL(file);
      setLogoUrl(objectUrl);
      toast.success("Logo uploaded successfully");
    }
  };
  
  // If setup is already complete, redirect to home
  if (setupComplete) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Initial Setup</h1>
          <div className="text-sm text-gray-500">Step {currentStep} of 2</div>
        </div>
      </header>
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  Brand Configuration
                </CardTitle>
                <CardDescription>
                  Set up your brand information for the website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> This setup page will only be accessible once. After completing the setup, 
                      you'll need to clear your browser data or reinstall the application to access this page again.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input
                    id="brand-name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Your Organization Name"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter your organization or brand name to be displayed throughout the site.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="website-url">Website URL</Label>
                  <Input
                    id="website-url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourdomain.com"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter your website URL (e.g., https://example.com)
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="logo-upload">Logo (Optional)</Label>
                  <div className="flex items-center gap-4">
                    {logoUrl && (
                      <div className="h-20 w-20 rounded border overflow-hidden">
                        <img src={logoUrl} alt="Logo preview" className="h-full w-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Label 
                        htmlFor="logo-upload" 
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Logo
                      </Label>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload your organization logo. Recommended size: 200x200px.
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSave} className="w-full sm:w-auto">
                    Continue to Discord Setup
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {currentStep === 2 && (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Discord OAuth2 Setup
                  </CardTitle>
                  <CardDescription>
                    Configure Discord OAuth2 authentication for your application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="client-id">Discord Client ID</Label>
                    <Input
                      id="client-id"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="123456789012345678"
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter your Discord application's Client ID from the Discord Developer Portal.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="authorized-users">Authorized User IDs</Label>
                    <Textarea
                      id="authorized-users"
                      value={authorizedUsers}
                      onChange={(e) => setAuthorizedUsers(e.target.value)}
                      placeholder="123456789012345678
987654321098765432"
                      rows={5}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter Discord user IDs (one per line) that are authorized to access restricted areas.
                      Learn how to <a href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">find your Discord user ID</a>.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <WebhookConfiguration />
              <HowItWorks />
              
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button onClick={handleSave} className="btn-primary">
                  <Save className="mr-2 h-4 w-4" />
                  Complete Setup
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Setup</DialogTitle>
            <DialogDescription>
              Are you sure you want to complete the setup? This page will no longer be accessible
              after confirmation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button onClick={confirmSetup}>Confirm Setup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InitialSetup;
