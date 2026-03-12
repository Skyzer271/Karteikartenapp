import type { Card, Deck, Settings, StudySession } from '../types/types';

const DB_NAME = 'FlashcardsDB';
const DB_VERSION = 1;

// Object store names
const STORES = {
  DECKS: 'decks',
  CARDS: 'cards',
  SETTINGS: 'settings',
  SESSIONS: 'sessions',
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

// Initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores
      if (!db.objectStoreNames.contains(STORES.DECKS)) {
        db.createObjectStore(STORES.DECKS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.CARDS)) {
        const cardStore = db.createObjectStore(STORES.CARDS, { keyPath: 'id' });
        cardStore.createIndex('deckId', 'deckId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
        db.createObjectStore(STORES.SESSIONS, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Generic database operations
async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getFromStore<T>(storeName: string, id: string): Promise<T | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function addToStore<T>(storeName: string, data: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(data);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function updateInStore<T>(storeName: string, data: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function deleteFromStore(storeName: string, id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function getByIndex<T>(
  storeName: string,
  indexName: string,
  value: string
): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Exported storage API
export const indexedDBStorage = {
  // Decks
  async getDecks(): Promise<Deck[]> {
    try {
      return await getAllFromStore<Deck>(STORES.DECKS);
    } catch (error) {
      console.error('Error getting decks:', error);
      return [];
    }
  },

  async getDeck(id: string): Promise<Deck | null> {
    try {
      return await getFromStore<Deck>(STORES.DECKS, id);
    } catch (error) {
      console.error('Error getting deck:', error);
      return null;
    }
  },

  async addDeck(deck: Deck): Promise<void> {
    try {
      await addToStore(STORES.DECKS, deck);
    } catch (error) {
      console.error('Error adding deck:', error);
      throw error;
    }
  },

  async updateDeck(id: string, updates: Partial<Deck>): Promise<void> {
    try {
      const deck = await getFromStore<Deck>(STORES.DECKS, id);
      if (deck) {
        const updatedDeck = { ...deck, ...updates, updatedAt: Date.now() };
        await updateInStore(STORES.DECKS, updatedDeck);
      }
    } catch (error) {
      console.error('Error updating deck:', error);
      throw error;
    }
  },

  async deleteDeck(id: string): Promise<void> {
    try {
      await deleteFromStore(STORES.DECKS, id);
      // Also delete all cards in this deck
      const cards = await this.getCardsByDeck(id);
      for (const card of cards) {
        await deleteFromStore(STORES.CARDS, card.id);
      }
    } catch (error) {
      console.error('Error deleting deck:', error);
      throw error;
    }
  },

  // Cards
  async getCards(): Promise<Card[]> {
    try {
      return await getAllFromStore<Card>(STORES.CARDS);
    } catch (error) {
      console.error('Error getting cards:', error);
      return [];
    }
  },

  async getCard(id: string): Promise<Card | null> {
    try {
      return await getFromStore<Card>(STORES.CARDS, id);
    } catch (error) {
      console.error('Error getting card:', error);
      return null;
    }
  },

  async getCardsByDeck(deckId: string): Promise<Card[]> {
    try {
      return await getByIndex<Card>(STORES.CARDS, 'deckId', deckId);
    } catch (error) {
      console.error('Error getting cards by deck:', error);
      return [];
    }
  },

  async addCard(card: Card): Promise<void> {
    try {
      await addToStore(STORES.CARDS, card);
    } catch (error) {
      console.error('Error adding card:', error);
      throw error;
    }
  },

  async updateCard(id: string, updates: Partial<Card>): Promise<void> {
    try {
      const card = await getFromStore<Card>(STORES.CARDS, id);
      if (card) {
        const updatedCard = { ...card, ...updates };
        await updateInStore(STORES.CARDS, updatedCard);
      }
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  },

  async deleteCard(id: string): Promise<void> {
    try {
      await deleteFromStore(STORES.CARDS, id);
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  },

  // Settings
  async getSettings(): Promise<Settings> {
    try {
      const settings = await getFromStore<Settings & { id: string }>(STORES.SETTINGS, 'default');
      return settings ? { ...DEFAULT_SETTINGS, ...settings } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: Settings): Promise<void> {
    try {
      await updateInStore(STORES.SETTINGS, { ...settings, id: 'default' });
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  // Study Sessions
  async getSessions(): Promise<StudySession[]> {
    try {
      return await getAllFromStore<StudySession>(STORES.SESSIONS);
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  },

  async addSession(session: StudySession): Promise<void> {
    try {
      await addToStore(STORES.SESSIONS, session);
    } catch (error) {
      console.error('Error adding session:', error);
      throw error;
    }
  },
};
