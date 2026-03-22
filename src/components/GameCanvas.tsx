import { useEffect, useRef } from 'react';
import type Phaser from 'phaser';
import { createPortfolioGame } from '../game/createPortfolioGame';
import {
  emitNearbyInteractable,
  emitUiLock,
} from '../game/gameEvents';

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) {
      return;
    }

    gameRef.current = createPortfolioGame(containerRef.current);

    const syncSize = () => {
      const container = containerRef.current;
      const game = gameRef.current;

      if (!container || !game) {
        return;
      }

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      game.scale.resize(width, height);
      game.canvas.style.width = '100%';
      game.canvas.style.height = '100%';
    };

    const resizeObserver = new ResizeObserver(() => {
      syncSize();
    });

    resizeObserver.observe(containerRef.current);

    const handleResize = () => {
      syncSize();
    };

    window.addEventListener('resize', handleResize);
    syncSize();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      emitUiLock(false);
      emitNearbyInteractable(null);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#130d0b]">
      <div ref={containerRef} className="h-screen w-screen" />
    </div>
  );
}
