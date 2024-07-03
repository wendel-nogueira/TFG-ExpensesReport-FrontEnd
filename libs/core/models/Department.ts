import { DepartmentStatus } from '../enums/DepartmentStatus';

export interface Department {
  id?: string;
  name: string;
  acronym: string;
  description: string;
  status?: DepartmentStatus;
  managers?: string[];
  employees?: string[];
}
