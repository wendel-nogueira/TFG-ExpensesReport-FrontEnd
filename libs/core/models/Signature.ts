import { User } from "./User";

export interface Signature {
  id?: string;
  userId?: string;
  user?: User;
  name?: string;
  acceptance: boolean;
  signatureDate?: Date;
  ipAddress: string;
}
