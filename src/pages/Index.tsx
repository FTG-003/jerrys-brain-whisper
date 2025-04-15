
import React, { useState, useEffect } from 'react';
import JerrysBrainChat from '@/components/JerrysBrainChat';
import ApiStatusChecker from '@/components/ApiStatusChecker';
import ApiTest from '@/components/ApiTest';
import ApiKeyForm from '@/components/ApiKeyForm';
import ApiKeyExplorer from '@/components/ApiKeyExplorer';
import ApiDocumentation from '@/components/ApiDocumentation';
import { validateApiConfig } from '@/services/apiValidator';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { ChevronDown, Settings, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Index: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [apiValid, setApiValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetupAlert, setShowSetupAlert] = useState(false);

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      setIsLoading(true);
      try {
        const result = await validateApiConfig();
        setApiValid(result.isValid);
        setShowSetupAlert(!result.isValid);
      } catch (error) {
        console.error('Error checking API status:', error);
        setApiValid(false);
        setShowSetupAlert(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkApiStatus();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-brain-dark">
      {/* API Settings Panel - Collapsible */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showSettings ? 'max-h-[80vh]' : 'max-h-0'}`}>
        <div className="p-4 lg:p-6 bg-brain-dark/90 border-b border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">API Configuration</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(false)}
              className="bg-brain-dark/70 border-white/20 text-white hover:bg-brain-dark/90"
            >
              <X className="h-4 w-4 mr-2" />
              Close Settings
            </Button>
          </div>
          
          <Accordion type="single" collapsible className="w-full" defaultValue="api-config">
            <AccordionItem value="api-config" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white/80">
                API Configuration
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <ApiKeyForm />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ApiStatusChecker />
                    <ApiTest />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="api-docs" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white/80">
                API Documentation
              </AccordionTrigger>
              <AccordionContent>
                <ApiDocumentation />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="api-explorer" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white/80">
                API Key Explorer
              </AccordionTrigger>
              <AccordionContent>
                <ApiKeyExplorer />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      {/* Settings Toggle Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="bg-brain-dark/70 border-white/20 text-white hover:bg-brain-dark/90"
        >
          <Settings className="h-4 w-4 mr-2" />
          {showSettings ? 'Hide Settings' : 'API Settings'}
        </Button>
      </div>
      
      {/* API Status Indicator - Centered in Header */}
      {!isLoading && !apiValid && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center gap-2 bg-red-500/80 text-white px-3 py-1 rounded-md text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>API Not Connected</span>
        </div>
      )}
      
      {/* First-time Setup Alert - Only show if settings are not open */}
      {showSetupAlert && !showSettings && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-10 max-w-md w-full">
          <Alert className="bg-brain-dark/90 border border-white/20 text-white shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="flex justify-between items-center">
              <span>Setup Required</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-white/70 hover:bg-white/10"
                onClick={() => setShowSetupAlert(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </AlertTitle>
            <AlertDescription>
              To get started, click the "API Settings" button in the top left and configure your TheBrain API access.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Brain Chat Interface - Takes Full Screen */}
      <div className="flex-1 overflow-hidden">
        <JerrysBrainChat />
      </div>
    </div>
  );
};

export default Index;
