
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface OAuthConfigCardProps {
  clientId: string;
  setClientId: (value: string) => void;
  clientSecret: string;
  setClientSecret: (value: string) => void;
  isLoading: boolean;
  onSave: () => void;
}

const OAuthConfigCard: React.FC<OAuthConfigCardProps> = ({
  clientId,
  setClientId,
  clientSecret,
  setClientSecret,
  isLoading,
  onSave
}) => {
  return (
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
          onClick={onSave} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Saving...' : 'Save Discord Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OAuthConfigCard;
