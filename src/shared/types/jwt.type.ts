export interface JwtPayload {
  userId: string;
  exp: number;
  iat: number;
}
