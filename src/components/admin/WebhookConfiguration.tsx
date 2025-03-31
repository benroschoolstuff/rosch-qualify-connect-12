
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Save, Send, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { saveWebhookUrl, getWebhookUrl, sendToDiscord } from '@/utils/webhookUtils';

const WebhookConfiguration = () => {
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
            <label htmlFor="webhook-url" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Discord Webhook URL</label>
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
  );
};

export default WebhookConfiguration;
