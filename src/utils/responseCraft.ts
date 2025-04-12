import { ThoughtNode } from '@/services/brainTypes';

// Friendly introductions for chat responses
const INTROS = [
  "Ah, I see you're curious about",
  "Interesting question about",
  "Let me search Jerry's thoughts on",
  "Hmm, let's explore what Jerry thinks about",
  "In Jerry's Brain, I've found some thoughts on",
  "Jerry has been thinking about",
  "Looking through Jerry's neural pathways for",
  "Diving into Jerry's thought connections on",
];

// Transition phrases for related thoughts
const TRANSITIONS = [
  "This connects to other thoughts like",
  "This thought links to",
  "Jerry has connected this with",
  "This branches out to ideas such as",
  "This is intertwined with concepts like",
  "In Jerry's mind, this relates to",
  "The neural pathways extend to",
  "This thought has tendrils reaching to",
];

// Encouraging phrases when no results are found
const NO_RESULTS = [
  "I don't see any specific thoughts on this yet, but Jerry's Brain is always growing!",
  "Hmm, this might be unexplored territory in Jerry's Brain. Want to try another term?",
  "This doesn't appear in Jerry's thought network yet. Shall we explore something else?",
  "I couldn't find this exact topic in Jerry's Brain. Would you like to try a related term?",
];

// Phrases for when a specific thought is explored
const THOUGHT_EXPLORATIONS = [
  "Let's dive deeper into",
  "Exploring the thought:",
  "Examining Jerry's thinking on",
  "Looking more closely at",
  "Focusing on this specific thought:",
];

/**
 * Generates a friendly welcome message
 */
export function generateWelcomeMessage(): string {
  return "Hello! I'm your guide to Jerry Michalski's Brain - a vast network of interconnected thoughts and ideas. What concept would you like to explore today?";
}

/**
 * Generates a response for when no results are found
 * @param query The search query
 */
export function generateNoResultsMessage(query: string): string {
  const randomNoResult = NO_RESULTS[Math.floor(Math.random() * NO_RESULTS.length)];
  return `${randomNoResult} You searched for "${query}".`;
}

/**
 * Generates a response for search results
 * @param query The search query
 * @param thoughts Found thoughts
 */
export function generateSearchResponse(query: string, thoughts: ThoughtNode[]): string {
  if (!thoughts.length) {
    return generateNoResultsMessage(query);
  }
  
  const randomIntro = INTROS[Math.floor(Math.random() * INTROS.length)];
  const randomTransition = TRANSITIONS[Math.floor(Math.random() * TRANSITIONS.length)];
  
  // Format a list of up to 3 related thoughts
  const relatedThoughtNames = thoughts
    .slice(0, 3)
    .map(t => `"${t.name}"`)
    .join(", ");
  
  const moreText = thoughts.length > 3 ? ` and ${thoughts.length - 3} more connections` : "";
  
  return `${randomIntro} "${query}"! ${randomTransition} ${relatedThoughtNames}${moreText}. Click on any thought to explore deeper!`;
}

/**
 * Generates a response for exploring a specific thought
 * @param thought The main thought being explored
 * @param relatedThoughts Related thoughts
 */
export function generateThoughtExplorationResponse(
  thought: ThoughtNode,
  relatedThoughts: ThoughtNode[]
): string {
  const randomExploration = THOUGHT_EXPLORATIONS[
    Math.floor(Math.random() * THOUGHT_EXPLORATIONS.length)
  ];
  
  const randomTransition = TRANSITIONS[Math.floor(Math.random() * TRANSITIONS.length)];
  
  let response = `${randomExploration} "${thought.name}". `;
  
  if (relatedThoughts.length) {
    const relatedThoughtNames = relatedThoughts
      .slice(0, 3)
      .map(t => `"${t.name}"`)
      .join(", ");
    
    const moreText = relatedThoughts.length > 3 ? ` and ${relatedThoughts.length - 3} more connections` : "";
    
    response += `${randomTransition} ${relatedThoughtNames}${moreText}.`;
  } else {
    response += "This thought stands on its own in Jerry's Brain.";
  }
  
  return response;
}

/**
 * Generates a message for when an error occurs
 */
export function generateErrorMessage(): string {
  return "Oops! I had a bit of a neural misfire. Could we try again?";
}
