import type { WordEntry } from './data';
import Fuse from 'fuse.js';

export interface SearchResult {
  item: WordEntry;
  score?: number;
  matches?: readonly Fuse.FuseResultMatch[];
}

/**
 * Create a search index for the given words
 */
export function createSearchIndex(words: WordEntry[]): Fuse<WordEntry> {
  return new Fuse(words, {
    keys: [
      { name: 'chinese', weight: 2 },
      { name: 'pinyin', weight: 1.5 },
      { name: 'meaning', weight: 1 },
    ],
    threshold: 0.3,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 1,
  });
}

/**
 * Search for words
 */
export function searchWords(
  fuse: Fuse<WordEntry>,
  query: string
): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const results = fuse.search(query);
  
  return results.map(result => ({
    item: result.item,
    score: result.score,
    matches: result.matches,
  }));
}

/**
 * Get search suggestions (for autocomplete)
 */
export function getSearchSuggestions(
  words: WordEntry[],
  query: string,
  limit: number = 5
): WordEntry[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  
  // Simple prefix matching for fast suggestions
  return words
    .filter(word => 
      word.chinese.toLowerCase().includes(lowerQuery) ||
      word.pinyin.toLowerCase().includes(lowerQuery) ||
      word.meaning.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit);
}
