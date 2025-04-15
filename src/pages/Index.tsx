
import React, { useState, useEffect } from 'react';
import JerrysBrainChat from '@/components/JerrysBrainChat';
import ApiStatusChecker from '@/components/ApiStatusChecker';
import ApiTest from '@/components/ApiTest';
import ApiKeyForm from '@/components/ApiKeyForm';
import ApiKeyExplorer from '@/components/ApiKeyExplorer';
import { validateApiConfig } from '@/services/apiValidator';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { ChevronDown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [apiValid, setApiValid] = useState(false);

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const result = await validateApiConfig();
        setApiValid(result.isValid);
      } catch (error) {
        console.error('Error checking API status:', error);
        setApiValid(false);
      }
    };
    
    checkApiStatus();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-brain-dark">
      {/* API Settings Panel - Collapsible */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showSettings ? 'max-h-[80vh]' : 'max-h-0'}`}>
        <div className="p-4 lg:p-6 bg-brain-dark/90 border-b border-white/10">
          <Accordion type="single" collapsible className="w-full">
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
      <div className="absolute top-4 right-4 z-10">
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
      
      {/* API Status Indicator */}
      {!apiValid && !showSettings && (
        <div className="absolute top-4 left-4 z-10 bg-red-500/80 text-white px-3 py-1 rounded-md text-sm animate-pulse">
          API Not Connected
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
