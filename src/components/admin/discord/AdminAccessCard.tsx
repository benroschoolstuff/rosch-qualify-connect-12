
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface AdminAccessCardProps {
  allowedAdmins: string[];
  onAddAdmin: (adminId: string) => void;
  onRemoveAdmin: (adminId: string) => void;
}

const AdminAccessCard: React.FC<AdminAccessCardProps> = ({
  allowedAdmins,
  onAddAdmin,
  onRemoveAdmin
}) => {
  const [newAdminId, setNewAdminId] = useState('');

  const handleAddAdmin = () => {
    if (newAdminId.trim()) {
      onAddAdmin(newAdminId);
      setNewAdminId('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Access</CardTitle>
        <CardDescription>
          Manage which Discord users can access the admin panel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Discord User ID"
              value={newAdminId}
              onChange={(e) => setNewAdminId(e.target.value)}
            />
            <Button onClick={handleAddAdmin}>Add Admin</Button>
          </div>
          
          <div className="space-y-2">
            <Label>Authorized Admin Users</Label>
            {allowedAdmins.length === 0 ? (
              <div className="text-center p-4 border rounded-md bg-gray-50">
                <p className="text-gray-500">No admin users configured yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {allowedAdmins.map(adminId => (
                  <div key={adminId} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="font-mono text-sm">{adminId}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRemoveAdmin(adminId)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Only these Discord users will be able to access the admin panel.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminAccessCard;
