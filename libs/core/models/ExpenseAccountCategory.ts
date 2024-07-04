import { CategoryStatus } from "../enums/CategoryStatus";

export interface ExpenseAccountCategory {
  id?: string;
  name: string;
  description: string;
  status?: CategoryStatus;
}
