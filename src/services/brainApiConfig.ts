
/**
 * TheBrain API Configuration
 * 
 * This file contains the default API configuration values.
 * Users can override these values through the UI, which will save to localStorage.
 * 
 * Documentation: https://api.bra.in/index.html
 */

// Default Brain ID - Replace with your actual Brain ID for production
export const BRAIN_ID = '3d80058c-14d8-5361-0b61-a061f89baf87';

// Default API Key - Replace with your actual API Key for production
export const API_KEY = 'c9893844370bcc3d6d07f52864b178233c1429689e2ecadc14857ac759ff03c3';

// Default Base URL - The standard API endpoint for TheBrain
export const BASE_URL = 'https://api.bra.in/v2';

/**
 * Check if the default configuration is being used or if the user has set custom values
 * @returns True if using custom configuration, False if using defaults
 */
export function isUsingCustomConfig(): boolean {
  return (
    localStorage.getItem('brain_id') !== null || 
    localStorage.getItem('api_key') !== null || 
    localStorage.getItem('base_url') !== null
  );
}

/**
 * Reset API configuration to defaults
 */
export function resetApiConfig(): void {
  localStorage.removeItem('brain_id');
  localStorage.removeItem('api_key');
  localStorage.removeItem('base_url');
}

/**
 * Get the current API configuration
 */
export function getCurrentApiConfig() {
  return {
    brainId: localStorage.getItem('brain_id') || BRAIN_ID,
    apiKey: localStorage.getItem('api_key') || API_KEY,
    baseUrl: localStorage.getItem('base_url') || BASE_URL,
    isCustom: isUsingCustomConfig()
  };
}
