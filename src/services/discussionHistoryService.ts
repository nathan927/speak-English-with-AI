// Discussion History Service - Save and review past discussion transcripts
import { logger } from './logService';

export interface DiscussionScore {
  overall: number; // 0-100
  speakingTime: number; // seconds
  turnCount: number;
  contentQuality: number; // 0-100
  vocabularyRichness: number; // 0-100
  feedback: string[];
}

export interface SavedDiscussion {
  id: string;
  date: string;
  grade: string;
  topic: string;
  userName?: string;
  groupmates: {
    supporter: { name: string; gender: string };
    opposer: { name: string; gender: string };
  };
  messages: {
    speaker: string;
    speakerName?: string;
    text: string;
    timestamp: string;
  }[];
  score: DiscussionScore;
  durationSeconds: number;
}

const STORAGE_KEY = 'discussion_history';
const MAX_SAVED_DISCUSSIONS = 20;

// Save a discussion to localStorage
export function saveDiscussion(discussion: Omit<SavedDiscussion, 'id'>): string {
  try {
    const history = getDiscussionHistory();
    const id = `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const savedDiscussion: SavedDiscussion = {
      ...discussion,
      id
    };
    
    history.unshift(savedDiscussion);
    
    // Keep only the last MAX_SAVED_DISCUSSIONS
    if (history.length > MAX_SAVED_DISCUSSIONS) {
      history.splice(MAX_SAVED_DISCUSSIONS);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    logger.info('Discussion saved', { id, topic: discussion.topic.substring(0, 30) });
    
    return id;
  } catch (error) {
    logger.error('Failed to save discussion', { error });
    return '';
  }
}

// Get all saved discussions
export function getDiscussionHistory(): SavedDiscussion[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    logger.error('Failed to load discussion history', { error });
    return [];
  }
}

// Get a single discussion by ID
export function getDiscussionById(id: string): SavedDiscussion | null {
  const history = getDiscussionHistory();
  return history.find(d => d.id === id) || null;
}

// Delete a discussion
export function deleteDiscussion(id: string): boolean {
  try {
    const history = getDiscussionHistory();
    const newHistory = history.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    logger.info('Discussion deleted', { id });
    return true;
  } catch (error) {
    logger.error('Failed to delete discussion', { error });
    return false;
  }
}

// Clear all history
export function clearDiscussionHistory(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    logger.info('Discussion history cleared');
    return true;
  } catch (error) {
    logger.error('Failed to clear discussion history', { error });
    return false;
  }
}

// Calculate discussion score
export function calculateDiscussionScore(
  messages: { speaker: string; text: string }[],
  durationSeconds: number,
  turnCount: number
): DiscussionScore {
  const userMessages = messages.filter(m => m.speaker === 'user');
  const userText = userMessages.map(m => m.text).join(' ');
  
  // Speaking time estimation (roughly 150 words per minute)
  const wordCount = userText.split(/\s+/).filter(w => w.length > 0).length;
  const estimatedSpeakingTime = Math.round((wordCount / 150) * 60);
  
  // Vocabulary richness - count unique longer words
  const words = userText.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const uniqueWords = new Set(words);
  const vocabularyRichness = Math.min(100, Math.round((uniqueWords.size / Math.max(words.length, 1)) * 150));
  
  // Content quality indicators
  const qualityIndicators = {
    hasExamples: /for example|for instance|such as|like when/i.test(userText),
    hasReasons: /because|therefore|since|as a result/i.test(userText),
    hasOpinion: /i think|i believe|in my opinion|i feel/i.test(userText),
    hasAgreement: /i agree|that's a good point|you're right/i.test(userText),
    hasDisagreement: /however|but|on the other hand|i disagree/i.test(userText),
    hasConclusion: /in conclusion|to sum up|overall|finally/i.test(userText),
    goodLength: wordCount > 50
  };
  
  const qualityScore = Object.values(qualityIndicators).filter(Boolean).length;
  const contentQuality = Math.round((qualityScore / 7) * 100);
  
  // Overall score
  const overall = Math.round(
    (contentQuality * 0.4) + 
    (vocabularyRichness * 0.3) + 
    (Math.min(turnCount * 15, 45)) + // up to 45 points for turns
    (estimatedSpeakingTime > 30 ? 10 : estimatedSpeakingTime > 15 ? 5 : 0) // time bonus
  );
  
  // Generate feedback
  const feedback: string[] = [];
  
  if (contentQuality >= 70) {
    feedback.push('Excellent use of examples and reasoning! 🌟');
  } else if (contentQuality >= 40) {
    feedback.push('Good effort! Try to include more examples and reasons.');
  } else {
    feedback.push('Remember to support your points with examples and clear reasoning.');
  }
  
  if (vocabularyRichness >= 60) {
    feedback.push('Great vocabulary variety! 📚');
  } else {
    feedback.push('Try to use more varied vocabulary in your responses.');
  }
  
  if (turnCount >= 3) {
    feedback.push('Well done for participating actively in the discussion! 💬');
  } else {
    feedback.push('Try to speak more in the discussion to practice fluency.');
  }
  
  if (qualityIndicators.hasExamples) {
    feedback.push('Good job using examples to support your points! 👍');
  }
  
  if (qualityIndicators.hasAgreement || qualityIndicators.hasDisagreement) {
    feedback.push('Nice interaction with your groupmates\' ideas! 🤝');
  }
  
  return {
    overall: Math.min(100, overall),
    speakingTime: estimatedSpeakingTime,
    turnCount,
    contentQuality,
    vocabularyRichness,
    feedback
  };
}
