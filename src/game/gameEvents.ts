import type { InteractableDefinition } from './roomData';
import type { PortfolioSectionId } from '../types/portfolio';

export type InteractableSummary = Pick<
  InteractableDefinition,
  'id' | 'label' | 'prompt' | 'sectionId'
>;

const eventTarget = new EventTarget();

const nearbyInteractableEvent = 'portfolio:nearby-interactable';
const openSectionEvent = 'portfolio:open-section';
const uiLockEvent = 'portfolio:ui-lock';

export function emitNearbyInteractable(
  interactable: InteractableSummary | null,
) {
  eventTarget.dispatchEvent(
    new CustomEvent<InteractableSummary | null>(nearbyInteractableEvent, {
      detail: interactable,
    }),
  );
}

export function onNearbyInteractable(
  handler: (interactable: InteractableSummary | null) => void,
) {
  const listener = (event: Event) => {
    handler(
      (event as CustomEvent<InteractableSummary | null>).detail,
    );
  };

  eventTarget.addEventListener(nearbyInteractableEvent, listener);

  return () => {
    eventTarget.removeEventListener(nearbyInteractableEvent, listener);
  };
}

export function emitOpenSection(sectionId: PortfolioSectionId) {
  eventTarget.dispatchEvent(
    new CustomEvent<PortfolioSectionId>(openSectionEvent, {
      detail: sectionId,
    }),
  );
}

export function onOpenSection(
  handler: (sectionId: PortfolioSectionId) => void,
) {
  const listener = (event: Event) => {
    handler((event as CustomEvent<PortfolioSectionId>).detail);
  };

  eventTarget.addEventListener(openSectionEvent, listener);

  return () => {
    eventTarget.removeEventListener(openSectionEvent, listener);
  };
}

export function emitUiLock(locked: boolean) {
  eventTarget.dispatchEvent(
    new CustomEvent<boolean>(uiLockEvent, {
      detail: locked,
    }),
  );
}

export function onUiLock(handler: (locked: boolean) => void) {
  const listener = (event: Event) => {
    handler((event as CustomEvent<boolean>).detail);
  };

  eventTarget.addEventListener(uiLockEvent, listener);

  return () => {
    eventTarget.removeEventListener(uiLockEvent, listener);
  };
}
