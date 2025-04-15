
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Loader2, Save, RefreshCw, RotateCcw, AlertCircle } from 'lucide-react';
import { BRAIN_ID, API_KEY, BASE_URL, resetApiConfig, isUsingCustomConfig } from '@/services/brainApiConfig';
import { toast } from '@/hooks/use-toast';
import { validateApiConfig } from '@/services/apiValidator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ApiFormValues {
  brainId: string;
  apiKey: string;
  baseUrl: string;
}

const ApiKeyForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isCustomConfig, setIsCustomConfig] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const form = useForm<ApiFormValues>({
    defaultValues: {
      brainId: BRAIN_ID,
      apiKey: API_KEY,
      baseUrl: BASE_URL,
    },
  });

  // This useEffect ensures we're always showing the current values
  useEffect(() => {
    // Get the current values from localStorage or default to the imports
    const storedBrainId = localStorage.getItem('brain_id') || BRAIN_ID;
    const storedApiKey = localStorage.getItem('api_key') || API_KEY;
    const storedBaseUrl = localStorage.getItem('base_url') || BASE_URL;
    const customConfig = isUsingCustomConfig();
    
    setIsCustomConfig(customConfig);
    
    form.reset({
      brainId: storedBrainId,
      apiKey: storedApiKey,
      baseUrl: storedBaseUrl,
    });
  }, [form]);

  const onSubmit = async (values: ApiFormValues) => {
    setIsSubmitting(true);
    setValidationError(null);
    
    try {
      // Validate values before saving
      if (!values.brainId.trim()) {
        setValidationError("Brain ID is required");
        setIsSubmitting(false);
        return;
      }
      
      if (!values.apiKey.trim()) {
        setValidationError("API Key is required");
        setIsSubmitting(false);
        return;
      }
      
      if (!values.baseUrl.trim()) {
        setValidationError("Base URL is required");
        setIsSubmitting(false);
        return;
      }
      
      // Ensure the base URL has the correct format
      let baseUrl = values.baseUrl.trim();
      if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = 'https://' + baseUrl;
      }
      
      // Remove trailing slash if present
      if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
      }
      
      // Save to localStorage
      localStorage.setItem('brain_id', values.brainId.trim());
      localStorage.setItem('api_key', values.apiKey.trim());
      localStorage.setItem('base_url', baseUrl);
      
      form.setValue('baseUrl', baseUrl);
      setIsCustomConfig(true);
      
      toast({
        title: "API Configuration Saved",
        description: "Your TheBrain API configuration has been saved.",
      });
      
      // Trigger validation
      await validateApiAfterSave();
      
    } catch (error) {
      console.error('Error saving API config:', error);
      toast({
        title: "Error Saving Configuration",
        description: "There was a problem saving your API configuration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const validateApiAfterSave = async () => {
    setIsValidating(true);
    setValidationError(null);
    
    try {
      const result = await validateApiConfig();
      if (result.isValid) {
        toast({
          title: "API Connection Valid",
          description: "Successfully connected to TheBrain API with your configuration.",
        });
      } else {
        setValidationError(result.message);
        toast({
          title: "API Connection Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error validating API:', error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred during validation";
      setValidationError(errorMessage);
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleReset = () => {
    resetApiConfig();
    setIsCustomConfig(false);
    setValidationError(null);
    
    form.reset({
      brainId: BRAIN_ID,
      apiKey: API_KEY,
      baseUrl: BASE_URL,
    });
    
    toast({
      title: "Configuration Reset",
      description: "API configuration has been reset to defaults.",
    });
  };

  return (
    <div className="p-6 rounded-lg border border-white/10 bg-brain-dark/50 backdrop-blur-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-white">TheBrain API Configuration</h2>
        {isCustomConfig && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="text-white/70 hover:text-white hover:bg-brain-dark/50"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset to Default
          </Button>
        )}
      </div>
      
      {validationError && (
        <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-white mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {validationError}
          </AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="brainId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Brain ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your Brain ID" 
                    className="bg-brain-dark/30 border-white/20 text-white"
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">API Key</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your API Key" 
                    className="bg-brain-dark/30 border-white/20 text-white"
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="baseUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Base URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="API Base URL" 
                    className="bg-brain-dark/30 border-white/20 text-white"
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="text-white/60">
                  Default: https://api.bra.in/v2 (not the documentation URL)
                </FormDescription>
              </FormItem>
            )}
          />
          
          <div className="flex gap-2 pt-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-brain-secondary hover:bg-brain-secondary/80 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={validateApiAfterSave}
              disabled={isValidating}
              className="border-white/20 hover:bg-white/10"
            >
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Test Connection
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ApiKeyForm;
