import { portfolioSections } from '../content/portfolioSections';
import type { PortfolioSectionId } from '../types/portfolio';

interface SectionModalProps {
  sectionId: PortfolioSectionId | null;
  onClose: () => void;
}

export function SectionModal({
  sectionId,
  onClose,
}: SectionModalProps) {
  if (!sectionId) {
    return null;
  }

  const section = portfolioSections[sectionId];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0d0806]/80 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-pub-brass/40 bg-[#241815] p-6 text-pub-cream shadow-panel">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-pub-brass">
              {section.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl text-white">
              {section.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-pub-brass/40 px-3 py-1 text-sm text-pub-cream hover:bg-pub-brass/10"
          >
            Close
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-7 text-pub-cream/90">
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {section.highlights && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {section.highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-2xl border border-pub-brass/25 bg-[#1b1210] px-4 py-3 text-sm text-pub-cream"
              >
                {highlight}
              </div>
            ))}
          </div>
        )}

        {section.actionLabel && (
          <div className="mt-6">
            <a
              href={section.actionHref}
              className="inline-flex rounded-full border border-pub-brass/60 px-4 py-2 text-sm text-pub-cream hover:bg-pub-brass/10"
            >
              {section.actionLabel}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
