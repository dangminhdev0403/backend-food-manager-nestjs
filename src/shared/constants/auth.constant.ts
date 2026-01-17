export interface UserInRequest {
  user: {
    id: number;
    name: string;
  };
}

export const whitelist = [
  //! route động  /products/**
  /^\/products\/.*/,
  /^\/order-result\/.*/,
  /^\/api\/.*/,
  //! route cứng /products
  '/products',
  '/chat',
  '/',
  /^\/auth\/((?!logout|refresh).*)$/,
];

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
