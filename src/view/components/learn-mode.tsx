import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, X, RotateCcw, Shuffle, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/view/ui/button';
import { Card, CardContent } from '@/view/ui/card';
import { Progress } from '@/view/ui/progress';
import { useSettings } from '@/controller/hooks/useSettings';
import { calculateNextReview, DEFAULT_INTERVALS } from '@/model/services/spaced-repetition';
import type { Deck, Card as FlashCard, Difficulty } from '@/model/types/types';

interface LearnModeProps {
  deck: Deck;
  cards: FlashCard[];
  onExit: () => void;
  onUpdateCard: (cardId: string, updates: Partial<FlashCard>) => void;
  onCardReviewed: (difficulty: 'easy' | 'good' | 'hard' | 'again', isCorrect: boolean) => void;
}

interface CardWithReverse extends FlashCard {
  isReversed?: boolean;
}

// Helper function to normalize and compare answers
const normalizeAnswer = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // normalize spaces
    .replace(/[.,!?;:]/g, ''); // remove punctuation
};

const isAnswerCorrect = (userAnswer: string, correctAnswer: string): boolean => {
  const normalizedUser = normalizeAnswer(userAnswer);
  const normalizedCorrect = normalizeAnswer(correctAnswer);
  
  // Exact match
  if (normalizedUser === normalizedCorrect) return true;
  
  // Check if answer is contained or contains (for partial matches)
  if (normalizedUser.includes(normalizedCorrect) || normalizedCorrect.includes(normalizedUser)) {
    // Only accept if difference is small (less than 20% difference)
    const diff = Math.abs(normalizedUser.length - normalizedCorrect.length);
    const avgLength = (normalizedUser.length + normalizedCorrect.length) / 2;
    return (diff / avgLength) < 0.2;
  }
  
  return false;
};

// Map old ratings to new difficulty system
const mapRatingToDifficulty = (rating: 'hard' | 'medium' | 'easy', isCorrect: boolean): Difficulty => {
  if (!isCorrect) return 'again';
  if (rating === 'hard') return 'hard';
  if (rating === 'medium') return 'good';
  return 'easy';
};

