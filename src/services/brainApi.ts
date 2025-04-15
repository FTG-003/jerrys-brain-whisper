
import { ThoughtNode, ThoughtSearchResult } from './brainTypes';
import { BRAIN_ID, API_KEY, BASE_URL } from './brainApiConfig';
import { toast } from '@/hooks/use-toast';

/**
 * Get the current API configuration
 * @returns The current API configuration
 */
function getApiConfig() {
  const brainId = localStorage.getItem('brain_id') || BRAIN_ID;
  const apiKey = localStorage.getItem('api_key') || API_KEY;
  const baseUrl = localStorage.getItem('base_url') || BASE_URL;
  
  // Validate config
  if (!brainId || !apiKey || !baseUrl) {
    console.warn('Incomplete API configuration');
  }
  
  return { brainId, apiKey, baseUrl };
}

/**
 * Handle API errors in a consistent way
 */
function handleApiError(error: any, fallbackMessage: string): never {
  console.error('API Error:', error);
  
  let errorMessage = fallbackMessage;
  
  if (error instanceof Response) {
    errorMessage = `API error: ${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  toast({
    title: "API Error",
    description: errorMessage,
    variant: "destructive"
  });
  
  throw new Error(errorMessage);
}

/**
 * Search for thoughts in Jerry's Brain
 * @param query The search query
 * @param limit Max number of results (default: 10)
 * @param offset Offset for pagination (default: 0)
 * @returns Promise resolving to search results
 */
export async function searchThoughts(
  query: string,
  limit: number = 10,
  offset: number = 0
): Promise<ThoughtSearchResult> {
  try {
    console.log('Searching thoughts with params:', { query, limit, offset });
    
    const { brainId, apiKey, baseUrl } = getApiConfig();
    
    if (!brainId || !apiKey || !baseUrl) {
      toast({
        title: "Missing API Configuration",
        description: "Please configure your API settings in the API Settings panel.",
        variant: "destructive"
      });
      return { thoughts: [], hasMore: false, nextOffset: 0 };
    }
    
    const url = `${baseUrl}/brains/${brainId}/search?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;
    
    console.log('Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `TheBrain ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      if (response.status === 404) {
        toast({
          title: "API Endpoint Not Found",
          description: "Please check your Brain ID and Base URL.",
          variant: "destructive"
        });
      } else if (response.status === 401) {
        toast({
          title: "Authentication Failed",
          description: "Please check your API Key.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "API Request Failed",
          description: `${response.status}: ${response.statusText}`,
          variant: "destructive"
        });
      }
      
      return { thoughts: [], hasMore: false, nextOffset: 0 };
    }

    const data = await response.json();
    console.log('API Response Data:', data);

    return {
      thoughts: data.thoughts || [],
      hasMore: data.hasMore || false,
      nextOffset: data.nextOffset || 0,
    };
  } catch (error) {
    console.error('Detailed Error in searchThoughts:', error);
    
    toast({
      title: "Search Failed",
      description: error instanceof Error ? error.message : "An unexpected error occurred",
      variant: "destructive"
    });
    
    return { thoughts: [], hasMore: false, nextOffset: 0 };
  }
}

/**
 * Get related thoughts for a specific thought
 * @param thoughtId The ID of the thought to get related thoughts for
 * @returns Promise resolving to an array of related thoughts
 */
export async function getRelatedThoughts(thoughtId: string): Promise<ThoughtNode[]> {
  try {
    const { brainId, apiKey, baseUrl } = getApiConfig();
    
    if (!brainId || !apiKey || !baseUrl) {
      toast({
        title: "Missing API Configuration",
        description: "Please configure your API settings in the API Settings panel.",
        variant: "destructive"
      });
      return [];
    }
    
    const url = `${baseUrl}/brains/${brainId}/thoughts/${thoughtId}/related`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `TheBrain ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      toast({
        title: "Failed to Get Related Thoughts",
        description: `${response.status}: ${response.statusText}`,
        variant: "destructive"
      });
      return [];
    }

    const data = await response.json();
    return data.thoughts || [];
  } catch (error) {
    console.error('Error getting related thoughts:', error);
    toast({
      title: "Error Getting Related Thoughts",
      description: error instanceof Error ? error.message : "An unexpected error occurred",
      variant: "destructive"
    });
    return [];
  }
}

/**
 * Get a specific thought by ID
 * @param thoughtId The ID of the thought to get
 * @returns Promise resolving to the thought
 */
export async function getThought(thoughtId: string): Promise<ThoughtNode> {
  try {
    const { brainId, apiKey, baseUrl } = getApiConfig();
    
    if (!brainId || !apiKey || !baseUrl) {
      toast({
        title: "Missing API Configuration",
        description: "Please configure your API settings in the API Settings panel.",
        variant: "destructive"
      });
      throw new Error("Missing API configuration");
    }
    
    const url = `${baseUrl}/brains/${brainId}/thoughts/${thoughtId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `TheBrain ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      toast({
        title: "Failed to Get Thought",
        description: `${response.status}: ${response.statusText}`,
        variant: "destructive"
      });
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting thought:', error);
    toast({
      title: "Error Getting Thought",
      description: error instanceof Error ? error.message : "An unexpected error occurred",
      variant: "destructive"
    });
    throw error;
  }
}
