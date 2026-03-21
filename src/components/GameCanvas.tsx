import { useEffect, useRef } from 'react';
import type Phaser from 'phaser';
import { createPortfolioGame } from '../game/createPortfolioGame';
import { emitNearbyInteractable, emitUiLock } from '../game/gameEvents';

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) {
      return;
    }

    gameRef.current = createPortfolioGame(containerRef.current);

    return () => {
      emitUiLock(false);
      emitNearbyInteractable(null);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-pub-brass/50 bg-[#130d0b] shadow-panel">
      <div ref={containerRef} className="aspect-[3/2] w-full" />
    </div>
  );
}
