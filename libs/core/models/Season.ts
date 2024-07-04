import { Project } from './Project';

export interface Season {
  id?: string;
  name: string;
  code: string;
  projects?: Project[];
}
