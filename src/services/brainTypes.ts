
/**
 * Type definitions for TheBrain API
 * Documentation: https://api.bra.in
 */

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
