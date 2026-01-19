export interface AccessTokenPayload {
  userId: number;
  deviceId: number;
  passwordChangedAt: Date | null;
}
export interface RefreshTokenPayload {
  userId: number;
}

export interface AccessTokenDecoded extends AccessTokenPayload {
  exp: number;
  iat: number;
}
export interface RefreshTokenDecoded extends RefreshTokenPayload {
  exp: number;
  iat: number;
}
