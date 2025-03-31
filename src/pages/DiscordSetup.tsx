
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertCircle, Save, User } from 'lucide-react';
import { toast } from "sonner";

// Local storage keys
const SETUP_COMPLETE_KEY = 'discord_setup_complete';
const CLIENT_ID_KEY = 'discord_client_id';
const AUTHORIZED_USERS_KEY = 'discord_authorized_users';

const DiscordSetup = () => {
  const [clientId, setClientId] = useState('');
  const [authorizedUsers, setAuthorizedUsers] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const navigate = useNavigate();

  // Check if setup is already complete
  useEffect(() => {
    const isComplete = localStorage.getItem(SETUP_COMPLETE_KEY) === 'true';
    if (isComplete) {
      setSetupComplete(true);
    } else {
      // Load any existing values
      const savedClientId = localStorage.getItem(CLIENT_ID_KEY);
      const savedUsers = localStorage.getItem(AUTHORIZED_USERS_KEY);
      
      if (savedClientId) setClientId(savedClientId);
      if (savedUsers) setAuthorizedUsers(savedUsers);
    }
  }, []);

  const handleSave = () => {
    // Basic validation
    if (!clientId.trim()) {
      toast.error("Please enter a Discord Client ID");
      return;
    }
    
    if (!authorizedUsers.trim()) {
      toast.error("Please enter at least one authorized user ID");
      return;
    }
    
    // Show confirmation dialog
    setShowConfirmDialog(true);
  };
  
  const confirmSetup = () => {
    try {
      // Save values to localStorage
      localStorage.setItem(CLIENT_ID_KEY, clientId);
      localStorage.setItem(AUTHORIZED_USERS_KEY, authorizedUsers);
      localStorage.setItem(SETUP_COMPLETE_KEY, 'true');
      
      // Mark setup as complete
      setSetupComplete(true);
      setShowConfirmDialog(false);
      
      toast.success("Discord setup complete! This page will no longer be accessible.");
      
      // Redirect to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
      console.error("Save error:", error);
    }
  };
  
  // If setup is already complete, redirect to home
  if (setupComplete) {
    return <Navigate to="/" />;
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Discord OAuth2 Setup
            </CardTitle>
            <CardDescription>
              Configure Discord OAuth2 authentication for your application. This page will self-destruct after setup.
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
            
            <div className="pt-4">
              <Button onClick={handleSave} className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save and Complete Setup
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">1. Create a Discord Application</h3>
              <ol className="list-decimal list-inside space-y-2 mt-2 ml-4">
                <li>Go to the <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Discord Developer Portal</a></li>
                <li>Click "New Application" and give it a name</li>
                <li>Go to the "OAuth2" section in the left sidebar</li>
                <li>Add a redirect URL: <code className="bg-gray-100 px-2 py-1 rounded">{window.location.origin}/auth/discord/callback</code></li>
                <li>Copy your Client ID from the OAuth2 page and paste it above</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">2. Add Authorized Users</h3>
              <p className="mt-2 ml-4">
                Enter the Discord user IDs of people who should have access to the admin area.
                Only these users will be able to access protected routes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Discord Setup</DialogTitle>
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
    </MainLayout>
  );
};

export default DiscordSetup;
