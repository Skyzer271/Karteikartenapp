import type { Card, Difficulty } from '../types/types';

/**
 * Spaced Repetition Algorithm (SM-2)
 * Based on SuperMemo 2 algorithm
 */

export function calculateNextReview(card: Card, difficulty: Difficulty): Partial<Card> {
  const now = Date.now();
  let { interval, easeFactor, repetitions } = card;

  switch (difficulty) {
    case 'again':
      // Reset progress
      interval = 1;
      repetitions = 0;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      break;

    case 'hard':
      // Reduce ease factor, keep interval short
      interval = Math.max(1, Math.floor(interval * 1.2));
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      repetitions += 1;
      break;

    case 'good':
      // Normal progression
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
      break;

    case 'easy':
      // Increase ease factor and interval
      if (repetitions === 0) {
        interval = 4;
      } else if (repetitions === 1) {
        interval = 10;
      } else {
        interval = Math.round(interval * easeFactor * 1.3);
      }
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
