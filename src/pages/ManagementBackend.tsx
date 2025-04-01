
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import WaitingList from '@/components/admin/WaitingList';
import DiscordSettings from '@/components/admin/DiscordSettings';
import BrandingSettings from '@/components/admin/BrandingSettings';
import BulkEmail from '@/components/admin/BulkEmail';
import TeamManagement from '@/components/admin/TeamManagement';
import FAQManagement from '@/components/admin/FAQManagement';
import { useAuth } from '@/hooks/use-auth';

const ManagementBackend = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Management Backend</h1>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
          
          <Tabs defaultValue="waiting-list" className="bg-white rounded-md shadow">
            <div className="p-4 border-b">
              <TabsList className="grid grid-cols-6 gap-4">
                <TabsTrigger value="waiting-list" className="text-sm">Waiting List</TabsTrigger>
                <TabsTrigger value="bulk-email" className="text-sm">Email Campaign</TabsTrigger>
                <TabsTrigger value="team" className="text-sm">Team Management</TabsTrigger>
                <TabsTrigger value="faq" className="text-sm">FAQ Management</TabsTrigger>
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
              
              <TabsContent value="team" className="mt-0">
                <TeamManagement />
              </TabsContent>
              
              <TabsContent value="faq" className="mt-0">
                <FAQManagement />
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

export default ManagementBackend;