export function LearnMode({ deck, cards, onExit, onUpdateCard, onCardReviewed }: LearnModeProps) {
  const { settings } = useSettings();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<CardWithReverse[]>([]);
  const [reviewedCards, setReviewedCards] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerIsCorrect, setAnswerIsCorrect] = useState(false);
  const [randomizeOrder, setRandomizeOrder] = useState(settings.shuffleMode);
  const [randomizeSides, setRandomizeSides] = useState(settings.randomSide);

  // Use user's intervals or defaults
  const intervals = settings.intervals || DEFAULT_INTERVALS;

  const prepareCards = (shouldRandomizeOrder: boolean, shouldRandomizeSides: boolean) => {
    let processedCards: CardWithReverse[] = [...cards];
    
    // Add random side flipping
    if (shouldRandomizeSides) {
      processedCards = processedCards.map(card => ({
        ...card,
        isReversed: Math.random() > 0.5,
      }));
    }
    
    // Sort or shuffle
    if (shouldRandomizeOrder) {
      // Complete random shuffle
      processedCards = processedCards.sort(() => Math.random() - 0.5);
    } else {
      // Prioritize cards due today
      const now = new Date();
      processedCards = processedCards.sort((a, b) => {
        const aDate = new Date(a.nextReview).getTime();
        const bDate = new Date(b.nextReview).getTime();
        const nowTime = now.getTime();
        
        // Cards due today come first
        const aDue = aDate <= nowTime;
        const bDue = bDate <= nowTime;
        
        if (aDue && !bDue) return -1;
        if (!aDue && bDue) return 1;
        
        // Then by review date
        return aDate - bDate;
      });
    }
    
    return processedCards;
  };

  useEffect(() => {
    const prepared = prepareCards(randomizeOrder, randomizeSides);
    setShuffledCards(prepared);
  }, [cards, randomizeOrder, randomizeSides]);

  const handleToggleRandomOrder = () => {
    setRandomizeOrder(!randomizeOrder);
    // Reset to first card
    setCurrentCardIndex(0);
    setReviewedCards(0);
    setIsFlipped(false);
    setShowHint(false);
    setUserAnswer('');
    setShowAnswer(false);
    setAnswerIsCorrect(false);
  };

  const handleToggleRandomSides = () => {
    setRandomizeSides(!randomizeSides);
    // Reset to first card
    setCurrentCardIndex(0);
    setReviewedCards(0);
    setIsFlipped(false);
    setShowHint(false);
    setUserAnswer('');
    setShowAnswer(false);
    setAnswerIsCorrect(false);
  };

  if (shuffledCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Card>
          <CardContent className="py-12">
            <h3 className="text-xl mb-4">Keine Karten zum Lernen</h3>
            <p className="text-muted-foreground mb-6">
              Dieses Deck enthält keine aktiven Karten. Alle Karten könnten pausiert sein.
            </p>
            <Button onClick={onExit} className="bg-[#007BFF] hover:bg-[#0056b3]">
              Zurück zum Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCard = shuffledCards[currentCardIndex];
  const progress = ((reviewedCards) / shuffledCards.length) * 100;
  
  // Get question and answer based on whether card is reversed
  const questionText = currentCard.isReversed ? currentCard.back : currentCard.front;
  const answerText = currentCard.isReversed ? currentCard.front : currentCard.back;

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleSubmitAnswer = () => {
    const correct = isAnswerCorrect(userAnswer, answerText);
    setAnswerIsCorrect(correct);
    setShowAnswer(true);
  };

  // Calculate next review date for display
  const getNextReviewLabel = (difficulty: Difficulty): string => {
    const result = calculateNextReview(currentCard, difficulty, intervals);
    const days = result.interval;
    if (days === 1) return 'Morgen';
    if (days < 30) return `${days} Tage`;
    const months = Math.round(days / 30);
    return `${months} Monat${months > 1 ? 'e' : ''}`;
  };

  const handleRating = (rating: 'hard' | 'medium' | 'easy') => {
    const difficulty = mapRatingToDifficulty(rating, answerIsCorrect);
    
    // Use the spaced repetition algorithm with user's intervals
    const updates = calculateNextReview(currentCard, difficulty, intervals);

    onUpdateCard(currentCard.id, updates);

    // Call the onCardReviewed callback
    onCardReviewed(difficulty, answerIsCorrect);

    // Move to next card
    setReviewedCards(reviewedCards + 1);
    
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowHint(false);
      setUserAnswer('');
      setShowAnswer(false);
      setAnswerIsCorrect(false);
    } else {
      // End of deck
      handleComplete();
    }
  };

  const handleComplete = () => {
    alert(`Glückwunsch! Du hast alle ${shuffledCards.length} Karten durchgearbeitet!`);
    onExit();
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setReviewedCards(0);
    setIsFlipped(false);
    setShowHint(false);
    setUserAnswer('');
    setShowAnswer(false);
    setAnswerIsCorrect(false);
    const prepared = prepareCards(randomizeOrder, randomizeSides);
    setShuffledCards(prepared);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl">Lernmodus - {deck.name}</h2>
          <p className="text-muted-foreground">
            Karte {currentCardIndex + 1} von {shuffledCards.length}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={randomizeOrder ? "default" : "outline"}
            size="icon" 
            onClick={handleToggleRandomOrder} 
            title="Zufällige Reihenfolge"
            className={randomizeOrder ? "bg-[#007BFF] hover:bg-[#0056b3]" : ""}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button 
            variant={randomizeSides ? "default" : "outline"}
            size="icon" 
            onClick={handleToggleRandomSides} 
            title="Zufällige Seiten (Vorder-/Rückseite)"
            className={randomizeSides ? "bg-[#007BFF] hover:bg-[#0056b3]" : ""}
          >
            <ArrowLeftRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleRestart} title="Neu starten">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onExit}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        {(randomizeOrder || randomizeSides) && (
          <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
            {randomizeOrder && (
              <span className="flex items-center gap-1">
                <Shuffle className="w-3 h-3" />
                Zufällige Reihenfolge
              </span>
            )}
            {randomizeSides && (
              <span className="flex items-center gap-1">
                <ArrowLeftRight className="w-3 h-3" />
                Zufällige Seiten
              </span>
            )}
          </div>
        )}
      </div>

      {/* Flashcard */}
      <div className="mb-6" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentCard.id}-${currentCard.isReversed}`}
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.4 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {!isFlipped ? (
              /* Question Card */
              <div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="min-h-[300px] hover:shadow-lg transition-shadow cursor-pointer" onClick={handleFlip}>
                    <CardContent className="flex items-center justify-center p-12 min-h-[300px]">
                      <div className="text-center w-full">
                        <div className="text-sm text-muted-foreground mb-2">
                          Frage {currentCard.isReversed && <span className="text-orange-500">(Umgekehrt)</span>}
                        </div>
                        <div className="text-xl">
                          {questionText}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <div className="text-center mt-3 text-sm text-muted-foreground">
                  Klicke auf die Karte zum Umdrehen
                </div>
              </div>
            ) : (
              /* Answer Input */
              <div>
                <Card className="min-h-[300px]">
                  <CardContent className="p-8">
                    {!showAnswer ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-2">
                            Frage {currentCard.isReversed && <span className="text-orange-500">(Umgekehrt)</span>}
                          </div>
                          <div className="text-lg mb-6">
                            {questionText}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Deine Antwort:
                          </label>
                          <textarea
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmitAnswer();
                              }
                            }}
                            placeholder="Gib hier deine Antwort ein..."
                            className="w-full p-3 border rounded-lg min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-[#007BFF] dark:bg-gray-800 dark:border-gray-700"
                            autoFocus
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Drücke Enter zum Absenden oder Shift+Enter für eine neue Zeile
                          </p>
                        </div>
                        <Button
                          onClick={handleSubmitAnswer}
                          className="w-full bg-[#007BFF] hover:bg-[#0056b3]"
                        >
                          Antwort prüfen
                        </Button>
                      </div>
                    ) : (
                      /* Show Answer Comparison */
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-2">
                            Frage {currentCard.isReversed && <span className="text-orange-500">(Umgekehrt)</span>}
                          </div>
                          <div className="text-lg mb-6">
                            {questionText}
                          </div>
                        </div>
                        
                        <div className="grid gap-4">
                          <div className={`p-4 border rounded-lg ${
                            answerIsCorrect 
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                          }`}>
                            <div className={`text-sm font-medium mb-2 ${
                              answerIsCorrect
                                ? 'text-green-900 dark:text-green-100'
                                : 'text-red-900 dark:text-red-100'
                            }`}>
                              Deine Antwort:
                            </div>
                            <div className={answerIsCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                              {userAnswer || <span className="italic text-muted-foreground">Keine Antwort eingegeben</span>}
                            </div>
                          </div>
                          
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                              Korrekte Antwort:
                            </div>
                            <div className="text-blue-800 dark:text-blue-200">
                              {answerText}
                            </div>
                          </div>
                        </div>

                        {answerIsCorrect ? (
                          <div className="text-center p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                            <p className="text-green-800 dark:text-green-200 font-medium">
                              ✓ Perfekt! Deine Antwort ist korrekt.
                            </p>
                          </div>
                        ) : (
                          <div className="text-center p-3 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded-lg">
                            <p className="text-orange-800 dark:text-orange-200 font-medium">
                              Nicht ganz richtig. Vergleiche deine Antwort mit der korrekten Lösung.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hint Button - Now always visible if hint exists */}
      {currentCard.hint && (
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowHint(!showHint)}
            className="w-full"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {showHint ? 'Hinweis verbergen' : 'Hinweis anzeigen'}
          </Button>
          
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">{currentCard.hint}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Rating Buttons */}
      {isFlipped && showAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h4 className="font-semibold mb-2">Wie gut kanntest du die Antwort?</h4>
                <p className="text-sm text-muted-foreground">
                  {answerIsCorrect 
                    ? 'Deine Antwort war korrekt! Wähle basierend auf der Schwierigkeit:'
                    : 'Bewerte ehrlich, wie gut du die Antwort wusstest:'}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => handleRating('hard')}
                  className="bg-red-600 hover:bg-red-700 text-white flex-col h-auto py-3"
                >
                  <span className="font-semibold">Schwer</span>
                  <div className="text-xs opacity-80 mt-1">
                    {!answerIsCorrect ? 'Nochmal' : getNextReviewLabel('hard')}
                  </div>
                </Button>
                <Button
                  onClick={() => handleRating('medium')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white flex-col h-auto py-3"
                >
                  <span className="font-semibold">Gut</span>
                  <div className="text-xs opacity-80 mt-1">
                    {!answerIsCorrect ? 'Nochmal' : getNextReviewLabel('good')}
                  </div>
                </Button>
                <Button
                  onClick={() => handleRating('easy')}
                  className="bg-green-600 hover:bg-green-700 text-white flex-col h-auto py-3"
                >
                  <span className="font-semibold">Leicht</span>
                  <div className="text-xs opacity-80 mt-1">
                    {!answerIsCorrect ? 'Nochmal' : getNextReviewLabel('easy')}
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
