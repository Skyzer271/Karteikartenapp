// Core Types
export interface Card {
  id: string;
  front: string;
  back: string;
  hint?: string;
  deckId: string;
  createdAt: number;
  lastReviewed: number | null;
  nextReview: number;
  interval: number; // days
  easeFactor: number;
  repetitions: number;
  isPaused: boolean;
  pausedUntil?: number;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface StudySession {
  deckId: string;
  cardsStudied: number;
  correctAnswers: number;
  startTime: number;
  endTime?: number;
}

export interface LearningIntervals {
  again: number;      // Tage nach "Nochmal" (1-7)
  hard: number;       // Tage für "Schwer" (0-7)
  good: number;       // Tage für "Gut" (4-14)
  easy: number;       // Tage für "Einfach" (7-28)
}

export interface Settings {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  autoRecognition: boolean;
  showHintButton: boolean;
  shuffleMode: boolean;
  randomSide: boolean;
  intervals: LearningIntervals;
}

export interface Statistics {
  totalDecks: number;
  totalCards: number;
  cardsToReview: number;
  cardsMastered: number;
  streakDays: number;
  lastStudyDate: number | null;
}

export type Difficulty = 'again' | 'hard' | 'good' | 'easy';

export interface DeckWithStats extends Deck {
  totalCards: number;
  dueCards: number;
  newCards: number;
}
