
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Hero from '@/components/shared/Hero';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Save, Settings, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { saveWebhookUrl, getWebhookUrl, sendToDiscord } from '@/utils/webhookUtils';

const AdminSettings = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);

  useEffect(() => {
    // Load saved webhook URL from localStorage on component mount
    const savedUrl = getWebhookUrl();
    if (savedUrl) {
      setWebhookUrl(savedUrl);
    }
  }, []);

  const handleSaveWebhook = () => {
    // Basic validation
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }
    
    // Check if it's a valid Discord webhook URL
    if (!webhookUrl.startsWith('https://discord.com/api/webhooks/') && 
        !webhookUrl.startsWith('https://discordapp.com/api/webhooks/')) {
      toast({
        title: "Warning",
        description: "This doesn't appear to be a Discord webhook URL",
        variant: "destructive",
      });
      // Still allow saving but show warning
    }

    // Save to localStorage
    saveWebhookUrl(webhookUrl);
    
    toast({
      title: "Success",
      description: "Webhook URL has been saved",
    });
  };
  
  const handleTestWebhook = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Prepare test data
      const testData = {
        name: "Test User",
        email: "test@example.com",
        message: "This is a test message from the ROSCH admin panel"
      };
      
      // Send test message
      const success = await sendToDiscord(testData, 'contact');
      
      if (success) {
        setTestResult({
          success: true,
          message: "Test message sent successfully! Check your Discord channel."
        });
      } else {
        setTestResult({
          success: false,
          message: "Failed to send test message. Please check the webhook URL and try again."
        });
      }
    } catch (error) {
      console.error("Error in test:", error);
      setTestResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <MainLayout>
      <Hero 
        title="Admin Settings" 
        subtitle="Configure system settings and integrations" 
      />
      
      <section className="section-container py-10">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Discord Webhook Configuration
              </CardTitle>
              <CardDescription>
                Connect form submissions to your Discord server for instant notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Discord Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    type="text"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Paste your Discord webhook URL here. All form submissions will be sent to this webhook.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button onClick={handleSaveWebhook} className="btn-primary">
                    <Save className="mr-2 h-4 w-4" />
                    Save Configuration
                  </Button>
                  <Button 
                    onClick={handleTestWebhook} 
                    variant="outline" 
                    disabled={isTesting || !webhookUrl}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isTesting ? 'Sending...' : 'Test Webhook'}
                  </Button>
                </div>
                
                {testResult && (
                  <Alert variant={testResult.success ? "default" : "destructive"} className="mt-4">
                    {testResult.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    <AlertTitle>
                      {testResult.success ? 'Test Successful' : 'Test Failed'}
                    </AlertTitle>
                    <AlertDescription>
                      {testResult.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Setting up a Discord webhook</h3>
                  <ol className="list-decimal list-inside space-y-2 mt-2">
                    <li>Open Discord and go to the server where you want to receive notifications</li>
                    <li>Go to Server Settings &gt; Integrations &gt; Webhooks</li>
                    <li>Click "New Webhook", give it a name like "ROSCH Form Notifications"</li>
                    <li>Choose which channel the webhook will post to</li>
                    <li>Click "Copy Webhook URL" and paste it in the field above</li>
                    <li>Save the configuration and test the webhook</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">What gets sent to Discord?</h3>
                  <p className="mt-2">
                    When someone submits a contact form or training application form, all the form details will
                    be sent as a formatted message to your Discord channel. This gives you immediate notifications
                    for new inquiries without having to check your email.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
};

export default AdminSettings;
