export const whitelist = [
  /^\/products\/.*/, //! route động  /products/**
  /^\/auth\/.*/,
  /^\/trips\/.*/,
  /^\/bookings\/.*/,
  /^\/chat\/.*/,
  /^\/order-result\/.*/,

  '/products', //! route cứng /products
  '/chat',
  '/',
  '/auth/login',
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
