export interface SensoryDraft {
  text: string;
  genre: string;
  sense: string;
  timestamp: string;
  analysis?: {
    radar_scores: {
      sight: number;
      sound: number;
      touch: number;
      taste: number;
      smell: number;
    };
    feedback: string;
  };
}

const STORAGE_KEY = 'sensory-scribe-drafts';
const MAX_DRAFTS = 10;

// Check if localStorage is available (browser environment)
const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Get all drafts from localStorage
export const getDrafts = (): SensoryDraft[] => {
  if (!isLocalStorageAvailable()) return [];
  
  try {
    const drafts = localStorage.getItem(STORAGE_KEY);
    return drafts ? JSON.parse(drafts) : [];
  } catch (error) {
    console.error('Error loading drafts:', error);
    return [];
  }
};

// Save a new draft
export const saveDraft = (draft: Omit<SensoryDraft, 'timestamp'>): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const drafts = getDrafts();
    const newDraft: SensoryDraft = {
      ...draft,
      timestamp: new Date().toISOString(),
    };
    
    // Add to beginning of array
    drafts.unshift(newDraft);
    
    // Keep only the most recent drafts
    const trimmedDrafts = drafts.slice(0, MAX_DRAFTS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedDrafts));
    return true;
  } catch (error) {
    console.error('Error saving draft:', error);
    return false;
  }
};

// Get the most recent draft
export const getLatestDraft = (): SensoryDraft | null => {
  const drafts = getDrafts();
  return drafts.length > 0 ? drafts[0] : null;
};

// Delete a specific draft by timestamp
export const deleteDraft = (timestamp: string): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const drafts = getDrafts();
    const filteredDrafts = drafts.filter(draft => draft.timestamp !== timestamp);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDrafts));
    return true;
  } catch (error) {
    console.error('Error deleting draft:', error);
    return false;
  }
};

// Clear all drafts
export const clearAllDrafts = (): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing drafts:', error);
    return false;
  }
};

// Get formatted date for display
export const formatDraftDate = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString();
  } catch {
    return 'Unknown date';
  }
};

// Usage limit functionality
const USAGE_STORAGE_KEY = 'sensory-scribe-usage';
const MAX_USAGE_PER_SESSION = 3;

// Get current usage count
export const getUsageCount = (): number => {
  if (!isLocalStorageAvailable()) return 0;
  
  try {
    const usage = localStorage.getItem(USAGE_STORAGE_KEY);
    return usage ? parseInt(usage, 10) : 0;
  } catch (error) {
    console.error('Error reading usage count:', error);
    return 0;
  }
};

// Check if user can still use the app
export const canUseApp = (): boolean => {
  const currentUsage = getUsageCount();
  return currentUsage < MAX_USAGE_PER_SESSION;
};

// Increment usage counter
export const incrementUsage = (): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    const currentUsage = getUsageCount();
    const newUsage = currentUsage + 1;
    localStorage.setItem(USAGE_STORAGE_KEY, newUsage.toString());
    return true;
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return false;
  }
};

// Get remaining analyses count
export const getRemainingAnalyses = (): number => {
  const currentUsage = getUsageCount();
  return Math.max(0, MAX_USAGE_PER_SESSION - currentUsage);
};

// Reset usage count (for testing or new sessions)
export const resetUsageCount = (): boolean => {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.removeItem(USAGE_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error resetting usage count:', error);
    return false;
  }
};