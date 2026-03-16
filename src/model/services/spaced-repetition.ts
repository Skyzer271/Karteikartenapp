import type { Card, Difficulty, LearningIntervals } from '../types/types';

// Algorithmus für individuelle Lernintervalle

export const DEFAULT_INTERVALS: LearningIntervals = {
  again: 1,
  hard: 1,
  good: 6,
  easy: 10,
};

// Berechnet das nächste Review-Datum basierend auf Schwierigkeit
export function calculateNextReview(
  card: Card, 
  difficulty: Difficulty,
  intervals: LearningIntervals = DEFAULT_INTERVALS
): Partial<Card> {
  const now = Date.now();
  let { interval, easeFactor, repetitions } = card;

  switch (difficulty) {
    case 'again':
      interval = intervals.again;
      repetitions = 0;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      break;

    case 'hard':
      interval = intervals.hard;
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      repetitions += 1;
      break;

    case 'good':
      interval = intervals.good;
      repetitions += 1;
      break;

    case 'easy':
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

// Filtert Karten die heute fällig sind
export function getDueCards(cards: Card[]): Card[] {
  const now = Date.now();
  return cards.filter((card) => {
    if (card.isPaused && card.pausedUntil && card.pausedUntil > now) {
      return false;
    }
    return card.nextReview <= now;
  });
}

// Neue Karten (noch nie gelernt)
export function getNewCards(cards: Card[]): Card[] {
  return cards.filter((card) => card.repetitions === 0);
}

// Gemeisterte Karten
export function getMasteredCards(cards: Card[]): Card[] {
  return cards.filter((card) => card.repetitions >= 5 && card.easeFactor >= 2.0);
}

// Mischt Karten zufällig
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Berechnet Lern-Streak (Tage in Folge)
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

// Voreingestellte Intervalle
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

// Formatiert Tage als lesbaren Text
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
