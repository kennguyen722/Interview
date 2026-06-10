export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  accessExpiresAtEpochSeconds: number;
};

export type UserProfile = {
  username: string;
};
