export const whitelist = [
  //! route động  /products/**
  /^\/products\/.*/,
  /^\/trips\/.*/,
  /^\/bookings\/.*/,
  /^\/chat\/.*/,
  /^\/order-result\/.*/,
  //! route cứng /products
  '/products',
  '/chat',
  '/',
  '/auth/login',
  //! route custom
  '/^/auth/(?!refresh$|logout$).*/',
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
