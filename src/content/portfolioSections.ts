import type {
  PortfolioSection,
  PortfolioSectionId,
} from '../types/portfolio';

export const portfolioSections: Record<
  PortfolioSectionId,
  PortfolioSection
> = {
  about: {
    title: 'About',
    eyebrow: 'Booth Conversation',
    paragraphs: [
      'This is placeholder copy for your personal intro. Replace it with the short story you want visitors to remember after walking through the room.',
      'A good final version usually covers who you are, the kind of product or engineering work you enjoy, and the tone you want your portfolio to carry.',
    ],
    highlights: [
      'Frontend-heavy product engineer',
      'Likes playful interfaces with clean architecture',
      'Interested in game-inspired storytelling on the web',
    ],
  },
  experience: {
    title: 'Experience',
    eyebrow: 'Bar Ledger',
    paragraphs: [
      'Use this section for your timeline, role summaries, and the impact you had in each position.',
      'For the MVP, keep it short and scannable. You can expand this later into role cards or a proper resume timeline.',
    ],
    highlights: [
      'Company Name - Senior Frontend Engineer',
      'Company Name - Product Engineer',
      'Agency / Freelance - Interactive Web Projects',
    ],
  },
  projects: {
    title: 'Projects',
    eyebrow: 'Community Board',
    paragraphs: [
      'This panel is meant for your featured work. Start with two or three projects and a one-line summary of what each one solves.',
      'You can later turn this into a project carousel, a filterable list, or link cards without changing the Phaser room logic.',
    ],
    highlights: [
      'Project One - Interactive portfolio experiment',
      'Project Two - Design system or product build',
      'Project Three - Game-inspired web experience',
    ],
  },
  resume: {
    title: 'Resume',
    eyebrow: 'Framed Copy',
    paragraphs: [
      'This placeholder section can link to a hosted PDF later or summarize your resume in plain text.',
      'For a static-site deployment, a simple `/resume.pdf` asset is enough. The React modal only needs the URL.',
    ],
    actionLabel: 'Replace with resume link',
    actionHref: '#',
  },
  contact: {
    title: 'Contact',
    eyebrow: 'Pub Phone',
    paragraphs: [
      'Keep contact options direct. Email first, then any public profile links you actually want people to use.',
      'This MVP uses placeholder copy, but the structure is ready for real contact details.',
    ],
    highlights: [
      'email@example.com',
      'linkedin.com/in/your-name',
      'github.com/your-name',
    ],
  },
};
