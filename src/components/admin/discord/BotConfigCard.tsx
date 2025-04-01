
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BotConfigCardProps {
  botToken: string;
  setBotToken: (value: string) => void;
  guildId: string;
  setGuildId: (value: string) => void;
}

const BotConfigCard: React.FC<BotConfigCardProps> = ({ 
  botToken, 
  setBotToken, 
  guildId, 
  setGuildId 
}) => {
  return (
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
  );
};

export default BotConfigCard;
