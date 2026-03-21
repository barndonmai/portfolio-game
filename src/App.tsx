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
    <main className="min-h-screen px-4 py-6 text-pub-cream sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-3xl border border-pub-brass/30 bg-[#1b1310]/90 p-6 shadow-panel">
          <p className="font-display text-xs uppercase tracking-[0.35em] text-pub-brass">
            Cozy Pixel Pub Portfolio
          </p>
          <h1 className="mt-3 font-display text-3xl text-white sm:text-4xl">
            The Lantern & Link
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-pub-cream/85 sm:text-base">
            Explore a single-room pub built in Phaser, then open portfolio
            panels in React. Walk with WASD or arrow keys, and press E near a
            hotspot to open About, Experience, Projects, Resume, or Contact.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="relative">
            <GameCanvas />
            <InteractionPrompt
              interactable={nearbyInteractable}
              hidden={Boolean(activeSection)}
            />
          </div>

          <aside className="rounded-3xl border border-pub-brass/30 bg-[#1b1310]/90 p-5 shadow-panel">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-pub-brass">
              Controls
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-pub-cream/85">
              <p>
                Move with <span className="text-white">WASD</span> or{' '}
                <span className="text-white">arrow keys</span>.
              </p>
              <p>
                Approach highlighted pub props and press{' '}
                <span className="text-white">E</span>.
              </p>
              <p>
                React owns the content panels. Phaser only manages the room,
                movement, collisions, and interaction events.
              </p>
            </div>
          </aside>
        </section>
      </div>

      <SectionModal
        sectionId={activeSection}
        onClose={() => setActiveSection(null)}
      />
    </main>
  );
}
