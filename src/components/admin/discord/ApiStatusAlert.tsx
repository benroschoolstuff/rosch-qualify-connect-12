
import React from 'react';

interface ApiStatusAlertProps {
  apiStatus: 'loading' | 'connected' | 'error';
}

const ApiStatusAlert: React.FC<ApiStatusAlertProps> = ({ apiStatus }) => {
  if (apiStatus === 'loading') return null;
  
  return (
    <>
      {apiStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">API Connection Error:</strong>
          <span className="block sm:inline"> Unable to connect to the Discord bot API. Configurations will only be saved to the database.</span>
        </div>
      )}
    </>
  );
};

export default ApiStatusAlert;
