import { UserRoles, UserStatus } from '../enums/index';

export interface Identity {
  id?: string;
  username?: string;
  email: string;
  role: UserRoles;
  status?: UserStatus;
}
