import { ProjectStatus } from '../enums/ProjectStatus';
import { Season } from './Season';

export interface Project {
  id?: string;
  name: string;
  code: string;
  description: string;
  status: ProjectStatus;
  seasons?: Season[];
  departments?: string[];
}
