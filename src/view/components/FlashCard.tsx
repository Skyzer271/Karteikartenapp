import React, { useState } from 'react';
import { motion } from 'motion/react';
import type { Card as CardType } from '@/model/types/types';

interface FlashCardProps {
  card: CardType;
  showBack?: boolean;
  onFlip?: () => void;
  fontSize: 'small' | 'medium' | 'large';
}

const fontSizeClasses = {
  small: 'text-base',
  medium: 'text-xl',
  large: 'text-2xl',
};

export function FlashCard({ card, showBack = false, onFlip, fontSize }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(showBack);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto">
      <motion.div
        className="relative w-full h-[400px] cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        onClick={handleFlip}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-card rounded-2xl shadow-2xl p-8 flex items-center justify-center border border-border"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-4">Vorderseite</div>
            <p className={`${fontSizeClasses[fontSize]} leading-relaxed`}>
              {card.front}
            </p>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-card rounded-2xl shadow-2xl p-8 flex items-center justify-center border-2 border-primary"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-center">
            <div className="text-sm text-primary mb-4">Rückseite</div>
            <p className={`${fontSizeClasses[fontSize]} leading-relaxed`}>
              {card.back}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="text-center mt-4 text-sm text-muted-foreground">
        Klicken zum Umdrehen
      </div>
    </div>
  );
}