import { Identity } from './Identity';

export interface User {
  id?: string;
  identityId?: string;
  code?: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  supervisors?: User[] | null;
  supervised?: User[] | null;
  identity?: Identity | null;
}
