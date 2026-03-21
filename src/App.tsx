import { useEffect, useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { InteractionPrompt } from './components/InteractionPrompt';
import { SectionModal } from './components/SectionModal';
import {
  emitUiLock,
  onNearbyInteractable,
  onOpenSection,
  type InteractableSummary,
} from './game/gameEvents';
import type { PortfolioSectionId } from './types/portfolio';

export default function App() {
  const [activeSection, setActiveSection] =
    useState<PortfolioSectionId | null>(null);
  const [nearbyInteractable, setNearbyInteractable] =
    useState<InteractableSummary | null>(null);

  useEffect(() => {
    const unsubscribeNearby = onNearbyInteractable((interactable) => {
      setNearbyInteractable(interactable);
    });

    const unsubscribeOpen = onOpenSection((sectionId) => {
      setActiveSection(sectionId);
    });

    return () => {
      unsubscribeNearby();
      unsubscribeOpen();
    };
  }, []);

  useEffect(() => {
    emitUiLock(Boolean(activeSection));
  }, [activeSection]);

  return (
    <main className="fixed inset-0 overflow-hidden text-pub-cream">
      <GameCanvas />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(7,4,3,0.45)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-20">
        <section className="pointer-events-auto absolute left-4 top-4 max-w-xs rounded-2xl border border-pub-brass/30 bg-[#1b1310]/78 px-4 py-3 shadow-panel backdrop-blur-sm sm:left-6 sm:top-6">
          <p className="font-display text-[11px] uppercase tracking-[0.35em] text-pub-brass">
            The Lantern & Link
          </p>
          <p className="mt-2 text-sm leading-6 text-pub-cream/80">
            Walk the room. Press E when a prompt appears.
          </p>
        </section>

        <aside className="pointer-events-auto absolute bottom-4 right-4 rounded-2xl border border-pub-brass/30 bg-[#1b1310]/78 px-4 py-3 text-sm text-pub-cream/80 shadow-panel backdrop-blur-sm sm:bottom-6 sm:right-6">
          WASD / Arrows to move
        </aside>

        <InteractionPrompt
          interactable={nearbyInteractable}
          hidden={Boolean(activeSection)}
        />
      </div>
      <SectionModal
        sectionId={activeSection}
        onClose={() => setActiveSection(null)}
      />
    </main>
  );
}
