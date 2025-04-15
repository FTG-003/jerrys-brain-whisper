
import React from 'react';
import JerrysBrainChat from '@/components/JerrysBrainChat';
import ApiStatusChecker from '@/components/ApiStatusChecker';
import ApiTest from '@/components/ApiTest';
import ApiKeyForm from '@/components/ApiKeyForm';
import ApiKeyExplorer from '@/components/ApiKeyExplorer';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-brain-dark">
      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-1 gap-4 mb-4">
          <ApiKeyForm />
          <ApiKeyExplorer />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ApiStatusChecker />
            <ApiTest />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <JerrysBrainChat />
      </div>
    </div>
  );
};

export default Index;
