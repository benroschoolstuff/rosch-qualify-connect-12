
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  imageSrc: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, bio, imageSrc }) => {
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
      <CardContent>
        <p className="text-gray-700">{bio}</p>
      </CardContent>
    </Card>
  );
};

export default TeamMember;
