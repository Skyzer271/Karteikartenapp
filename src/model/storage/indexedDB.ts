import type { Deck, Card, StudySession, Settings } from '../types/types';

const DB_NAME = 'KarteikartenDB';
const DB_VERSION = 1;

class IndexedDBStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('decks')) {
          db.createObjectStore('decks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('cards')) {
          db.createObjectStore('cards', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
      };
    });
  }

  async getDecks(): Promise<Deck[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('decks', 'readonly');
      const store = transaction.objectStore('decks');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addDeck(deck: Deck): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('decks', 'readwrite');
      const store = transaction.objectStore('decks');
      const request = store.add(deck);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateDeck(id: string, updates: Partial<Deck>): Promise<void> {
    const db = await this.init();
    const deck = await this.getDeck(id);
    if (!deck) throw new Error('Deck nicht gefunden');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('decks', 'readwrite');
      const store = transaction.objectStore('decks');
      const request = store.put({ ...deck, ...updates, updatedAt: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteDeck(id: string): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('decks', 'readwrite');
      const store = transaction.objectStore('decks');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getDeck(id: string): Promise<Deck | undefined> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('decks', 'readonly');
      const store = transaction.objectStore('decks');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getCards(): Promise<Card[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('cards', 'readonly');
      const store = transaction.objectStore('cards');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getCardsByDeck(deckId: string): Promise<Card[]> {
    const cards = await this.getCards();
    return cards.filter(card => card.deckId === deckId);
  }

  async addCard(card: Card): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('cards', 'readwrite');
      const store = transaction.objectStore('cards');
      const request = store.add(card);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateCard(id: string, updates: Partial<Card>): Promise<void> {
    const db = await this.init();
    const cards = await this.getCards();
    const card = cards.find(c => c.id === id);
    if (!card) throw new Error('Karte nicht gefunden');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('cards', 'readwrite');
      const store = transaction.objectStore('cards');
      const request = store.put({ ...card, ...updates });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteCard(id: string): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('cards', 'readwrite');
      const store = transaction.objectStore('cards');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSessions(): Promise<StudySession[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('sessions', 'readonly');
      const store = transaction.objectStore('sessions');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addSession(session: StudySession): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('sessions', 'readwrite');
      const store = transaction.objectStore('sessions');
      const request = store.add(session);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSettings(): Promise<Settings> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('settings', 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get('user');

      request.onsuccess = () => {
        resolve(request.result || {
          darkMode: false,
          fontSize: 'medium',
          autoRecognition: true,
          showHintButton: true,
          shuffleMode: false,
          randomSide: false,
          intervals: {
            again: 1,
            hard: 1,
            good: 6,
            easy: 10,
          },
        });
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveSettings(settings: Settings): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('settings', 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put({ ...settings, id: 'user' });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const indexedDBStorage = new IndexedDBStorage();
