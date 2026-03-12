import { useState } from 'react';
import { Search, Edit, Trash2, Share2, Plus, Download, Upload, Settings, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/view/ui/button';
import { Input } from '@/view/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/ui/card';
import type { Deck } from '@/model/types/types';
import type { Card as FlashCard } from '@/model/types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/view/ui/dialog';
import { Label } from '@/view/ui/label';

interface DashboardProps {
  decks: Deck[];
  cards: FlashCard[];
  todayStats: {
    totalReviewed: number;
    correct: number;
    incorrect: number;
  };
  onStartLearning: (deck: Deck) => void;
  onDeleteDeck: (deckId: string) => void;
  onCreateDeck: (name: string) => void;
  onNavigateToCreate: () => void;
  onOpenSettings: () => void;
  onPauseCard: (cardId: string, pausedUntil: Date | null) => void;
  onResetStats: () => void;
}

export function Dashboard({
  decks,
  cards,
  todayStats,
  onStartLearning,
  onDeleteDeck,
  onCreateDeck,
  onNavigateToCreate,
  onOpenSettings,
  onPauseCard,
  onResetStats,
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [newDeckName, setNewDeckName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDeckForCards, setSelectedDeckForCards] = useState<Deck | null>(null);
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [selectedCardForPause, setSelectedCardForPause] = useState<FlashCard | null>(null);
  const [pauseMonths, setPauseMonths] = useState('1');

  const filteredDecks = decks.filter(deck =>
    deck.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const totalCards = cards.length;
  const todayLearned = todayStats.totalReviewed;
  const correctRate = todayStats.totalReviewed > 0 
    ? Math.round((todayStats.correct / todayStats.totalReviewed) * 100)
    : 0;
  
  // Calculate cards due tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
  
  const cardsDueTomorrow = cards.filter(card => {
    if (card.isPaused) return false;
    const reviewDate = new Date(card.nextReview);
    reviewDate.setHours(0, 0, 0, 0);
    return reviewDate >= tomorrow && reviewDate < dayAfterTomorrow;
  }).length;

  // Calculate active (not paused) cards due today
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const cardsDueToday = cards.filter(card => {
    if (card.isPaused) return false;
    const reviewDate = new Date(card.nextReview);
    reviewDate.setHours(0, 0, 0, 0);
    return reviewDate <= now;
  }).length;

  const handleCreateDeck = () => {
    if (newDeckName.trim()) {
      onCreateDeck(newDeckName);
      setNewDeckName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleShare = (deck: Deck) => {
    // Mock share functionality
    alert(`Teilen-Link für "${deck.name}" wurde in die Zwischenablage kopiert!`);
  };

  const handlePauseCard = (card: FlashCard) => {
    setSelectedCardForPause(card);
    setPauseDialogOpen(true);
  };

  const handleConfirmPause = () => {
    if (!selectedCardForPause) return;
    
    const months = parseInt(pauseMonths) || 1;
    const pauseUntilDate = new Date();
    pauseUntilDate.setMonth(pauseUntilDate.getMonth() + months);
    
    onPauseCard(selectedCardForPause.id, pauseUntilDate);
    setPauseDialogOpen(false);
    setSelectedCardForPause(null);
    setPauseMonths('1');
  };

  const handleResumeCard = (card: FlashCard) => {
    onPauseCard(card.id, null);
  };

  const getDeckCards = (deckId: string) => {
    return cards.filter(c => c.deckId === deckId);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl mb-4">Dashboard</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Suche nach Decks/Karten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Decks Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Meine Decks</h3>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#007BFF] hover:bg-[#0056b3]">
                  <Plus className="w-4 h-4 mr-2" />
                  Neues Deck
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neues Deck erstellen</DialogTitle>
                  <DialogDescription>
                    Gib deinem neuen Karteikarten-Deck einen Namen.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="deck-name">Deck-Name</Label>
                  <Input
                    id="deck-name"
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    placeholder="z.B. Biologie"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateDeck()}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Abbrechen
                  </Button>
                  <Button 
                    onClick={handleCreateDeck}
                    className="bg-[#007BFF] hover:bg-[#0056b3]"
                  >
                    Erstellen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {filteredDecks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  {searchQuery ? 'Keine Decks gefunden' : 'Noch keine Decks vorhanden'}
                </CardContent>
              </Card>
            ) : (
              filteredDecks.map((deck) => {
                const deckCards = getDeckCards(deck.id);
                const activeDeckCards = deckCards.filter(c => !c.isPaused).length;
                const pausedDeckCards = deckCards.filter(c => c.isPaused).length;
                
                return (
                  <Card key={deck.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold">{deck.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {activeDeckCards} aktive Karten
                            {pausedDeckCards > 0 && ` • ${pausedDeckCards} pausiert`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onStartLearning(deck)}
                            className="hover:bg-[#007BFF] hover:text-white"
                            disabled={activeDeckCards === 0}
                          >
                            Lernen
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setSelectedDeckForCards(deck)}
                            title="Karten verwalten"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleShare(deck)}
                            title="Teilen"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDeleteDeck(deck.id)}
                            title="Löschen"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Expanded card list */}
                      {selectedDeckForCards?.id === deck.id && (
                        <div className="mt-4 pt-4 border-t space-y-2">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-medium">Karten in diesem Deck:</h5>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedDeckForCards(null)}
                            >
                              Schließen
                            </Button>
                          </div>
                          {deckCards.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">
                              Keine Karten vorhanden
                            </p>
                          ) : (
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {deckCards.map((card) => (
                                <div
                                  key={card.id}
                                  className={`p-3 rounded-lg border text-sm ${
                                    card.isPaused 
                                      ? 'bg-muted/50 border-muted' 
                                      : 'bg-background'
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium truncate">{card.front}</p>
                                      <p className="text-muted-foreground text-xs truncate">
                                        {card.back}
                                      </p>
                                      {card.isPaused && card.pausedUntil && (
                                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                          Pausiert bis {new Date(card.pausedUntil).toLocaleDateString('de-DE')}
                                        </p>
                                      )}
                                    </div>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="flex-shrink-0"
                                      onClick={() => card.isPaused ? handleResumeCard(card) : handlePauseCard(card)}
                                      title={card.isPaused ? 'Fortsetzen' : 'Pausieren'}
                                    >
                                      {card.isPaused ? (
                                        <Play className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <Pause className="w-4 h-4 text-orange-600" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Statistics Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Statistiken</CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onResetStats}
                  title="Statistiken zurücksetzen"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Heute gelernt</div>
                <div className="text-2xl font-semibold" style={{ color: '#007BFF' }}>
                  {todayLearned} Karten
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Korrekte Antworten</div>
                <div className="text-2xl font-semibold text-green-600">
                  {correctRate}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Heute fällig</div>
                <div className="text-2xl font-semibold text-orange-600">
                  {cardsDueToday}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Gesamt Karten</div>
                <div className="text-2xl font-semibold">
                  {totalCards}
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground mb-1">Morgen zu lernen</div>
                <div className="text-2xl font-semibold" style={{ color: '#007BFF' }}>
                  {cardsDueTomorrow} Karten
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aktionen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => alert('Import-Funktion')}
              >
                <Upload className="w-4 h-4 mr-2" />
                Importieren
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => alert('Export-Funktion')}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportieren
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={onOpenSettings}
              >
                <Settings className="w-4 h-4 mr-2" />
                Einstellungen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pause Card Dialog */}
      <Dialog open={pauseDialogOpen} onOpenChange={setPauseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Karte pausieren</DialogTitle>
            <DialogDescription>
              Wähle wie lange diese Karte pausiert werden soll.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="pause-months">Anzahl Monate</Label>
            <Input
              id="pause-months"
              type="number"
              min="1"
              max="12"
              value={pauseMonths}
              onChange={(e) => setPauseMonths(e.target.value)}
              placeholder="1"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Die Karte wird bis {new Date(new Date().setMonth(new Date().getMonth() + parseInt(pauseMonths || '1'))).toLocaleDateString('de-DE')} pausiert.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPauseDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button 
              onClick={handleConfirmPause}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Pausieren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}