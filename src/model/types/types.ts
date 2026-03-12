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
  again: number;      // Tage nach "Nochmal"
  hard: number;       // Multiplikator für "Schwer"
  good: number;       // Multiplikator für "Gut"
  easy: number;       // Multiplikator für "Einfach"
  easyBonus: number;  // Extra-Bonus für "Einfach"
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
