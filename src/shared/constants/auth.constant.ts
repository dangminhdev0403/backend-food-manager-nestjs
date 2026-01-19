export interface UserInRequest {
  user: {
    id: number;
    email: string;
    name: string;
    passwordChangedAt: Date | null ;
  };
}

//! public route
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
//! routeIgnore  Permissions initialization
export const routeIgnore = [...whitelist, /^\/auth\/.*/, /^\/profile\/.*/];
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
