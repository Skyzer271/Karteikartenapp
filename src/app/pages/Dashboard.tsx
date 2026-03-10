import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Plus, BookOpen, TrendingUp, Calendar, Trash2, Play } from 'lucide-react';
import { useDecks } from '../hooks/useDecks';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { indexedDBStorage } from '../lib/indexedDB';
import { getMasteredCards, calculateStreak } from '../lib/spaced-repetition';
import type { Deck } from '../types';

export function Dashboard() {
  const navigate = useNavigate();
  const { decks, cards, loading, addDeck, deleteDeck } = useDecks();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');

  // Statistics
  const [stats, setStats] = useState({
    totalDecks: 0,
    totalCards: 0,
    cardsToReview: 0,
    cardsMastered: 0,
    streakDays: 0,
    lastStudyDate: null as number | null,
  });

  useEffect(() => {
    async function loadStats() {
      const totalCards = cards.length;
      const cardsToReview = cards.filter((c) => c.nextReview <= Date.now()).length;
      const cardsMastered = getMasteredCards(cards).length;
      const sessions = await indexedDBStorage.getSessions();
      const streakDays = calculateStreak(sessions);
      const lastStudyDate = sessions.length > 0 ? Math.max(...sessions.map((s) => s.startTime)) : null;

      setStats({
        totalDecks: decks.length,
        totalCards,
        cardsToReview,
        cardsMastered,
        streakDays,
        lastStudyDate,
      });
    }

    if (!loading) {
      loadStats();
    }
  }, [decks, cards, loading]);

  // Filtered decks
  const filteredDecks = useMemo(() => {
    if (!searchQuery) return decks;
    return decks.filter((deck) =>
      deck.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [decks, searchQuery]);

  const handleCreateDeck = async () => {
    if (!newDeckName.trim()) return;

    const colors = ['#007BFF', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newDeck: Deck = {
      id: `deck_${Date.now()}`,
      name: newDeckName.trim(),
      description: newDeckDescription.trim() || undefined,
      color: randomColor,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await addDeck(newDeck);
    setNewDeckName('');
    setNewDeckDescription('');
    setIsCreateModalOpen(false);
  };

  const handleDeleteDeck = async (e: React.MouseEvent, deckId: string) => {
    e.stopPropagation();
    if (confirm('Möchten Sie dieses Deck und alle seine Karten wirklich löschen?')) {
      await deleteDeck(deckId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Willkommen zurück! Bereit zum Lernen?
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Decks gesamt</p>
                <p className="text-2xl mt-1">{stats.totalDecks}</p>
              </div>
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Karten gesamt</p>
                <p className="text-2xl mt-1">{stats.totalCards}</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Zu wiederholen</p>
                <p className="text-2xl mt-1">{stats.cardsToReview}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl mt-1">{stats.streakDays} Tage</p>
              </div>
              <div className="text-3xl">🔥</div>
            </div>
          </Card>
        </div>

        {/* Learn All Button */}
        {stats.cardsToReview > 0 && (
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg mb-1">Alle Karten lernen</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats.cardsToReview} Karten aus allen Decks warten auf dich
                  </p>
                </div>
                <Button
                  size="lg"
                  onClick={() => navigate('/study/all')}
                  className="flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Jetzt lernen
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Decks durchsuchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Neues Deck
          </Button>
        </div>

        {/* Decks Grid */}
        {filteredDecks.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Keine Decks gefunden' : 'Noch keine Decks vorhanden'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Erstes Deck erstellen
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map((deck) => (
              <Card
                key={deck.id}
                onClick={() => navigate(`/deck/${deck.id}`)}
                className="relative group cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div
                  className="absolute top-0 left-0 w-full h-2 rounded-t-xl"
                  style={{ backgroundColor: deck.color }}
                />
                <div className="mt-2">
                  <h3 className="text-xl mb-2">{deck.name}</h3>
                  {deck.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {deck.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">
                        {deck.totalCards} Karten
                      </p>
                      {deck.dueCards > 0 && (
                        <p className="text-primary">
                          {deck.dueCards} fällig
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDeleteDeck(e, deck.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 rounded-lg transition-all"
                      aria-label="Deck löschen"
                    >
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Deck Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Neues Deck erstellen"
      >
        <div className="space-y-4">
          <Input
            label="Deck-Name"
            placeholder="z.B. Spanisch Vokabeln"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            autoFocus
          />
          <Input
            label="Beschreibung (optional)"
            placeholder="Was möchten Sie lernen?"
            value={newDeckDescription}
            onChange={(e) => setNewDeckDescription(e.target.value)}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleCreateDeck} disabled={!newDeckName.trim()}>
              Erstellen
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}