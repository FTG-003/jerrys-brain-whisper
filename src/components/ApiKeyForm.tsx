
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Loader2, Save, RefreshCw } from 'lucide-react';
import { BRAIN_ID, API_KEY, BASE_URL } from '@/services/brainApiConfig';
import { toast } from '@/hooks/use-toast';
import { validateApiConfig } from '@/services/apiValidator';

interface ApiFormValues {
  brainId: string;
  apiKey: string;
  baseUrl: string;
}

const ApiKeyForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  
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
    
    form.reset({
      brainId: storedBrainId,
      apiKey: storedApiKey,
      baseUrl: storedBaseUrl,
    });
  }, [form]);

  const onSubmit = async (values: ApiFormValues) => {
    setIsSubmitting(true);
    try {
      // Save to localStorage
      localStorage.setItem('brain_id', values.brainId);
      localStorage.setItem('api_key', values.apiKey);
      localStorage.setItem('base_url', values.baseUrl);
      
      toast({
        title: "API Configuration Saved",
        description: "Your TheBrain API configuration has been saved. Please reload the page or check API status.",
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
    try {
      const result = await validateApiConfig();
      if (result.isValid) {
        toast({
          title: "API Connection Valid",
          description: "Successfully connected to TheBrain API with your configuration.",
        });
      } else {
        toast({
          title: "API Connection Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error validating API:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="p-6 rounded-lg border border-white/10 bg-brain-dark/50 backdrop-blur-md">
      <h2 className="text-xl font-medium text-white mb-4">TheBrain API Configuration</h2>
      
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
