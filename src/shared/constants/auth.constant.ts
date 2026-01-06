export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
};

export const TypeOfVerfication = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
} as const;

export type TypeOfVerficationCodeType = (typeof TypeOfVerfication)[keyof typeof TypeOfVerfication];
