
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink, KeyRound, Eye, EyeOff } from 'lucide-react';
import { validateApiConfig } from '@/services/apiValidator';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const ApiKeyExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ key: string; description: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isKeyVisible, setIsKeyVisible] = useState(false);

  // This is a mock function. In a real implementation, you would search for keys in a database or API
  const searchForKeys = async (query: string) => {
    setIsSearching(true);
    try {
      // Simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock results - in a real app, these would come from an API
      const mockResults = [
        { 
          key: 'c9893844370bcc3d6d07f52864b178233c1429689e2ecadc14857ac759ff03c3', 
          description: 'Demo API Key for TheBrain v2 (Read-only)' 
        },
        { 
          key: 'demo_key_123456789', 
          description: 'Sample Demo Key with limited access' 
        }
      ].filter(item => 
        item.key.includes(query) || 
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching for API keys:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for API keys",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchForKeys(searchQuery);
    }
  };

  const handleSelectKey = async (key: string) => {
    try {
      // Save to localStorage
      localStorage.setItem('api_key', key);
      
      // Test the key
      const validationResult = await validateApiConfig();
      
      if (validationResult.isValid) {
        toast({
          title: "API Key Set",
          description: "Key has been applied and validated successfully",
        });
      } else {
        toast({
          title: "API Key Applied",
          description: "Key was set but validation failed. Check connection status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error setting API key:', error);
      toast({
        title: "Error",
        description: "Failed to set API key",
        variant: "destructive",
      });
    }
  };

  const toggleKeyVisibility = () => {
    setIsKeyVisible(!isKeyVisible);
  };

  const formatKey = (key: string) => {
    if (isKeyVisible) {
      return key;
    }
    // Show only first 6 and last 4 characters
    return `${key.substring(0, 6)}...${key.substring(key.length - 4)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <a 
          href="https://api.bra.in/index.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-brain-secondary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          <span>TheBrain API Documentation</span>
        </a>
      </div>
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for API keys (e.g., demo, read-only)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-brain-dark/30 border-white/20 text-white"
        />
        <Button 
          type="submit" 
          disabled={isSearching}
          className="bg-brain-secondary hover:bg-brain-secondary/80 text-white"
        >
          {isSearching ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-1" />
              Search
            </>
          )}
        </Button>
      </form>
      
      {searchResults.length > 0 && (
        <div className="bg-brain-dark/70 rounded-md border border-white/10 overflow-hidden">
          <ul className="divide-y divide-white/10">
            {searchResults.map((result, index) => (
              <li key={index} className="p-3 hover:bg-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-mono text-sm text-white/80 truncate flex-1">
                        {formatKey(result.key)}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={toggleKeyVisibility}
                        className="text-white/60 hover:text-white"
                      >
                        {isKeyVisible ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="text-xs text-white/60">{result.description}</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSelectKey(result.key)}
                    className="bg-brain-secondary hover:bg-brain-secondary/80 text-white whitespace-nowrap"
                  >
                    <KeyRound className="h-4 w-4 mr-1" />
                    Use This Key
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="text-center p-4 text-white/60">
          No API keys found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
};

export default ApiKeyExplorer;
