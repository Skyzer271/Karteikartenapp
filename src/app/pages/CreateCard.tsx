import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Save, ArrowLeft, Plus } from 'lucide-react';
import { useDecks } from '../hooks/useDecks';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import type { Card as CardType } from '../types';

export function CreateCard() {
  const navigate = useNavigate();
  const { decks, addCard } = useDecks();

  const [selectedDeckId, setSelectedDeckId] = useState(decks[0]?.id || '');
  const [cards, setCards] = useState<Array<{ front: string; back: string; hint: string }>>([
    { front: '', back: '', hint: '' },
  ]);

  const handleAddCardField = () => {
    setCards([...cards, { front: '', back: '', hint: '' }]);
  };

  const handleRemoveCardField = (index: number) => {
    if (cards.length > 1) {
      setCards(cards.filter((_, i) => i !== index));
    }
  };

  const handleCardChange = (index: number, field: string, value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setCards(newCards);
  };

  const handleSave = async () => {
    if (!selectedDeckId) {
      alert('Bitte wählen Sie ein Deck aus.');
      return;
    }

    const validCards = cards.filter((card) => card.front.trim() && card.back.trim());
    
    if (validCards.length === 0) {
      alert('Bitte erstellen Sie mindestens eine vollständige Karte (Vorderseite und Rückseite).');
      return;
    }

    for (const card of validCards) {
      const newCard: CardType = {
        id: `card_${Date.now()}_${Math.random()}`,
        front: card.front.trim(),
        back: card.back.trim(),
        hint: card.hint.trim() || undefined,
        deckId: selectedDeckId,
        createdAt: Date.now(),
        lastReviewed: null,
        nextReview: Date.now(),
        interval: 0,
        easeFactor: 2.5,
        repetitions: 0,
        isPaused: false,
      };
      await addCard(newCard);
    }

    navigate(`/deck/${selectedDeckId}`);
  };

  if (decks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sie müssen zuerst ein Deck erstellen
          </p>
          <Button onClick={() => navigate('/')}>Zum Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Zurück
          </Button>
          <h1 className="text-3xl text-gray-900 dark:text-gray-100 mb-2">
            Karten erstellen
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fügen Sie neue Karteikarten zu Ihrem Deck hinzu
          </p>
        </div>

        {/* Deck Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
            Deck auswählen
          </label>
          <select
            value={selectedDeckId}
            onChange={(e) => setSelectedDeckId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.name} ({deck.totalCards} Karten)
              </option>
            ))}
          </select>
        </div>

        {/* Card Forms */}
        <div className="space-y-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg text-gray-900 dark:text-gray-100">
                  Karte {index + 1}
                </h3>
                {cards.length > 1 && (
                  <button
                    onClick={() => handleRemoveCardField(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Entfernen
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <Textarea
                  label="Vorderseite *"
                  placeholder="z.B. Was ist die Hauptstadt von Deutschland?"
                  value={card.front}
                  onChange={(e) => handleCardChange(index, 'front', e.target.value)}
                  rows={3}
                />

                <Textarea
                  label="Rückseite *"
                  placeholder="z.B. Berlin"
                  value={card.back}
                  onChange={(e) => handleCardChange(index, 'back', e.target.value)}
                  rows={3}
                />

                <Textarea
                  label="Hinweis (optional)"
                  placeholder="Ein hilfreicher Tipp für diese Karte"
                  value={card.hint}
                  onChange={(e) => handleCardChange(index, 'hint', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" onClick={handleAddCardField} className="flex-1">
            <Plus className="w-5 h-5 mr-2" />
            Weitere Karte hinzufügen
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
            disabled={!cards.some((c) => c.front.trim() && c.back.trim())}
          >
            <Save className="w-5 h-5 mr-2" />
            Karten speichern
          </Button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
          * Pflichtfelder
        </p>
      </div>
    </div>
  );
}