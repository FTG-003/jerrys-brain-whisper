
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { searchThoughts } from '@/services/brainApi';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { ThoughtNode } from '@/services/brainTypes';

const ApiTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    success: boolean;
    message: string;
    data?: ThoughtNode[];
  } | null>(null);

  const runApiTest = async () => {
    setIsLoading(true);
    setTestResults(null);
    
    try {
      // Run a simple search with a common term that should return results
      const searchResult = await searchThoughts('AI', 5, 0);
      
      setTestResults({
        success: true,
        message: `API test successful! Found ${searchResult.thoughts.length} thoughts.`,
        data: searchResult.thoughts
      });
      
    } catch (error) {
      console.error('API Test Error:', error);
      setTestResults({
        success: false,
        message: `API test failed: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-lg border border-white/10 bg-brain-dark/50 backdrop-blur-md">
      <h2 className="text-xl font-medium text-white mb-4">TheBrain API Test</h2>
      
      <div className="mb-4">
        <Button 
          onClick={runApiTest} 
          disabled={isLoading}
          className="bg-brain-secondary hover:bg-brain-secondary/80 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing API...
            </>
          ) : 'Run API Test'}
        </Button>
      </div>
      
      {testResults && (
        <div className={`mt-4 p-4 rounded-md ${testResults.success ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          <div className="flex items-center mb-2">
            {testResults.success ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <span className="text-white font-medium">{testResults.message}</span>
          </div>
          
          {testResults.success && testResults.data && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-white/80 mb-2">Sample Results:</h3>
              <div className="bg-brain-dark/70 p-3 rounded-md border border-white/10 max-h-60 overflow-y-auto">
                <ul className="space-y-2">
                  {testResults.data.map(thought => (
                    <li key={thought.id} className="text-white/90 text-sm">
                      {thought.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiTest;
