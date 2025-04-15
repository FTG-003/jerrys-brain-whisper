
import React, { useEffect, useState } from 'react';
import { validateApiConfig } from '@/services/apiValidator';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getCurrentApiConfig } from '@/services/brainApiConfig';

const ApiStatusChecker: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [message, setMessage] = useState<string>('');
  const [details, setDetails] = useState<any>(null);
  const [configInfo, setConfigInfo] = useState({
    brainId: '',
    baseUrl: '',
    isCustom: false
  });

  const checkApiStatus = async () => {
    setStatus('checking');
    setMessage('Checking API configuration...');
    
    try {
      // Get current config info for display
      const config = getCurrentApiConfig();
      setConfigInfo({
        brainId: config.brainId,
        baseUrl: config.baseUrl,
        isCustom: config.isCustom
      });
      
      const result = await validateApiConfig();
      
      if (result.isValid) {
        setStatus('valid');
        toast({
          title: "API Connection Successful",
          description: "Your TheBrain API is now connected.",
        });
      } else {
        setStatus('invalid');
        toast({
          title: "API Connection Failed",
          description: result.message,
          variant: "destructive"
        });
      }
      
      setMessage(result.message);
      setDetails(result.details);
    } catch (error) {
      setStatus('invalid');
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessage(`Error checking API status: ${errorMessage}`);
      
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };
  
  // Auto-check on component mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  return (
    <div className="p-4 rounded-lg border border-white/10 bg-brain-dark/50 backdrop-blur-md">
      <h2 className="text-lg font-medium text-white mb-2">TheBrain API Status</h2>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          {status === 'checking' && (
            <div className="flex items-center text-brain-light">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Checking API connection...</span>
            </div>
          )}
          
          {status === 'valid' && (
            <div className="flex items-center text-green-500">
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>API connection valid</span>
            </div>
          )}
          
          {status === 'invalid' && (
            <div className="flex items-center text-red-500">
              <XCircle className="mr-2 h-4 w-4" />
              <span>API connection invalid</span>
            </div>
          )}
        </div>
        
        <Button 
          onClick={checkApiStatus} 
          size="sm"
          variant="outline"
          className="border-white/20 hover:bg-white/10"
          disabled={status === 'checking'}
        >
          {status === 'checking' ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Checking...
            </>
          ) : 'Recheck'}
        </Button>
      </div>
      
      <div className="mb-4 text-sm space-y-1">
        <div className="text-white/70">
          <span className="font-medium">Brain ID:</span> {configInfo.brainId}
        </div>
        <div className="text-white/70">
          <span className="font-medium">Base URL:</span> {configInfo.baseUrl}
        </div>
        <div className="text-white/70">
          <span className="font-medium">Config Type:</span> {configInfo.isCustom ? 'Custom' : 'Default'}
        </div>
      </div>
      
      {message && (
        <div className="mb-2 text-sm text-white/80">
          <div className="font-medium mb-1">Status Message:</div>
          {message}
        </div>
      )}
      
      {status === 'invalid' && details && (
        <div className="mt-4">
          <div className="flex items-center mb-1">
            <AlertCircle className="h-4 w-4 text-amber-400 mr-1" />
            <div className="text-sm font-medium text-white/80">Error Details:</div>
          </div>
          <div className="text-xs p-2 rounded bg-brain-dark/90 border border-white/5 overflow-auto max-h-40">
            <pre>{JSON.stringify(details, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiStatusChecker;
