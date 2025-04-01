
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import WaitingList from '@/components/admin/WaitingList';
import DiscordSettings from '@/components/admin/DiscordSettings';
import BrandingSettings from '@/components/admin/BrandingSettings';
import BulkEmail from '@/components/admin/BulkEmail';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      navigate('/login');
      return;
    }
    
    setIsAuthenticated(true);
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
          
          <Tabs defaultValue="waiting-list" className="bg-white rounded-md shadow">
            <div className="p-4 border-b">
              <TabsList className="grid grid-cols-4 gap-4">
                <TabsTrigger value="waiting-list" className="text-sm">Waiting List</TabsTrigger>
                <TabsTrigger value="bulk-email" className="text-sm">Email Campaign</TabsTrigger>
                <TabsTrigger value="discord" className="text-sm">Discord Settings</TabsTrigger>
                <TabsTrigger value="branding" className="text-sm">Branding</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="waiting-list" className="mt-0">
                <WaitingList />
              </TabsContent>
              
              <TabsContent value="bulk-email" className="mt-0">
                <BulkEmail />
              </TabsContent>
              
              <TabsContent value="discord" className="mt-0">
                <DiscordSettings />
              </TabsContent>
              
              <TabsContent value="branding" className="mt-0">
                <BrandingSettings />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
