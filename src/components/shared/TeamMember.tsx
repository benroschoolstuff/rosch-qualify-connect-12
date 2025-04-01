
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  imageSrc: string;
  email?: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, bio, imageSrc, email }) => {
  return (
    <Card className="overflow-hidden card-hover">
      <div className="aspect-square overflow-hidden">
        <img 
          src={imageSrc} 
          alt={`${name} - ${role}`} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700">{bio}</p>
        {email && (
          <a 
            href={`mailto:${email}`} 
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <Mail className="h-4 w-4 mr-2" />
            {email}
          </a>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamMember;
