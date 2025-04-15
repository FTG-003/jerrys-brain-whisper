
import { BRAIN_ID, API_KEY, BASE_URL } from './brainApiConfig';

/**
 * Validates the TheBrain API configuration by making a test request
 * @returns Promise resolving to validation result
 */
export async function validateApiConfig(): Promise<{
  isValid: boolean;
  message: string;
  details?: any;
}> {
  try {
    // Get values from localStorage if available, otherwise use defaults
    const brainId = localStorage.getItem('brain_id') || BRAIN_ID;
    const apiKey = localStorage.getItem('api_key') || API_KEY;
    const baseUrl = localStorage.getItem('base_url') || BASE_URL;
    
    console.log('Validating API configuration');
    console.log('Brain ID:', brainId);
    console.log('API Base URL:', baseUrl);
    
    // Test with a simple query that should return results if the config is valid
    const url = `${baseUrl}/brains/${brainId}/search?query=test&limit=1`;
    
    console.log('Validation request URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `TheBrain ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Validation response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Validation Error:', errorText);
      
      return {
        isValid: false,
        message: `API validation failed: ${response.statusText}`,
        details: errorText
      };
    }
    
    const data = await response.json();
    console.log('API Validation Response:', data);
    
    return {
      isValid: true,
      message: 'API configuration validated successfully',
      details: data
    };
  } catch (error) {
    console.error('API Validation Error:', error);
    return {
      isValid: false,
      message: `Error validating API: ${error instanceof Error ? error.message : String(error)}`,
      details: error
    };
  }
}
