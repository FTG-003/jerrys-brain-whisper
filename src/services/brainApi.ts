
import { ThoughtNode, ThoughtSearchResult } from './brainTypes';
import { BRAIN_ID, API_KEY, BASE_URL } from './brainApiConfig';

/**
 * Get the current API configuration
 * @returns The current API configuration
 */
function getApiConfig() {
  return {
    brainId: localStorage.getItem('brain_id') || BRAIN_ID,
    apiKey: localStorage.getItem('api_key') || API_KEY,
    baseUrl: localStorage.getItem('base_url') || BASE_URL,
  };
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
    
    const url = `${baseUrl}/brains/${brainId}/search?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;
    
    console.log('Request URL:', url);
    console.log('Request Headers:', {
      'Authorization': `TheBrain ${apiKey}`,
      'Content-Type': 'application/json',
    });

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
      throw new Error(`API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response Data:', data);

    return {
      thoughts: data.thoughts || [],
      hasMore: data.hasMore,
      nextOffset: data.nextOffset,
    };
  } catch (error) {
    console.error('Detailed Error in searchThoughts:', error);
    throw error;
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
    
    const url = `${baseUrl}/brains/${brainId}/thoughts/${thoughtId}/related`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `TheBrain ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.thoughts || [];
  } catch (error) {
    console.error('Error getting related thoughts:', error);
    throw error;
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
    
    const url = `${baseUrl}/brains/${brainId}/thoughts/${thoughtId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `TheBrain ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting thought:', error);
    throw error;
  }
}
