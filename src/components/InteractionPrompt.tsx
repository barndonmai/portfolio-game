import type { InteractableSummary } from "../game/gameEvents";

interface InteractionPromptProps {
  interactable: InteractableSummary | null;
  hidden?: boolean;
  isTouchUi?: boolean;
  onActivate?: (interactable: InteractableSummary) => void;
}

export function InteractionPrompt({
  interactable,
  hidden = false,
  isTouchUi = false,
  onActivate,
}: InteractionPromptProps) {
  if (!interactable || hidden) {
    return null;
  }

  const promptBody = (
    <>
      <p className="font-display text-xs uppercase tracking-[0.24em] text-pub-brass">
        {interactable.label}
      </p>
      <p className="mt-1 text-sm text-pub-cream">
        {isTouchUi ? "Tap here to open" : interactable.prompt}
      </p>
    </>
  );

  if (isTouchUi) {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
        <button
          type="button"
          className="pointer-events-auto rounded-full border border-pub-brass/70 bg-pub-ink/90 px-4 py-2 text-center shadow-lg backdrop-blur-sm"
          onClick={() => onActivate?.(interactable)}
        >
          {promptBody}
        </button>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
      <div className="rounded-full border border-pub-brass/70 bg-pub-ink/90 px-4 py-2 text-center shadow-lg backdrop-blur-sm">
        {promptBody}
      </div>
    </div>
  );
}
