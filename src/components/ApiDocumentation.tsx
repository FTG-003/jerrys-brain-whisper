
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ExternalLink } from 'lucide-react';

const ApiDocumentation: React.FC = () => {
  return (
    <div className="p-4 rounded-lg border border-white/10 bg-brain-dark/50 backdrop-blur-md">
      <h2 className="text-xl font-medium text-white mb-4">TheBrain API Documentation</h2>
      
      <div className="space-y-4">
        <Alert className="bg-brain-dark/70 border-white/10 text-white">
          <AlertTitle>Getting Started</AlertTitle>
          <AlertDescription>
            To connect to Jerry's Brain using TheBrain API, you need three key pieces of information:
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>A Brain ID</li>
              <li>An API Key</li>
              <li>The API Base URL</li>
            </ul>
          </AlertDescription>
        </Alert>
        
        <div className="bg-brain-dark/70 p-4 rounded-lg border border-white/10">
          <h3 className="text-md font-medium text-white mb-2">How to Get API Access</h3>
          <ol className="space-y-3 list-decimal pl-5 text-white/90">
            <li>
              Visit <a href="https://api.bra.in/index.html" target="_blank" rel="noopener noreferrer" className="text-brain-secondary hover:underline inline-flex items-center">
                api.bra.in/index.html <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </li>
            <li>Sign up for an API account or log in to your existing account</li>
            <li>Navigate to your account settings to find your API key</li>
            <li>Create or access a brain to get its Brain ID</li>
            <li>The base URL is typically <code className="bg-black/30 px-1 py-0.5 rounded">https://api.bra.in/v2</code></li>
          </ol>
        </div>
        
        <div className="bg-brain-dark/70 p-4 rounded-lg border border-white/10">
          <h3 className="text-md font-medium text-white mb-2">Setting Up in This App</h3>
          <p className="text-white/90 mb-3">
            Once you have your credentials, click the "API Settings" button at the top of the page and enter your information in the API Configuration form.
          </p>
          <p className="text-white/90">
            After saving, use the Test Connection button to verify your connection is working properly.
          </p>
        </div>
        
        <Alert className="bg-brain-dark/70 border-brain-secondary/50 text-white">
          <AlertTitle>Need Help?</AlertTitle>
          <AlertDescription>
            For more detailed information, please refer to
            <a href="https://docs.thebrain.com/api/" target="_blank" rel="noopener noreferrer" className="ml-1 text-brain-secondary hover:underline inline-flex items-center">
              TheBrain API Documentation <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default ApiDocumentation;
