
import React from 'react';

interface ApiStatusAlertProps {
  apiStatus: 'loading' | 'connected' | 'error' | 'unknown';
}

const ApiStatusAlert: React.FC<ApiStatusAlertProps> = ({ apiStatus }) => {
  // Always show connected status since we're removing the bot
  return (
    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong className="font-bold">Discord Settings:</strong>
      <span className="block sm:inline"> These settings are used for Discord OAuth authentication only. The Discord bot has been removed.</span>
    </div>
  );
};

export default ApiStatusAlert;
