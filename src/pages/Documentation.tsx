
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  BrainCog, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  MessageCircle, 
  Sparkles 
} from 'lucide-react';

const Documentation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brain-primary to-brain-dark text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button 
              variant="outline" 
              size="sm"
              className="border-white/20 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center mb-8">
          <BrainCog className="h-10 w-10 text-brain-secondary mr-3" />
          <h1 className="text-3xl font-bold">Jerry's Brain Whisper</h1>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-brain-light">Introduction</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Jerry's Brain Whisper is an interactive application that allows you to explore Jerry's "Brain" - 
              a vast network of interconnected thoughts and concepts. This application uses TheBrain API to 
              visualize these connections and employs an AI assistant to guide your exploration.
            </p>
            <p className="text-white/80 leading-relaxed">
              Whether you're curious about specific topics, looking for connections between ideas, or simply 
              wanting to browse through Jerry's knowledge network, this application provides an intuitive 
              interface for your journey.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-brain-light">Getting Started</h2>
            <div className="space-y-6">
              <div className="bg-brain-dark/40 border border-white/10 rounded-lg p-6">
                <h3 className="flex items-center text-xl font-medium mb-3">
                  <Search className="h-5 w-5 mr-2 text-brain-secondary" />
                  Step 1: Configure API Access
                </h3>
                <p className="text-white/80 mb-4">
                  Before you can start exploring, you need to configure your API access:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-white/80">
                  <li>Click the "API Settings" button in the top-right corner</li>
                  <li>Enter your Brain ID, API Key, and ensure the Base URL is set to <code className="bg-black/30 px-1 py-0.5 rounded">https://api.bra.in/v2</code></li>
                  <li>Click "Save Configuration" and then "Test Connection" to verify</li>
                </ol>
              </div>
              
              <div className="bg-brain-dark/40 border border-white/10 rounded-lg p-6">
                <h3 className="flex items-center text-xl font-medium mb-3">
                  <Search className="h-5 w-5 mr-2 text-brain-secondary" />
                  Step 2: Search for Concepts
                </h3>
                <p className="text-white/80">
                  Use the search bar at the bottom of the screen to look for concepts within Jerry's Brain. 
                  Enter keywords like "trust", "AI", or "capitalism" and press Enter or click the search button.
                </p>
              </div>
              
              <div className="bg-brain-dark/40 border border-white/10 rounded-lg p-6">
                <h3 className="flex items-center text-xl font-medium mb-3">
                  <MessageCircle className="h-5 w-5 mr-2 text-brain-secondary" />
                  Step 3: Explore Connections
                </h3>
                <p className="text-white/80">
                  After searching, you'll see a visual graph of thoughts and their connections. Click on any node 
                  to explore that thought further and see its related concepts.
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-brain-light">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-brain-dark/40 border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3">Interactive Visualization</h3>
                <p className="text-white/80">
                  The central visualization shows thoughts as nodes and relationships as connections. Use the zoom 
                  controls <ZoomIn className="inline h-4 w-4 mx-1" /> <ZoomOut className="inline h-4 w-4 mx-1" /> 
                  to adjust your view.
                </p>
              </div>
              
              <div className="bg-brain-dark/40 border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3">Chat Panel</h3>
                <p className="text-white/80">
                  The right sidebar shows your search history and the system's responses. Toggle it with the "Hide Chat" 
                  button to focus on the visualization.
                </p>
              </div>
              
              <div className="bg-brain-dark/40 border border-white/10 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3">Related Thoughts</h3>
                <p className="text-white/80">
                  The bottom of the chat panel displays related thoughts to your current exploration, allowing quick 
                  navigation to connected concepts.
                </p>
              </div>
              
              <div className="bg-brain-dark/40 border border-white/10 rounded-lg p-6">
                <h3 className="flex items-center text-xl font-medium mb-3">
                  <Sparkles className="h-5 w-5 mr-2 text-brain-secondary" />
                  AI Assistant
                </h3>
                <p className="text-white/80">
                  The AI assistant provides context-aware guidance, reflections on your current thought, and suggests paths 
                  to explore. It appears in the bottom-right corner of the screen.
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-brain-light">Troubleshooting</h2>
            <div className="bg-brain-dark/40 border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3">Common Issues</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-1">API Connection Failed</h4>
                  <p className="text-white/80">
                    Ensure your Brain ID and API Key are correct. The Base URL should be <code className="bg-black/30 px-1 py-0.5 rounded">https://api.bra.in/v2</code> 
                    (not the documentation URL).
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-1">No Search Results</h4>
                  <p className="text-white/80">
                    Try different search terms or check if the Brain ID is connected to the right brain.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-1">Visualization Not Loading</h4>
                  <p className="text-white/80">
                    Refresh the page and ensure your API connection is successful before searching.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="pb-12">
            <h2 className="text-2xl font-semibold mb-4 text-brain-light">About</h2>
            <p className="text-white/80 leading-relaxed">
              Jerry's Brain Whisper was developed to provide an intuitive interface for exploring TheBrain's API 
              and visualizing the connections between thoughts in Jerry's Brain. The application combines modern 
              web technologies with AI guidance to create an engaging exploration experience.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
