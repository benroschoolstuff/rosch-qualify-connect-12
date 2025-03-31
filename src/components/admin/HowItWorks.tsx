
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HowItWorks = () => {
  return (
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
  );
};

export default HowItWorks;
