
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  const { user, logout } = useAuth();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Access Denied</h2>
            <p className="mt-2 text-sm text-gray-600">
              {user ? (
                <>
                  Sorry, <span className="font-semibold">{user.username}</span>, you are not authorized to access this application.
                </>
              ) : (
                'You are not authorized to access this application.'
              )}
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <Button 
              onClick={logout}
              className="w-full flex items-center justify-center py-4 bg-red-600 hover:bg-red-700"
            >
              Logout
            </Button>
            <Link to="/">
              <Button 
                variant="outline"
                className="w-full flex items-center justify-center py-4"
              >
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Unauthorized;
