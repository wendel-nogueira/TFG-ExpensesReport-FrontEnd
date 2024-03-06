export interface TokenData {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  nbf?: number;
  subject?: string;
  nameid: string;
  name: string;
  email: string;
  role: string;
}
