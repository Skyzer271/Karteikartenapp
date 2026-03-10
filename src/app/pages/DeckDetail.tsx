import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Play, Plus, Edit2, Trash2, Pause } from 'lucide-react';
import { useDecks } from '../hooks/useDecks';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { getDueCards } from '../lib/spaced-repetition';
import type { Card as CardType } from '../types';

export function DeckDetail() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { decks, getCardsByDeck, addCard, updateCard, deleteCard } = useDecks();

  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [pausingCard, setPausingCard] = useState<CardType | null>(null);
  const [pauseMonths, setPauseMonths] = useState(1);

  const [cardForm, setCardForm] = useState({
    front: '',
    back: '',
    hint: '',
  });

  const deck = decks.find((d) => d.id === deckId);
  const cards = useMemo(() => getCardsByDeck(deckId || ''), [deckId, getCardsByDeck]);
  const dueCards = useMemo(() => getDueCards(cards), [cards]);

  if (!deck) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Deck nicht gefunden</p>
          <Button onClick={() => navigate('/')}>Zurück zum Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleAddCard = async () => {
    if (!cardForm.front.trim() || !cardForm.back.trim()) return;

    const newCard: CardType = {
      id: `card_${Date.now()}`,
      front: cardForm.front.trim(),
      back: cardForm.back.trim(),
      hint: cardForm.hint.trim() || undefined,
      deckId: deck.id,
      createdAt: Date.now(),
      lastReviewed: null,
      nextReview: Date.now(),
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      isPaused: false,
    };

    await addCard(newCard);
    setCardForm({ front: '', back: '', hint: '' });
    setIsAddCardModalOpen(false);
  };

  const handleEditCard = async () => {
    if (!editingCard || !cardForm.front.trim() || !cardForm.back.trim()) return;

    await updateCard(editingCard.id, {
      front: cardForm.front.trim(),
      back: cardForm.back.trim(),
      hint: cardForm.hint.trim() || undefined,
    });

    setEditingCard(null);
    setCardForm({ front: '', back: '', hint: '' });
    setIsEditCardModalOpen(false);
  };

  const handleDeleteCard = async (cardId: string) => {
    if (confirm('Möchten Sie diese Karte wirklich löschen?')) {
      await deleteCard(cardId);
    }
  };

  const handlePauseCard = async () => {
    if (!pausingCard) return;

    const pausedUntil = Date.now() + pauseMonths * 30 * 24 * 60 * 60 * 1000;
    await updateCard(pausingCard.id, {
      isPaused: true,
      pausedUntil,
    });

    setPausingCard(null);
    setPauseMonths(1);
    setIsPauseModalOpen(false);
  };

  const openEditModal = (card: CardType) => {
    setEditingCard(card);
    setCardForm({
      front: card.front,
      back: card.back,
      hint: card.hint || '',
    });
    setIsEditCardModalOpen(true);
  };

  const openPauseModal = (card: CardType) => {
    setPausingCard(card);
    setIsPauseModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Zurück
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-gray-900 dark:text-gray-100 mb-2">{deck.name}</h1>
              {deck.description && (
                <p className="text-gray-600 dark:text-gray-400">{deck.description}</p>
              )}
            </div>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl"
              style={{ backgroundColor: deck.color }}
            >
              📚
            </div>
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Card className="flex-1">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Gesamtkarten</p>
              <p className="text-2xl text-gray-900 dark:text-gray-100">{cards.length}</p>
            </div>
          </Card>
          <Card className="flex-1">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Fällige Karten</p>
              <p className="text-2xl text-orange-600 dark:text-orange-400">{dueCards.length}</p>
            </div>
          </Card>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => navigate(`/study/${deck.id}`)}
              disabled={dueCards.length === 0}
            >
              <Play className="w-5 h-5 mr-2" />
              Lernen starten
            </Button>
            <Button variant="secondary" onClick={() => setIsAddCardModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Karte hinzufügen
            </Button>
          </div>
        </div>

        {/* Cards List */}
        {cards.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Noch keine Karten in diesem Deck
            </p>
            <Button onClick={() => setIsAddCardModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Erste Karte hinzufügen
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl text-gray-900 dark:text-gray-100">Alle Karten</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cards.map((card) => (
                <Card key={card.id} className="relative group">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vorderseite</p>
                      <p className="text-gray-900 dark:text-gray-100">{card.front}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Rückseite</p>
                      <p className="text-gray-900 dark:text-gray-100">{card.back}</p>
                    </div>
                    {card.hint && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hinweis</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{card.hint}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {card.isPaused ? (
                          <span className="text-orange-600">
                            Pausiert bis{' '}
                            {new Date(card.pausedUntil || 0).toLocaleDateString('de-DE')}
                          </span>
                        ) : (
                          <span>
                            Wiederholungen: {card.repetitions} | Intervall: {card.interval}d
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openPauseModal(card)}
                          className="p-2 hover:bg-orange-100 dark:hover:bg-orange-900 rounded-lg transition-colors"
                          aria-label="Karte pausieren"
                        >
                          <Pause className="w-4 h-4 text-orange-600" />
                        </button>
                        <button
                          onClick={() => openEditModal(card)}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          aria-label="Karte bearbeiten"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                          aria-label="Karte löschen"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Card Modal */}
      <Modal
        isOpen={isAddCardModalOpen}
        onClose={() => {
          setIsAddCardModalOpen(false);
          setCardForm({ front: '', back: '', hint: '' });
        }}
        title="Neue Karte hinzufügen"
      >
        <div className="space-y-4">
          <Textarea
            label="Vorderseite"
            placeholder="Was möchten Sie lernen?"
            value={cardForm.front}
            onChange={(e) => setCardForm({ ...cardForm, front: e.target.value })}
            rows={3}
            autoFocus
          />
          <Textarea
            label="Rückseite"
            placeholder="Die Antwort"
            value={cardForm.back}
            onChange={(e) => setCardForm({ ...cardForm, back: e.target.value })}
            rows={3}
          />
          <Textarea
            label="Hinweis (optional)"
            placeholder="Ein hilfreicher Tipp"
            value={cardForm.hint}
            onChange={(e) => setCardForm({ ...cardForm, hint: e.target.value })}
            rows={2}
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddCardModalOpen(false);
                setCardForm({ front: '', back: '', hint: '' });
              }}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleAddCard}
              disabled={!cardForm.front.trim() || !cardForm.back.trim()}
            >
              Hinzufügen
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Card Modal */}
      <Modal
        isOpen={isEditCardModalOpen}
        onClose={() => {
          setIsEditCardModalOpen(false);
          setEditingCard(null);
          setCardForm({ front: '', back: '', hint: '' });
        }}
        title="Karte bearbeiten"
      >
        <div className="space-y-4">
          <Textarea
            label="Vorderseite"
            value={cardForm.front}
            onChange={(e) => setCardForm({ ...cardForm, front: e.target.value })}
            rows={3}
            autoFocus
          />
          <Textarea
            label="Rückseite"
            value={cardForm.back}
            onChange={(e) => setCardForm({ ...cardForm, back: e.target.value })}
            rows={3}
          />
          <Textarea
            label="Hinweis (optional)"
            value={cardForm.hint}
            onChange={(e) => setCardForm({ ...cardForm, hint: e.target.value })}
            rows={2}
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditCardModalOpen(false);
                setEditingCard(null);
                setCardForm({ front: '', back: '', hint: '' });
              }}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleEditCard}
              disabled={!cardForm.front.trim() || !cardForm.back.trim()}
            >
              Speichern
            </Button>
          </div>
        </div>
      </Modal>

      {/* Pause Card Modal */}
      <Modal
        isOpen={isPauseModalOpen}
        onClose={() => {
          setIsPauseModalOpen(false);
          setPausingCard(null);
          setPauseMonths(1);
        }}
        title="Karte pausieren"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Für wie viele Monate möchten Sie diese Karte pausieren?
          </p>
          <Input
            type="number"
            min="1"
            max="12"
            value={pauseMonths}
            onChange={(e) => setPauseMonths(Number(e.target.value))}
            label="Monate"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Die Karte wird pausiert bis:{' '}
            {new Date(Date.now() + pauseMonths * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
              'de-DE'
            )}
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setIsPauseModalOpen(false);
                setPausingCard(null);
                setPauseMonths(1);
              }}
            >
              Abbrechen
            </Button>
            <Button onClick={handlePauseCard}>Pausieren</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}