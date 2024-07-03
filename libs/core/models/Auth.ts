export interface Auth {
  token: string;
  userId: string;
  refreshToken: string;
  expiresIn: Date;
}
