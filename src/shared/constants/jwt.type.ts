export interface AccessTokenPayload {
  userId: number;
  deviceId: number;
  ver: number;
}

export interface RefreshTokenPayload {
  ver: number;
  userId: number;
}

export interface AccessTokenDecoded extends AccessTokenPayload {
  ver: number;
  exp: number;
  iat: number;
}
export interface RefreshTokenDecoded extends RefreshTokenPayload {
  ver: number;
  exp: number;
  iat: number;
}
