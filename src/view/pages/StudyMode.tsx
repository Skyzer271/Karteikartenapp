import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Lightbulb, RotateCcw, CheckCircle, Eye } from 'lucide-react';
import { useDecks } from '@/controller/hooks/useDecks';
import { useSettings } from '@/controller/hooks/useSettings';
import { Button } from '@/view/components/Button';
import { FlashCard } from '@/view/components/FlashCard';
import { indexedDBStorage } from '@/model/storage/indexedDB';
import { calculateNextReview, getDueCards, shuffleArray, DEFAULT_INTERVALS, formatDays } from '@/model/services/spaced-repetition';
import { motion, AnimatePresence } from 'motion/react';
import type { Card as CardType, Difficulty } from '@/model/types/types';

export function StudyMode() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { decks, cards, getCardsByDeck, updateCard } = useDecks();
  const { settings } = useSettings();

  const isAllMode = deckId === 'all';
  
  // For "all" mode, we create a virtual deck
  const deck = isAllMode 
    ? { id: 'all', name: 'Alle Decks', color: '#007BFF' }
    : decks.find((d) => d.id === deckId);
    
  const allCards = useMemo(() => {
    if (isAllMode) {
      // Return all cards from all decks
      return cards;
    }
    return getCardsByDeck(deckId || '');
  }, [isAllMode, cards, deckId, getCardsByDeck]);
  
  const dueCards = useMemo(() => getDueCards(allCards), [allCards]);

  const [studyCards, setStudyCards] = useState<CardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showRandomSide, setShowRandomSide] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    cardsStudied: 0,
    correctAnswers: 0,
    startTime: Date.now(),
  });
  
  const initializedRef = useRef(false);

  // Initialize study session - only run once when dueCards are first available
  useEffect(() => {
    if (dueCards.length > 0 && !initializedRef.current) {
      let cards = settings.shuffleMode ? shuffleArray([...dueCards]) : [...dueCards];
      
      // Determine which side to show for each card
      if (settings.randomSide) {
        cards = cards.map((card) => ({
          ...card,
          _showFrontFirst: Math.random() > 0.5,
        }));
      }

      setStudyCards(cards as any);
      initializedRef.current = true;
    }
  }, [dueCards, settings.shuffleMode, settings.randomSide]);

  const currentCard = studyCards[currentIndex];
  const isLastCard = currentIndex === studyCards.length - 1;

  // Get user's custom intervals or defaults - must be at component scope for JSX access
  const intervals = settings.intervals || DEFAULT_INTERVALS;

  // Handle revealing the solution
  const handleRevealSolution = () => {
    // Compare answer when revealing (if user entered something)
    if (userAnswer.trim() && currentCard) {
      // The solution shown is displayCard.front
      // We need to compare against what was displayed as the solution
      const correctAnswer = displayCard.front;
      
      const isCorrect =
        userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
      setIsAnswerCorrect(isCorrect);
    }
    
    setIsRevealed(true);
  };

  const handleDifficulty = (difficulty: Difficulty) => {
    if (!currentCard) return;

    const updates = calculateNextReview(currentCard, difficulty, intervals);
    updateCard(currentCard.id, updates);

    const isCorrect = difficulty === 'good' || difficulty === 'easy';
    setSessionStats((prev) => ({
      ...prev,
      cardsStudied: prev.cardsStudied + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
    }));

    // Move to next card
    if (isLastCard) {
      finishSession();
    } else {
      setCurrentIndex(currentIndex + 1);
      resetCardState();
    }
  };

  const resetCardState = () => {
    setIsRevealed(false);
    setShowHint(false);
    setUserAnswer('');
    setIsAnswerCorrect(null);
    setShowRandomSide(settings.randomSide && Math.random() > 0.5);
  };

  const finishSession = () => {
    const session = {
      deckId: deckId!,
      cardsStudied: sessionStats.cardsStudied + 1,
      correctAnswers:
        sessionStats.correctAnswers + (isAnswerCorrect !== false ? 1 : 0),
      startTime: sessionStats.startTime,
      endTime: Date.now(),
    };
    indexedDBStorage.addSession(session);
    // Navigate back to dashboard for "all" mode, or to deck detail for single deck
    navigate(isAllMode ? '/' : `/deck/${deckId}`);
  };

  if (!deck || dueCards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl text-gray-900 dark:text-gray-100 mb-2">
            Gut gemacht!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Keine Karten zum Wiederholen vorhanden.
          </p>
          <Button onClick={() => navigate(isAllMode ? '/' : `/deck/${deckId}`)}>
            {isAllMode ? 'Zurück zum Dashboard' : 'Zurück zum Deck'}
          </Button>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Laden...</p>
        </div>
      </div>
    );
  }

  const displayCard = {
    ...currentCard,
    front: (currentCard as any)._showFrontFirst ? currentCard.front : currentCard.back,
    back: (currentCard as any)._showFrontFirst ? currentCard.back : currentCard.front,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate(isAllMode ? '/' : `/deck/${deckId}`)}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Beenden
          </Button>
          <div className="text-center">
            <h2 className="text-xl text-gray-900 dark:text-gray-100">{deck.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {currentIndex + 1} / {studyCards.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Richtig</p>
            <p className="text-lg text-green-600 dark:text-green-400">
              {sessionStats.correctAnswers} / {sessionStats.cardsStudied}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-blue-600 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / studyCards.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card (Front Side) - Always shown first */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 min-h-[300px] flex flex-col items-center justify-center text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wide">
                  Frage
                </p>
                <p className={`text-2xl md:text-3xl font-medium text-gray-900 dark:text-gray-100 ${
                  settings.fontSize === 'small' ? 'text-xl' : settings.fontSize === 'large' ? 'text-4xl' : 'text-2xl'
                }`}>
                  {displayCard.back}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Answer Input - Only shown before revealing */}
        {!isRevealed && (
          <div className="mt-6 max-w-2xl mx-auto">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-center">
              Gib deine Antwort ein (optional):
            </p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userAnswer.trim()) {
                  handleRevealSolution();
                }
              }}
              placeholder="Deine Antwort..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center text-lg"
              autoFocus
            />
          </div>
        )}

        {/* Solution Card - Shown after revealing */}
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 max-w-2xl mx-auto"
          >
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl shadow-lg p-8 text-center">
              <p className="text-sm text-green-600 dark:text-green-400 mb-2 uppercase tracking-wide">
                Richtige Antwort
              </p>
              <p className={`text-2xl md:text-3xl font-medium text-green-900 dark:text-green-100 ${
                settings.fontSize === 'small' ? 'text-xl' : settings.fontSize === 'large' ? 'text-4xl' : 'text-2xl'
              }`}>
                {displayCard.front}
              </p>
            </div>

            {/* Answer Comparison */}
            {userAnswer.trim() && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <div className={`p-4 rounded-xl text-center ${
                  isAnswerCorrect 
                    ? 'bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700'
                    : 'bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700'
                }`}>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Deine Antwort:</p>
                  <p className={`font-medium ${
                    isAnswerCorrect 
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {userAnswer}
                  </p>
                  {isAnswerCorrect ? (
                    <p className="text-green-600 dark:text-green-400 text-sm mt-2">✓ Richtig!</p>
                  ) : (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-2">✗ Falsch</p>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Hint Button */}
        {settings.showHintButton && currentCard.hint && !showHint && !isRevealed && (
          <div className="mt-6 text-center">
            <Button variant="secondary" onClick={() => setShowHint(true)}>
              <Lightbulb className="w-5 h-5 mr-2" />
              Hinweis anzeigen
            </Button>
          </div>
        )}

        {/* Hint Display */}
        {showHint && currentCard.hint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 max-w-2xl mx-auto p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <p className="text-gray-800 dark:text-gray-200">{currentCard.hint}</p>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 max-w-2xl mx-auto">
          {!isRevealed ? (
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={handleRevealSolution} 
                size="lg" 
                className="flex-1 max-w-xs bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="w-5 h-5 mr-2" />
                Lösung aufdecken
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-3">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Wie gut kanntest du die Antwort?
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Button
                    variant="danger"
                    onClick={() => handleDifficulty('again')}
                    className="flex flex-col items-center py-4 bg-red-600 hover:bg-red-700"
                  >
                    <RotateCcw className="w-5 h-5 mb-1" />
                    <span>Nochmal</span>
                    <span className="text-xs opacity-75">{formatDays(intervals.again)}</span>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDifficulty('hard')}
                    className="flex flex-col items-center py-4 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <span className="text-xl mb-1">😕</span>
                    <span>Schwer</span>
                    <span className="text-xs opacity-75">{formatDays(intervals.hard)}</span>
                  </Button>
                  <Button
                    onClick={() => handleDifficulty('good')}
                    className="flex flex-col items-center py-4 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <span className="text-xl mb-1">🙂</span>
                    <span>Gut</span>
                    <span className="text-xs opacity-75">{formatDays(intervals.good)}</span>
                  </Button>
                  <Button
                    onClick={() => handleDifficulty('easy')}
                    className="flex flex-col items-center py-4 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <span className="text-xl mb-1">😄</span>
                    <span>Einfach</span>
                    <span className="text-xs opacity-75">{formatDays(intervals.easy)}</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
