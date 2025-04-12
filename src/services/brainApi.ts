
// TheBrain API service
// Documentation: https://api.bra.in

export interface ThoughtNode {
  id: string;
  name: string;
  typeId?: number;
  label?: string;
}

export interface ThoughtSearchResult {
  thoughts: ThoughtNode[];
  hasMore?: boolean;
  nextOffset?: number;
}

const BRAIN_ID = '3d80058c-14d8-5361-0b61-a061f89baf87';
const API_KEY = 'c9893844370bcc3d6d07f52864b178233c1429689e2ecadc14857ac759ff03c3';
const BASE_URL = 'https://api.bra.in/v2';

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
    const url = `${BASE_URL}/brains/${BRAIN_ID}/search?query=${encodeURIComponent(
      query
    )}&limit=${limit}&offset=${offset}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `TheBrain ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      thoughts: data.thoughts || [],
      hasMore: data.hasMore,
      nextOffset: data.nextOffset,
    };
  } catch (error) {
    console.error('Error searching thoughts:', error);
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
    const url = `${BASE_URL}/brains/${BRAIN_ID}/thoughts/${thoughtId}/related`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `TheBrain ${API_KEY}`,
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
    const url = `${BASE_URL}/brains/${BRAIN_ID}/thoughts/${thoughtId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `TheBrain ${API_KEY}`,
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
