// Datentypen für die Anwendung

export interface Card {
  id: string;
  front: string;
  back: string;
  hint?: string;
  deckId: string;
  createdAt: number;
  lastReviewed: number | null;
  nextReview: number;
  interval: number;
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
  again: number;
  hard: number;
  good: number;
  easy: number;
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
