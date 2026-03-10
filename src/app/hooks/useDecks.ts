import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Deck, Card, DeckWithStats } from '../types';
import { indexedDBStorage } from '../lib/indexedDB';
import { getDueCards, getNewCards } from '../lib/spaced-repetition';

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [loadedDecks, loadedCards] = await Promise.all([
        indexedDBStorage.getDecks(),
        indexedDBStorage.getCards(),
      ]);
      setDecks(loadedDecks);
      setCards(loadedCards);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh data
  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  // Decks with statistics
  const decksWithStats = useMemo<DeckWithStats[]>(() => {
    return decks.map((deck) => {
      const deckCards = cards.filter((c) => c.deckId === deck.id);
      const dueCards = getDueCards(deckCards);
      const newCards = getNewCards(deckCards);

      return {
        ...deck,
        totalCards: deckCards.length,
        dueCards: dueCards.length,
        newCards: newCards.length,
      };
    });
  }, [decks, cards]);

  // Deck operations
  const addDeck = async (deck: Deck) => {
    await indexedDBStorage.addDeck(deck);
    refresh();
  };

  const updateDeck = async (id: string, updates: Partial<Deck>) => {
    await indexedDBStorage.updateDeck(id, updates);
    refresh();
  };

  const deleteDeck = async (id: string) => {
    await indexedDBStorage.deleteDeck(id);
    refresh();
  };

  // Card operations
  const addCard = async (card: Card) => {
    await indexedDBStorage.addCard(card);
    refresh();
  };

  const updateCard = async (id: string, updates: Partial<Card>) => {
    await indexedDBStorage.updateCard(id, updates);
    refresh();
  };

  const deleteCard = async (id: string) => {
    await indexedDBStorage.deleteCard(id);
    refresh();
  };

  const getCardsByDeck = useCallback((deckId: string): Card[] => {
    return cards.filter((c) => c.deckId === deckId);
  }, [cards]);

  return {
    decks: decksWithStats,
    cards,
    loading,
    addDeck,
    updateDeck,
    deleteDeck,
    addCard,
    updateCard,
    deleteCard,
    getCardsByDeck,
    refresh,
  };
}