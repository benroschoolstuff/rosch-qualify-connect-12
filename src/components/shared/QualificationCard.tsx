
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export interface QualificationProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  forWho: string[];
}

const QualificationCard: React.FC<QualificationProps> = ({ 
  id, 
  title, 
  description, 
  duration, 
  level,
  forWho
}) => {
  return (
    <Card className="h-full card-hover border-t-4 border-t-rosch-DEFAULT">
      <CardHeader>
        <CardTitle className="text-rosch-DEFAULT">{title}</CardTitle>
        <CardDescription>{forWho.join(', ')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-semibold">Duration:</span> {duration}
          </div>
          <div>
            <span className="font-semibold">Level:</span> {level}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full btn-primary">
          <Link to={`/qualification/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QualificationCard;
