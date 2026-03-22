import type { PortfolioSectionId } from '../../../types/portfolio';

export interface FurnitureDefinition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  stroke: number;
  shape?: 'rectangle' | 'ellipse';
  collides?: boolean;
}

export interface InteractableDefinition {
  id: string;
  sectionId: PortfolioSectionId;
  label: string;
  prompt: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
}

export interface WallColliderDefinition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
