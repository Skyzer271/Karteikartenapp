import { useState } from 'react';
import { ImagePlus, Volume2, X } from 'lucide-react';
import { Button } from '@/view/ui/button';
import { Input } from '@/view/ui/input';
import { Textarea } from '@/view/ui/textarea';
import { Label } from '@/view/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/view/ui/select';
import type { Deck } from '@/model/types/types';
import type { Card as FlashCard } from '@/model/types/types';

interface CreateCardProps {
  decks: Deck[];
  onCreateCard: (card: Omit<FlashCard, 'id' | 'difficulty' | 'nextReview' | 'reviewCount'>) => void;
  onCancel: () => void;
}

export function CreateCard({ decks, onCreateCard, onCancel }: CreateCardProps) {
  const [selectedDeckId, setSelectedDeckId] = useState(decks[0]?.id || '');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [hint, setHint] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim() || !selectedDeckId) return;

    onCreateCard({
      deckId: selectedDeckId,
      front: front.trim(),
      back: back.trim(),
      hint: hint.trim() || undefined,
    });
  };

  const handleMediaUpload = (type: 'image' | 'audio') => {
    alert(`${type === 'image' ? 'Bild' : 'Audio'}-Upload würde hier implementiert werden`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Neue Karteikarte erstellen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Deck Selection */}
            <div className="space-y-2">
              <Label htmlFor="deck">Deck auswählen</Label>
              <Select value={selectedDeckId} onValueChange={setSelectedDeckId}>
                <SelectTrigger id="deck">
                  <SelectValue placeholder="Wähle ein Deck" />
                </SelectTrigger>
                <SelectContent>
                  {decks.map((deck) => (
                    <SelectItem key={deck.id} value={deck.id}>
                      {deck.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Front Side (Question) */}
            <div className="space-y-2">
              <Label htmlFor="front">Vorderseite (Frage)</Label>
              <Textarea
                id="front"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Was ist 2+2?"
                className="min-h-[100px]"
                required
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleMediaUpload('image')}
                >
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Bild hinzufügen
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleMediaUpload('audio')}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Audio hinzufügen
                </Button>
              </div>
            </div>

            {/* Back Side (Answer) */}
            <div className="space-y-2">
              <Label htmlFor="back">Rückseite (Antwort)</Label>
              <Textarea
                id="back"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="4"
                className="min-h-[100px]"
                required
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleMediaUpload('image')}
                >
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Bild hinzufügen
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleMediaUpload('audio')}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Audio hinzufügen
                </Button>
              </div>
            </div>

            {/* Hint */}
            <div className="space-y-2">
              <Label htmlFor="hint">Hinweis (optional)</Label>
              <Textarea
                id="hint"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder="Denke an Addition"
                className="min-h-[80px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                Abbrechen
              </Button>
              <Button 
                type="submit" 
                className="bg-[#007BFF] hover:bg-[#0056b3]"
                disabled={!front.trim() || !back.trim() || !selectedDeckId}
              >
                Speichern
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
