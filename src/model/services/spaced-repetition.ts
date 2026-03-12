import type { Card, Difficulty, LearningIntervals } from '../types/types';

/**
 * Spaced Repetition Algorithm with Customizable Day Intervals
 * Users can set exact days for each difficulty level
 */

// Default intervals for new users
export const DEFAULT_INTERVALS: LearningIntervals = {
  again: 1,   // 1 day after "Again"
  hard: 1,    // 1 day for "Hard"
  good: 6,    // 6 days for "Good"
  easy: 10,   // 10 days for "Easy"
};

/**
 * Calculate next review date based on difficulty and user-defined day intervals
 * @param card - The flashcard to update
 * @param difficulty - User's rating of how well they knew the card
 * @param intervals - User's custom interval settings (in days)
 * @returns Partial card object with updated review data
 */
export function calculateNextReview(
  card: Card, 
  difficulty: Difficulty,
  intervals: LearningIntervals = DEFAULT_INTERVALS
): Partial<Card> {
  const now = Date.now();
  let { interval, easeFactor, repetitions } = card;

  switch (difficulty) {
    case 'again':
      // Reset progress - use user's "again" interval (default: 1 day)
      interval = intervals.again;
      repetitions = 0;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      break;

    case 'hard':
      // Hard - use user's hard interval directly (0-7 days)
      interval = intervals.hard;
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      repetitions += 1;
      break;

    case 'good':
      // Good - use user's good interval directly (4-14 days)
      interval = intervals.good;
      repetitions += 1;
      break;

    case 'easy':
      // Easy - use user's easy interval directly (7-28 days)
      interval = intervals.easy;
      easeFactor = Math.min(2.5, easeFactor + 0.15);
      repetitions += 1;
      break;
  }

  const nextReview = now + interval * 24 * 60 * 60 * 1000;

  return {
    interval,
    easeFactor,
    repetitions,
    lastReviewed: now,
    nextReview,
  };
}

export function getDueCards(cards: Card[]): Card[] {
  const now = Date.now();
  return cards.filter((card) => {
    if (card.isPaused && card.pausedUntil && card.pausedUntil > now) {
      return false;
    }
    return card.nextReview <= now;
  });
}

export function getNewCards(cards: Card[]): Card[] {
  return cards.filter((card) => card.repetitions === 0);
}

export function getMasteredCards(cards: Card[]): Card[] {
  return cards.filter((card) => card.repetitions >= 5 && card.easeFactor >= 2.0);
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function calculateStreak(sessions: { startTime: number }[]): number {
  if (sessions.length === 0) return 0;

  const sortedSessions = [...sessions].sort((a, b) => b.startTime - a.startTime);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = today.getTime();

  for (const session of sortedSessions) {
    const sessionDate = new Date(session.startTime);
    sessionDate.setHours(0, 0, 0, 0);
    const sessionTime = sessionDate.getTime();

    if (sessionTime === currentDate || sessionTime === currentDate - 24 * 60 * 60 * 1000) {
      if (sessionTime < currentDate) {
        streak++;
        currentDate = sessionTime;
      }
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Get interval preset for different learning styles
 */
export const INTERVAL_PRESETS = {
  relaxed: {
    name: 'Entspannt',
    description: 'Längere Pausen zwischen den Wiederholungen',
    intervals: {
      again: 1,
      hard: 2,
      good: 10,
      easy: 21,
    } as LearningIntervals,
  },
  standard: {
    name: 'Standard',
    description: 'Ausgewogenes Lernempo',
    intervals: DEFAULT_INTERVALS,
  },
  intensive: {
    name: 'Intensiv',
    description: 'Kürzere Intervalle für schnelles Lernen',
    intervals: {
      again: 1,
      hard: 0,
      good: 4,
      easy: 7,
    } as LearningIntervals,
  },
};

/**
 * Format days into human-readable string
 */
export function formatDays(days: number): string {
  if (days === 0) return 'Heute';
  if (days === 1) return 'Morgen';
  if (days < 7) return `${days} Tage`;
  if (days === 7) return '1 Woche';
  if (days < 14) return `${Math.floor(days / 7)} Wochen`;
  if (days === 14) return '2 Wochen';
  if (days < 28) return `${Math.floor(days / 7)} Wochen`;
  if (days === 28) return '4 Wochen';
  return `${Math.floor(days / 7)} Wochen`;
}
