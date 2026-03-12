import type { Card, Deck, Settings, StudySession } from '../types/types';

const STORAGE_KEYS = {
  DECKS: 'flashcards_decks',
  CARDS: 'flashcards_cards',
  SETTINGS: 'flashcards_settings',
  SESSIONS: 'flashcards_sessions',
} as const;

// Default settings
const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  fontSize: 'medium',
  autoRecognition: true,
  showHintButton: true,
  shuffleMode: false,
  randomSide: false,
};

// Storage utilities
export const storage = {
  // Decks
  getDecks(): Deck[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DECKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveDecks(decks: Deck[]): void {
    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
  },

  getDeck(id: string): Deck | null {
    const decks = this.getDecks();
    return decks.find((d) => d.id === id) || null;
  },

  addDeck(deck: Deck): void {
    const decks = this.getDecks();
    decks.push(deck);
    this.saveDecks(decks);
  },

  updateDeck(id: string, updates: Partial<Deck>): void {
    const decks = this.getDecks();
    const index = decks.findIndex((d) => d.id === id);
    if (index !== -1) {
      decks[index] = { ...decks[index], ...updates, updatedAt: Date.now() };
      this.saveDecks(decks);
    }
  },

  deleteDeck(id: string): void {
    const decks = this.getDecks().filter((d) => d.id !== id);
    this.saveDecks(decks);
    // Also delete all cards in this deck
    const cards = this.getCards().filter((c) => c.deckId !== id);
    this.saveCards(cards);
  },

  // Cards
  getCards(): Card[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCards(cards: Card[]): void {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
  },

  getCard(id: string): Card | null {
    const cards = this.getCards();
    return cards.find((c) => c.id === id) || null;
  },

  getCardsByDeck(deckId: string): Card[] {
    return this.getCards().filter((c) => c.deckId === deckId);
  },

  addCard(card: Card): void {
    const cards = this.getCards();
    cards.push(card);
    this.saveCards(cards);
  },

  updateCard(id: string, updates: Partial<Card>): void {
    const cards = this.getCards();
    const index = cards.findIndex((c) => c.id === id);
    if (index !== -1) {
      cards[index] = { ...cards[index], ...updates };
      this.saveCards(cards);
    }
  },

  deleteCard(id: string): void {
    const cards = this.getCards().filter((c) => c.id !== id);
    this.saveCards(cards);
  },

  // Settings
  getSettings(): Settings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: Settings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Study Sessions
  getSessions(): StudySession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSessions(sessions: StudySession[]): void {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },

  addSession(session: StudySession): void {
    const sessions = this.getSessions();
    sessions.push(session);
    this.saveSessions(sessions);
  },
};
