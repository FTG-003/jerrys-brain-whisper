
import React, { useState, useEffect, useRef } from 'react';
import JerrysBrainChat from '@/components/JerrysBrainChat';
import ApiStatusChecker from '@/components/ApiStatusChecker';
import ApiTest from '@/components/ApiTest';
import ApiKeyForm from '@/components/ApiKeyForm';
import ApiKeyExplorer from '@/components/ApiKeyExplorer';
import ApiDocumentation from '@/components/ApiDocumentation';
import { validateApiConfig } from '@/services/apiValidator';
import { Toaster } from '@/components/ui/toaster';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronDown, Settings, AlertCircle, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { BrainCog } from '@/components/Icons';

const Index: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [apiValid, setApiValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetupAlert, setShowSetupAlert] = useState(false);
  const [connectionNotified, setConnectionNotified] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const checkApiStatus = async () => {
      setIsLoading(true);
      try {
        const result = await validateApiConfig();
        setApiValid(result.isValid);
        setShowSetupAlert(!result.isValid);

        if (result.isValid && !connectionNotified && audioRef.current) {
          audioRef.current.play();
          setConnectionNotified(true);
          toast({
            title: "API Connected",
            description: "Successfully connected to TheBrain API"
          });
        }
      } catch (error) {
        console.error('Error checking API status:', error);
        setApiValid(false);
        setShowSetupAlert(true);
      } finally {
        setIsLoading(false);
      }
    };
    checkApiStatus();

    const intervalId = setInterval(checkApiStatus, 30000);
    return () => clearInterval(intervalId);
  }, [connectionNotified]);

  return (
    <div className="flex flex-col h-screen bg-brain-dark">
      <audio ref={audioRef} src="/sounds/connect-success.mp3" preload="auto" />

      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showSettings ? 'max-h-[80vh]' : 'max-h-0'}`}>
        <div className="p-4 lg:p-6 bg-brain-dark/90 border-b border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white"></h2>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(false)} className="bg-brain-dark/70 border-white/20 text-white hover:bg-brain-dark/90">
              <X className="h-4 w-4 mr-2" />
              Close Settings
            </Button>
          </div>
          
          <Accordion type="single" collapsible className="w-full" defaultValue="api-config">
            <AccordionItem value="api-config" className="border-white/10">
              <AccordionTrigger className="text-white hover:text-white/80 py-0 text-center text-xl">
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
      
      <div className="relative bg-brain-primary text-white py-3 px-6 flex items-center justify-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <BrainCog className="h-6 w-6 text-brain-light animate-pulse-slow" />
          <h1 className="text-xl font-semibold">Jerry's Brain Explorer</h1>
        </div>
        
        <div className="absolute left-4">
          <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)} className="bg-brain-dark/70 border-white/20 text-white hover:bg-brain-dark/90">
            <Settings className="h-4 w-4 mr-2" />
            {showSettings ? 'Hide Settings' : 'API Settings'}
          </Button>
        </div>
      </div>
      
      {!isLoading && <div className={`
          w-full 
          flex 
          items-center 
          justify-center 
          py-1
          transition-all
          duration-500
          ${apiValid ? 'bg-green-600/80 text-white animate-fade-in' : 'bg-red-500/80 text-white animate-pulse-slow'}
        `}>
          {apiValid ? <div className="flex items-center gap-2 transition-opacity duration-500">
              <CheckCircle className="h-4 w-4" />
              <span>API Connected</span>
            </div> : <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>API Not Connected</span>
            </div>}
        </div>}
      
      {showSetupAlert && !showSettings && <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-10 max-w-md w-full">
          <Alert className="bg-brain-dark/90 border border-white/20 text-white shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="flex justify-between items-center">
              <span>Setup Required</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white/70 hover:bg-white/10" onClick={() => setShowSetupAlert(false)}>
                <X className="h-3 w-3" />
              </Button>
            </AlertTitle>
            <AlertDescription>
              To get started, click the "API Settings" button and configure your TheBrain API access.
            </AlertDescription>
          </Alert>
        </div>}
      
      <div className="flex-1 overflow-hidden">
        <JerrysBrainChat />
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;
