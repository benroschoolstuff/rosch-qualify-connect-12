
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Database } from 'lucide-react';

const MaintenanceMode: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Maintenance Mode</CardTitle>
          <CardDescription>
            System temporarily unavailable
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <div className="mb-4 flex items-center justify-center text-sm text-muted-foreground">
            <Database className="mr-2 h-4 w-4" />
            <span>Database connection error</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            We're experiencing technical difficulties with our database connection.
            Our team has been notified and is working to resolve the issue.
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate('/managementbackend')} variant="outline" className="mr-2">
            Go to Admin
          </Button>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MaintenanceMode;
