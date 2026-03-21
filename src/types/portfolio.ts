export type PortfolioSectionId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'resume'
  | 'contact';

export interface PortfolioSection {
  title: string;
  eyebrow: string;
  paragraphs: string[];
  highlights?: string[];
  actionLabel?: string;
  actionHref?: string;
}
